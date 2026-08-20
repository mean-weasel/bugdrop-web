"use client";

import type { HomepageExperience } from "./homepage-demo-model";

interface HomepageDemoLauncherProps {
  readonly disabled: boolean;
  readonly inPageChooserVisible: boolean;
  onLaunch(initiator: HTMLButtonElement): void;
}

export function homepageExperienceLabel(experience: HomepageExperience): string {
  return experience.id === "classic"
    ? `${experience.label} · Classic`
    : experience.label;
}

export function HomepageDemoLauncher({
  disabled,
  inPageChooserVisible,
  onLaunch,
}: HomepageDemoLauncherProps) {
  const concealedForChooser = inPageChooserVisible;

  return (
    <button
      type="button"
      disabled={disabled}
      tabIndex={concealedForChooser ? -1 : undefined}
      data-in-page-chooser-visible={concealedForChooser}
      aria-label="Open BugDrop feedback"
      onClick={(event) => onLaunch(event.currentTarget)}
      className={`fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-50 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-accent-cyan/70 bg-bg-surface px-5 py-3 font-semibold text-text-primary shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition-[transform,opacity] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cyan disabled:cursor-wait motion-reduce:transform-none motion-reduce:transition-none ${
        concealedForChooser
          ? "pointer-events-none max-md:translate-y-[calc(100%+2rem)] max-md:opacity-0"
          : "disabled:opacity-70"
      }`}
    >
      <span aria-hidden="true">🐛</span>
      Feedback
    </button>
  );
}
