import { describe, expect, it } from "vitest";

import {
  homepageExperiences,
  initialHomepageDemoState,
  reduceHomepageDemo,
} from "@/components/landing/homepage-demo-model";

describe("homepage demo model", () => {
  it("keeps Classic first and exposes three differentiated composable choices", () => {
    expect(homepageExperiences.map(({ id, label, icon }) => ({ id, label, icon }))).toEqual([
      { id: "classic", label: "General Feedback", icon: "💬" },
      { id: "bug-report", label: "Bug Report", icon: "🐛" },
      { id: "quick-rating", label: "Quick Rating", icon: "⭐" },
      { id: "feature-request", label: "Feature Request", icon: "💡" },
    ]);
    expect(Object.isFrozen(homepageExperiences)).toBe(true);
    expect(homepageExperiences.every(Object.isFrozen)).toBe(true);
    expect(homepageExperiences.map(({ description, launchLabel }) => ({ description, launchLabel }))).toEqual([
      {
        description: "The familiar screenshot-first feedback widget.",
        launchLabel: "Open General Feedback",
      },
      {
        description: "Reproduce a bug and attach proof.",
        launchLabel: "Open Bug Report",
      },
      {
        description: "Share a 1–5 star rating in one step.",
        launchLabel: "Open Quick Rating",
      },
      {
        description: "Shape and prioritize a product idea.",
        launchLabel: "Open Feature Request",
      },
    ]);
  });

  it("starts with an idle, closed Classic selection", () => {
    expect(initialHomepageDemoState).toEqual({
      selectedId: "classic",
      activeId: null,
      runtimeState: "idle",
      announcement: "",
    });
  });

  it("keeps the last selected experience highlighted after it settles", () => {
    const selected = reduceHomepageDemo(initialHomepageDemoState, {
      type: "select",
      id: "feature-request",
    });
    const settled = reduceHomepageDemo(
      reduceHomepageDemo(selected, { type: "launch" }),
      { type: "settled" },
    );

    expect(settled).toMatchObject({
      selectedId: "feature-request",
      activeId: null,
      runtimeState: "idle",
    });
  });

  it("does not open a second experience while one is active, but preserves a newly selected next choice", () => {
    const active = reduceHomepageDemo(initialHomepageDemoState, { type: "launch" });
    const selectedWhileActive = reduceHomepageDemo(active, {
      type: "select",
      id: "quick-rating",
    });
    const duplicateLaunch = reduceHomepageDemo(selectedWhileActive, { type: "launch" });

    expect(selectedWhileActive).toMatchObject({
      activeId: "classic",
      selectedId: "quick-rating",
    });
    expect(duplicateLaunch).toBe(selectedWhileActive);
  });

  it("makes runtime failure retryable without losing the selected choice", () => {
    const selected = reduceHomepageDemo(initialHomepageDemoState, {
      type: "select",
      id: "bug-report",
    });
    const failed = reduceHomepageDemo(
      reduceHomepageDemo(selected, { type: "launch" }),
      { type: "runtime-error" },
    );

    expect(failed).toMatchObject({
      selectedId: "bug-report",
      activeId: null,
      runtimeState: "error",
    });
    expect(reduceHomepageDemo(failed, { type: "launch" })).toMatchObject({
      selectedId: "bug-report",
      activeId: "bug-report",
      runtimeState: "error",
    });
  });

  it("models runtime progress and clears active ownership on settle and unmount", () => {
    const loading = reduceHomepageDemo(
      reduceHomepageDemo(initialHomepageDemoState, { type: "launch" }),
      { type: "runtime-loading" },
    );
    const ready = reduceHomepageDemo(loading, { type: "runtime-ready" });

    expect(ready).toMatchObject({ activeId: "classic", runtimeState: "ready" });
    expect(reduceHomepageDemo(ready, { type: "settled" })).toMatchObject({
      activeId: null,
      runtimeState: "ready",
    });
    expect(reduceHomepageDemo(ready, { type: "unmount" })).toEqual(
      initialHomepageDemoState,
    );
  });
});
