import { createHash, randomUUID } from "node:crypto";
import { COMPONENTS, EVALUATOR_STALE_AFTER_MS, STATUS_URL } from "./config";
import { monitoringDatabase, type D1Statement } from "./db";
import { reduceComponentState } from "./state-machine";
import type {
  AlertPayload,
  ComponentDefinition,
  ComponentState,
  ComponentStatus,
  Observation,
  PublicStatusSnapshot,
} from "./types";

export type AlertChannel = "webhook" | "email";

type IncidentTransitionResult = {
  kind: "opened" | "resolved";
  incidentId: string;
} | null;

type LockedWrite<T> = { value: T; statements: D1Statement[] };

export async function seedMonitoringComponents(now = new Date()): Promise<void> {
  const timestamp = now.toISOString();
  await monitoringDatabase().batch([
    ...COMPONENTS.map((component) => ({
      sql: `INSERT INTO monitoring_components (
        id, name, description, impact_on_failure, failure_threshold, recovery_threshold, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT (id) DO UPDATE SET
        name = excluded.name,
        description = excluded.description,
        impact_on_failure = excluded.impact_on_failure,
        failure_threshold = excluded.failure_threshold,
        recovery_threshold = excluded.recovery_threshold,
        updated_at = excluded.updated_at`,
      params: [
        component.id,
        component.name,
        component.description,
        component.impactOnFailure,
        component.failureThreshold,
        component.recoveryThreshold,
        timestamp,
      ],
    })),
    {
      sql: `INSERT INTO monitoring_meta (key, value, updated_at)
        VALUES ('monitoring_started', ?, ?)
        ON CONFLICT (key) DO NOTHING`,
      params: [JSON.stringify({ startedAt: timestamp }), timestamp],
    },
  ]);
}

export async function applyObservation(
  definition: ComponentDefinition,
  observation: Observation,
  alertChannels: AlertChannel[],
): Promise<IncidentTransitionResult> {
  return withWriterLock(async () =>
    buildObservationWrite(definition, observation, alertChannels),
  );
}

async function buildObservationWrite(
  definition: ComponentDefinition,
  observation: Observation,
  alertChannels: AlertChannel[],
): Promise<LockedWrite<IncidentTransitionResult>> {
  const database = monitoringDatabase();
  const rows = (await database.query({
    sql: "SELECT * FROM monitoring_components WHERE id = ?",
    params: [definition.id],
  })).results;
  if (!rows[0]) throw new Error(`Monitoring component ${definition.id} has not been seeded`);

  const current = componentStateFromRow(rows[0]);
  if (current.lastCheckedAt && observation.checkedAt <= current.lastCheckedAt) {
    return { value: null, statements: [] };
  }

  const reduced = reduceComponentState(current, definition, observation);
  const checkedAt = observation.checkedAt.toISOString();
  const statements: D1Statement[] = [];
  let openIncidentId = reduced.state.openIncidentId;
  let result: IncidentTransitionResult = null;

  if (reduced.transition?.kind === "opened") {
    const incidentId = randomUUID();
    const title = `${definition.name} is ${definition.impactOnFailure}`;
    openIncidentId = incidentId;
    statements.push(
      {
        sql: `INSERT INTO monitoring_incidents (
          id, component_id, state, impact, title, public_message, started_at, created_at, updated_at
        ) VALUES (?, ?, 'open', ?, ?, ?, ?, ?, ?)`,
        params: [incidentId, definition.id, definition.impactOnFailure, title, definition.failureMessage, checkedAt, checkedAt, checkedAt],
      },
      eventStatement(definition.id, incidentId, "incident_opened", definition.failureMessage, checkedAt),
      ...alertStatements(alertChannels, {
        schemaVersion: 1,
        event: "opened",
        incidentId,
        component: definition.name,
        componentId: definition.id,
        impact: definition.impactOnFailure,
        title,
        message: definition.failureMessage,
        startedAt: checkedAt,
        resolvedAt: null,
        statusUrl: STATUS_URL,
      }, checkedAt),
    );
    result = { kind: "opened", incidentId };
  }

  if (reduced.transition?.kind === "resolved") {
    const incidentId = reduced.transition.incidentId;
    const incident = (await database.query({
      sql: "SELECT title, started_at FROM monitoring_incidents WHERE id = ? AND state = 'open'",
      params: [incidentId],
    })).results[0];
    if (incident) {
      const recoveryMessage = `${definition.name} has recovered and passed its confirmation policy.`;
      statements.push(
        {
          sql: `UPDATE monitoring_incidents SET state = 'resolved', resolved_at = ?, updated_at = ?
            WHERE id = ? AND state = 'open'`,
          params: [checkedAt, checkedAt, incidentId],
        },
        eventStatement(definition.id, incidentId, "incident_resolved", recoveryMessage, checkedAt),
        ...alertStatements(alertChannels, {
          schemaVersion: 1,
          event: "resolved",
          incidentId,
          component: definition.name,
          componentId: definition.id,
          impact: definition.impactOnFailure,
          title: String(incident.title),
          message: recoveryMessage,
          startedAt: String(incident.started_at),
          resolvedAt: checkedAt,
          statusUrl: STATUS_URL,
        }, checkedAt),
      );
      result = { kind: "resolved", incidentId };
    }
    openIncidentId = null;
  }

  statements.push(
    {
      sql: `UPDATE monitoring_components SET
        status = ?, consecutive_failures = ?, consecutive_successes = ?, last_checked_at = ?,
        last_verified_at = ?, last_failure_at = ?, last_latency_ms = ?, last_error_code = ?,
        open_incident_id = ?, updated_at = ?
      WHERE id = ? AND (last_checked_at IS NULL OR last_checked_at < ?)`,
      params: [
        reduced.state.status,
        reduced.state.consecutiveFailures,
        reduced.state.consecutiveSuccesses,
        isoOrNull(reduced.state.lastCheckedAt),
        isoOrNull(reduced.state.lastVerifiedAt),
        isoOrNull(reduced.state.lastFailureAt),
        reduced.state.lastLatencyMs,
        reduced.state.lastErrorCode,
        openIncidentId,
        checkedAt,
        definition.id,
        checkedAt,
      ],
    },
    {
      sql: `INSERT INTO monitoring_check_results (component_id, checked_at, ok, latency_ms, error_code)
        VALUES (?, ?, ?, ?, ?)`,
      params: [definition.id, checkedAt, observation.ok ? 1 : 0, observation.latencyMs, observation.errorCode],
    },
  );
  return { value: result, statements };
}

export async function recordHeartbeatSuccess(
  requestId: string | null,
  receivedAt: Date,
  definition: ComponentDefinition,
  alertChannels: AlertChannel[],
): Promise<boolean> {
  return withWriterLock(async () => {
    const requestIdHash = hashRequestId(requestId);
    if (requestIdHash) {
      const existing = (await monitoringDatabase().query({
        sql: "SELECT 1 AS present FROM monitoring_heartbeat_receipts WHERE request_id_hash = ?",
        params: [requestIdHash],
      })).results;
      if (existing.length > 0) return { value: false, statements: [] };
    }

    const observationWrite = await buildObservationWrite(
      definition,
      {
        ok: true,
        checkedAt: receivedAt,
        latencyMs: null,
        errorCode: null,
        markVerifiedSuccess: true,
      },
      alertChannels,
    );
    return {
      value: true,
      statements: [
        {
          sql: `INSERT INTO monitoring_heartbeat_receipts (received_at, request_id_hash)
            VALUES (?, ?) ON CONFLICT (request_id_hash) DO NOTHING`,
          params: [receivedAt.toISOString(), requestIdHash],
        },
        ...observationWrite.statements,
      ],
    };
  });
}

export async function recordHeartbeatReceipt(requestId: string | null, receivedAt: Date): Promise<boolean> {
  const requestIdHash = hashRequestId(requestId);
  if (requestIdHash) {
    const existing = (await monitoringDatabase().query({
      sql: "SELECT 1 AS present FROM monitoring_heartbeat_receipts WHERE request_id_hash = ?",
      params: [requestIdHash],
    })).results;
    if (existing.length > 0) return false;
  }
  const result = await monitoringDatabase().query({
    sql: `INSERT INTO monitoring_heartbeat_receipts (received_at, request_id_hash)
      VALUES (?, ?) ON CONFLICT (request_id_hash) DO NOTHING RETURNING id`,
    params: [receivedAt.toISOString(), requestIdHash],
  });
  return result.results.length === 1;
}

export async function getHeartbeatBaseline(): Promise<{ lastReceivedAt: Date | null; monitoringStartedAt: Date }> {
  const [heartbeat, started] = await monitoringDatabase().batch([
    { sql: "SELECT received_at FROM monitoring_heartbeat_receipts ORDER BY received_at DESC LIMIT 1" },
    { sql: "SELECT value FROM monitoring_meta WHERE key = 'monitoring_started'" },
  ]);
  const startedValue = parseJsonRecord(started.results[0]?.value);
  return {
    lastReceivedAt: asDate(heartbeat.results[0]?.received_at),
    monitoringStartedAt: asDate(startedValue.startedAt) || new Date(),
  };
}

export async function markEvaluatorCompleted(completedAt: Date): Promise<void> {
  const timestamp = completedAt.toISOString();
  await monitoringDatabase().query({
    sql: `INSERT INTO monitoring_meta (key, value, updated_at) VALUES ('last_evaluated', ?, ?)
      ON CONFLICT (key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
    params: [JSON.stringify({ completedAt: timestamp }), timestamp],
  });
}

export async function acquireEvaluatorLease(now: Date): Promise<boolean> {
  const timestamp = now.toISOString();
  const windowStart = new Date(Math.floor(now.getTime() / 300_000) * 300_000);
  const windowKey = evaluationWindowKey(windowStart);
  const window = await monitoringDatabase().query({
    sql: `INSERT INTO monitoring_meta (key, value, updated_at) VALUES (?, ?, ?)
      ON CONFLICT (key) DO NOTHING RETURNING key`,
    params: [windowKey, JSON.stringify({ startedAt: timestamp }), timestamp],
  });
  return window.results.length === 1;
}

export async function releaseFailedEvaluatorLease(now: Date): Promise<void> {
  const windowStart = new Date(Math.floor(now.getTime() / 300_000) * 300_000);
  const windowKey = evaluationWindowKey(windowStart);
  await monitoringDatabase().query({
    sql: "DELETE FROM monitoring_meta WHERE key = ?",
    params: [windowKey],
  });
}

export async function pruneMonitoringHistory(now = new Date()): Promise<void> {
  const checksBefore = new Date(now.getTime() - 90 * 86_400_000).toISOString();
  const auditBefore = new Date(now.getTime() - 365 * 86_400_000).toISOString();
  await monitoringDatabase().batch([
    { sql: "DELETE FROM monitoring_check_results WHERE checked_at < ?", params: [checksBefore] },
    { sql: "DELETE FROM monitoring_heartbeat_receipts WHERE received_at < ?", params: [checksBefore] },
    { sql: "DELETE FROM monitoring_meta WHERE key LIKE 'evaluation_window:%' AND updated_at < ?", params: [checksBefore] },
    { sql: `DELETE FROM monitoring_alert_outbox WHERE incident_id IN
      (SELECT id FROM monitoring_incidents WHERE state = 'resolved' AND resolved_at < ?)`, params: [auditBefore] },
    { sql: `DELETE FROM monitoring_events WHERE incident_id IN
      (SELECT id FROM monitoring_incidents WHERE state = 'resolved' AND resolved_at < ?)`, params: [auditBefore] },
    { sql: "DELETE FROM monitoring_events WHERE incident_id IS NULL AND occurred_at < ?", params: [auditBefore] },
    { sql: "DELETE FROM monitoring_incidents WHERE state = 'resolved' AND resolved_at < ?", params: [auditBefore] },
  ]);
}

export async function getPublicStatusSnapshot(now = new Date()): Promise<PublicStatusSnapshot> {
  const recent = new Date(now.getTime() - 90 * 86_400_000).toISOString();
  const uptimeSince = new Date(now.getTime() - 30 * 86_400_000).toISOString();
  const [componentResult, openResult, resolvedResult, uptimeResult, evaluatedResult] =
    await monitoringDatabase().batch([
      { sql: "SELECT * FROM monitoring_components" },
      { sql: `SELECT i.*, c.name AS component_name FROM monitoring_incidents i
        JOIN monitoring_components c ON c.id = i.component_id
        WHERE i.state = 'open' ORDER BY i.started_at DESC` },
      { sql: `SELECT i.*, c.name AS component_name FROM monitoring_incidents i
        JOIN monitoring_components c ON c.id = i.component_id
        WHERE i.state = 'resolved' AND i.resolved_at >= ? ORDER BY i.resolved_at DESC LIMIT 100`, params: [recent] },
      { sql: `SELECT component_id, 100.0 * AVG(CASE WHEN ok = 1 THEN 1.0 ELSE 0.0 END) AS uptime
        FROM monitoring_check_results WHERE checked_at >= ? GROUP BY component_id`, params: [uptimeSince] },
      { sql: "SELECT value FROM monitoring_meta WHERE key = 'last_evaluated'" },
    ]);

  const uptimeByComponent = new Map(uptimeResult.results.map((row) => [String(row.component_id), Number(row.uptime)]));
  const rowsById = new Map(componentResult.results.map((row) => [String(row.id), row]));
  const components = COMPONENTS.map((definition) => {
    const row = rowsById.get(definition.id);
    return {
      id: definition.id,
      name: definition.name,
      description: definition.description,
      status: row ? asStatus(row.status) : "unknown" as ComponentStatus,
      lastCheckedAt: asDate(row?.last_checked_at)?.toISOString() || null,
      lastVerifiedAt: asDate(row?.last_verified_at)?.toISOString() || null,
      uptime30d: uptimeByComponent.has(definition.id) ? roundUptime(uptimeByComponent.get(definition.id)!) : null,
    };
  });
  const evaluatedValue = parseJsonRecord(evaluatedResult.results[0]?.value);
  const lastEvaluatedAt = asDate(evaluatedValue.completedAt);
  const evaluatorFresh = Boolean(lastEvaluatedAt && now.getTime() - lastEvaluatedAt.getTime() <= EVALUATOR_STALE_AFTER_MS);
  const incidentRows = [...openResult.results, ...resolvedResult.results];
  return {
    schemaVersion: 1,
    overall: aggregateOverallStatus(components.map((component) => component.status), evaluatorFresh),
    generatedAt: now.toISOString(),
    lastEvaluatedAt: lastEvaluatedAt?.toISOString() || null,
    evaluatorFresh,
    components,
    incidents: incidentRows.map((row) => ({
      id: String(row.id), componentId: String(row.component_id), componentName: String(row.component_name),
      state: row.state === "open" ? "open" : "resolved", impact: row.impact === "outage" ? "outage" : "degraded",
      title: String(row.title), message: String(row.public_message), startedAt: String(row.started_at),
      resolvedAt: row.resolved_at ? String(row.resolved_at) : null,
    })),
  };
}

export async function claimPendingAlert(): Promise<Record<string, unknown> | null> {
  const now = new Date();
  const result = await monitoringDatabase().query({
    sql: `UPDATE monitoring_alert_outbox SET locked_until = ?, attempts = attempts + 1, updated_at = ?
      WHERE id = (SELECT id FROM monitoring_alert_outbox WHERE status = 'pending'
        AND next_attempt_at <= ? AND (locked_until IS NULL OR locked_until < ?)
        ORDER BY created_at LIMIT 1)
      AND status = 'pending' AND (locked_until IS NULL OR locked_until < ?) RETURNING *`,
    params: [new Date(now.getTime() + 60_000).toISOString(), now.toISOString(), now.toISOString(), now.toISOString(), now.toISOString()],
  });
  const row = result.results[0];
  if (!row) return null;
  return { ...row, payload: parseJsonRecord(row.payload) };
}

export async function markAlertDelivered(id: string): Promise<void> {
  const now = new Date().toISOString();
  await monitoringDatabase().query({
    sql: `UPDATE monitoring_alert_outbox SET status = 'delivered', delivered_at = ?, locked_until = NULL,
      last_error = NULL, updated_at = ? WHERE id = ?`, params: [now, now, id],
  });
}

export async function markAlertSkipped(id: string, reason: string): Promise<void> {
  await updateAlertFailureState(id, "skipped", new Date().toISOString(), reason);
}

export async function markAlertFailed(id: string, attempts: number, error: string): Promise<void> {
  const now = new Date();
  const delaySeconds = Math.min(3600, 60 * 2 ** Math.min(attempts, 6));
  await updateAlertFailureState(id, "pending", new Date(now.getTime() + delaySeconds * 1000).toISOString(), error, now.toISOString());
}

async function updateAlertFailureState(id: string, status: string, nextAttemptAt: string, error: string, now = new Date().toISOString()): Promise<void> {
  await monitoringDatabase().query({
    sql: `UPDATE monitoring_alert_outbox SET status = ?, locked_until = NULL, next_attempt_at = ?,
      last_error = ?, updated_at = ? WHERE id = ?`, params: [status, nextAttemptAt, error, now, id],
  });
}

async function withWriterLock<T>(work: () => Promise<LockedWrite<T>>): Promise<T> {
  const token = randomUUID();
  let acquired = false;
  for (let attempt = 0; attempt < 20 && !acquired; attempt += 1) {
    const now = new Date();
    const result = await monitoringDatabase().query({
      sql: `INSERT INTO monitoring_locks (name, token, locked_until, updated_at) VALUES ('writer', ?, ?, ?)
        ON CONFLICT (name) DO UPDATE SET token = excluded.token, locked_until = excluded.locked_until,
          updated_at = excluded.updated_at WHERE monitoring_locks.locked_until < ? RETURNING token`,
      params: [token, new Date(now.getTime() + 120_000).toISOString(), now.toISOString(), now.toISOString()],
    });
    acquired = result.results.length === 1;
    if (!acquired) await new Promise((resolve) => setTimeout(resolve, 50));
  }
  if (!acquired) throw new Error("Monitoring state is busy");

  try {
    const write = await work();
    const renewedAt = new Date();
    const renewed = await monitoringDatabase().query({
      sql: `UPDATE monitoring_locks SET locked_until = ?, updated_at = ?
        WHERE name = 'writer' AND token = ? RETURNING token`,
      params: [new Date(renewedAt.getTime() + 120_000).toISOString(), renewedAt.toISOString(), token],
    });
    if (renewed.results.length !== 1) throw new Error("Monitoring writer lease was lost");
    await monitoringDatabase().batch([
      ...write.statements,
      { sql: "DELETE FROM monitoring_locks WHERE name = 'writer' AND token = ?", params: [token] },
    ]);
    return write.value;
  } catch (error) {
    await monitoringDatabase().query({
      sql: "DELETE FROM monitoring_locks WHERE name = 'writer' AND token = ?",
      params: [token],
    }).catch(() => undefined);
    throw error;
  }
}

function eventStatement(componentId: string, incidentId: string, kind: string, message: string, occurredAt: string): D1Statement {
  return { sql: `INSERT INTO monitoring_events (component_id, incident_id, kind, message, occurred_at)
    VALUES (?, ?, ?, ?, ?)`, params: [componentId, incidentId, kind, message, occurredAt] };
}

function alertStatements(channels: AlertChannel[], payload: AlertPayload, now: string): D1Statement[] {
  return channels.map((channel) => ({
    sql: `INSERT INTO monitoring_alert_outbox (
      id, incident_id, event_kind, channel, payload, next_attempt_at, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT (incident_id, event_kind, channel) DO NOTHING`,
    params: [randomUUID(), payload.incidentId, payload.event, channel, JSON.stringify(payload), now, now, now],
  }));
}

function componentStateFromRow(row: Record<string, unknown>): ComponentState {
  return {
    id: String(row.id), status: asStatus(row.status), consecutiveFailures: Number(row.consecutive_failures),
    consecutiveSuccesses: Number(row.consecutive_successes), lastCheckedAt: asDate(row.last_checked_at),
    lastVerifiedAt: asDate(row.last_verified_at), lastFailureAt: asDate(row.last_failure_at),
    lastLatencyMs: row.last_latency_ms === null ? null : Number(row.last_latency_ms),
    lastErrorCode: row.last_error_code === null ? null : String(row.last_error_code),
    openIncidentId: row.open_incident_id === null ? null : String(row.open_incident_id),
  };
}

function hashRequestId(requestId: string | null): string | null {
  return requestId ? createHash("sha256").update(requestId).digest("hex") : null;
}

function evaluationWindowKey(windowStart: Date): string {
  return `evaluation_window:${windowStart.toISOString()}`;
}

function parseJsonRecord(value: unknown): Record<string, unknown> {
  if (typeof value !== "string") return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed as Record<string, unknown> : {};
  } catch {
    return {};
  }
}

function isoOrNull(value: Date | null): string | null { return value?.toISOString() || null; }
function asDate(value: unknown): Date | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value !== "string") return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
function asStatus(value: unknown): ComponentStatus {
  return value === "operational" || value === "degraded" || value === "outage" ? value : "unknown";
}
function aggregateOverallStatus(statuses: ComponentStatus[], evaluatorFresh: boolean): ComponentStatus {
  if (statuses.includes("outage")) return "outage";
  if (!evaluatorFresh || statuses.includes("degraded")) return "degraded";
  if (statuses.includes("unknown")) return "unknown";
  return "operational";
}
function roundUptime(value: number): number { return Math.round(value * 1000) / 1000; }
