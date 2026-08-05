import { createHash, randomUUID } from "node:crypto";
import type { TransactionSql } from "postgres";
import { COMPONENTS, EVALUATOR_STALE_AFTER_MS, STATUS_URL } from "./config";
import { monitoringSql } from "./db";
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

export async function seedMonitoringComponents(now = new Date()): Promise<void> {
  const sql = monitoringSql();
  await sql.begin(async (transaction) => {
    for (const component of COMPONENTS) {
      await transaction`
        INSERT INTO monitoring_components (
          id, name, description, impact_on_failure, failure_threshold, recovery_threshold
        ) VALUES (
          ${component.id}, ${component.name}, ${component.description},
          ${component.impactOnFailure}, ${component.failureThreshold}, ${component.recoveryThreshold}
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          impact_on_failure = EXCLUDED.impact_on_failure,
          failure_threshold = EXCLUDED.failure_threshold,
          recovery_threshold = EXCLUDED.recovery_threshold,
          updated_at = now()
      `;
    }
    await transaction`
      INSERT INTO monitoring_meta (key, value)
      VALUES ('monitoring_started', ${transaction.json({ startedAt: now.toISOString() })})
      ON CONFLICT (key) DO NOTHING
    `;
  });
}

export async function applyObservation(
  definition: ComponentDefinition,
  observation: Observation,
  alertChannels: AlertChannel[],
): Promise<IncidentTransitionResult> {
  const sql = monitoringSql();
  return sql.begin((transaction) =>
    applyObservationInTransaction(transaction, definition, observation, alertChannels),
  );
}

async function applyObservationInTransaction(
  transaction: TransactionSql,
  definition: ComponentDefinition,
  observation: Observation,
  alertChannels: AlertChannel[],
): Promise<IncidentTransitionResult> {
    const rows = await transaction`
      SELECT * FROM monitoring_components WHERE id = ${definition.id} FOR UPDATE
    `;
    if (!rows[0]) throw new Error(`Monitoring component ${definition.id} has not been seeded`);

    const current = componentStateFromRow(rows[0] as Record<string, unknown>);
    if (current.lastCheckedAt && observation.checkedAt <= current.lastCheckedAt) return null;

    const reduced = reduceComponentState(current, definition, observation);
    let openIncidentId = reduced.state.openIncidentId;
    let result: IncidentTransitionResult = null;

    if (reduced.transition?.kind === "opened") {
      const incidentId = randomUUID();
      openIncidentId = incidentId;
      const title = `${definition.name} is ${definition.impactOnFailure}`;
      await transaction`
        INSERT INTO monitoring_incidents (
          id, component_id, state, impact, title, public_message, started_at
        ) VALUES (
          ${incidentId}, ${definition.id}, 'open', ${definition.impactOnFailure},
          ${title}, ${definition.failureMessage}, ${observation.checkedAt}
        )
      `;
      await transaction`
        INSERT INTO monitoring_events (component_id, incident_id, kind, message, occurred_at)
        VALUES (
          ${definition.id}, ${incidentId}, 'incident_opened',
          ${definition.failureMessage}, ${observation.checkedAt}
        )
      `;
      await enqueueAlerts(transaction, alertChannels, {
        schemaVersion: 1,
        event: "opened",
        incidentId,
        component: definition.name,
        componentId: definition.id,
        impact: definition.impactOnFailure,
        title,
        message: definition.failureMessage,
        startedAt: observation.checkedAt.toISOString(),
        resolvedAt: null,
        statusUrl: STATUS_URL,
      });
      result = { kind: "opened", incidentId };
    }

    if (reduced.transition?.kind === "resolved") {
      const incidentRows = await transaction`
        UPDATE monitoring_incidents
        SET state = 'resolved', resolved_at = ${observation.checkedAt},
            updated_at = now()
        WHERE id = ${reduced.transition.incidentId} AND state = 'open'
        RETURNING *
      `;
      const incident = incidentRows[0] as Record<string, unknown> | undefined;
      if (incident) {
        const recoveryMessage = `${definition.name} has recovered and passed its confirmation policy.`;
        await transaction`
          INSERT INTO monitoring_events (component_id, incident_id, kind, message, occurred_at)
          VALUES (
            ${definition.id}, ${reduced.transition.incidentId}, 'incident_resolved',
            ${recoveryMessage}, ${observation.checkedAt}
          )
        `;
        await enqueueAlerts(transaction, alertChannels, {
          schemaVersion: 1,
          event: "resolved",
          incidentId: reduced.transition.incidentId,
          component: definition.name,
          componentId: definition.id,
          impact: definition.impactOnFailure,
          title: String(incident.title),
          message: recoveryMessage,
          startedAt: asDate(incident.started_at)?.toISOString() || observation.checkedAt.toISOString(),
          resolvedAt: observation.checkedAt.toISOString(),
          statusUrl: STATUS_URL,
        });
        result = { kind: "resolved", incidentId: reduced.transition.incidentId };
      }
      openIncidentId = null;
    }

    await transaction`
      UPDATE monitoring_components SET
        status = ${reduced.state.status},
        consecutive_failures = ${reduced.state.consecutiveFailures},
        consecutive_successes = ${reduced.state.consecutiveSuccesses},
        last_checked_at = ${reduced.state.lastCheckedAt},
        last_verified_at = ${reduced.state.lastVerifiedAt},
        last_failure_at = ${reduced.state.lastFailureAt},
        last_latency_ms = ${reduced.state.lastLatencyMs},
        last_error_code = ${reduced.state.lastErrorCode},
        open_incident_id = ${openIncidentId},
        updated_at = now()
      WHERE id = ${definition.id}
    `;
    await transaction`
      INSERT INTO monitoring_check_results (
        component_id, checked_at, ok, latency_ms, error_code
      ) VALUES (
        ${definition.id}, ${observation.checkedAt}, ${observation.ok},
        ${observation.latencyMs}, ${observation.errorCode}
      )
    `;

    return result;
}

export async function recordHeartbeatSuccess(
  requestId: string | null,
  receivedAt: Date,
  definition: ComponentDefinition,
  alertChannels: AlertChannel[],
): Promise<boolean> {
  const sql = monitoringSql();
  const requestIdHash = requestId
    ? createHash("sha256").update(requestId).digest("hex")
    : null;

  return sql.begin(async (transaction) => {
    const rows = await transaction`
      INSERT INTO monitoring_heartbeat_receipts (received_at, request_id_hash)
      VALUES (${receivedAt}, ${requestIdHash})
      ON CONFLICT (request_id_hash) DO NOTHING
      RETURNING id
    `;
    if (rows.length === 0) return false;

    await applyObservationInTransaction(
      transaction,
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
    return true;
  });
}

export async function recordHeartbeatReceipt(
  requestId: string | null,
  receivedAt: Date,
): Promise<boolean> {
  const sql = monitoringSql();
  const requestIdHash = requestId
    ? createHash("sha256").update(requestId).digest("hex")
    : null;
  const rows = await sql`
    INSERT INTO monitoring_heartbeat_receipts (received_at, request_id_hash)
    VALUES (${receivedAt}, ${requestIdHash})
    ON CONFLICT (request_id_hash) DO NOTHING
    RETURNING id
  `;
  return rows.length === 1;
}

export async function getHeartbeatBaseline(): Promise<{
  lastReceivedAt: Date | null;
  monitoringStartedAt: Date;
}> {
  const sql = monitoringSql();
  const heartbeatRows = await sql`
    SELECT received_at FROM monitoring_heartbeat_receipts
    ORDER BY received_at DESC LIMIT 1
  `;
  const startedRows = await sql`
    SELECT value FROM monitoring_meta WHERE key = 'monitoring_started'
  `;
  const startedValue = (startedRows[0]?.value || {}) as Record<string, unknown>;
  return {
    lastReceivedAt: asDate(heartbeatRows[0]?.received_at),
    monitoringStartedAt: asDate(startedValue.startedAt) || new Date(),
  };
}

export async function markEvaluatorCompleted(completedAt: Date): Promise<void> {
  const sql = monitoringSql();
  await sql`
    INSERT INTO monitoring_meta (key, value, updated_at)
    VALUES (
      'last_evaluated', ${sql.json({ completedAt: completedAt.toISOString() })}, now()
    )
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()
  `;
}

export async function acquireEvaluatorLease(now: Date): Promise<boolean> {
  const sql = monitoringSql();
  const lockedUntil = new Date(now.getTime() + 4 * 60 * 1000);
  const windowStart = new Date(Math.floor(now.getTime() / (5 * 60 * 1000)) * 5 * 60 * 1000);
  const windowKey = `evaluation_window:${windowStart.toISOString()}`;

  return sql.begin(async (transaction) => {
    const windowRows = await transaction`
      INSERT INTO monitoring_meta (key, value)
      VALUES (${windowKey}, ${transaction.json({ startedAt: now.toISOString() })})
      ON CONFLICT (key) DO NOTHING
      RETURNING key
    `;
    if (windowRows.length === 0) return false;

    const leaseRows = await transaction`
      INSERT INTO monitoring_locks (name, locked_until)
      VALUES ('evaluator', ${lockedUntil})
      ON CONFLICT (name) DO UPDATE SET
        locked_until = EXCLUDED.locked_until,
        updated_at = now()
      WHERE monitoring_locks.locked_until < ${now}
      RETURNING name
    `;
    if (leaseRows.length === 0) {
      await transaction`DELETE FROM monitoring_meta WHERE key = ${windowKey}`;
      return false;
    }
    return true;
  });
}

export async function pruneMonitoringHistory(now = new Date()): Promise<void> {
  const sql = monitoringSql();
  const checksBefore = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  const auditBefore = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  await sql.begin(async (transaction) => {
    await transaction`DELETE FROM monitoring_check_results WHERE checked_at < ${checksBefore}`;
    await transaction`DELETE FROM monitoring_heartbeat_receipts WHERE received_at < ${checksBefore}`;
    await transaction`
      DELETE FROM monitoring_meta
      WHERE key LIKE 'evaluation_window:%' AND updated_at < ${checksBefore}
    `;
    await transaction`
      DELETE FROM monitoring_alert_outbox AS outbox
      USING monitoring_incidents AS incident
      WHERE outbox.incident_id = incident.id
        AND incident.state = 'resolved'
        AND incident.resolved_at < ${auditBefore}
    `;
    await transaction`
      DELETE FROM monitoring_events AS event
      USING monitoring_incidents AS incident
      WHERE event.incident_id = incident.id
        AND incident.state = 'resolved'
        AND incident.resolved_at < ${auditBefore}
    `;
    await transaction`
      DELETE FROM monitoring_events
      WHERE incident_id IS NULL AND occurred_at < ${auditBefore}
    `;
    await transaction`
      DELETE FROM monitoring_incidents
      WHERE state = 'resolved' AND resolved_at < ${auditBefore}
    `;
  });
}

export async function getPublicStatusSnapshot(now = new Date()): Promise<PublicStatusSnapshot> {
  const sql = monitoringSql();
  const [componentRows, openIncidentRows, resolvedIncidentRows, uptimeRows, evaluatedRows] =
    await sql.begin("isolation level repeatable read read only", (transaction) =>
      Promise.all([
        transaction`SELECT * FROM monitoring_components`,
        transaction`
          SELECT i.*, c.name AS component_name
          FROM monitoring_incidents i
          JOIN monitoring_components c ON c.id = i.component_id
          WHERE i.state = 'open'
          ORDER BY i.started_at DESC
        `,
        transaction`
          SELECT i.*, c.name AS component_name
          FROM monitoring_incidents i
          JOIN monitoring_components c ON c.id = i.component_id
          WHERE i.state = 'resolved'
            AND i.resolved_at >= ${new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)}
          ORDER BY i.resolved_at DESC
          LIMIT 100
        `,
        transaction`
          SELECT component_id,
            (100.0 * AVG(CASE WHEN ok THEN 1.0 ELSE 0.0 END))::double precision AS uptime
          FROM monitoring_check_results
          WHERE checked_at >= ${new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)}
          GROUP BY component_id
        `,
        transaction`SELECT value FROM monitoring_meta WHERE key = 'last_evaluated'`,
      ]),
    );

  const uptimeByComponent = new Map(
    uptimeRows.map((row) => [String(row.component_id), Number(row.uptime)]),
  );
  const rowsById = new Map(componentRows.map((row) => [String(row.id), row]));
  const components = COMPONENTS.map((definition) => {
    const row = rowsById.get(definition.id);
    return {
      id: definition.id,
      name: definition.name,
      description: definition.description,
      status: row ? asStatus(row.status) : "unknown",
      lastCheckedAt: asDate(row?.last_checked_at)?.toISOString() || null,
      lastVerifiedAt: asDate(row?.last_verified_at)?.toISOString() || null,
      uptime30d: uptimeByComponent.has(definition.id)
        ? roundUptime(uptimeByComponent.get(definition.id)!)
        : null,
    };
  });
  const evaluatedValue = (evaluatedRows[0]?.value || {}) as Record<string, unknown>;
  const lastEvaluatedAt = asDate(evaluatedValue.completedAt);
  const evaluatorFresh = Boolean(
    lastEvaluatedAt && now.getTime() - lastEvaluatedAt.getTime() <= EVALUATOR_STALE_AFTER_MS,
  );
  const incidentRows = [...openIncidentRows, ...resolvedIncidentRows];

  return {
    schemaVersion: 1,
    overall: aggregateOverallStatus(
      components.map((component) => component.status),
      evaluatorFresh,
    ),
    generatedAt: now.toISOString(),
    lastEvaluatedAt: lastEvaluatedAt?.toISOString() || null,
    evaluatorFresh,
    components,
    incidents: incidentRows.map((row) => ({
      id: String(row.id),
      componentId: String(row.component_id),
      componentName: String(row.component_name),
      state: row.state === "open" ? "open" : "resolved",
      impact: row.impact === "outage" ? "outage" : "degraded",
      title: String(row.title),
      message: String(row.public_message),
      startedAt: asDate(row.started_at)!.toISOString(),
      resolvedAt: asDate(row.resolved_at)?.toISOString() || null,
    })),
  };
}

export async function claimPendingAlert(): Promise<Record<string, unknown> | null> {
  const sql = monitoringSql();
  const rows = await sql`
    WITH candidate AS (
      SELECT id FROM monitoring_alert_outbox
      WHERE status = 'pending'
        AND next_attempt_at <= now()
        AND (locked_until IS NULL OR locked_until < now())
      ORDER BY created_at
      FOR UPDATE SKIP LOCKED
      LIMIT 1
    )
    UPDATE monitoring_alert_outbox AS outbox
    SET locked_until = now() + interval '1 minute',
        attempts = attempts + 1,
        updated_at = now()
    FROM candidate
    WHERE outbox.id = candidate.id
    RETURNING outbox.*
  `;
  return (rows[0] as Record<string, unknown> | undefined) || null;
}

export async function markAlertDelivered(id: string): Promise<void> {
  const sql = monitoringSql();
  await sql`
    UPDATE monitoring_alert_outbox SET
      status = 'delivered', delivered_at = now(), locked_until = NULL,
      last_error = NULL, updated_at = now()
    WHERE id = ${id}
  `;
}

export async function markAlertSkipped(id: string, reason: string): Promise<void> {
  const sql = monitoringSql();
  await sql`
    UPDATE monitoring_alert_outbox SET
      status = 'skipped', locked_until = NULL, last_error = ${reason}, updated_at = now()
    WHERE id = ${id}
  `;
}

export async function markAlertFailed(id: string, attempts: number, error: string): Promise<void> {
  const sql = monitoringSql();
  const delaySeconds = Math.min(3600, 60 * 2 ** Math.min(attempts, 6));
  await sql`
    UPDATE monitoring_alert_outbox SET
      locked_until = NULL,
      next_attempt_at = now() + (${delaySeconds} * interval '1 second'),
      last_error = ${error},
      updated_at = now()
    WHERE id = ${id}
  `;
}

async function enqueueAlerts(
  transaction: TransactionSql,
  channels: AlertChannel[],
  payload: AlertPayload,
): Promise<void> {
  for (const channel of channels) {
    await transaction`
      INSERT INTO monitoring_alert_outbox (
        id, incident_id, event_kind, channel, payload
      ) VALUES (
        ${randomUUID()}, ${payload.incidentId}, ${payload.event}, ${channel},
        ${transaction.json(payload)}
      )
      ON CONFLICT (incident_id, event_kind, channel) DO NOTHING
    `;
  }
}

function componentStateFromRow(row: Record<string, unknown>): ComponentState {
  return {
    id: String(row.id),
    status: asStatus(row.status),
    consecutiveFailures: Number(row.consecutive_failures),
    consecutiveSuccesses: Number(row.consecutive_successes),
    lastCheckedAt: asDate(row.last_checked_at),
    lastVerifiedAt: asDate(row.last_verified_at),
    lastFailureAt: asDate(row.last_failure_at),
    lastLatencyMs: row.last_latency_ms === null ? null : Number(row.last_latency_ms),
    lastErrorCode: row.last_error_code === null ? null : String(row.last_error_code),
    openIncidentId: row.open_incident_id === null ? null : String(row.open_incident_id),
  };
}

function asDate(value: unknown): Date | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value !== "string") return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function asStatus(value: unknown): ComponentStatus {
  return value === "operational" || value === "degraded" || value === "outage"
    ? value
    : "unknown";
}

function aggregateOverallStatus(statuses: ComponentStatus[], evaluatorFresh: boolean): ComponentStatus {
  if (statuses.includes("outage")) return "outage";
  if (!evaluatorFresh || statuses.includes("degraded")) return "degraded";
  if (statuses.includes("unknown")) return "unknown";
  return "operational";
}

function roundUptime(value: number): number {
  return Math.round(value * 1000) / 1000;
}
