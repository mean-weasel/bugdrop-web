import type { ComponentStatus, PublicIncident, PublicStatusSnapshot } from "@/lib/monitoring/types";
import { ComponentHistory, HistoryLegend } from "./component-history";

type PresentedStatus = ComponentStatus | "verification_delayed";

const statusStyles: Record<PresentedStatus, string> = {
  operational: "border-accent-green/40 bg-accent-green/10 text-accent-green",
  degraded: "border-accent-warm/40 bg-accent-warm/10 text-accent-warm",
  outage: "border-accent-rose/40 bg-accent-rose/10 text-accent-rose",
  unknown: "border-text-muted/40 bg-text-muted/10 text-text-subtle",
  verification_delayed: "border-text-muted/40 bg-text-muted/10 text-text-subtle",
};

const statusLabels: Record<PresentedStatus, string> = {
  operational: "Operational",
  degraded: "Degraded",
  outage: "Outage",
  unknown: "Unknown",
  verification_delayed: "Verification delayed",
};

export function StatusDashboard({ snapshot }: { snapshot: PublicStatusSnapshot }) {
  const openIncidents = snapshot.incidents.filter((incident) => incident.state === "open");
  const incidentHistory = snapshot.incidents.filter((incident) => incident.state === "resolved");
  const delayedComponentIds = new Set(snapshot.components.filter((component) => component.statusDetail === "verification_delayed").map((component) => component.id));
  const delayedIncidentIds = new Set([
    ...snapshot.incidents.filter((incident) => incident.statusDetail === "verification_delayed").map((incident) => incident.id),
    ...openIncidents.filter((incident) => delayedComponentIds.has(incident.componentId)).map((incident) => incident.id),
  ]);
  const bannerStatus: PresentedStatus = isVerificationDelayedOnly(snapshot) ? "verification_delayed" : snapshot.overall;

  return (
    <div className="space-y-10">
      <section className={`rounded-2xl border p-6 ${statusStyles[bannerStatus]}`} aria-live="polite">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] opacity-80">Current status</p>
            <h2 className="mt-2 text-2xl font-semibold text-current">{overallMessage(bannerStatus)}</h2>
          </div>
          <StatusPill status={bannerStatus} />
        </div>
        {!snapshot.evaluatorFresh && <p className="mt-4 text-sm text-current/80">The monitoring evaluator has not completed recently. Component results may be stale.</p>}
      </section>

      <section aria-labelledby="components-heading">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-cyan">30-day reliability</p>
            <h2 id="components-heading" className="mt-1 text-2xl font-semibold">
              BugDrop services
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-text-subtle">Daily confirmed status over the past 30 days. Continuous monitoring began {formatMonitoringStart(snapshot.monitoringStartedAt)}.</p>
          </div>
          <p className="text-xs text-text-muted">Last evaluated {formatRelativeTime(snapshot.lastEvaluatedAt)}</p>
        </div>
        <HistoryLegend />
        <div className="mt-5 space-y-4">
          {snapshot.components.map((component) => (
            <ComponentHistory key={component.id} component={component} delayedIncidentIds={delayedIncidentIds} />
          ))}
        </div>
      </section>

      <section aria-labelledby="incidents-heading">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-warm">Incident response</p>
        <h2 id="incidents-heading" className="mt-1 text-2xl font-semibold">
          Current incidents
        </h2>
        <div className="mt-4">
          {openIncidents.length === 0 ? (
            <div className="rounded-xl border border-accent-green/30 bg-accent-green/5 p-5 text-sm text-text-subtle">No active incidents.</div>
          ) : (
            <div className="space-y-4">
              {openIncidents.map((incident) => (
                <IncidentCard key={incident.id} incident={incident} verificationDelayed={delayedIncidentIds.has(incident.id)} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="history-heading">
        <h2 id="history-heading" className="text-2xl font-semibold">
          Previous incidents
        </h2>
        <p className="mt-1 text-sm text-text-subtle">Resolved incidents from the last 90 days.</p>
        <div className="mt-4 space-y-3">
          {incidentHistory.length === 0 ? (
            <p className="rounded-xl border border-border bg-bg-surface p-5 text-sm text-text-muted">No resolved incidents have been recorded in this window.</p>
          ) : (
            incidentHistory.map((incident) => <IncidentCard key={incident.id} incident={incident} verificationDelayed={delayedIncidentIds.has(incident.id)} />)
          )}
        </div>
      </section>
    </div>
  );
}

export function StatusUnavailable() {
  return (
    <section className="rounded-2xl border border-text-muted/40 bg-bg-surface p-6">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-text-muted">Status unavailable</p>
      <h2 className="mt-2 text-2xl font-semibold">Current monitoring data could not be loaded.</h2>
      <p className="mt-3 text-sm text-text-subtle">This page has failed closed instead of presenting stale services as healthy. Please try again shortly.</p>
    </section>
  );
}

function StatusPill({ status }: { status: PresentedStatus }) {
  return (
    <span className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[status]}`}>
      <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />
      {statusLabels[status]}
    </span>
  );
}

function IncidentCard({ incident, verificationDelayed = false }: { incident: PublicIncident; verificationDelayed?: boolean }) {
  return (
    <article id={`incident-${incident.id}`} className="scroll-mt-24 rounded-xl border border-border bg-bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-text-muted">{incident.componentName}</p>
          <h3 className="mt-1 font-semibold text-text-primary">{verificationDelayed ? "Verification delayed" : incident.title}</h3>
        </div>
        <span
          className={`rounded-full border px-2.5 py-1 text-xs ${incident.state === "open" ? statusStyles[verificationDelayed ? "verification_delayed" : incident.impact] : "border-accent-green/30 text-accent-green"}`}
        >
          {incident.state === "open" ? (verificationDelayed ? "Verification delayed" : "Investigating") : "Resolved"}
        </span>
      </div>
      <p className="mt-3 text-sm text-text-subtle">{incident.message}</p>
      <p className="mt-4 font-mono text-xs text-text-muted">
        Started {formatTimestamp(incident.startedAt)}
        {incident.resolvedAt ? ` · Resolved ${formatTimestamp(incident.resolvedAt)}` : ""}
      </p>
    </article>
  );
}

function overallMessage(status: PresentedStatus): string {
  if (status === "verification_delayed") return "Issue delivery verification is delayed";
  if (status === "operational") return "All systems are operational";
  if (status === "degraded") return "Some systems are degraded";
  if (status === "outage") return "A service outage is in progress";
  return "System status is not yet established";
}

function isVerificationDelayedOnly(snapshot: PublicStatusSnapshot): boolean {
  return (
    snapshot.overall === "degraded" &&
    snapshot.evaluatorFresh &&
    snapshot.components.some((component) => component.statusDetail === "verification_delayed") &&
    snapshot.components.every((component) => component.status === "operational" || component.statusDetail === "verification_delayed")
  );
}

function formatTimestamp(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(value));
}

function formatRelativeTime(value: string | null): string {
  if (!value) return "not yet";
  const elapsedMs = Date.now() - new Date(value).getTime();
  if (elapsedMs < 60_000) return "less than a minute ago";
  if (elapsedMs < 60 * 60_000) return `${Math.floor(elapsedMs / 60_000)} minutes ago`;
  if (elapsedMs < 24 * 60 * 60_000) return `${Math.floor(elapsedMs / 3_600_000)} hours ago`;
  return `${Math.floor(elapsedMs / 86_400_000)} days ago`;
}

function formatMonitoringStart(value: string | null): string {
  if (!value) return "when the first trustworthy sample is recorded";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(value));
}
