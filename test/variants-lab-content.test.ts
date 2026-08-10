import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const component = readFileSync(
  "src/components/variants-lab/variants-lab.tsx",
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
});
