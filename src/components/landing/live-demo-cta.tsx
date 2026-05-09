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
            Open the feedback button and send a demo report to see the experience your users would get.
          </p>
        </div>
        <div className="flex shrink-0 gap-3 max-sm:w-full max-sm:flex-col">
          <OpenWidgetButton />
        </div>
      </div>
    </section>
  );
}
