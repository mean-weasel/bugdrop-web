import { describe, expect, it } from "vitest";
import { reduceComponentState } from "@/lib/monitoring/state-machine";
import type { ComponentDefinition, ComponentState, Observation } from "@/lib/monitoring/types";

const definition: ComponentDefinition = {
  id: "feedback_api",
  name: "Feedback API",
  description: "Test",
  impactOnFailure: "outage",
  failureThreshold: 2,
  recoveryThreshold: 2,
  failureMessage: "Unavailable",
};

describe("reduceComponentState", () => {
  it("does not open an incident on one transient failure", () => {
    const reduced = reduceComponentState(initialState("operational"), definition, failure(1));
    expect(reduced.state.status).toBe("operational");
    expect(reduced.state.consecutiveFailures).toBe(1);
    expect(reduced.transition).toBeNull();
  });

  it("opens one incident after the configured confirmation threshold", () => {
    const current = {
      ...initialState("operational"),
      consecutiveFailures: 1,
      lastFailureAt: new Date("2026-08-05T00:00:00Z"),
    };
    const reduced = reduceComponentState(current, definition, failure(2));
    expect(reduced.state.status).toBe("outage");
    expect(reduced.transition).toEqual({ kind: "opened", impact: "outage" });
  });

  it("requires stable recovery and resolves the existing incident", () => {
    const first = reduceComponentState(
      {
        ...initialState("outage"),
        openIncidentId: "4a93499d-4dcc-40aa-ad0a-ed5ac7532e19",
        consecutiveFailures: 3,
      },
      definition,
      success(3),
    );
    expect(first.state.status).toBe("outage");
    expect(first.transition).toBeNull();

    const second = reduceComponentState(first.state, definition, success(4));
    expect(second.state.status).toBe("operational");
    expect(second.state.openIncidentId).toBeNull();
    expect(second.transition).toEqual({
      kind: "resolved",
      incidentId: "4a93499d-4dcc-40aa-ad0a-ed5ac7532e19",
    });
  });

  it("does not let freshness evaluation replace the last real heartbeat", () => {
    const verifiedAt = new Date("2026-08-05T00:00:00Z");
    const reduced = reduceComponentState(
      { ...initialState("operational"), lastVerifiedAt: verifiedAt },
      { ...definition, recoveryThreshold: 1 },
      { ...success(5), markVerifiedSuccess: false },
    );
    expect(reduced.state.lastVerifiedAt).toEqual(verifiedAt);
  });

  it("establishes an unknown component as operational after its first success", () => {
    const reduced = reduceComponentState(initialState("unknown"), definition, success(1));
    expect(reduced.state.status).toBe("operational");
    expect(reduced.transition).toBeNull();
  });
});

function initialState(status: ComponentState["status"]): ComponentState {
  return {
    id: definition.id,
    status,
    consecutiveFailures: 0,
    consecutiveSuccesses: 0,
    lastCheckedAt: null,
    lastVerifiedAt: null,
    lastFailureAt: null,
    lastLatencyMs: null,
    lastErrorCode: null,
    openIncidentId: null,
  };
}

function failure(minute: number): Observation {
  return {
    ok: false,
    checkedAt: new Date(`2026-08-05T00:0${minute}:00Z`),
    latencyMs: 200,
    errorCode: "http_503",
  };
}

function success(minute: number): Observation {
  return {
    ok: true,
    checkedAt: new Date(`2026-08-05T00:0${minute}:00Z`),
    latencyMs: 100,
    errorCode: null,
  };
}
