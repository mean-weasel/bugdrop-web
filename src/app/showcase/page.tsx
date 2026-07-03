import type { Metadata } from "next";
import { ArrowRight, ExternalLink, GitPullRequest, Globe2, ShieldCheck } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { MARKETPLACE_URL, SHOWCASE_SUBMISSION_ISSUE_URL } from "@/lib/links";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

const showcaseDescription =
  "See first-party products using BugDrop and share your own opt-in setup for the BugDrop showcase.";

const showcaseApps = [
  {
    name: "Bleep That Sh*t!",
    href: "https://bleepthat.sh",
    category: "Media workflow",
    status: "First-party",
    description:
      "Media-cleanup app using BugDrop for product feedback around upload, transcript, and export workflows.",
  },
  {
    name: "DeckChecker",
    href: "https://deckchecker.app",
    category: "Event operations",
    status: "First-party",
    description:
      "Conference presentation management software using BugDrop to capture review and revision feedback from event workflows.",
  },
  {
    name: "Seatify",
    href: "https://seatify.app",
    category: "Planning tool",
    status: "First-party",
    description:
      "Seating chart planner using BugDrop to collect feedback from event planning and beta workflows.",
  },
];

const listingSteps = [
  "Install BugDrop on a public app, internal tool, client project, or self-hosted setup.",
  "Share a public URL or an anonymized use case in the pinned GitHub issue.",
  "Confirm permission to list the entry on bugdrop.dev/showcase.",
];

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Built with BugDrop | BugDrop Showcase",
    description: showcaseDescription,
    path: "/showcase",
  }),
  alternates: {
    canonical: "/showcase",
  },
};

export default function ShowcasePage() {
  return (
    <main>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Showcase", path: "/showcase" },
        ])}
      />

      <header className="pb-16 text-center max-sm:pb-12">
        <p className="mb-4 text-sm font-medium text-accent-warm">
          Opt-in social proof for GitHub-native feedback
        </p>
        <h1 className="mx-auto mb-6 max-w-[780px] text-[clamp(2.35rem,5vw,4rem)] font-semibold leading-[1.12] text-text-primary">
          Built with BugDrop
        </h1>
        <p className="mx-auto mb-8 max-w-[680px] text-lg leading-relaxed text-text-subtle">
          These first-party products use BugDrop to collect actionable feedback directly into
          GitHub Issues. If BugDrop is running in your app too, share your setup and we may add it
          here.
        </p>
        <div className="flex flex-wrap justify-center gap-4 max-sm:flex-col">
          <a
            href={SHOWCASE_SUBMISSION_ISSUE_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-analytics-event="showcase_submit_click"
            data-analytics-label="Share your setup"
            className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-accent-cyan px-6 py-3 font-medium text-bg-deep no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(125,207,255,0.24)]"
          >
            <GitPullRequest className="size-4" aria-hidden="true" />
            Share your setup
          </a>
          <a
            href={MARKETPLACE_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-analytics-event="outbound_marketplace_click"
            data-analytics-label="Showcase install BugDrop"
            className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-border bg-bg-surface px-6 py-3 font-medium text-text-primary no-underline transition-all hover:-translate-y-0.5 hover:bg-bg-elevated"
          >
            Install BugDrop
            <ExternalLink className="size-4" aria-hidden="true" />
          </a>
        </div>
      </header>

      <section className="mb-20">
        <div className="mb-8 flex items-end justify-between gap-6 max-md:flex-col max-md:items-start">
          <div>
            <h2 className="mb-2 text-2xl font-semibold text-text-primary">
              First-party products using BugDrop
            </h2>
            <p className="max-w-[680px] text-sm leading-relaxed text-text-subtle">
              We are starting with apps from the BugDrop maker&apos;s own portfolio. Community
              submissions will be added only after explicit opt-in review.
            </p>
          </div>
          <span className="rounded border border-accent-green/25 bg-accent-green/10 px-3 py-1.5 text-xs font-medium text-accent-green">
            3 seed examples
          </span>
        </div>

        <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-1">
          {showcaseApps.map((app) => (
            <a
              key={app.name}
              href={app.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-[250px] flex-col rounded-2xl border border-border bg-bg-surface p-6 text-left no-underline transition-all duration-300 hover:-translate-y-1 hover:border-accent-warm hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
            >
              <div className="mb-6 flex items-center justify-between gap-3">
                <span className="rounded border border-accent-cyan/25 bg-accent-cyan/10 px-3 py-1 text-xs font-medium text-accent-cyan">
                  {app.status}
                </span>
                <ExternalLink
                  className="size-4 text-text-muted transition-colors group-hover:text-accent-warm"
                  aria-hidden="true"
                />
              </div>
              <div className="mb-5 flex size-12 items-center justify-center rounded-[10px] border border-border bg-bg-deep text-accent-warm">
                <Globe2 className="size-6" aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-text-primary">{app.name}</h3>
              <p className="mb-4 text-xs font-medium uppercase text-text-muted">{app.category}</p>
              <p className="mt-auto text-sm leading-relaxed text-text-subtle">{app.description}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="mb-20 grid grid-cols-[1fr_0.85fr] gap-6 max-lg:grid-cols-1">
        <div className="rounded-2xl border border-border bg-bg-surface p-7">
          <h2 className="mb-5 text-2xl font-semibold text-text-primary">How to get listed</h2>
          <ol className="grid gap-4">
            {listingSteps.map((step, index) => (
              <li key={step} className="flex gap-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-bg-deep text-sm font-semibold text-accent-warm">
                  {index + 1}
                </span>
                <span className="pt-0.5 text-sm leading-relaxed text-text-subtle">{step}</span>
              </li>
            ))}
          </ol>
          <a
            href={SHOWCASE_SUBMISSION_ISSUE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-[10px] border border-accent-cyan/35 bg-bg-deep/40 px-4 py-2.5 text-sm font-medium text-accent-cyan no-underline transition-all hover:-translate-y-0.5 hover:border-accent-cyan"
          >
            Open the pinned issue
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>

        <aside className="rounded-2xl border border-accent-cyan/25 bg-accent-cyan/10 p-7">
          <ShieldCheck className="mb-4 size-7 text-accent-cyan" aria-hidden="true" />
          <h2 className="mb-3 text-xl font-semibold text-text-primary">
            Opt-in, reviewed, and honest
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-text-subtle">
            BugDrop does not publish install data automatically. Private repositories, internal
            apps, and user data stay private unless you choose to share an anonymized use case.
          </p>
          <p className="text-sm leading-relaxed text-text-subtle">
            The first entries here are first-party examples. Outside products will appear only after
            explicit permission and review.
          </p>
        </aside>
      </section>

      <section className="rounded-2xl border border-accent-warm/20 bg-gradient-to-br from-accent-warm/10 to-accent-rose/10 p-8 text-center">
        <h2 className="mb-3 text-2xl font-semibold text-text-primary">
          Want your app in the showcase?
        </h2>
        <p className="mx-auto mb-6 max-w-[620px] text-sm leading-relaxed text-text-subtle">
          Share where BugDrop is installed, how it helps your feedback loop, and how you want to be
          credited.
        </p>
        <a
          href={SHOWCASE_SUBMISSION_ISSUE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-accent-warm px-6 py-3 font-medium text-bg-deep no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(255,158,100,0.24)] max-sm:w-full"
        >
          Share your BugDrop setup
          <GitPullRequest className="size-4" aria-hidden="true" />
        </a>
      </section>
    </main>
  );
}
