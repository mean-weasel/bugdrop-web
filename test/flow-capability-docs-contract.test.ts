import { readFileSync } from "node:fs";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { FlowCapabilityExamples } from "../src/components/docs/flow-capability-examples";
import { FlowCapabilityReference } from "../src/components/docs/flow-capability-reference";
import { FLOW_TRANSITION_KINDS } from "../src/components/docs/flow-capability-example-configs";
import { FLOW_CAPABILITIES } from "../src/lib/flow-capabilities";

const read = (file: string) => readFileSync(file, "utf8");

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("'", "&#x27;");
}

function tableMarkup(html: string, caption: string) {
  const match = html.match(
    new RegExp(
      `<table[^>]*>\\s*<caption[^>]*>${escapeRegExp(caption)}</caption>([\\s\\S]*?)</table>`,
    ),
  );
  expect(match, `missing rendered table ${caption}`).not.toBeNull();
  return match?.[1] ?? "";
}

function rowLabels(table: string) {
  return [...table.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)]
    .map((match) => match[1].replace(/<[^>]+>/g, "").trim())
    .filter((label) => label !== "Capability" && label !== "Released contract");
}

function expectTokens(table: string, values: readonly (string | number)[]) {
  for (const value of values) {
    expect(table, `missing rendered manifest value ${String(value)}`).toContain(
      `>${String(value)}</code>`,
    );
  }
}

describe("manifest-driven Flow documentation contract", () => {
  const referenceHtml = renderToStaticMarkup(
    createElement(FlowCapabilityReference),
  );
  const examplesHtml = renderToStaticMarkup(
    createElement(FlowCapabilityExamples),
  );

  it("renders exact canonical field, screen, transition, lifecycle, and exclusion rows", () => {
    expect(referenceHtml).toContain(
      `data-version-key="${FLOW_CAPABILITIES.versionKey}"`,
    );

    const fieldTable = tableMarkup(referenceHtml, "Released fields");
    expect(rowLabels(fieldTable)).toEqual(
      FLOW_CAPABILITIES.fields.types.map((type) => `field.type=${type}`),
    );

    const fieldLimits = tableMarkup(
      referenceHtml,
      "Released field limits and defaults",
    );
    expect(rowLabels(fieldLimits)).toEqual([
      "minLength",
      "maxLength",
      "longText.rows",
      "singleChoice.options",
      "attachments.maxFiles",
      "attachments.maxFileSize",
      "attachments.accept entries",
      "attachments.accept values",
    ]);
    expectTokens(
      fieldLimits,
      FLOW_CAPABILITIES.fields.constraints.attachments.acceptedMimeTypes,
    );
    expect(fieldLimits).toContain("5242880 bytes");

    const screenTable = tableMarkup(referenceHtml, "Released screens");
    expect(rowLabels(screenTable)).toEqual(
      FLOW_CAPABILITIES.screens.types.map((type) => `screen.type=${type}`),
    );

    const transitionTable = tableMarkup(
      referenceHtml,
      "Released screen transition controls",
    );
    expectTokens(transitionTable, FLOW_CAPABILITIES.transitions.kinds);
    expectTokens(transitionTable, FLOW_CAPABILITIES.transitions.easings);
    expectTokens(transitionTable, FLOW_CAPABILITIES.transitions.immediateWhen);

    const transitionBranches = tableMarkup(
      referenceHtml,
      "Required screen transition branches",
    );
    expect(rowLabels(transitionBranches)).toEqual(
      Object.keys(FLOW_CAPABILITIES.transitions.branches),
    );

    const publicTypes = tableMarkup(
      referenceHtml,
      "Canonical public value types",
    );
    expect(rowLabels(publicTypes)).toEqual(
      Object.keys(FLOW_CAPABILITIES.publicContract),
    );
    for (const declaration of Object.values(FLOW_CAPABILITIES.publicContract)) {
      expect(publicTypes).toContain(escapeHtml(declaration));
    }

    const lifecycleTable = tableMarkup(
      referenceHtml,
      "Released registration and lifecycle contract",
    );
    expect(rowLabels(lifecycleTable)).toEqual([
      "registration",
      "FlowHandle",
      "open options",
      "OpenedFlow",
      "submission result",
      ...Object.keys(FLOW_CAPABILITIES.lifecycle.outcomeBranches).map(
        (status) => `outcome.status=${status}`,
      ),
    ]);

    const exclusionsTable = tableMarkup(
      referenceHtml,
      "Capabilities excluded from the released Flow contract",
    );
    expectTokens(exclusionsTable, FLOW_CAPABILITIES.exclusions.variantOnly);
    expectTokens(exclusionsTable, FLOW_CAPABILITIES.exclusions.unreleased);
  });

  it("wires both public pages to canonical renderers instead of copied inventories", () => {
    const referencePages = [
      read("src/content/docs/flow-fields-and-screens-reference.mdx"),
      read("src/content/docs/flow-types.mdx"),
      read("src/content/docs/flow-branching-and-output.mdx"),
      read("src/content/docs/flow-presentation-and-motion.mdx"),
    ].join("\n");
    const examplesPage = read("src/content/docs/flow-examples.mdx");

    expect(referencePages).toContain(
      'import { FlowCapabilityReference } from "@/components/docs/flow-capability-reference"',
    );
    for (const section of [
      "fields-and-screens",
      "types",
      "branching-and-output",
      "presentation-and-motion",
    ]) {
      expect(referencePages).toContain(
        `<FlowCapabilityReference section="${section}" />`,
      );
    }
    expect(examplesPage).toContain(
      'import { FlowCapabilityExamples } from "@/components/docs/flow-capability-examples"',
    );
    expect(examplesPage).toContain("<FlowCapabilityExamples />");
    expect(FLOW_TRANSITION_KINDS).toBe(FLOW_CAPABILITIES.transitions.kinds);
  });

  it("binds local previews to exact release provenance and disables them in production", () => {
    const runtimePath = `/vendor/bugdrop/${FLOW_CAPABILITIES.targetCommit}/widget.js`;
    const examplesSource = read(
      "src/components/docs/flow-capability-examples.tsx",
    );

    expect(examplesHtml).toContain(`data-runtime-src="${runtimePath}"`);
    expect(examplesSource).toContain(
      "const RUNTIME_SRC = `/vendor/bugdrop/${FLOW_CAPABILITIES.targetCommit}/widget.js`",
    );
    expect(examplesSource).toContain("script.src = RUNTIME_SRC");
    expect(examplesSource).toContain(
      'const LOCAL_PREVIEW_ENABLED = process.env.NODE_ENV === "development"',
    );
    expect(examplesSource).toContain("if (!LOCAL_PREVIEW_ENABLED) return;");
    expect(examplesHtml).toContain("Interactive preview available locally");
    expect(examplesHtml).toContain("Local preview only");
    expect(examplesHtml).not.toContain('data-runtime-src="http');
    expect(referenceHtml).toContain(`Commit ${FLOW_CAPABILITIES.targetCommit}`);
    expect(referenceHtml).toContain(
      `Runtime SHA-256 ${FLOW_CAPABILITIES.runtime.sha256}`,
    );
  });

  it("makes generic horizontally scrollable MDX tables keyboard-focusable", () => {
    const mdxComponents = read("src/mdx-components.tsx");

    expect(mdxComponents).toContain(
      'table: ({ children }) => <div className="overflow-x-auto mb-4" tabIndex={0}>',
    );
  });
});
