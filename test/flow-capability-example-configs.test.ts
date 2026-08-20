import { describe, expect, it } from "vitest";
import {
  buildFlowExampleConfig,
  FLOW_EXAMPLE_RECIPES,
  FLOW_STYLE_PRESETS,
  FLOW_TRANSITION_KINDS,
  transitionConfig,
} from "../src/components/docs/flow-capability-example-configs";
import { FLOW_CAPABILITIES } from "../src/lib/flow-capabilities";
// Vitest is currently scoped to `*.test.ts`; import the board-mandated TSX suite so
// the exact verification command executes its server-rendered component checks.
import "./flow-capability-examples.test";

function collectDiscriminators(value: unknown, property: string): string[] {
  if (Array.isArray(value)) return value.flatMap((item) => collectDiscriminators(item, property));
  if (!value || typeof value !== "object") return [];
  const record = value as Record<string, unknown>;
  return [
    ...(typeof record[property] === "string" ? [record[property]] : []),
    ...Object.values(record).flatMap((item) => collectDiscriminators(item, property)),
  ];
}

function collectPropertyValues(value: unknown, property: string): unknown[] {
  if (Array.isArray(value)) return value.flatMap((item) => collectPropertyValues(item, property));
  if (!value || typeof value !== "object") return [];
  const record = value as Record<string, unknown>;
  return [
    ...(property in record ? [record[property]] : []),
    ...Object.values(record).flatMap((item) => collectPropertyValues(item, property)),
  ];
}

describe("curated Flow capability example configs", () => {
  it("covers every released field and screen through coherent recipes", () => {
    const configs = FLOW_EXAMPLE_RECIPES.map(({ config }) => config);
    const fieldTypes = new Set(collectDiscriminators(configs, "type"));
    const screenTypes = new Set(
      configs.flatMap((config) =>
        ((config.screens ?? []) as readonly Record<string, unknown>[]).map(({ type }) => type),
      ),
    );

    expect([...FLOW_CAPABILITIES.fields.types].every((type) => fieldTypes.has(type))).toBe(true);
    expect(screenTypes).toEqual(new Set(FLOW_CAPABILITIES.screens.types));
    expect(JSON.stringify(configs)).toContain('"all"');
    expect(JSON.stringify(configs)).toContain('"any"');
    expect(JSON.stringify(configs)).toContain('"answer"');
    expect(JSON.stringify(configs)).toContain('"context"');
  });

  it("derives the complete selector from the canonical transition manifest", () => {
    expect(FLOW_TRANSITION_KINDS).toBe(FLOW_CAPABILITIES.transitions.kinds);
    expect(FLOW_TRANSITION_KINDS).toEqual([
      "none",
      "slide-horizontal",
      "slide-vertical",
      "fade",
      "scale-fade",
      "custom",
    ]);

    for (const kind of FLOW_TRANSITION_KINDS) {
      expect(transitionConfig(kind).kind).toBe(kind);
      const config = buildFlowExampleConfig("incident-triage", kind, "product-dark");
      expect(config.presentation).toMatchObject({
        kind: "modal",
        screenTransition: { kind },
      });
    }
  });

  it("uses only released appearance and presentation values for app-matching presets", () => {
    for (const preset of FLOW_STYLE_PRESETS) {
      expect(FLOW_CAPABILITIES.appearance.themes).toContain(preset.appearance.theme);
      expect(FLOW_CAPABILITIES.appearance.densities).toContain(preset.appearance.density);
      expect(FLOW_CAPABILITIES.presentation.sizes).toContain(preset.presentation.size);
      expect(FLOW_CAPABILITIES.presentation.columns).toContain(preset.presentation.columns);
    }

    const serialized = JSON.stringify(FLOW_EXAMPLE_RECIPES);
    for (const excluded of [
      ...FLOW_CAPABILITIES.exclusions.variantOnly,
      ...FLOW_CAPABILITIES.exclusions.unreleased,
    ]) {
      expect(serialized).not.toContain(excluded);
    }
  });

  it("keeps all example IDs unique and maps evidence only to released field types", () => {
    expect(new Set(FLOW_EXAMPLE_RECIPES.map(({ id }) => id)).size).toBe(FLOW_EXAMPLE_RECIPES.length);
    expect(JSON.stringify(FLOW_EXAMPLE_RECIPES)).toContain('"attachments":"evidence.files"');
    expect(JSON.stringify(FLOW_EXAMPLE_RECIPES)).toContain('"sendConsoleLogs":"evidence.send-logs"');
  });

  it("uses only runtime-valid identifiers for every example context key", () => {
    const contextKeys = collectPropertyValues(FLOW_EXAMPLE_RECIPES, "context").filter(
      (value): value is string => typeof value === "string",
    );

    expect(contextKeys).toContain("ask-followup");
    expect(contextKeys).not.toContain("askFollowup");
    for (const key of contextKeys) {
      expect(key).toMatch(/^[a-z][a-z0-9_-]{0,63}$/);
    }
  });

  it("places release risk input on a context-conditional form screen", () => {
    const recipe = FLOW_EXAMPLE_RECIPES.find(({ id }) => id === "release-readiness")!;
    const forms = recipe.config.forms as readonly Record<string, unknown>[];
    const screens = recipe.config.screens as readonly Record<string, unknown>[];
    const releaseForm = forms.find(({ id }) => id === "release")!;
    const riskForm = forms.find(({ id }) => id === "risk")!;
    const riskScreen = screens.find(({ id }) => id === "risk-screen")!;

    expect(JSON.stringify(releaseForm)).not.toContain('"id":"note"');
    expect(JSON.stringify(riskForm)).toContain('"id":"note"');
    expect(riskScreen).toMatchObject({
      type: "form",
      form: "risk",
      when: { context: "risk", equals: "high" },
    });
    expect(JSON.stringify(recipe.config.issue)).toContain('"answer":"risk.note"');
  });
});
