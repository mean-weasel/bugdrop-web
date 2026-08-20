import { ArrowDown, ArrowUpRight } from "lucide-react";
import {
  GITHUB_ORG_URL,
  GITHUB_REPO_URL,
  MARKETPLACE_URL,
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
          GitHub Marketplace
        </span>
        <span className="rounded border border-border bg-bg-surface px-3 py-1.5">
          Self-hostable
        </span>
        <span className="rounded border border-border bg-bg-surface px-3 py-1.5">
          #6 Product of the Day
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
