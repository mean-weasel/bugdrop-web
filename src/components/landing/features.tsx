import { SectionHeading } from "./section-heading";
import Link from "next/link";
import { ArrowRight, Camera, GitPullRequest, Zap } from "lucide-react";

const features = [
  {
    Icon: Camera,
    title: "Visual bug reports",
    description:
      "Capture screenshots, annotations, browser context, and privacy redactions so every report starts with useful evidence.",
    href: "/use-cases/visual-bug-reporting",
  },
  {
    Icon: GitPullRequest,
    title: "GitHub-native triage",
    description:
      "Turn feedback into structured GitHub Issues with labels and metadata instead of sending your team into another dashboard.",
    href: "/use-cases/github-issues-feedback",
  },
  {
    Icon: Zap,
    title: "Lightweight by default",
    description:
      "Install with one script tag, customize the widget to match your site, and self-host when your team wants full control.",
    href: "/docs/installation",
  },
];

export function Features() {
  return (
    <section className="mb-20">
      <SectionHeading>Why Teams Use BugDrop</SectionHeading>
      <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-1">
        {features.map((feature, i) => (
          <Link key={feature.title} href={feature.href} className="bg-bg-surface border border-border rounded-2xl p-7 transition-all duration-400 hover:-translate-y-1 hover:border-accent-warm hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] animate-fade-up no-underline" style={{ animationDelay: `${0.1 + i * 0.05}s` }}>
            <feature.Icon className="mb-4 size-7 text-accent-warm" aria-hidden="true" />
            <h3 className="text-base font-semibold mb-2 text-text-primary">{feature.title}</h3>
            <p className="text-sm text-text-subtle leading-relaxed">{feature.description}</p>
          </Link>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-accent-cyan/25 bg-accent-cyan/10 p-6 text-center animate-fade-up max-sm:pb-20" style={{ animationDelay: "0.3s" }}>
        <p className="mx-auto mb-4 max-w-[760px] text-sm leading-relaxed text-text-subtle">
          Looking for a lighter alternative to Userback, Marker.io, BugHerd,
          Usersnap, Canny, or Sentry User Feedback? BugDrop keeps the workflow
          focused on visual reports that land where developers already work.
        </p>
        <Link
          href="/compare"
          data-analytics-event="compare_index_click"
          data-analytics-label="Compare BugDrop alternatives"
          className="inline-flex items-center gap-2 rounded-[10px] border border-accent-cyan/40 bg-bg-deep/40 px-4 py-2 text-sm font-medium text-accent-cyan no-underline transition-all hover:-translate-y-0.5 hover:border-accent-cyan max-sm:flex max-sm:mr-auto max-sm:w-[190px] max-sm:justify-center"
        >
          Compare alternatives
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
