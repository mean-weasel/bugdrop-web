import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { FlowCapabilityExamples } from "../src/components/docs/flow-capability-examples";
import {
  FLOW_STYLE_PRESETS,
  FLOW_TRANSITION_KINDS,
  transitionLabel,
} from "../src/components/docs/flow-capability-example-configs";
import { FLOW_CAPABILITIES } from "../src/lib/flow-capabilities";

describe("Flow capability live gallery", () => {
  const html = renderToStaticMarkup(<FlowCapabilityExamples />);

  it("loads only the pinned runtime and describes the public local-only path", () => {
    expect(html).toContain(`/vendor/bugdrop/${FLOW_CAPABILITIES.targetCommit}/widget.js`);
    expect(html).toContain("registerFlow(config)");
    expect(html).toContain("open(options)");
    expect(html).toContain("Local route only · no GitHub Issue");
    expect(html).not.toContain("https://bugdrop.neonwatty.workers.dev");
  });

  it("owns a docs runtime explicitly and cleans it up without deleting a borrowed homepage runtime", () => {
    const source = readFileSync("src/components/docs/flow-capability-examples.tsx", "utf8");
    const ownershipGuard = source.indexOf("queueMicrotask(() => {\n      if (cancelled) return;");

    expect(source).toContain('const DOCS_SCRIPT_ID = "bugdrop-flow-capability-docs-runtime"');
    expect(ownershipGuard).toBeGreaterThan(-1);
    for (const transactionStep of [
      "const exactHomepageRuntime",
      "suspendableHomepageRuntime(exactHomepageRuntime)",
      'document.createElement("script")',
      "document.body.append(script)",
    ]) {
      expect(source.indexOf(transactionStep)).toBeGreaterThan(ownershipGuard);
    }
    expect(source).toContain("releaseRuntimeOwnership?.()");
    expect(source).toContain("canBorrowHomepageRuntime");
    expect(source).toContain("existingApi === exactHomepageRuntime.api");
    expect(source).toContain("if (exactHomepageRuntime) return exactHomepageRuntime");
    expect(source).toContain("const script = runtimeScript(HOMEPAGE_SCRIPT_ID)");
    expect(source).toContain("return currentRuntime(script)");
    expect(source).toContain("suspendableHomepageRuntime(exactHomepageRuntime)");
    expect(source).toContain("restoreHomepageRuntime(suspendedHomepageRuntime)");
    expect(source).toContain('window.addEventListener("bugdrop:ready", handleRuntimeReady)');
    expect(source).toContain("executingScript === script");
    expect(source).toContain("reclaimDetachedRuntime()");
    expect(source).toContain(
      "homepageRuntimeAfterCancellation ?? boundHomepageRuntime()",
    );
    expect(source).toContain("removeDocsFlowHosts()");
    expect(source).toContain(
      "__bugDropDocsFlowHandles?: WeakMap<BugDropApi, Map<string, FlowHandle>>",
    );
    expect(source).toContain("const handles = handlesForApi(runtime)");
    expect(source).toContain("handlesByApi.get(api) ?? new Map<string, FlowHandle>()");
    expect(source).toContain("forgetHandlesForApi(lateRuntime?.api)");
    expect(source).toContain("forgetHandlesForApi(ownedApi)");
    expect(source).not.toContain("delete docsWindow().__bugDropDocsFlowHandles");
  });

  it("renders every canonical transition choice without a duplicate selector inventory", () => {
    expect((html.match(/data-transition-kind=/g) ?? [])).toHaveLength(
      FLOW_CAPABILITIES.transitions.kinds.length,
    );
    for (const kind of FLOW_TRANSITION_KINDS) {
      expect(html).toContain(`data-transition-kind="${kind}"`);
      expect(html).toContain(transitionLabel(kind));
    }
    expect(html).toContain("System reduced-motion preference always replaces it immediately");
  });

  it("shows each supported app-matching styling preset and the Shadow DOM boundary", () => {
    for (const preset of FLOW_STYLE_PRESETS) {
      expect(html).toContain(preset.label);
      expect(html).toContain(preset.description);
    }
    expect(html).toContain("Host CSS styles these preview cards, not BugDrop&#x27;s Shadow DOM");
  });
});
