import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { compareNav } from "@/lib/compare-nav";
import { SectionHeading } from "./section-heading";

const keywordClusters = [
  {
    title: "Website feedback widget",
    description:
      "A drop-in feedback button for SaaS sites, docs, internal tools, and client review environments.",
  },
  {
    title: "GitHub Issues feedback",
    description:
      "Turn website bug reports into structured GitHub Issues instead of routing teams through another dashboard.",
  },
  {
    title: "Visual bug reporting",
    description:
      "Capture annotated screenshots, browser metadata, viewport size, and privacy redactions with one widget.",
  },
  {
    title: "Open-source alternative",
    description:
      "A free, MIT-licensed alternative to hosted visual feedback tools when your team wants GitHub-native triage.",
  },
];

const competitorLinks = compareNav.filter((item) =>
  ["userback", "marker-io", "bugherd", "usersnap", "canny", "sentry-user-feedback"].includes(
    item.slug,
  ),
);

export function KeywordPositioning() {
  return (
    <section className="mb-20">
      <SectionHeading>Search-Focused Workflows</SectionHeading>
      <div className="grid grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-8 max-lg:grid-cols-1">
        <div className="rounded-2xl border border-border bg-bg-surface p-7">
          <h2 className="mb-3 text-2xl font-semibold leading-tight text-text-primary">
            Built for teams searching for a lighter feedback widget than
            Userback, Marker.io, BugHerd, Usersnap, Canny, or Sentry feedback.
          </h2>
          <p className="mb-6 text-sm leading-relaxed text-text-subtle">
            BugDrop targets the workflow those tools often surround with paid
            suites: collect website feedback, capture a screenshot, include
            browser context, and create a GitHub Issue developers can triage
            immediately.
          </p>
          <Link
            href="/compare"
            data-analytics-event="compare_index_click"
            data-analytics-label="Compare BugDrop alternatives"
            className="inline-flex items-center gap-2 rounded-[10px] border border-accent-cyan/40 bg-accent-cyan/10 px-4 py-2 text-sm font-medium text-accent-cyan no-underline transition-all hover:-translate-y-0.5 hover:border-accent-cyan"
          >
            Compare alternatives
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          {keywordClusters.map((cluster) => (
            <div
              key={cluster.title}
              className="rounded-2xl border border-border bg-bg-surface p-5"
            >
              <h3 className="mb-2 text-sm font-semibold text-text-primary">
                {cluster.title}
              </h3>
              <p className="text-sm leading-relaxed text-text-subtle">
                {cluster.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
        {competitorLinks.map((item) => (
          <Link
            key={item.slug}
            href={`/compare/${item.slug}`}
            data-analytics-event="competitor_compare_click"
            data-analytics-label={item.title}
            className="rounded-2xl border border-border bg-bg-surface p-5 no-underline transition-all duration-300 hover:-translate-y-1 hover:border-accent-warm"
          >
            <h3 className="mb-2 text-sm font-semibold text-text-primary">
              {item.title}
            </h3>
            <p className="text-sm leading-relaxed text-text-subtle">
              {item.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
