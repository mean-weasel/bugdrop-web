import { ArrowUpRight, Code2, MessageSquare } from "lucide-react";
import {
  GITHUB_ORG_URL,
  GITHUB_REPO_URL,
  MARKETPLACE_URL,
  PRODUCT_HUNT_URL,
} from "@/lib/links";

export function Hero() {
  const flowShowcaseEnabled =
    process.env.NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO_ENABLED === "true";
  const demoCtaLabel = flowShowcaseEnabled
    ? "Design your flow"
    : "Try it on this page";

  return (
    <header className="text-center py-16 pb-24 max-sm:-mt-6 max-sm:pt-0 max-sm:pb-16">
      <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-light tracking-tight leading-[1.15] mb-6 text-text-primary max-sm:text-[2.35rem]">
        BugDrop: website feedback to GitHub Issues with
        <br />
        <strong className="font-bold text-accent-warm">
          screenshots in 30 seconds
        </strong>
      </h1>
      <p className="text-xl text-text-subtle max-w-[600px] mx-auto mb-10 max-sm:mb-7 max-sm:text-lg">
        Capture screenshots, annotations, and browser context, then turn user
        feedback into GitHub Issues, all from one script tag.
      </p>
      <div className="mx-auto mb-7 flex max-w-[720px] flex-wrap justify-center gap-2 text-xs font-medium text-text-muted">
        <span className="rounded border border-border bg-bg-surface px-3 py-1.5">
          MIT licensed
        </span>
        <span className="rounded border border-border bg-bg-surface px-3 py-1.5">
          GitHub Marketplace
        </span>
        <span className="rounded border border-border bg-bg-surface px-3 py-1.5">
          Self-hostable
        </span>
        <span className="rounded border border-border bg-bg-surface px-3 py-1.5">
          Screenshot privacy controls
        </span>
      </div>
      <div className="mb-7 flex flex-col items-center gap-3 max-sm:mb-5">
        <p className="text-sm text-accent-cyan">
          Now available on GitHub Marketplace. Open source by{" "}
          <a
            href={GITHUB_ORG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-cyan underline decoration-accent-cyan/40 underline-offset-4 hover:text-text-primary"
          >
            mean-weasel
          </a>
          .
        </p>
        <a
          href={`${PRODUCT_HUNT_URL}?utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-bugdrop-2`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="BugDrop was featured on Product Hunt"
          data-analytics-event="outbound_product_hunt_click"
          data-analytics-label="Product Hunt badge"
          className="inline-flex transition-transform duration-300 hover:-translate-y-0.5"
        >
          <span className="flex h-[54px] w-[250px] items-center justify-center gap-3 rounded-md border border-border bg-white px-4 text-left text-[#111827] shadow-sm">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#ff6154] text-lg font-bold text-white" aria-hidden="true">P</span>
            <span className="leading-tight">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.12em]">Featured on</span>
              <span className="block text-base font-bold">Product Hunt</span>
            </span>
          </span>
        </a>
        <p className="text-sm font-medium text-text-muted">
          #6 Product of the Day · May 9, 2026
        </p>
      </div>
      <div className="flex gap-4 justify-center flex-wrap max-sm:flex-col">
        <a
          href="#try-bugdrop"
          data-analytics-event="landing_cta_click"
          data-analytics-label={demoCtaLabel}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-[10px] font-medium text-[0.95rem] bg-accent-cyan text-bg-deep hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(125,207,255,0.24)] transition-all duration-300 max-sm:w-full max-sm:justify-center"
        >
          <MessageSquare className="size-4" aria-hidden="true" />
          {demoCtaLabel}
        </a>
        <a
          href={MARKETPLACE_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-analytics-event="outbound_marketplace_click"
          data-analytics-label="Install from GitHub Marketplace"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-[10px] font-medium text-[0.95rem] bg-gradient-to-br from-accent-warm to-accent-rose text-bg-deep hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(255,158,100,0.3)] transition-all duration-300 max-sm:w-full max-sm:justify-center"
        >
          <ArrowUpRight className="size-4" aria-hidden="true" />
          Install from GitHub Marketplace
        </a>
        <a
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-analytics-event="outbound_github_click"
          data-analytics-label="View on GitHub"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-[10px] font-medium text-[0.95rem] bg-bg-surface text-text-primary border border-border hover:bg-bg-elevated hover:-translate-y-0.5 transition-all duration-300 max-sm:w-full max-sm:justify-center"
        >
          <Code2 className="size-4" aria-hidden="true" />
          View on GitHub
        </a>
      </div>
    </header>
  );
}
