import { PlayCircle } from "lucide-react";
import { DEMO_PATH } from "@/lib/links";

export function TryCallout() {
  return (
    <div className="bg-gradient-to-br from-accent-warm/10 to-accent-rose/10 border border-accent-warm/20 rounded-2xl p-8 text-center mb-20">
      <h3 className="text-xl font-semibold text-text-primary mb-2">
        Try BugDrop before installing
      </h3>
      <p className="mx-auto mb-6 max-w-[520px] text-text-subtle">
        Open the hosted demo to test the form, screenshot capture, annotation flow,
        and GitHub issue creation.
      </p>
      <a
        href={DEMO_PATH}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-accent-cyan px-6 py-3 font-medium text-bg-deep transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(125,207,255,0.24)] max-sm:w-full"
      >
        <PlayCircle className="size-4" aria-hidden="true" />
        Open live demo
      </a>
    </div>
  );
}
