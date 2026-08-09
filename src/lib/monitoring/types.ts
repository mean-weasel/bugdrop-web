export type ComponentStatus = "unknown" | "operational" | "degraded" | "outage";
export type IncidentImpact = "degraded" | "outage";

export type ComponentDefinition = {
  id: string;
  name: string;
  description: string;
  impactOnFailure: IncidentImpact;
  failureThreshold: number;
  recoveryThreshold: number;
  failureMessage: string;
};

export type ComponentState = {
  id: string;
  status: ComponentStatus;
  consecutiveFailures: number;
  consecutiveSuccesses: number;
  lastCheckedAt: Date | null;
  lastVerifiedAt: Date | null;
  lastFailureAt: Date | null;
  lastLatencyMs: number | null;
  lastErrorCode: string | null;
  openIncidentId: string | null;
};

export type Observation = {
  ok: boolean;
  checkedAt: Date;
  latencyMs: number | null;
  errorCode: string | null;
  markVerifiedSuccess?: boolean;
};

export type StateTransition = { kind: "opened"; impact: IncidentImpact } | { kind: "resolved"; incidentId: string } | null;

export type ReducedState = {
  state: ComponentState;
  transition: StateTransition;
};

export type AlertPayload = {
  schemaVersion: 1;
  event: "opened" | "resolved";
  incidentId: string;
  component: string;
  componentId: string;
  impact: IncidentImpact;
  title: string;
  message: string;
  startedAt: string;
  resolvedAt: string | null;
  statusUrl: string;
};

export type PublicComponent = {
  id: string;
  name: string;
  description: string;
  status: ComponentStatus;
  lastCheckedAt: string | null;
  lastVerifiedAt: string | null;
  uptime30d: number | null;
  monitoredDays30d: number;
  history30d: PublicDailyComponentStatus[];
};

export type PublicDailyComponentStatus = {
  date: string;
  status: ComponentStatus;
  dataState: "pre_monitoring" | "historical" | "monitored" | "monitoring_gap";
  uptime: number | null;
  checks: number;
  successfulChecks: number;
  incidentIds: string[];
};

export type PublicIncident = {
  id: string;
  componentId: string;
  componentName: string;
  state: "open" | "resolved";
  impact: IncidentImpact;
  title: string;
  message: string;
  startedAt: string;
  resolvedAt: string | null;
};

export type PublicStatusSnapshot = {
  schemaVersion: 1;
  overall: ComponentStatus;
  generatedAt: string;
  lastEvaluatedAt: string | null;
  monitoringStartedAt: string | null;
  evaluatorFresh: boolean;
  components: PublicComponent[];
  incidents: PublicIncident[];
};
