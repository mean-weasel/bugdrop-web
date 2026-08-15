import Link from "next/link";
import architecture from "@/lib/acquisition-architecture.json";
import { SectionHeading } from "./section-heading";

const home = architecture.pages.find((page) => page.path === "/")!;

export function KeywordPositioning() {
  return (
    <section className="mb-20" data-acquisition-related-for="/">
      <SectionHeading>Choose Your Feedback Workflow</SectionHeading>
      <p className="mx-auto mb-7 max-w-[720px] text-center text-text-subtle">
        Start with the reporting job your team needs, then follow the focused
        use case or comparison instead of sorting through a generic feature list.
      </p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
        {home.related.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            data-acquisition-related-link={item.path}
            data-analytics-event="acquisition_path_click"
            data-analytics-label={item.anchor}
            className="rounded-2xl border border-border bg-bg-surface p-5 no-underline transition-all duration-300 hover:-translate-y-1 hover:border-accent-warm"
          >
            <h3 className="mb-2 text-sm font-semibold text-text-primary">
              {item.anchor}
            </h3>
            <p className="text-sm leading-relaxed text-text-subtle">
              {item.rationale}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
