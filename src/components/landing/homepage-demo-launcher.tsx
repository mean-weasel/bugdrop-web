"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { HomepageExperience } from "./homepage-demo-model";

interface HomepageDemoLauncherProps {
  readonly disabled: boolean;
  onLaunch(initiator: HTMLButtonElement): void;
}

export function homepageExperienceLabel(experience: HomepageExperience): string {
  return experience.id === "classic"
    ? `${experience.label} · Classic`
    : experience.label;
}

export function HomepageDemoLauncher({
  disabled,
  onLaunch,
}: HomepageDemoLauncherProps) {
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  if (!mounted) return null;

  return createPortal(
    <button
      type="button"
      disabled={disabled}
      data-in-page-chooser-visible="false"
      aria-label="Open BugDrop feedback"
      onClick={(event) => onLaunch(event.currentTarget)}
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-50 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-accent-cyan/70 bg-bg-surface px-5 py-3 font-semibold text-text-primary shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition-[transform,opacity] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cyan disabled:cursor-wait disabled:opacity-70 motion-reduce:transform-none motion-reduce:transition-none"
    >
      <span aria-hidden="true">🐛</span>
      Give feedback
    </button>,
    document.body,
  );
}
