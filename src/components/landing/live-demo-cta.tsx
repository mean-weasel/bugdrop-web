import Link from "next/link";
import { ArrowUpRight, PlayCircle } from "lucide-react";
import { DEMO_PATH } from "@/lib/links";
import { OpenWidgetButton } from "./open-widget-button";

export function LiveDemoCta() {
  return (
    <section id="try-bugdrop" className="mb-20 rounded-2xl border border-accent-cyan/25 bg-accent-cyan/10 px-8 py-7">
      <div className="flex items-center justify-between gap-6 max-md:flex-col max-md:items-start">
        <div>
          <p className="mb-2 text-sm font-medium text-accent-cyan">Try it on this page</p>
          <h2 className="text-2xl font-semibold text-text-primary">
            This landing page is running BugDrop.
          </h2>
          <p className="mt-2 max-w-[620px] text-text-subtle">
            Open the feedback button in the corner and send a demo report to see the experience your users would get.
            Want a fuller product flow? Open the Sample App Demo.
          </p>
        </div>
        <div className="flex shrink-0 gap-3 max-sm:w-full max-sm:flex-col">
          <OpenWidgetButton />
          <a
            href={DEMO_PATH}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-accent-cyan px-5 py-3 font-medium text-bg-deep transition-all hover:-translate-y-0.5 max-sm:w-full"
          >
            <PlayCircle className="size-4" aria-hidden="true" />
            Sample App Demo
          </a>
          <Link
            href="/docs/demo"
            className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-border bg-bg-surface px-5 py-3 font-medium text-text-primary transition-all hover:-translate-y-0.5 hover:bg-bg-elevated max-sm:w-full"
          >
            Details
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
