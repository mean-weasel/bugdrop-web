import type {
  ComponentStatus,
  PublicIncident,
  PublicStatusSnapshot,
} from "@/lib/monitoring/types";

const statusStyles: Record<ComponentStatus, string> = {
  operational: "border-accent-green/40 bg-accent-green/10 text-accent-green",
  degraded: "border-accent-warm/40 bg-accent-warm/10 text-accent-warm",
  outage: "border-accent-rose/40 bg-accent-rose/10 text-accent-rose",
  unknown: "border-text-muted/40 bg-text-muted/10 text-text-subtle",
};

const statusLabels: Record<ComponentStatus, string> = {
  operational: "Operational",
  degraded: "Degraded",
  outage: "Outage",
  unknown: "Unknown",
};

export function StatusDashboard({ snapshot }: { snapshot: PublicStatusSnapshot }) {
  const openIncidents = snapshot.incidents.filter((incident) => incident.state === "open");
  const incidentHistory = snapshot.incidents.filter((incident) => incident.state === "resolved");

  return (
    <div className="space-y-10">
      <section
        className={`rounded-2xl border p-6 ${statusStyles[snapshot.overall]}`}
        aria-live="polite"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] opacity-80">
              Current status
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-current">
              {overallMessage(snapshot.overall)}
            </h2>
          </div>
          <StatusPill status={snapshot.overall} />
        </div>
        {!snapshot.evaluatorFresh && (
          <p className="mt-4 text-sm text-current/80">
            The monitoring evaluator has not completed recently. Component results may be stale.
          </p>
        )}
      </section>

      <section aria-labelledby="components-heading">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-cyan">
              Live components
            </p>
            <h2 id="components-heading" className="mt-1 text-2xl font-semibold">
              BugDrop services
            </h2>
          </div>
          <p className="text-xs text-text-muted">
            Last evaluated {formatRelativeTime(snapshot.lastEvaluatedAt)}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {snapshot.components.map((component) => (
            <article key={component.id} className="rounded-xl border border-border bg-bg-surface p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-text-primary">{component.name}</h3>
                  <p className="mt-1 text-sm text-text-subtle">{component.description}</p>
                </div>
                <StatusPill status={component.status} />
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-4 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-text-muted">30-day checks</dt>
                  <dd className="mt-1 font-mono text-text-primary">
                    {component.uptime30d === null ? "No data" : `${component.uptime30d.toFixed(3)}%`}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-text-muted">Last verified</dt>
                  <dd className="mt-1 font-mono text-text-primary">
                    {formatRelativeTime(component.lastVerifiedAt)}
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="incidents-heading">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-warm">
          Incident response
        </p>
        <h2 id="incidents-heading" className="mt-1 text-2xl font-semibold">
          Current incidents
        </h2>
        <div className="mt-4">
          {openIncidents.length === 0 ? (
            <div className="rounded-xl border border-accent-green/30 bg-accent-green/5 p-5 text-sm text-text-subtle">
              No active incidents.
            </div>
          ) : (
            <div className="space-y-4">
              {openIncidents.map((incident) => (
                <IncidentCard key={incident.id} incident={incident} />
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
            <p className="rounded-xl border border-border bg-bg-surface p-5 text-sm text-text-muted">
              No resolved incidents have been recorded in this window.
            </p>
          ) : (
            incidentHistory.map((incident) => (
              <IncidentCard key={incident.id} incident={incident} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export function StatusUnavailable() {
  return (
    <section className="rounded-2xl border border-text-muted/40 bg-bg-surface p-6">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-text-muted">
        Status unavailable
      </p>
      <h2 className="mt-2 text-2xl font-semibold">Current monitoring data could not be loaded.</h2>
      <p className="mt-3 text-sm text-text-subtle">
        This page has failed closed instead of presenting stale services as healthy. Please try again
        shortly.
      </p>
    </section>
  );
}

function StatusPill({ status }: { status: ComponentStatus }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[status]}`}
    >
      <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />
      {statusLabels[status]}
    </span>
  );
}

function IncidentCard({ incident }: { incident: PublicIncident }) {
  return (
    <article className="rounded-xl border border-border bg-bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-text-muted">{incident.componentName}</p>
          <h3 className="mt-1 font-semibold text-text-primary">{incident.title}</h3>
        </div>
        <span
          className={`rounded-full border px-2.5 py-1 text-xs ${
            incident.state === "open"
              ? statusStyles[incident.impact]
              : "border-accent-green/30 text-accent-green"
          }`}
        >
          {incident.state === "open" ? "Investigating" : "Resolved"}
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

function overallMessage(status: ComponentStatus): string {
  if (status === "operational") return "All systems are operational";
  if (status === "degraded") return "Some systems are degraded";
  if (status === "outage") return "A service outage is in progress";
  return "System status is not yet established";
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
