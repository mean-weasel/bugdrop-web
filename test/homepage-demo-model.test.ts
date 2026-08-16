import { describe, expect, it } from "vitest";

import {
  homepageExperiences,
  initialHomepageDemoState,
  reduceHomepageDemo,
} from "@/components/landing/homepage-demo-model";

describe("homepage demo model", () => {
  it("keeps Classic first and derives the three composable choices from canonical recipes", () => {
    expect(homepageExperiences.map(({ id, label }) => ({ id, label }))).toEqual([
      { id: "classic", label: "General Feedback" },
      { id: "bug-report", label: "Bug Report" },
      { id: "product-triage", label: "Product Triage" },
      { id: "customer-pulse", label: "Customer Pulse" },
    ]);
    expect(Object.isFrozen(homepageExperiences)).toBe(true);
    expect(homepageExperiences.every(Object.isFrozen)).toBe(true);
    expect(homepageExperiences.map(({ description, launchLabel }) => ({ description, launchLabel }))).toEqual([
      {
        description: "The familiar screenshot-first feedback widget.",
        launchLabel: "Open General Feedback",
      },
      {
        description: "Capture a reproducible problem with evidence.",
        launchLabel: "Open Bug Report",
      },
      {
        description: "Route product signals with conditional follow-up.",
        launchLabel: "Open Product Triage",
      },
      {
        description: "Ask a focused customer satisfaction question.",
        launchLabel: "Open Customer Pulse",
      },
    ]);
  });

  it("starts with an idle, closed Classic selection", () => {
    expect(initialHomepageDemoState).toEqual({
      selectedId: "classic",
      activeId: null,
      menuOpen: false,
      runtimeState: "idle",
      announcement: "",
    });
  });

  it("keeps the last selected experience highlighted after it settles and the menu reopens", () => {
    const selected = reduceHomepageDemo(initialHomepageDemoState, {
      type: "select",
      id: "product-triage",
    });
    const reopened = reduceHomepageDemo(
      reduceHomepageDemo(reduceHomepageDemo(selected, { type: "launch" }), {
        type: "settled",
      }),
      { type: "open-menu" },
    );

    expect(reopened).toMatchObject({
      selectedId: "product-triage",
      menuOpen: true,
      activeId: null,
      runtimeState: "idle",
    });
  });

  it("does not open a second experience while one is active, but preserves a newly selected next choice", () => {
    const active = reduceHomepageDemo(initialHomepageDemoState, { type: "launch" });
    const selectedWhileActive = reduceHomepageDemo(active, {
      type: "select",
      id: "customer-pulse",
    });
    const duplicateLaunch = reduceHomepageDemo(selectedWhileActive, { type: "launch" });

    expect(selectedWhileActive).toMatchObject({
      activeId: "classic",
      selectedId: "customer-pulse",
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
      menuOpen: false,
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
