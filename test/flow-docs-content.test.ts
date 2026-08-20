import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FlowCapabilityReference } from "../src/components/docs/flow-capability-reference";
import { FLOW_CAPABILITIES } from "../src/lib/flow-capabilities";
import { docsNav } from "../src/lib/docs-nav";
import { docHeadingId } from "../src/mdx-components";

const read = (path: string) => readFileSync(path, "utf8");

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("'", "&#x27;");

const widgetDocsManifest = JSON.parse(
  read("src/content/docs/.widget-docs-source.json"),
) as {
  schemaVersion: number;
  sourceRepository: string;
  sourceRevision: string;
  files: Array<{ source: string; target: string; sha256: string }>;
};

const customFlows = read("src/content/docs/custom-flows.mdx");
const flowDesign = read("src/content/docs/flow-design.mdx");
const flowExamples = read("src/content/docs/flow-examples.mdx");
const flowFieldsAndScreens = read(
  "src/content/docs/flow-fields-and-screens.mdx",
);
const flowFieldGuide = read("src/content/docs/flow-field-guide.mdx");
const flowScreenGuide = read("src/content/docs/flow-screen-guide.mdx");
const flowFieldsAndScreensReference = read(
  "src/content/docs/flow-fields-and-screens-reference.mdx",
);
const flowReference = read("src/content/docs/flow-reference.mdx");
const flowBranchingAndOutput = read(
  "src/content/docs/flow-branching-and-output.mdx",
);
const flowPresentationAndMotion = read(
  "src/content/docs/flow-presentation-and-motion.mdx",
);
const javascriptApi = read("src/content/docs/javascript-api.mdx");
const styling = read("src/content/docs/styling.mdx");
const referenceComponent = read(
  "src/components/docs/flow-capability-reference.tsx",
);

describe("public custom-flow documentation", () => {
  it("keeps widget-owned documentation byte-identical to its sync receipt", () => {
    expect(widgetDocsManifest).toMatchObject({
      schemaVersion: 1,
      sourceRepository: "mean-weasel/bugdrop",
    });
    expect(widgetDocsManifest.sourceRevision).not.toBe("");
    expect(widgetDocsManifest.files).toContainEqual(
      expect.objectContaining({
        source: "docs/website/flow-capabilities.ts",
        target: "src/lib/flow-capabilities.ts",
      }),
    );
    for (const entry of widgetDocsManifest.files) {
      expect(entry.target).toMatch(
        /^src\/(?:content\/docs\/[a-z0-9-]+\.mdx|lib\/flow-capabilities\.ts)$/,
      );
      const digest = createHash("sha256")
        .update(readFileSync(entry.target))
        .digest("hex");
      expect(digest, `${entry.target} drifted from ${entry.source}`).toBe(
        entry.sha256,
      );
    }
  });

  it("gives plain MDX headings stable fragment IDs", () => {
    expect(docHeadingId("Custom-flow lifecycle")).toBe("custom-flow-lifecycle");
    expect(docHeadingId(["Short text ", 2])).toBe("short-text-2");
  });

  it("keeps the default feedback path first and places the new IA after Configuration", () => {
    expect(docsNav[0]?.slug).toBe("");
    expect(docsNav[0]?.title).toBe("Getting Started");

    const slugs = docsNav.map(({ slug }) => slug);
    expect(slugs.indexOf("custom-flows")).toBe(
      slugs.indexOf("configuration") + 1,
    );
    expect(docsNav.find(({ slug }) => slug === "flow-design")?.parent).toBe(
      "custom-flows",
    );
    expect(docsNav.find(({ slug }) => slug === "flow-examples")?.parent).toBe(
      "custom-flows",
    );
    expect(
      docsNav.find(({ slug }) => slug === "flow-fields-and-screens")?.parent,
    ).toBe("flow-reference");
    expect(
      docsNav.find(({ slug }) => slug === "flow-field-guide")?.parent,
    ).toBe("flow-fields-and-screens");
    expect(
      docsNav.find(({ slug }) => slug === "flow-screen-guide")?.parent,
    ).toBe("flow-fields-and-screens");
    expect(docsNav.find(({ slug }) => slug === "flow-types")?.parent).toBe(
      "flow-reference",
    );
    expect(slugs.indexOf("styling")).toBeGreaterThan(
      slugs.indexOf("flow-reference"),
    );
  });

  it("presents custom flows as an addition to the primary default feedback flow", () => {
    expect(customFlows).toContain(
      "The default feedback flow is still the fastest way",
    );
    expect(flowReference).toContain(
      "default feedback flow remains the primary starting point",
    );

    for (const content of [
      customFlows,
      flowDesign,
      flowReference,
      javascriptApi,
      styling,
    ]) {
      expect(content).not.toMatch(/\b(?:legacy|deprecated)\b/i);
    }
  });

  it("uses the canonical manifest as the only exhaustive capability inventory", () => {
    expect(referenceComponent).toContain(
      'import { FLOW_CAPABILITIES } from "@/lib/flow-capabilities"',
    );
    expect(referenceComponent).toContain(
      "Object.entries(capability.fields.byType)",
    );
    expect(referenceComponent).toContain(
      "Object.entries(capability.screens.byType)",
    );
    expect(referenceComponent).toContain(
      "Object.entries(capability.publicContract)",
    );
    expect(referenceComponent).toContain(
      "Object.entries(capability.transitions.branches)",
    );
    expect(referenceComponent).toContain("capability.transitions.kinds");
    expect(flowReference).toContain("/docs/flow-fields-and-screens");
    expect(flowReference).toContain("/docs/flow-types");
    expect(flowReference).toContain("/docs/flow-branching-and-output");
    expect(flowReference).toContain("/docs/flow-presentation-and-motion");
  });

  it("renders every released discriminator and option from the canonical manifest", () => {
    const html = renderToStaticMarkup(FlowCapabilityReference());
    const inventory = FLOW_CAPABILITIES;

    expect(html).toContain(`data-version-key="${inventory.versionKey}"`);

    const values = [
      ...inventory.fields.types,
      ...inventory.fields.layoutSpans,
      ...inventory.fields.ratingScales,
      ...inventory.fields.ratingIcons,
      ...inventory.fields.singleChoiceDisplays,
      ...inventory.screens.types,
      ...inventory.screens.screenshotModes,
      ...Object.keys(inventory.conditions.branches),
      ...inventory.conditions.scalarTypes,
      ...inventory.presentation.kinds,
      ...inventory.presentation.sizes,
      ...inventory.presentation.columns,
      ...inventory.appearance.themes,
      ...inventory.appearance.densities,
      ...inventory.transitions.kinds,
      ...inventory.transitions.easings,
      ...inventory.issue.classifications,
      ...inventory.issue.sections.answer.formats,
      ...inventory.issue.sections.context.formats,
      ...Object.keys(inventory.lifecycle.outcomeBranches),
    ];

    for (const value of values) {
      expect(html, `missing canonical value ${String(value)}`).toContain(
        String(value),
      );
    }

    for (const [name, declaration] of Object.entries(
      inventory.publicContract,
    )) {
      expect(html, `missing public value type ${name}`).toContain(name);
      expect(html, `missing declaration for ${name}`).toContain(
        escapeHtml(declaration),
      );
    }
    for (const branch of Object.keys(inventory.transitions.branches)) {
      expect(html, `missing transition branch ${branch}`).toContain(branch);
    }
  });

  it("documents registration, opening inputs, instance lifecycle, and outcomes", () => {
    expect(javascriptApi).toContain("BugDrop.registerFlow(config)");
    expect(javascriptApi).toContain("triage.open({");
    expect(javascriptApi).toContain("context:");
    expect(javascriptApi).toContain("initialAnswers:");
    expect(javascriptApi).toContain("opened.instanceId");
    expect(javascriptApi).toContain("await opened.result");
    expect(javascriptApi).toContain("opened.close()");
    expect(javascriptApi).toContain("register each configuration once");
    expect(javascriptApi).toContain("an option's configured `value` string");
    expect(javascriptApi).toContain(
      "/docs/flow-branching-and-output#lifecycle",
    );

    for (const status of Object.keys(
      FLOW_CAPABILITIES.lifecycle.outcomeBranches,
    )) {
      expect(javascriptApi).toContain(`\`${status}\``);
    }
  });

  it("covers branching, issue output, evidence, motion, styling, and contract boundaries", () => {
    expect(flowDesign).toContain("answer: 'triage.kind'");
    expect(flowDesign).toContain("context: 'supportPlan'");
    expect(flowDesign).toContain("sendConsoleLogs:");
    expect(flowDesign).toContain("prefers reduced motion");
    expect(flowExamples).toContain("<FlowCapabilityExamples />");
    expect(styling).toContain("## Custom-flow appearance");
    expect(styling).toContain(
      "does not\nexpose arbitrary class names, style hooks, or CSS injection",
    );
    expect(styling).toContain(
      "inline mounting belongs to the separate Variant contract",
    );
    expect(flowBranchingAndOutput).toContain(
      "BugDrop removes the answers and screenshot evidence",
    );
    expect(flowBranchingAndOutput).toContain("Matching uses exact equality");
    expect(flowBranchingAndOutput).toContain(
      "The selected option's configured `value` string",
    );
    expect(flowPresentationAndMotion).toContain(
      "The first screen appears immediately",
    );
    expect(flowPresentationAndMotion).toContain("prefers reduced motion");
    expect(flowPresentationAndMotion).toContain(
      "| `slide-horizontal` | Slides between steps from side to side | 500 ms |",
    );
    expect(flowFieldGuide).toContain("`maxFileSize` is measured in bytes");
  });

  it("links split flow guidance to its current pages", () => {
    for (const staleLink of [
      "/docs/flow-reference#lifecycle",
      "/docs/flow-reference#presentation-and-appearance",
      "/docs/flow-reference#screen-transitions",
      "/docs/custom-flows#live-released-examples",
    ]) {
      expect(javascriptApi).not.toContain(staleLink);
      expect(styling).not.toContain(staleLink);
    }
    expect(styling).toContain(
      "/docs/flow-presentation-and-motion#presentation-and-appearance",
    );
    expect(styling).toContain(
      "/docs/flow-presentation-and-motion#screen-transitions",
    );
    expect(styling).toContain("/docs/flow-examples");
  });

  it("links every field and screen to focused plain-English guidance", () => {
    for (const anchor of [
      "short-text",
      "long-text",
      "rating",
      "single-choice",
      "checkbox",
      "attachments",
    ]) {
      expect(flowFieldsAndScreens).toContain(
        `/docs/flow-field-guide#${anchor}`,
      );
    }
    for (const anchor of [
      "message-screen",
      "form-screen",
      "screenshot-screen",
    ]) {
      expect(flowFieldsAndScreens).toContain(
        `/docs/flow-screen-guide#${anchor}`,
      );
    }
    for (const phrase of [
      "Collects a brief response",
      "Collects a response that may need multiple lines",
      "Collects a score",
      "Lets someone select exactly one option",
      "Collects one checked-or-unchecked answer",
      "Lets someone add supporting files",
    ]) {
      expect(flowFieldGuide).toContain(phrase);
    }
    for (const phrase of [
      "Presents a title",
      "Displays one of the reusable forms",
      "Guides someone through screenshot capture",
    ]) {
      expect(flowScreenGuide).toContain(phrase);
    }
    expect(flowFieldsAndScreens).toContain("fields** collect information");
    expect(flowFieldsAndScreens).toContain("screens** arrange the steps");
    expect(flowFieldsAndScreens).toContain(
      "/docs/flow-fields-and-screens-reference",
    );
    expect(flowFieldsAndScreensReference).toContain(
      '<FlowCapabilityReference section="fields-and-screens" />',
    );
  });

  it("labels Variant-only and unreleased values as exclusions, not Flow features", () => {
    const html = renderToStaticMarkup(FlowCapabilityReference());
    expect(html).toContain("Scope boundaries");
    expect(html).toContain("Variant-only");
    expect(html).toContain("Unreleased");

    for (const excluded of [
      ...FLOW_CAPABILITIES.exclusions.variantOnly,
      ...FLOW_CAPABILITIES.exclusions.unreleased,
    ]) {
      expect(html).toContain(excluded);
      expect(customFlows).not.toContain(excluded);
    }
  });
});
