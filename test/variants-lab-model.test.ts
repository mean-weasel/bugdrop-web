import { describe, expect, it } from "vitest";
import {
  collapseTitle,
  compileIssueDraft,
  defaultLabels,
  formatIssueSection,
  initialInteractionState,
  normalizeAnswers,
  PRIMITIVE_COPY,
  PRIMITIVE_IDS,
  RECIPE_IDS,
  RECIPES,
  resetInteractionState,
  selectAnswer,
  submitInteraction,
} from "@/components/variants-lab/model";

describe("composable variants lab model", () => {
  it("presents exactly five plain-language blocks across exactly three recipes", () => {
    expect(PRIMITIVE_IDS).toEqual([
      "shortText",
      "longText",
      "rating",
      "singleChoice",
      "multiSelect",
    ]);
    expect(PRIMITIVE_IDS.map((id) => PRIMITIVE_COPY[id].label)).toEqual([
      "Short answer",
      "Long answer",
      "Rating",
      "Single choice",
      "Multiple choice",
    ]);
    expect(RECIPE_IDS).toHaveLength(3);
    const used = new Set(
      RECIPE_IDS.flatMap((id) => RECIPES[id].fields.map((field) => field.type)),
    );
    expect([...used].sort()).toEqual([...PRIMITIVE_IDS].sort());
  });

  it("normalizes multiSelect values to configured order", () => {
    const result = normalizeAnswers("bugReport", { summary: "Broken", details: "", areas: ["integrations", "dashboard"] });
    expect(result).toEqual({ ok: true, answers: { summary: "Broken", details: "", areas: ["dashboard", "integrations"] } });
  });

  it("allows optional empty arrays but rejects required empty, non-array, unknown, and duplicate selections", () => {
    expect(normalizeAnswers("bugReport", { summary: "Broken", areas: [] })).toMatchObject({ ok: false, field: "areas" });
    expect(normalizeAnswers("bugReport", { summary: "Broken", areas: "dashboard" })).toMatchObject({ ok: false, field: "areas" });
    expect(normalizeAnswers("bugReport", { summary: "Broken", areas: ["unknown"] })).toMatchObject({ ok: false, field: "areas" });
    expect(normalizeAnswers("bugReport", { summary: "Broken", areas: ["dashboard", "dashboard"] })).toMatchObject({ ok: false, field: "areas" });
    expect(normalizeAnswers("productReview", { rating: 4, context: "", signals: undefined })).toMatchObject({
      ok: true,
      answers: { signals: [] },
    });
  });

  it("uses stable multiSelect values in titles and configured labels in choice sections", () => {
    const result = compileIssueDraft("bugReport", { summary: "  Broken menu  ", details: "", areas: ["integrations", "dashboard"] });
    expect(result).toMatchObject({
      ok: true,
      draft: {
        title: "Bug: Broken menu · dashboard, integrations",
        labels: ["bug", "bugdrop"],
        sections: [
          { heading: "Summary", format: "text", value: "Broken menu" },
          { heading: "Affected areas", format: "text", value: "Dashboard, Integrations" },
        ],
      },
    });
  });

  it("keeps singleChoice title values, choice labels, and rating stars formatting", () => {
    const vote = compileIssueDraft("roadmapVote", { priority: "better-docs", team: "" });
    expect(vote).toMatchObject({ ok: true, draft: { title: "Roadmap vote: better-docs", labels: ["enhancement", "bugdrop"] } });
    if (!vote.ok) throw new Error("unexpected validation failure");
    expect(vote.draft.sections[0]).toMatchObject({ value: "Better documentation", format: "text" });
    expect(vote.draft.sections[1]).toMatchObject({ value: "Not provided.", format: "text" });
    const review = compileIssueDraft("productReview", { rating: 4, context: "", signals: [] });
    expect(review).toMatchObject({ ok: true, draft: { labels: ["bugdrop"], sections: [{ value: "★★★★☆ (4/5)", format: "text" }, { value: "Not provided.", format: "quote" }] } });
  });

  it("honors omission, fallback, trimmed headings, Worker formats, and title limits", () => {
    const bug = compileIssueDraft("bugReport", { summary: "Broken", details: "", areas: ["dashboard"] });
    if (!bug.ok) throw new Error("unexpected validation failure");
    expect(bug.draft.sections.map((section) => section.heading)).toEqual(["Summary", "Affected areas"]);
    expect(bug.draft.sections.map((section) => section.format)).toEqual(["text", "text"]);
    expect(collapseTitle(`  ${"long ".repeat(90)}\n title  `)).toHaveLength(256);
    expect(collapseTitle("  spaced\n\t title  ")).toBe("spaced title");
  });

  it("does not submit on selection; explicit submit fails, retry succeeds, and reset clears", () => {
    let state = initialInteractionState("bugReport");
    state = selectAnswer(state, "summary", "Broken menu");
    state = selectAnswer(state, "areas", ["dashboard"]);
    expect(state).toMatchObject({ status: "idle", attempted: false });
    const failure = submitInteraction("bugReport", state);
    expect(failure).toMatchObject({ status: "failure", attempted: true, answers: { summary: "Broken menu", areas: ["dashboard"] } });
    if (!("status" in failure)) throw new Error("unexpected validation failure");
    expect(submitInteraction("bugReport", failure)).toMatchObject({ status: "success", attempted: true });
    expect(resetInteractionState("bugReport")).toEqual(initialInteractionState("bugReport"));
  });

  it("matches core title parsing, final trimming, configured-order values, and backend labels", () => {
    expect(compileIssueDraft("bugReport", { summary: "Broken", details: "", areas: ["integrations", "dashboard"] })).toMatchObject({
      ok: true,
      draft: {
        title: "Bug: Broken · dashboard, integrations",
        labels: ["bug", "bugdrop"],
        sections: [
          { heading: "Summary", value: "Broken" },
          { heading: "Affected areas", value: "Dashboard, Integrations" },
        ],
      },
    });
    expect(collapseTitle(`${"x".repeat(255)}   trailing`)).toBe("x".repeat(255));
    expect(defaultLabels("feature")).toEqual(["enhancement", "bugdrop"]);
    expect(defaultLabels("feedback")).toEqual(["bugdrop"]);
  });

  it("matches backend section headings and quote/code Markdown while omitting server metadata", () => {
    expect(formatIssueSection("Fast *and* predictable.\r\nSecond line", "quote")).toBe("> Fast \\*and\\* predictable.\n> Second line");
    expect(formatIssueSection("const fence = ```;", "code")).toBe("````\nconst fence = ```;\n````");
    const review = compileIssueDraft("productReview", { rating: 4, context: "Fast *and* predictable.", signals: [] });
    if (!review.ok) throw new Error("unexpected validation failure");
    expect(review.draft.body).toContain("## Rating\n\n★★★★☆ (4/5)");
    expect(review.draft.body).toContain("## Context\n\n> Fast \\*and\\* predictable.");
    expect(review.draft.body).not.toContain("System Info");
    expect(review.draft.body).not.toContain("bugdrop-submission");
  });
});
