import { configuredAlertChannels, dispatchPendingAlerts } from "@/lib/monitoring/alerts";
import { hasValidBearer, safeRequestId } from "@/lib/monitoring/auth";
import { COMPONENTS, HEARTBEAT_REASON_CODES, configurationIssues } from "@/lib/monitoring/config";
import {
  recordHeartbeatOutcome,
  recordHeartbeatSuccess,
  seedMonitoringComponents,
} from "@/lib/monitoring/store";
import type { HeartbeatOutcome, HeartbeatOutcomeReport } from "@/lib/monitoring/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  if (!hasValidBearer(request, process.env.MONITOR_HEARTBEAT_SECRET)) {
    return new Response(null, { status: 401, headers: { "cache-control": "no-store" } });
  }

  const suppliedRequestId = request.headers.get("x-bugdrop-heartbeat-id");
  const requestId = safeRequestId(suppliedRequestId);
  if (suppliedRequestId !== null && requestId === null) {
    return Response.json(
      { error: "Heartbeat ID is invalid" },
      { status: 400, headers: { "cache-control": "no-store" } },
    );
  }

  const issues = configurationIssues();
  if (issues.length > 0) {
    console.error("[monitoring] heartbeat configuration invalid", issues.join("; "));
    return Response.json(
      { error: "Monitoring is not configured" },
      { status: 503, headers: { "cache-control": "no-store" } },
    );
  }

  const receivedAt = new Date();
  let acceptedResponse: Response;
  let shouldDispatchAlerts = false;
  try {
    const body = await request.text();
    let report: HeartbeatOutcomeReport | null = null;
    if (body.trim()) {
      if (!isJsonMediaType(request.headers.get("content-type"))) {
        return heartbeatError("Heartbeat content type must be application/json", 400);
      }
      if (!requestId) return heartbeatError("Heartbeat ID is required for outcome reports", 400);
      report = parseOutcomeReport(body, receivedAt);
      if (!report) return heartbeatError("Heartbeat outcome is invalid", 400);
    }
    await seedMonitoringComponents(receivedAt);
    const definition = COMPONENTS.find((component) => component.id === "issue_delivery");
    if (!definition) throw new Error("Issue delivery component is not configured");
    const channels = configuredAlertChannels();
    if (report) {
      const result = await recordHeartbeatOutcome(requestId!, report, receivedAt, definition, channels);
      if (result.status === "conflict") {
        return heartbeatError("Heartbeat ID was reused with different content", 409);
      }
      shouldDispatchAlerts = result.status === "inserted";
      acceptedResponse = Response.json(
        {
          schemaVersion: 1,
          accepted: true,
          duplicate: result.status === "duplicate",
          outcome: report.outcome,
          effect: result.effect,
          observedAt: report.observedAt.toISOString(),
        },
        { headers: { "cache-control": "no-store" } },
      );
    } else {
      shouldDispatchAlerts = await recordHeartbeatSuccess(requestId, receivedAt, definition, channels);
      acceptedResponse = new Response(null, { status: 204, headers: { "cache-control": "no-store" } });
    }
  } catch (error) {
    console.error("[monitoring] heartbeat failed", safeError(error));
    return Response.json(
      { error: "Heartbeat could not be recorded" },
      { status: 500, headers: { "cache-control": "no-store" } },
    );
  }

  if (shouldDispatchAlerts) {
    try {
      await dispatchHeartbeatAlerts();
    } catch (error) {
      console.error("[monitoring] heartbeat alert dispatch unavailable", safeError(error));
    }
  }
  return acceptedResponse;
}

async function dispatchHeartbeatAlerts(): Promise<void> {
  const alerts = await dispatchPendingAlerts();
  if (alerts.failed > 0 || alerts.skipped > 0) {
    console.error(
      "[monitoring] heartbeat alert delivery impaired",
      `${alerts.failed} failed, ${alerts.skipped} skipped`,
    );
  }
}

function parseOutcomeReport(body: string, receivedAt: Date): HeartbeatOutcomeReport | null {
  let value: unknown;
  try {
    value = JSON.parse(body);
  } catch {
    return null;
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  if (Object.keys(record).sort().join(",") !== "observedAt,outcome,reasonCode,schemaVersion") return null;
  if (record.schemaVersion !== 1 || !isOutcome(record.outcome) || typeof record.reasonCode !== "string" || typeof record.observedAt !== "string") return null;
  if (!(HEARTBEAT_REASON_CODES[record.outcome] as readonly string[]).includes(record.reasonCode)) return null;
  const timestamp = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?Z$/.exec(record.observedAt);
  if (!timestamp) return null;
  const observedAt = new Date(record.observedAt);
  if (
    Number.isNaN(observedAt.getTime()) ||
    observedAt.getUTCFullYear() !== Number(timestamp[1]) ||
    observedAt.getUTCMonth() + 1 !== Number(timestamp[2]) ||
    observedAt.getUTCDate() !== Number(timestamp[3]) ||
    observedAt.getUTCHours() !== Number(timestamp[4]) ||
    observedAt.getUTCMinutes() !== Number(timestamp[5]) ||
    observedAt.getUTCSeconds() !== Number(timestamp[6]) ||
    observedAt.getTime() > receivedAt.getTime()
  ) return null;
  return { schemaVersion: 1, outcome: record.outcome, reasonCode: record.reasonCode, observedAt };
}

function isJsonMediaType(value: string | null): boolean {
  if (!value) return false;
  return /^application\/json(?:\s*;\s*[!#$%&'*+.^_`|~0-9A-Za-z-]+\s*=\s*(?:[!#$%&'*+.^_`|~0-9A-Za-z-]+|"[^"\r\n]*"))*\s*$/i.test(value);
}

function isOutcome(value: unknown): value is HeartbeatOutcome {
  return value === "verified" || value === "delivery_failed" || value === "inconclusive";
}

function heartbeatError(error: string, status: number): Response {
  return Response.json({ error }, { status, headers: { "cache-control": "no-store" } });
}

function safeError(error: unknown): string {
  return (error instanceof Error ? error.message : String(error)).slice(0, 500);
}
