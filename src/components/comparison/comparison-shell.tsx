import Link from "next/link";
import comparisonData from "./comparison-data.json";

interface ComparisonSource {
  id: string;
  label: string;
  url: string;
  supports: string;
  claimIds: string[];
}

export interface ComparisonEvidence {
  slug: string;
  verifiedDate: string;
  publisher: string;
  reviewMethod: string;
  researchBasis: string;
  summary: string;
  bugdropWins: string;
  competitorWins: string;
  bugdropLimitation: string;
  claimRefs: Record<"summary" | "bugdropWins" | "competitorWins" | "bugdropLimitation", string[]>;
  sources: ComparisonSource[];
}

export function ComparisonTable(props: React.ComponentPropsWithoutRef<"table">) {
  return (
    <div className="not-prose my-6">
      <p id="comparison-table-scroll-instructions" className="mb-2 text-xs font-medium text-text-muted sm:hidden">
        Scroll table horizontally to reach every column →
      </p>
      <div
        data-comparison-table-scroll
        aria-label="Scrollable comparison table"
        aria-describedby="comparison-table-scroll-instructions"
        role="region"
        tabIndex={0}
        className="max-w-full overflow-x-auto rounded-xl border border-border bg-bg-surface pb-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cyan [scrollbar-color:var(--color-accent-cyan)_var(--color-bg-surface)] [scrollbar-width:thin]"
      >
        <table {...props} className={`${props.className ?? ""} my-0 w-[680px] table-fixed border-0`} />
      </div>
    </div>
  );
}

export function getComparisonEvidence(slug: string): ComparisonEvidence {
  const evidence = comparisonData.find((entry) => entry.slug === slug);
  if (!evidence) throw new Error(`Missing comparison evidence for ${slug}`);
  return evidence;
}

function DecisionCard({
  eyebrow,
  children,
  tone,
  claimIds,
  sources,
}: {
  eyebrow: string;
  children: React.ReactNode;
  tone: "cyan" | "warm";
  claimIds: string[];
  sources: ComparisonSource[];
}) {
  const border = tone === "cyan" ? "border-accent-cyan/30" : "border-accent-warm/30";
  const text = tone === "cyan" ? "text-accent-cyan" : "text-accent-warm";
  return (
    <div className={`rounded-2xl border ${border} bg-bg-surface p-5`}>
      <p className={`mb-2 text-xs font-semibold uppercase tracking-[0.18em] ${text}`}>{eyebrow}</p>
      <p className="m-0 text-sm leading-relaxed text-text-subtle">
        {children} <ClaimLinks claimIds={claimIds} sources={sources} />
      </p>
    </div>
  );
}

function ClaimLinks({ claimIds, sources }: { claimIds: string[]; sources: ComparisonSource[] }) {
  return (
    <span className="whitespace-nowrap font-mono text-xs" aria-label={`Sources for claims ${claimIds.join(", ")}`}>
      {claimIds.map((claimId, index) => {
        const source = sources.find((candidate) => candidate.claimIds.includes(claimId));
        if (!source) throw new Error(`Missing source mapping for claim ${claimId}`);
        return (
          <span key={claimId}>
            {index > 0 ? " " : null}
            <a className="text-accent-cyan hover:underline" href={`#source-${source.id}`}>[{claimId}]</a>
          </span>
        );
      })}
    </span>
  );
}

export function ComparisonShell({
  evidence,
  children,
}: {
  evidence: ComparisonEvidence;
  children: React.ReactNode;
}) {
  const humanDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${evidence.verifiedDate}T00:00:00Z`));

  return (
    <article data-comparison-slug={evidence.slug}>
      <div className="mb-8 rounded-2xl border border-border bg-bg-surface p-5 sm:p-6">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-text-muted">
          <span>Publisher: {evidence.publisher}</span>
          <span>Review method: {evidence.reviewMethod}</span>
          <time dateTime={evidence.verifiedDate}>Last verified {humanDate}</time>
        </div>
        <p className="mb-0 mt-3 text-sm leading-relaxed text-text-subtle">
          <strong className="text-text-primary">Research basis:</strong> {evidence.researchBasis}
        </p>
      </div>

      <div className="comparison-prose">{children}</div>

      <section aria-labelledby="decision-summary" className="mt-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent-rose">Decision summary</p>
        <h2 id="decision-summary" className="mb-3 mt-0 text-2xl font-semibold text-text-primary">
          Pick the workflow, not the longest feature list
        </h2>
        <p className="mb-5 leading-relaxed text-text-subtle">
          {evidence.summary} <ClaimLinks claimIds={evidence.claimRefs.summary} sources={evidence.sources} />
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <DecisionCard eyebrow="BugDrop wins when" tone="cyan" claimIds={evidence.claimRefs.bugdropWins} sources={evidence.sources}>{evidence.bugdropWins}</DecisionCard>
          <DecisionCard eyebrow="The alternative wins when" tone="warm" claimIds={evidence.claimRefs.competitorWins} sources={evidence.sources}>{evidence.competitorWins}</DecisionCard>
        </div>
        <div className="mt-4 rounded-2xl border border-accent-rose/30 bg-accent-rose/5 p-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent-rose">BugDrop limitation</p>
          <p className="m-0 text-sm leading-relaxed text-text-subtle">
            {evidence.bugdropLimitation} <ClaimLinks claimIds={evidence.claimRefs.bugdropLimitation} sources={evidence.sources} />
          </p>
        </div>
      </section>

      <section aria-labelledby="comparison-sources" className="mt-10 rounded-2xl border border-border bg-bg-surface p-5 sm:p-6">
        <h2 id="comparison-sources" className="mb-2 mt-0 text-xl font-semibold text-text-primary">Sources</h2>
        <p className="mb-4 text-sm leading-relaxed text-text-subtle">
          Claims were checked against these first-party pages on {humanDate}. Product details can change; re-check the linked source before purchasing.
        </p>
        <ul className="m-0 space-y-4 p-0">
          {evidence.sources.map((source) => (
            <li id={`source-${source.id}`} key={source.id} className="scroll-mt-24 list-none text-sm">
              <a className="font-medium text-accent-cyan hover:underline" href={source.url} target="_blank" rel="noopener noreferrer">
                [{source.id}] {source.label}
              </a>
              <span className="mt-1 block leading-relaxed text-text-muted">{source.supports}</span>
              <span className="mt-1 block font-mono text-xs leading-relaxed text-text-muted">
                Claim IDs: {source.claimIds.join(", ")}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="comparison-next-step" className="mt-10 rounded-2xl border border-accent-cyan/25 bg-gradient-to-br from-accent-cyan/10 to-accent-rose/10 p-6 text-center sm:p-8">
        <h2 id="comparison-next-step" className="mb-2 mt-0 text-2xl font-semibold text-text-primary">Validate BugDrop in your own workflow</h2>
        <p className="mx-auto mb-5 max-w-2xl leading-relaxed text-text-subtle">
          Try the reporting flow with your own expectations, then review installation and privacy controls before adding it to a real site.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/demo" data-analytics-event="compare_demo_click" data-analytics-label={evidence.slug} className="rounded-[10px] bg-gradient-to-br from-accent-warm to-accent-rose px-6 py-3 font-medium text-bg-deep no-underline transition-transform hover:-translate-y-0.5">
            Try the interactive demo
          </Link>
          <Link href="/docs/installation" data-analytics-event="compare_installation_click" data-analytics-label={evidence.slug} className="rounded-[10px] border border-border bg-bg-surface px-6 py-3 font-medium text-text-primary no-underline hover:border-accent-cyan">
            Review installation
          </Link>
        </div>
      </section>
    </article>
  );
}
