import { configuredAlertChannels, dispatchPendingAlerts } from "./alerts";
import {
  COMPONENTS,
  HEARTBEAT_STALE_AFTER_MS,
  configurationIssues,
} from "./config";
import { runHttpChecks } from "./checks";
import {
  acquireEvaluatorLease,
  applyHeartbeatEvaluation,
  applyObservation,
  markEvaluatorCompleted,
  pruneMonitoringHistory,
  releaseFailedEvaluatorLease,
  seedMonitoringComponents,
} from "./store";

export type EvaluationSummary = {
  status: "completed" | "already_running";
  checkedAt: string;
  observations: Array<{
    componentId: string;
    ok: boolean;
    errorCode: string | null;
  }>;
  alerts: { delivered: number; failed: number; skipped: number };
};

export async function evaluateMonitoring(now = new Date()): Promise<EvaluationSummary> {
  const issues = configurationIssues();
  if (issues.length > 0) throw new Error(`Monitoring configuration is invalid: ${issues.join("; ")}`);

  await seedMonitoringComponents(now);
  if (!(await acquireEvaluatorLease(now))) {
    return {
      status: "already_running",
      checkedAt: now.toISOString(),
      observations: [],
      alerts: { delivered: 0, failed: 0, skipped: 0 },
    };
  }

  let observationCommitted = false;
  try {
    const channels = configuredAlertChannels();
    const observations = await runHttpChecks(now);

    for (const result of observations) {
      const definition = COMPONENTS.find((component) => component.id === result.componentId);
      if (!definition) throw new Error(`Unknown monitoring component ${result.componentId}`);
      await applyObservation(definition, result.observation, channels);
      observationCommitted = true;
    }
    const heartbeatDefinition = COMPONENTS.find((component) => component.id === "issue_delivery");
    if (!heartbeatDefinition) throw new Error("Issue delivery component is not configured");
    const heartbeat = await applyHeartbeatEvaluation(now, heartbeatDefinition, channels);
    if (heartbeat) {
      observations.push(heartbeat);
      observationCommitted = true;
    }

    const completedAt = new Date();
    await pruneMonitoringHistory(completedAt);
    const alerts = await dispatchPendingAlerts();
    if (alerts.failed > 0 || alerts.skipped > 0) {
      throw new Error(
        `Alert delivery is impaired: ${alerts.failed} failed, ${alerts.skipped} skipped`,
      );
    }
    await markEvaluatorCompleted(completedAt);
    return {
      status: "completed",
      checkedAt: now.toISOString(),
      observations: observations.map((result) => ({
        componentId: result.componentId,
        ok: result.observation.ok,
        errorCode: result.observation.errorCode,
      })),
      alerts,
    };
  } catch (error) {
    if (!observationCommitted) {
      await releaseFailedEvaluatorLease(now).catch(() => undefined);
    }
    throw error;
  }
}

export function isHeartbeatStale(reference: Date, now: Date): boolean {
  return now.getTime() - reference.getTime() > HEARTBEAT_STALE_AFTER_MS;
}
