import { ArrowDown, ArrowUpRight } from "lucide-react";
import {
  GITHUB_ORG_URL,
  GITHUB_REPO_URL,
  MARKETPLACE_URL,
  PRODUCT_HUNT_URL,
} from "@/lib/links";

export function Hero() {
  return (
    <header className="mx-auto max-w-[960px] text-center">
      <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-accent-cyan">
        Open-source website feedback
      </p>
      <h1 className="mb-6 text-[clamp(2.5rem,6vw,4.5rem)] font-light leading-[1.08] tracking-tight text-text-primary max-sm:text-[2.35rem]">
        Website feedback to GitHub Issues with{" "}
        <strong className="font-bold text-accent-warm">
          screenshots in 30 seconds
        </strong>
      </h1>
      <p className="text-xl text-text-subtle max-w-[600px] mx-auto mb-10 max-sm:mb-7 max-sm:text-lg">
        Capture screenshots, annotations, and browser context, then turn user
        feedback into GitHub Issues, all from one script tag.
      </p>
      <div className="mx-auto mb-8 flex max-w-[720px] flex-wrap justify-center gap-2 text-xs font-medium text-text-muted">
        <span className="rounded border border-border bg-bg-surface px-3 py-1.5">
          MIT licensed
        </span>
        <span className="rounded border border-border bg-bg-surface px-3 py-1.5">
          Self-hostable
        </span>
      </div>
      <div className="flex flex-wrap justify-center gap-4 max-sm:flex-col">
        <a
          href="#demo"
          data-analytics-event="landing_cta_click"
          data-analytics-label="See BugDrop in action"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-[10px] font-medium text-[0.95rem] bg-accent-cyan text-bg-deep hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(125,207,255,0.24)] transition-all duration-300 max-sm:w-full max-sm:justify-center"
        >
          <ArrowDown className="size-4" aria-hidden="true" />
          See BugDrop in action
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
      </div>
      <div className="mx-auto mt-8 grid max-w-[720px] grid-cols-3 divide-x divide-border overflow-hidden rounded-xl border border-border bg-bg-surface/70 max-sm:grid-cols-1 max-sm:divide-x-0 max-sm:divide-y">
        <a
          href={MARKETPLACE_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-analytics-event="outbound_marketplace_click"
          data-analytics-label="130+ app installs"
          className="flex flex-col items-center gap-1 px-5 py-4 transition-colors hover:bg-bg-elevated"
        >
          <strong className="text-2xl font-bold text-text-primary">130+</strong>
          <span className="text-sm text-text-muted">App installs</span>
        </a>
        <div className="flex flex-col items-center gap-1 px-5 py-4">
          <strong className="text-2xl font-bold text-text-primary">
            3,000+
          </strong>
          <span className="text-sm text-text-muted">
            Feedback issues created
          </span>
        </div>
        <a
          href={`${PRODUCT_HUNT_URL}?utm_source=homepage-proof&utm_medium=website&utm_campaign=bugdrop-2`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="BugDrop was the number 6 Product of the Day on Product Hunt"
          data-analytics-event="outbound_product_hunt_click"
          data-analytics-label="#6 Product of the Day"
          className="flex flex-col items-center gap-1 px-5 py-4 transition-colors hover:bg-bg-elevated"
        >
          <strong className="text-2xl font-bold text-text-primary">#6</strong>
          <span className="text-sm text-text-muted">Product of the Day</span>
        </a>
      </div>
      <p className="mt-6 text-sm text-text-muted">
        Open source by{" "}
        <a href={GITHUB_ORG_URL} target="_blank" rel="noopener noreferrer" className="text-accent-cyan underline-offset-4 hover:underline">
          mean-weasel
        </a>{" "}
        ·{" "}
        <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer" className="text-accent-cyan underline-offset-4 hover:underline">
          View the code on GitHub
        </a>
      </p>
    </header>
  );
}
