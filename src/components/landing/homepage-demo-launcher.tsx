"use client";

import { Menu } from "@base-ui/react/menu";
import type { HomepageExperience, HomepageExperienceId } from "./homepage-demo-model";

interface HomepageDemoLauncherProps {
  readonly experiences: readonly HomepageExperience[];
  readonly selectedId: HomepageExperienceId;
  readonly menuOpen: boolean;
  readonly disabled: boolean;
  onMenuOpenChange(open: boolean): void;
  onSelect(id: HomepageExperienceId): void;
  onLaunch(id: HomepageExperienceId): void;
}

function displayLabel(experience: HomepageExperience): string {
  return experience.id === "classic"
    ? `${experience.label} · Classic`
    : experience.label;
}

export function homepageExperienceLabel(experience: HomepageExperience): string {
  return displayLabel(experience);
}

export function HomepageDemoLauncher({
  experiences,
  selectedId,
  menuOpen,
  disabled,
  onMenuOpenChange,
  onSelect,
  onLaunch,
}: HomepageDemoLauncherProps) {
  return (
    <Menu.Root
      modal={false}
      open={menuOpen}
      onOpenChange={(open) => onMenuOpenChange(open)}
    >
      <Menu.Trigger
        type="button"
        disabled={disabled}
        aria-label="Try BugDrop experiences"
        className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-50 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-accent-cyan/70 bg-bg-surface px-5 py-3 font-semibold text-text-primary shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cyan disabled:cursor-wait disabled:opacity-70 motion-reduce:transform-none motion-reduce:transition-none"
      >
        <span aria-hidden="true">🐛</span>
        Try BugDrop experiences
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner side="top" align="end" sideOffset={12}>
          <Menu.Popup
            aria-labelledby="homepage-feedback-experience-menu-label"
            className="z-50 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-border bg-bg-surface p-2 shadow-[0_20px_56px_rgba(0,0,0,0.42)]"
          >
            <span id="homepage-feedback-experience-menu-label" className="sr-only">
              Feedback experience
            </span>
            <Menu.RadioGroup value={selectedId} onValueChange={onSelect}>
              {experiences.map((experience) => (
                <Menu.RadioItem
                  key={experience.id}
                  value={experience.id}
                  closeOnClick
                  onClick={() => onLaunch(experience.id)}
                  className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-3 text-left text-sm text-text-primary outline-none data-[highlighted]:bg-accent-cyan/15 data-[checked]:bg-accent-cyan/10 data-[disabled]:cursor-wait data-[disabled]:opacity-70"
                >
                  <span>{displayLabel(experience)}</span>
                  <span aria-hidden="true" className="text-accent-cyan">
                    {experience.id === selectedId ? "✓" : ""}
                  </span>
                </Menu.RadioItem>
              ))}
            </Menu.RadioGroup>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
