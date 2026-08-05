import { configuredAlertChannels, dispatchPendingAlerts } from "@/lib/monitoring/alerts";
import { hasValidBearer, safeRequestId } from "@/lib/monitoring/auth";
import { COMPONENTS, configurationIssues } from "@/lib/monitoring/config";
import {
  recordHeartbeatSuccess,
  seedMonitoringComponents,
} from "@/lib/monitoring/store";

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
  try {
    await seedMonitoringComponents(receivedAt);
    const definition = COMPONENTS.find((component) => component.id === "issue_delivery");
    if (!definition) throw new Error("Issue delivery component is not configured");
    const inserted = await recordHeartbeatSuccess(
      requestId,
      receivedAt,
      definition,
      configuredAlertChannels(),
    );
    if (inserted) {
      const alerts = await dispatchPendingAlerts();
      if (alerts.failed > 0 || alerts.skipped > 0) {
        console.error(
          "[monitoring] heartbeat alert delivery impaired",
          `${alerts.failed} failed, ${alerts.skipped} skipped`,
        );
      }
    }
    return new Response(null, { status: 204, headers: { "cache-control": "no-store" } });
  } catch (error) {
    console.error("[monitoring] heartbeat failed", safeError(error));
    return Response.json(
      { error: "Heartbeat could not be recorded" },
      { status: 500, headers: { "cache-control": "no-store" } },
    );
  }
}

function safeError(error: unknown): string {
  return (error instanceof Error ? error.message : String(error)).slice(0, 500);
}
