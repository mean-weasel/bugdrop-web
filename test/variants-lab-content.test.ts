import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const component = readFileSync(
  "src/components/variants-lab/variants-lab.tsx",
  "utf8",
);
const styles = readFileSync(
  "src/components/variants-lab/variants-lab.module.css",
  "utf8",
);

describe("simplified variants lab content", () => {
  it("uses the approved compact hero and missing-block CTA", () => {
    expect(component).toContain("Composable feedback");
    expect(component).toContain("Build feedback your way.");
    expect(component).toContain(
      "Choose from five building blocks and try a few useful combinations.",
    );
    expect(component).toContain("Missing a building block?");
    expect(component).toContain("Request one on GitHub");
    expect(component).toContain(
      'href="https://github.com/mean-weasel/bugdrop/issues/new"',
    );
  });

  it("removes customization and generated-configuration UI", () => {
    expect(component).not.toContain("Appearance and editable copy");
    expect(component).not.toContain("Generated public configuration");
    expect(component).not.toContain("<details");
    expect(component).not.toContain("<select");
    expect(component).not.toContain('type="color"');
  });

  it("retains one shared preview and the local-only disclosure", () => {
    expect(component.match(/Local GitHub Issue preview/g)).toHaveLength(1);
    expect(component).toContain("LAB_DISCLOSURE");
    expect(component).toContain("PRIMITIVE_COPY");
    expect(component).toContain("RECIPE_IDS.map");
  });

  it("derives the fourth picker and cumulative rating state", () => {
    expect(component).toContain("RECIPE_IDS.map");
    expect(component).toContain("PRIMITIVE_COPY[field.type].label");
    expect(component).toContain("const selectedRating");
    expect(component).toContain("data-filled={value <= selectedRating}");
    expect(styles).toContain('.rating label[data-filled="true"] span');
    expect(styles).not.toContain(
      ".rating input:checked + span { color: var(--lab-accent); }",
    );
  });

  it("previews the hovered rating range without changing selection state", () => {
    expect(styles).toContain(".rating:has(label:hover) label span");
    expect(styles).toContain(
      "color-mix(in srgb, var(--lab-accent) 45%, var(--muted))",
    );
    expect(styles).toContain(
      ".rating:has(label:hover) label:hover ~ label span",
    );
  });

  it("carries model constraints and accessible labels into native controls", () => {
    expect(component).toContain("maxLength: field.maxLength");
    expect(component).toContain('aria-labelledby={`${recipeId}-dialog-title`}');
    expect(component).toContain('id={`${recipeId}-dialog-title`}');
    expect(component).toContain("field.lowLabel");
    expect(component).toContain("field.highLabel");
    expect(component).toContain("ratingScaleId");
    expect(component).toContain('aria-label={`${value} of ${field.scale}`}');
  });

  it("removes obsolete customization styles", () => {
    for (const obsolete of [
      ".secondary",
      ".controls",
      ".configPreview",
      ".themeLight",
      ".themeDark",
      ".themeAuto",
      ".comfortable",
      ".compact",
    ]) {
      expect(styles).not.toContain(obsolete);
    }
    expect(styles).toContain(".requestBlock");
    expect(styles).toContain(".primitiveList");
  });
});
