import type { ComponentStatus, PublicComponent, PublicDailyComponentStatus } from "@/lib/monitoring/types";

const historyStyles = {
  operational: "bg-accent-green/85 hover:bg-accent-green",
  degraded: "bg-accent-warm/85 hover:bg-accent-warm",
  outage: "bg-accent-rose/85 hover:bg-accent-rose",
  unknown: "bg-text-muted/45 hover:bg-text-muted/60",
  pre_monitoring: "bg-text-muted/15 hover:bg-text-muted/25",
  historical: "bg-accent-cyan/35 ring-1 ring-inset ring-accent-cyan/30 hover:bg-accent-cyan/50",
  monitoring_gap: "bg-text-muted/45 ring-1 ring-inset ring-text-muted/30 hover:bg-text-muted/60",
} as const;

export function ComponentHistory({ component }: { component: PublicComponent }) {
  return (
    <article className="rounded-xl border border-border bg-bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-xl">
          <h3 className="font-semibold text-text-primary">{component.name}</h3>
          <p className="mt-1 text-sm text-text-subtle">{component.description}</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-lg font-semibold text-text-primary">{component.uptime30d === null ? "No data" : `${component.uptime30d.toFixed(2)}%`}</p>
          <p className="text-xs text-text-muted">check uptime</p>
        </div>
      </div>

      <div className="mt-5 grid gap-1" style={{ gridTemplateColumns: "repeat(30, minmax(3px, 1fr))" }} aria-label={`${component.name} daily status over the past 30 days`}>
        {component.history30d.map((day, index) => (
          <HistoryDay key={day.date} day={day} index={index} />
        ))}
      </div>

      <div className="mt-2 flex justify-between font-mono text-[0.65rem] uppercase tracking-wider text-text-muted">
        <span>29 days ago</span>
        <span>Today</span>
      </div>

      <dl className="mt-5 grid gap-4 border-t border-border pt-4 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-xs uppercase tracking-wider text-text-muted">Current status</dt>
          <dd className="mt-1 text-text-primary">{statusLabel(component.status)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider text-text-muted">Monitored days</dt>
          <dd className="mt-1 font-mono text-text-primary">{component.monitoredDays30d} of 30</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider text-text-muted">Last verified</dt>
          <dd className="mt-1 font-mono text-text-primary">{formatRelativeTime(component.lastVerifiedAt)}</dd>
        </div>
      </dl>
    </article>
  );
}

export function HistoryLegend() {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-text-muted" aria-label="Status history legend">
      <LegendItem className={historyStyles.operational} label="Operational" />
      <LegendItem className={historyStyles.degraded} label="Degraded" />
      <LegendItem className={historyStyles.outage} label="Outage" />
      <LegendItem className={historyStyles.pre_monitoring} label="Before monitoring" />
      <LegendItem className={historyStyles.historical} label="Historical checks" />
      <LegendItem className={historyStyles.monitoring_gap} label="Monitoring gap" />
    </ul>
  );
}

function HistoryDay({ day, index }: { day: PublicDailyComponentStatus; index: number }) {
  const incidentId = day.incidentIds[0];
  const description = historyDescription(day);
  const incidentDuringGap = day.dataState === "monitoring_gap" && Boolean(incidentId) && day.status !== "unknown";
  const incidentDuringBackfill = day.dataState === "historical" && Boolean(incidentId) && day.status !== "unknown";
  const barClass =
    day.dataState === "pre_monitoring"
      ? historyStyles.pre_monitoring
      : incidentDuringBackfill
        ? `${historyStyles[day.status]} ring-2 ring-inset ring-accent-cyan/70`
        : day.dataState === "historical"
          ? historyStyles.historical
          : incidentDuringGap
            ? `${historyStyles[day.status]} ring-2 ring-inset ring-text-muted/70`
            : day.dataState === "monitoring_gap"
              ? historyStyles.monitoring_gap
              : historyStyles[day.status];
  const tooltipPosition = index < 3 ? "left-0" : index > 26 ? "right-0" : "left-1/2 -translate-x-1/2";
  const sharedClass = `block h-9 w-full rounded-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cyan ${barClass}`;

  return (
    <div className="group relative min-w-0">
      {incidentId ? <a className={sharedClass} href={`#incident-${incidentId}`} aria-label={description} /> : <span className={sharedClass} tabIndex={0} aria-label={description} />}
      <div
        role="tooltip"
        className={`pointer-events-none absolute bottom-full z-20 mb-2 hidden w-52 rounded-lg border border-border bg-bg-elevated p-3 text-left text-xs shadow-xl group-hover:block group-focus-within:block ${tooltipPosition}`}
      >
        <p className="font-semibold text-text-primary">{formatDay(day.date)}</p>
        <p className="mt-1 text-text-subtle">{descriptionAfterDate(day)}</p>
        {incidentId && <p className="mt-2 text-accent-cyan">View incident details</p>}
      </div>
    </div>
  );
}

function LegendItem({ className, label }: { className: string; label: string }) {
  return (
    <li className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded-sm ${className}`} aria-hidden="true" />
      {label}
    </li>
  );
}

function historyDescription(day: PublicDailyComponentStatus): string {
  return `${formatDay(day.date)}: ${descriptionAfterDate(day)}`;
}

function descriptionAfterDate(day: PublicDailyComponentStatus): string {
  if (day.dataState === "pre_monitoring") return "No monitoring data was collected yet.";
  if (day.dataState === "historical") {
    const checks = `${day.successfulChecks} of ${day.checks} checks passed`;
    if (day.incidentIds.length > 0 && day.status !== "unknown") {
      const incidents = `${day.incidentIds.length} confirmed incident${day.incidentIds.length === 1 ? "" : "s"}`;
      return `${statusLabel(day.status)} · Historical check data · ${checks} · ${incidents}.`;
    }
    return `Historical check data · ${checks} · Confirmed daily state is unavailable.`;
  }
  if (day.dataState === "monitoring_gap") {
    if (day.incidentIds.length > 0 && day.status !== "unknown") {
      const incidents = `${day.incidentIds.length} confirmed incident${day.incidentIds.length === 1 ? "" : "s"}`;
      return `${statusLabel(day.status)} · No trustworthy monitoring samples were recorded · ${incidents}.`;
    }
    return "No trustworthy monitoring samples were recorded.";
  }
  const uptime = day.uptime === null ? "No uptime data" : `${day.uptime.toFixed(2)}% check uptime`;
  const checks = `${day.successfulChecks} of ${day.checks} checks passed`;
  const incidents = day.incidentIds.length === 0 ? "no incidents" : `${day.incidentIds.length} incident${day.incidentIds.length === 1 ? "" : "s"}`;
  return `${statusLabel(day.status)} · ${uptime} · ${checks} · ${incidents}.`;
}

function statusLabel(status: ComponentStatus): string {
  if (status === "operational") return "Operational";
  if (status === "degraded") return "Degraded";
  if (status === "outage") return "Outage";
  return "Unknown";
}

function formatDay(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function formatRelativeTime(value: string | null): string {
  if (!value) return "not yet";
  const elapsedMs = Date.now() - new Date(value).getTime();
  if (elapsedMs < 60_000) return "less than a minute ago";
  if (elapsedMs < 60 * 60_000) return `${Math.floor(elapsedMs / 60_000)} minutes ago`;
  if (elapsedMs < 24 * 60 * 60_000) return `${Math.floor(elapsedMs / 3_600_000)} hours ago`;
  return `${Math.floor(elapsedMs / 86_400_000)} days ago`;
}
