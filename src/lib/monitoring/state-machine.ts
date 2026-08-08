import type {
  ComponentDefinition,
  ComponentState,
  Observation,
  ReducedState,
} from "./types";

export function reduceComponentState(
  current: ComponentState,
  definition: ComponentDefinition,
  observation: Observation,
): ReducedState {
  if (observation.ok) {
    const consecutiveSuccesses = current.consecutiveSuccesses + 1;
    const canRecover =
      current.status === "unknown" || consecutiveSuccesses >= definition.recoveryThreshold;
    const recoveredIncidentId =
      canRecover && current.status !== "unknown" ? current.openIncidentId : null;
    const status = canRecover ? "operational" : current.status;

    return {
      state: {
        ...current,
        status,
        consecutiveFailures: 0,
        consecutiveSuccesses,
        lastCheckedAt: observation.checkedAt,
        lastVerifiedAt:
          observation.markVerifiedSuccess === false
            ? current.lastVerifiedAt
            : observation.checkedAt,
        lastLatencyMs: observation.latencyMs,
        lastErrorCode: status === "operational" ? null : current.lastErrorCode,
        openIncidentId: status === "operational" ? null : current.openIncidentId,
      },
      transition: recoveredIncidentId
        ? { kind: "resolved", incidentId: recoveredIncidentId }
        : null,
    };
  }

  const consecutiveFailures = current.consecutiveFailures + 1;
  const opensIncident =
    (current.status === "unknown" || current.status === "operational") &&
    consecutiveFailures >= definition.failureThreshold;

  return {
    state: {
      ...current,
      status: opensIncident ? definition.impactOnFailure : current.status,
      consecutiveFailures,
      consecutiveSuccesses: 0,
      lastCheckedAt: observation.checkedAt,
      lastFailureAt: observation.checkedAt,
      lastLatencyMs: observation.latencyMs,
      lastErrorCode: observation.errorCode || "check_failed",
    },
    transition: opensIncident
      ? { kind: "opened", impact: definition.impactOnFailure }
      : null,
  };
}
