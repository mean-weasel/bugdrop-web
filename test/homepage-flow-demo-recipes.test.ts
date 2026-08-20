import { describe, expect, it } from "vitest";

import { homepageFlowRecipes } from "@/components/landing/homepage-flow-recipes.generated";
import {
  homepageFlowDemoRecipeList,
  homepageFlowDemoRecipes,
} from "@/components/landing/homepage-flow-demo-recipes";

type Item = Record<string, unknown>;

function forms(id: keyof typeof homepageFlowDemoRecipes): Item[] {
  return homepageFlowDemoRecipes[id].config.forms as Item[];
}

function screens(id: keyof typeof homepageFlowDemoRecipes): Item[] {
  return homepageFlowDemoRecipes[id].config.screens as Item[];
}

describe("homepage flow demo recipes", () => {
  it("offers three distinct composable experiences and freezes their complete configs", () => {
    expect(homepageFlowDemoRecipeList.map(({ id, label }) => ({ id, label }))).toEqual([
      { id: "bug-report", label: "Bug Report" },
      { id: "quick-rating", label: "Quick Rating" },
      { id: "feature-request", label: "Feature Request" },
    ]);

    for (const recipe of homepageFlowDemoRecipeList) {
      expect(Object.isFrozen(recipe)).toBe(true);
      expect(Object.isFrozen(recipe.config)).toBe(true);
      expect(Object.isFrozen(recipe.config.forms)).toBe(true);
      expect(Object.isFrozen(recipe.config.screens)).toBe(true);
    }
  });

  it("uses the same 500 ms horizontal transition for every homepage Flow", () => {
    expect(
      homepageFlowDemoRecipeList.map(({ config }) =>
        (config.presentation as Item).screenTransition,
      ),
    ).toEqual(
      Array.from({ length: 3 }, () => ({
        kind: "slide-horizontal",
        durationMs: 500,
      })),
    );
  });

  it("keeps the generated canonical recipes immutable while preserving the rich bug contract", () => {
    const canonical = homepageFlowRecipes["bug-report"];
    const demo = homepageFlowDemoRecipes["bug-report"];
    const contract = (config: Item) => ({
      forms: (config.forms as Item[]).map(({ id, fields }) => ({
        id,
        fields: (fields as Item[]).map((field) => field.id),
      })),
      screens: (config.screens as Item[]).map(({ id, type, form, when }) => ({
        id,
        type,
        form,
        when,
      })),
      issue: config.issue,
      evidence: config.evidence,
    });

    expect(contract(demo.config as Item)).toEqual(contract(canonical.config as Item));
    expect((canonical.config.presentation as Item).screenTransition).toBeUndefined();
    expect(demo.config).not.toBe(canonical.config);
  });

  it("uses layout-only Bug Report overrides for full-width evidence and paired contact fields", () => {
    const evidenceFields = forms("bug-report")[1].fields as Item[];
    expect(evidenceFields.map(({ id, type, layout }) => ({ id, type, layout }))).toEqual([
      { id: "files", type: "attachments", layout: { span: 2 } },
      { id: "logs", type: "checkbox", layout: { span: 2 } },
      { id: "name", type: "shortText", layout: undefined },
      { id: "email", type: "shortText", layout: undefined },
    ]);
    expect(evidenceFields[0]).toMatchObject({
      required: true,
      maxFiles: 2,
      accept: ["image/png", "application/pdf"],
    });
  });

  it("makes Quick Rating a single required 1–5 star action", () => {
    expect(forms("quick-rating")).toEqual([
      expect.objectContaining({
        id: "rating",
        fields: [
          expect.objectContaining({
            id: "score",
            type: "rating",
            required: true,
            scale: 5,
            icon: "star",
          }),
        ],
      }),
    ]);
    expect(screens("quick-rating")).toEqual([
      expect.objectContaining({
        id: "rating-screen",
        form: "rating",
        continueLabel: "Send rating",
      }),
    ]);
  });

  it("paces Feature Request across compact forms with labeled impact cards", () => {
    const featureForms = forms("feature-request");
    expect(featureForms.map(({ id }) => id)).toEqual(["idea", "detail", "priority"]);
    const ideaFields = featureForms[0].fields as Item[];
    expect(ideaFields.map(({ id, type }) => ({ id, type }))).toEqual([
      { id: "category", type: "singleChoice" },
      { id: "title", type: "shortText" },
    ]);
    expect(ideaFields[0]).toMatchObject({ required: true, display: "cards" });
    expect(ideaFields[1]).toMatchObject({ required: true, maxLength: 120 });
    expect(featureForms[1].fields).toEqual([
      expect.objectContaining({ id: "detail", type: "longText" }),
    ]);
    expect((featureForms[2].fields as Item[])[0]).toMatchObject({
      id: "impact",
      type: "singleChoice",
      required: true,
      display: "cards",
      options: [
        expect.objectContaining({ value: "nice-to-have", label: "Nice to have" }),
        expect.objectContaining({ value: "important", label: "Important" }),
        expect.objectContaining({ value: "transformative", label: "Transformative" }),
      ],
    });
    expect(screens("feature-request").map(({ id, form }) => ({ id, form }))).toEqual([
      { id: "intro", form: undefined },
      { id: "idea-screen", form: "idea" },
      { id: "detail-screen", form: "detail" },
      { id: "priority-screen", form: "priority" },
    ]);
    expect((homepageFlowDemoRecipes["feature-request"].config.issue as Item)).toMatchObject({
      classification: "feature",
      title: "Feature: {{idea.title}}",
    });
  });

});
