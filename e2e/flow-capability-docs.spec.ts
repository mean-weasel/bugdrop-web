import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";

import { expect, test, type BrowserContext, type Page } from "@playwright/test";

import { FLOW_CAPABILITIES } from "../src/lib/flow-capabilities";

const origin = "http://bugdrop.localhost:3000";
const runtimePath = "/vendor/bugdrop/47a392d1e7b1a8d8adeff1692f6bbbd84696280d";
const axeSource = readFileSync(
  path.join(process.cwd(), "node_modules/axe-core/axe.min.js"),
  "utf8",
);

function recordNetwork(context: BrowserContext) {
  const external: string[] = [];
  const feedbackMutations: string[] = [];
  context.on("request", (request) => {
    const url = new URL(request.url());
    if ((url.protocol === "http:" || url.protocol === "https:") && url.origin !== origin) {
      external.push(request.url());
    }
    if (request.method() !== "GET" && url.pathname.endsWith("/api/feedback")) {
      feedbackMutations.push(`${request.method()} ${request.url()}`);
    }
  });
  return { external, feedbackMutations };
}

async function expectAccessiblePage(page: Page) {
  await page.evaluate(axeSource);
  const violations = await page.evaluate(async () => {
    const axe = (
      globalThis as typeof globalThis & {
        axe: {
          run(
            root: Document,
            options: Readonly<Record<string, unknown>>,
          ): Promise<{
            violations: Array<{
              id: string;
              nodes: Array<{ target: unknown }>;
            }>;
          }>;
        };
      }
    ).axe;
    const result = await axe.run(document, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
      },
    });
    return result.violations.map(({ id, nodes }) => ({
      id,
      targets: nodes.map(({ target }) => target),
    }));
  });
  expect(violations).toEqual([]);
}

async function expectResponsivePage(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
}

async function waitForGallery(page: Page) {
  await page.goto("/docs/flow-examples");
  await expect(page.getByRole("heading", { name: "Compose a released flow" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Launch live example" })).toBeEnabled();
}

async function rememberRuntimeIdentity(page: Page, key: string, scriptId: string) {
  return page.evaluate(({ identityKey, ownerScriptId }) => {
    const runtimeWindow = window as Window & {
      BugDrop?: unknown;
      __docsRuntimeIdentityProof?: Record<
        string,
        { script: Element | null; api: unknown; host: Element | null }
      >;
    };
    const identities = runtimeWindow.__docsRuntimeIdentityProof ?? {};
    runtimeWindow.__docsRuntimeIdentityProof = identities;
    const identity = {
      script: document.getElementById(ownerScriptId),
      api: runtimeWindow.BugDrop,
      host: document.getElementById("bugdrop-host"),
    };
    identities[identityKey] = identity;
    return {
      script: identity.script !== null,
      api: identity.api !== undefined,
      host: identity.host !== null,
    };
  }, { identityKey: key, ownerScriptId: scriptId });
}

async function compareRuntimeIdentity(page: Page, key: string, scriptId: string) {
  return page.evaluate(({ identityKey, ownerScriptId }) => {
    const runtimeWindow = window as Window & {
      BugDrop?: unknown;
      __docsRuntimeIdentityProof?: Record<
        string,
        { script: Element | null; api: unknown; host: Element | null }
      >;
    };
    const identity = runtimeWindow.__docsRuntimeIdentityProof?.[identityKey];
    return {
      script: identity?.script === document.getElementById(ownerScriptId),
      api: identity?.api === runtimeWindow.BugDrop,
      host: identity?.host === document.getElementById("bugdrop-host"),
    };
  }, { identityKey: key, ownerScriptId: scriptId });
}

test("the public reference renders the canonical released inventory accessibly", async ({
  page,
}) => {
  const network = recordNetwork(page.context());
  await page.goto("/docs/flow-reference");
  const article = page.getByRole("article");
  await expect(article.getByRole("link", { name: "Fields & Screens", exact: true })).toBeVisible();
  await expect(article.getByRole("link", { name: "Field Guide", exact: true })).toBeVisible();
  await expect(article.getByRole("link", { name: "Screen Guide", exact: true })).toBeVisible();
  await expect(article.getByRole("link", { name: "Flow Types", exact: true })).toBeVisible();
  await expect(article.getByRole("link", { name: "Branching & Output", exact: true })).toBeVisible();
  await expect(article.getByRole("link", { name: "Presentation & Motion", exact: true })).toBeVisible();

  await page.goto("/docs/flow-types");

  const reference = page.locator("[data-flow-capability-reference]");
  await expect(reference).toHaveAttribute("data-version-key", FLOW_CAPABILITIES.versionKey);
  await expect(reference).toContainText(`Commit ${FLOW_CAPABILITIES.targetCommit}`);
  await expect(reference).toContainText(`Runtime SHA-256 ${FLOW_CAPABILITIES.runtime.sha256}`);

  await page.goto("/docs/flow-fields-and-screens-reference");
  const fieldTable = page.getByRole("table", { name: "Released fields" });
  await expect(fieldTable.locator("tbody tr")).toHaveCount(FLOW_CAPABILITIES.fields.types.length);
  expect(await fieldTable.locator("tbody th").allTextContents()).toEqual(
    FLOW_CAPABILITIES.fields.types.map((type) => `field.type=${type}`),
  );

  const screenTable = page.getByRole("table", { name: "Released screens" });
  await expect(screenTable.locator("tbody tr")).toHaveCount(FLOW_CAPABILITIES.screens.types.length);
  expect(await screenTable.locator("tbody th").allTextContents()).toEqual(
    FLOW_CAPABILITIES.screens.types.map((type) => `screen.type=${type}`),
  );

  await page.goto("/docs/flow-presentation-and-motion");
  const transitionTable = page.getByRole("table", {
    name: "Released screen transition controls",
  });
  const transitionText = await transitionTable.textContent();
  for (const value of [
    ...FLOW_CAPABILITIES.transitions.kinds,
    ...FLOW_CAPABILITIES.transitions.easings,
    ...FLOW_CAPABILITIES.transitions.immediateWhen,
  ]) {
    expect(transitionText).toContain(String(value));
  }

  await page.goto("/docs/flow-types");
  const publicTypesTable = page.getByRole("table", { name: "Canonical public value types" });
  await expect(publicTypesTable.locator("tbody tr")).toHaveCount(
    Object.keys(FLOW_CAPABILITIES.publicContract).length,
  );
  const publicTypesText = await publicTypesTable.textContent();
  for (const [name, declaration] of Object.entries(FLOW_CAPABILITIES.publicContract)) {
    expect(publicTypesText).toContain(name);
    expect(publicTypesText).toContain(declaration);
  }
  for (const helper of ["BaseScreen", "BaseField"]) {
    const helperRow = publicTypesTable.getByRole("row").filter({
      has: page.getByRole("rowheader", { name: helper, exact: true }),
    });
    await expect(helperRow).toContainText("Unexported structural helper");
  }
  const flowConfigRow = publicTypesTable.getByRole("row").filter({
    has: page.getByRole("rowheader", { name: "FlowConfig", exact: true }),
  });
  await expect(flowConfigRow).toContainText("Exported public type");

  await page.goto("/docs/flow-presentation-and-motion");
  const transitionBranchesTable = page.getByRole("table", {
    name: "Required screen transition branches",
  });
  expect(await transitionBranchesTable.locator("tbody th").allTextContents()).toEqual(
    Object.keys(FLOW_CAPABILITIES.transitions.branches),
  );

  await page.goto("/docs/flow-branching-and-output");
  const exclusionsTable = page.getByRole("table", {
    name: "Capabilities excluded from the released Flow contract",
  });
  const exclusionsText = await exclusionsTable.textContent();
  for (const excluded of [
    ...FLOW_CAPABILITIES.exclusions.variantOnly,
    ...FLOW_CAPABILITIES.exclusions.unreleased,
  ]) {
    expect(exclusionsText).toContain(excluded);
  }

  await expectAccessiblePage(page);
  await expectResponsivePage(page);
  expect(network.external).toEqual([]);
  expect(network.feedbackMutations).toEqual([]);
});

for (const docsPath of ["/docs/javascript-api", "/docs/styling"] as const) {
  test(`${docsPath} keeps the unchanged WCAG A/AA axe oracle`, async ({ page }) => {
    const network = recordNetwork(page.context());
    await page.goto(docsPath);

    await expectAccessiblePage(page);
    await expectResponsivePage(page);
    expect(network.external).toEqual([]);
    expect(network.feedbackMutations).toEqual([]);
  });
}

test("reclaims a delayed detached docs runtime without deleting the Classic-only homepage owner", async ({
  page,
}, testInfo) => {
  test.skip(process.env.NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO_ENABLED === "true");
  test.skip(!["desktop-chromium", "mobile-chromium"].includes(testInfo.project.name));

  let releaseDocsResponse!: () => void;
  let noteDocsRequest!: () => void;
  let noteDocsCompletion!: () => void;
  const docsRequest = new Promise<void>((resolve) => {
    noteDocsRequest = resolve;
  });
  const docsResponseGate = new Promise<void>((resolve) => {
    releaseDocsResponse = resolve;
  });
  const docsCompletion = new Promise<void>((resolve) => {
    noteDocsCompletion = resolve;
  });
  await page.route(`**${runtimePath}/widget.js`, async (route) => {
    noteDocsRequest();
    await docsResponseGate;
    try {
      await route.fallback();
    } finally {
      noteDocsCompletion();
    }
  });
  await page.route("https://bugdrop.neonwatty.workers.dev/widget.js", async (route) => {
    await route.fulfill({
      contentType: "application/javascript",
      body: `
        const host = document.createElement('div');
        host.id = 'bugdrop-host';
        document.body.append(host);
        window.BugDrop = {
          open() { document.body.dataset.delayedClassicOpened = String(Number(document.body.dataset.delayedClassicOpened || 0) + 1); },
          close() {},
        };
        window.dispatchEvent(new CustomEvent('bugdrop:ready'));
      `,
    });
  });

  await page.goto("/");
  const launcher = page.getByRole("button", { name: "Open Feedback demo" });
  await launcher.click();
  await expect(page.locator("body")).toHaveAttribute("data-delayed-classic-opened", "1");
  expect(await rememberRuntimeIdentity(page, "delayed-classic", "bugdrop-homepage-demo"))
    .toEqual({ script: true, api: true, host: true });

  await page.getByRole("link", { name: "Docs", exact: true }).click();
  await page.getByRole("link", { name: "Flow Examples", exact: true }).click();
  await expect(page).toHaveURL(`${origin}/docs/flow-examples`);
  await docsRequest;
  await page.getByRole("link", { name: "BugDrop", exact: true }).first().click();
  await expect(page).toHaveURL(`${origin}/`);
  await launcher.click();
  await expect(page.locator("body")).toHaveAttribute("data-delayed-classic-opened", "2");

  releaseDocsResponse();
  await docsCompletion;

  await expect(page.locator("#bugdrop-flow-capability-docs-runtime")).toHaveCount(0);
  await expect(page.locator("#bugdrop-homepage-demo")).toHaveCount(1);
  await expect(page.locator("#bugdrop-host")).toHaveCount(1);
  await expect(page.locator('[data-bugdrop-flow^="docs-"]')).toHaveCount(0);
  await expect.poll(() => compareRuntimeIdentity(
    page,
    "delayed-classic",
    "bugdrop-homepage-demo",
  )).toEqual({ script: true, api: true, host: true });

  await launcher.click();
  await expect(page.locator("body")).toHaveAttribute("data-delayed-classic-opened", "3");
});

test("owns the runtime across Classic-only home to docs to home client navigation", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium");

  await page.route("https://bugdrop.neonwatty.workers.dev/widget.js", async (route) => {
    await route.fulfill({
      contentType: "application/javascript",
      body: `
        const host = document.createElement('div');
        host.id = 'bugdrop-host';
        document.body.append(host);
        window.BugDrop = {
          open() { document.body.dataset.classicDemoOpened = String(Number(document.body.dataset.classicDemoOpened || 0) + 1); },
          close() {},
        };
        window.dispatchEvent(new CustomEvent('bugdrop:ready'));
      `,
    });
  });

  await page.goto("/");
  await page.getByRole("button", { name: "Open Feedback demo" }).click();
  await expect(page.locator("body")).toHaveAttribute("data-classic-demo-opened", "1");
  await expect(page.locator("#bugdrop-homepage-demo")).toHaveCount(1);
  expect(await rememberRuntimeIdentity(page, "classic", "bugdrop-homepage-demo")).toEqual({
    script: true,
    api: true,
    host: true,
  });

  await page.locator('a[href="/docs"]').first().click();
  await page.waitForURL("**/docs");
  await page.locator('a[href="/docs/flow-examples"]').first().click();
  await expect(page.getByRole("button", { name: "Launch live example" })).toBeEnabled();
  await expect(page.locator("#bugdrop-homepage-demo")).toHaveCount(0);
  await expect(page.locator("#bugdrop-flow-capability-docs-runtime")).toHaveCount(1);
  await expect(page.locator("#bugdrop-host")).toHaveCount(1);
  expect(await compareRuntimeIdentity(page, "classic", "bugdrop-flow-capability-docs-runtime"))
    .toEqual({ script: false, api: false, host: false });
  expect(
    await rememberRuntimeIdentity(page, "docs-after-classic", "bugdrop-flow-capability-docs-runtime"),
  ).toEqual({ script: true, api: true, host: true });

  await page.getByRole("link", { name: "BugDrop", exact: true }).first().click();
  await expect(page).toHaveURL(`${origin}/`);
  await expect(page.locator("#bugdrop-flow-capability-docs-runtime")).toHaveCount(0);
  await expect(page.locator("#bugdrop-homepage-demo")).toHaveCount(1);
  await expect(page.locator("#bugdrop-host")).toHaveCount(1);
  expect(await compareRuntimeIdentity(page, "classic", "bugdrop-homepage-demo")).toEqual({
    script: true,
    api: true,
    host: true,
  });
  expect(await compareRuntimeIdentity(page, "docs-after-classic", "bugdrop-homepage-demo"))
    .toEqual({ script: false, api: false, host: false });
  await page.getByRole("button", { name: "Open Feedback demo" }).click();
  await expect(page.locator("body")).toHaveAttribute("data-classic-demo-opened", "2");
  await expect(page.locator("[data-bugdrop-flow]")).toHaveCount(0);
});

test("the manifest-driven gallery runs the public pinned flow path accessibly", async ({
  page,
}) => {
  const network = recordNetwork(page.context());
  const runtimeResponsePromise = page.waitForResponse(
    (response) => new URL(response.url()).pathname === `${runtimePath}/widget.js`,
  );
  await waitForGallery(page);

  const runtimeResponse = await runtimeResponsePromise;
  const runtimeBytes = await runtimeResponse.body();
  expect(runtimeResponse.status()).toBe(200);
  expect(runtimeBytes.byteLength).toBe(FLOW_CAPABILITIES.runtime.byteLength);
  expect(createHash("sha256").update(runtimeBytes).digest("hex")).toBe(
    FLOW_CAPABILITIES.runtime.sha256,
  );
  expect(
    await rememberRuntimeIdentity(page, "direct-docs", "bugdrop-flow-capability-docs-runtime"),
  ).toEqual({ script: true, api: true, host: true });

  const transitionButtons = page.locator("[data-transition-selector] button");
  await expect(transitionButtons).toHaveCount(6);
  for (const kind of ["none", "slide-horizontal", "slide-vertical", "fade", "scale-fade", "custom"]) {
    await expect(page.locator(`[data-transition-kind="${kind}"]`)).toHaveCount(1);
  }
  await expect(page.locator("[data-style-presets] button")).toHaveCount(3);
  await expectAccessiblePage(page);

  await page.getByRole("button", { name: /Custom lift/ }).click();
  await page.getByRole("button", { name: /Product dark/ }).click();
  const launcher = page.getByRole("button", { name: "Launch live example" });
  await launcher.focus();
  await launcher.press("Enter");

  const flow = page.locator('[data-bugdrop-flow^="docs-incident-triage-custom-product-dark"]');
  const welcome = flow.getByRole("dialog", { name: "Triage an incident" });
  await expect(welcome).toBeVisible();
  await welcome.getByRole("button", { name: "Start triage" }).click();
  await expect(flow.locator(".bdf-transitioning")).toHaveCount(1);
  await expect(flow.getByLabel("Summary")).toHaveValue("Checkout confirmation is delayed");
  await flow.getByLabel("Blocking").click();
  await flow.getByRole("button", { name: "Continue" }).click();
  await expect(flow.getByRole("heading", { name: "Add diagnostic evidence" })).toBeVisible();
  await flow.getByRole("button", { name: "Back" }).click();
  await expect(flow.getByLabel("Summary")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(flow).toHaveCount(0);
  await expect(launcher).toBeFocused();

  expect(network.external).toEqual([]);
  expect(network.feedbackMutations).toEqual([]);
  const runtimeScripts = page.locator(`script[src="${runtimePath}/widget.js"]`);
  await expect(runtimeScripts).toHaveCount(1);
  await expect(runtimeScripts).toHaveAttribute("data-repo", "mean-weasel/bugdrop-widget-test");
  expect(await compareRuntimeIdentity(page, "direct-docs", "bugdrop-flow-capability-docs-runtime"))
    .toEqual({ script: true, api: true, host: true });
  await expectResponsivePage(page);
});

test("a submitted gallery flow is disposed when navigation precedes Done", async ({ page }) => {
  await page.goto("/docs");
  await page.locator('a[href="/docs/flow-examples"]').first().click();
  await expect(page.getByRole("button", { name: "Launch live example" })).toBeEnabled();

  await page.getByRole("button", { name: /Release readiness/ }).click();
  await page.getByRole("button", { name: "Launch live example" }).click();
  const flow = page.locator(
    '[data-bugdrop-flow^="docs-release-readiness-slide-horizontal-product-dark"]',
  );

  await flow.getByLabel("Release name").fill("v1.56.3 docs");
  await flow.getByLabel("Critical tests passed").check();
  await flow.getByLabel("Rollback plan checked").check();
  await flow.getByRole("button", { name: "Continue" }).click();
  await flow.getByLabel("Risk note").fill("Navigation teardown regression proof.");
  await flow.getByRole("button", { name: "Continue" }).click();
  await flow.getByRole("button", { name: "Submit" }).click();
  await expect(flow.getByRole("button", { name: "Done" })).toBeVisible();
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");

  await page.goBack();
  await expect(page).toHaveURL(`${origin}/docs`);
  await expect(page.locator("[data-bugdrop-flow]")).toHaveCount(0);
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test.describe("reduced motion", () => {
  test("reports and performs immediate screen replacement", async ({ page }) => {
    const network = recordNetwork(page.context());
    await page.emulateMedia({ reducedMotion: "reduce" });
    await waitForGallery(page);
    await expect(page.locator('[data-reduced-motion="true"]')).toContainText(
      "BugDrop replaces every screen immediately",
    );

    await page.getByRole("button", { name: "Launch live example" }).click();
    const flow = page.locator('[data-bugdrop-flow^="docs-incident-triage-slide-horizontal-product-dark"]');
    const welcome = flow.getByRole("dialog", { name: "Triage an incident" });
    await expect(welcome).toBeVisible();
    await welcome.getByRole("button", { name: "Start triage" }).click();
    await expect(flow.getByLabel("Summary")).toBeVisible();
    await expect(flow.locator(".bdf-transitioning")).toHaveCount(0);
    await expect(flow.locator(".bdv-overlay > .bdv-surface")).toHaveCount(1);
    await page.keyboard.press("Escape");

    await expectAccessiblePage(page);
    await expectResponsivePage(page);
    expect(network.external).toEqual([]);
    expect(network.feedbackMutations).toEqual([]);
  });
});
