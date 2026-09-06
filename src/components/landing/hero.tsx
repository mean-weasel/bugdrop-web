import { ArrowUpRight, Play, MessageSquare } from "lucide-react";
import { GITHUB_REPO_URL, MARKETPLACE_URL, PRODUCT_HUNT_URL, isLocalHomepageDogfoodRuntime } from "@/lib/links";
import { getFeedbackIssuesDisplay } from "@/lib/feedback-count";
import { ProductPreview } from "./product-preview";

export async function Hero() {
  const feedbackIssuesDisplay = await getFeedbackIssuesDisplay();

  return (
    <header className="hero-layout">
      <div className="hero-copy">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-accent-cyan max-sm:mb-3">Open-source website feedback</p>
        <h1 className="hero-title">Website feedback to GitHub Issues—<strong>with screenshots.</strong></h1>
        <p className="hero-description"><strong className="font-semibold text-text-primary">No new dashboard.</strong> Get bug reports, annotated screenshots, and browser details right in GitHub—where your team already works.</p>
        <div className="hero-actions">
          <a href="#flows" aria-describedby="hero-demo-note" data-homepage-hero-activate data-analytics-event="landing_cta_click" data-analytics-label="Try the widget" className="hero-primary">
            <MessageSquare size={17} aria-hidden="true" /> Try the widget
          </a>
          <a href={MARKETPLACE_URL} target="_blank" rel="noopener noreferrer" data-analytics-event="outbound_marketplace_click" data-analytics-label="Install from GitHub Marketplace" className="hero-install">
            Install on GitHub <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
        <p id="hero-demo-note" className="mt-3 text-xs text-text-subtle">{isLocalHomepageDogfoodRuntime() ? "Demo reports stay in this local preview." : "Demo reports create public issues in our test repository."}</p>
        <p className="mt-2 text-xs text-text-subtle">One script tag · MIT licensed · Self-hostable</p>
        <a href="#demo" className="mt-5 inline-flex items-center gap-2 text-sm text-accent-cyan underline-offset-4 hover:underline max-sm:mt-3"><Play size={13} aria-hidden="true" /> Watch the walkthrough</a>
      </div>
      <ProductPreview />
      <div className="hero-proof">
        <a href={MARKETPLACE_URL} target="_blank" rel="noopener noreferrer" data-analytics-event="outbound_marketplace_click" data-analytics-label="133+ GitHub App installs"><strong>133+</strong><span>GitHub App installs</span></a>
        <div><strong>{feedbackIssuesDisplay}</strong><span>Feedback issues created</span></div>
        <a href={`${PRODUCT_HUNT_URL}?utm_source=homepage-proof&utm_medium=website&utm_campaign=bugdrop-2`} data-analytics-event="outbound_product_hunt_click" data-analytics-label="#6 Product of the Day" target="_blank" rel="noopener noreferrer" aria-label="BugDrop was the number 6 Product of the Day on Product Hunt"><strong>#6</strong><span>Product of the Day</span></a>
        <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer" className="hero-source">Explore the source <ArrowUpRight size={14} aria-hidden="true" /></a>
      </div>
    </header>
  );
}
