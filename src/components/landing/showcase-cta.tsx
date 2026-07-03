import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { SHOWCASE_PATH } from "@/lib/links";

export function ShowcaseCta() {
  return (
    <section className="mb-20 rounded-2xl border border-accent-warm/20 bg-bg-surface/70 p-6 animate-fade-up">
      <div className="flex items-center justify-between gap-5 max-md:flex-col max-md:items-start">
        <div className="flex items-start gap-4">
          <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-[10px] border border-accent-warm/30 bg-accent-warm/10 text-accent-warm">
            <Sparkles className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="mb-1 text-lg font-semibold text-text-primary">
              Using BugDrop in your app?
            </h2>
            <p className="max-w-[620px] text-sm leading-relaxed text-text-subtle">
              Share your setup and get listed in the showcase. We only publish opt-in
              submissions, and private/internal products can be anonymized.
            </p>
          </div>
        </div>
        <Link
          href={SHOWCASE_PATH}
          data-analytics-event="showcase_cta_click"
          data-analytics-label="Homepage showcase CTA"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-[10px] border border-accent-warm/35 bg-bg-deep/40 px-4 py-2.5 text-sm font-medium text-accent-warm no-underline transition-all hover:-translate-y-0.5 hover:border-accent-warm max-md:w-full"
        >
          View showcase
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
