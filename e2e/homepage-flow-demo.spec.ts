import {
  expect,
  test,
  type Locator,
  type Page,
} from "@playwright/test";

const origin = process.env.HOMEPAGE_E2E_ORIGIN ?? "http://bugdrop.localhost:3000";
const runtimePath =
  "/vendor/bugdrop/47a392d1e7b1a8d8adeff1692f6bbbd84696280d";
const repo = "mean-weasel/bugdrop-widget-test";

type Submission = Readonly<{
  url: string;
  body: Record<string, unknown>;
}>;

function installLocalBugDropHarness(
  page: Page,
  options: { failOnceForTitle?: string; issueBase?: number; publicResult?: boolean } = {},
) {
  const submissions: Submission[] = [];
  const rejectedRequests: string[] = [];
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  let failedOnce = false;

  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.route("**/*", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const exactCheck =
      url.origin === origin &&
      url.pathname === `${runtimePath}/api/check/${repo}` &&
      request.method() === "GET";
    const exactFeedback =
      url.origin === origin &&
      url.pathname === `${runtimePath}/api/feedback` &&
      request.method() === "POST";

    if (exactCheck) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ installed: true, appName: "BugDrop" }),
      });
      return;
    }
    if (exactFeedback) {
      const body = request.postDataJSON() as Record<string, unknown>;
      submissions.push({ url: request.url(), body });
      if (options.failOnceForTitle === body.title && !failedOnce) {
        failedOnce = true;
        await route.fulfill({
          contentType: "application/json",
          body: JSON.stringify({ success: false, error: "Intentional retry proof" }),
        });
        return;
      }
      const issueNumber = (options.issueBase ?? 9100) + submissions.length;
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          issueNumber,
          issueUrl: `https://github.com/${repo}/issues/${issueNumber}`,
          isPublic: options.publicResult ?? false,
        }),
      });
      return;
    }

    const isFeedbackLike =
      url.pathname.includes("/api/check/") || url.pathname.endsWith("/api/feedback");
    const isExternal =
      (url.protocol === "http:" || url.protocol === "https:") && url.origin !== origin;
    if (isFeedbackLike || isExternal) {
      rejectedRequests.push(request.url());
      await route.abort("blockedbyclient");
      return;
    }
    await route.continue();
  });

  return {
    submissions,
    rejectedRequests,
    consoleErrors,
    pageErrors,
    assertClean() {
      expect(rejectedRequests).toEqual([]);
      expect(consoleErrors).toEqual([]);
      expect(pageErrors).toEqual([]);
    },
  };
}

async function expectComposedShadowFocus(control: Locator) {
  const focus = await control.evaluate((element) => {
    const root = element.getRootNode() as ShadowRoot;
    return {
      shadow: root.activeElement === element,
      document: document.activeElement === root.host,
    };
  });
  expect(focus).toEqual({ shadow: true, document: true });
}

function enabledOnly(testInfo: { project: { name: string } }) {
  test.skip(process.env.NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO_ENABLED !== "true");
  test.skip(!["desktop-chromium", "mobile-chromium"].includes(testInfo.project.name));
}

async function chooseInPage(page: Page, name: string) {
  await page.getByRole("radio", { name }).check();
  const launch = page.getByRole("button", { name: `Open ${name}` });
  await launch.click();
  return launch;
}

test("separates the simple floating feedback action from the flow showcase", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium");
  test.skip(process.env.NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO_ENABLED !== "true");

  await page.goto("/");
  await expect(page.getByRole("button", { name: "Open BugDrop feedback" })).toBeVisible();
  await expect(page.getByRole("menu", { name: "Feedback experience" })).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "One widget for every feedback moment." }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation").getByRole("link", { name: "Design your flow" }),
  ).toHaveAttribute("href", "/#try-bugdrop");
  await expect(
    page.getByRole("link", { name: "Explore the building blocks" }),
  ).toHaveAttribute("href", "/labs/variants");
  await expect(page.getByText(/Local dogfood submissions stay in this development process/))
    .toContainText("they do not create a public GitHub Issue");
  await expect(page.getByText(/Demo submissions create a real public GitHub Issue/)).toHaveCount(0);
  const picker = page.getByRole("group", { name: "Feedback experience" });
  await expect(picker.getByRole("radio")).toHaveCount(4);
  await expect(picker).toContainText("The familiar screenshot-first feedback widget.");
  await expect(picker).toContainText("Reproduce a bug and attach proof.");
  await expect(picker).toContainText("Share a 1–5 star rating in one step.");
  await expect(picker).toContainText("Shape and prioritize a product idea.");
  await page.getByRole("radio", { name: "Feature Request" }).check();
  await expect(page.getByRole("button", { name: "Open Feature Request" })).toContainText("💡");
});

test("fails visibly after a client navigation leaves a foreign runtime active", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium");
  test.skip(process.env.NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO_ENABLED !== "true");

  await page.goto("/labs/variants");
  await expect(page.getByRole("button", { name: "Run default-shaped flow" })).toBeEnabled();
  await page.getByRole("link", { name: "BugDrop", exact: true }).first().click();
  await expect(page).toHaveURL(`${origin}/`);

  await page.getByRole("button", { name: "Open General Feedback" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "The feedback experience" }),
  ).toContainText("could not load");
  await expect(page.getByRole("button", { name: "Open General Feedback" })).toBeEnabled();
  await expect(page.locator("#bugdrop-homepage-demo")).toHaveCount(0);
});

test("keeps the pinned homepage API across homepage to lab to homepage navigation", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium");
  test.skip(process.env.NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO_ENABLED !== "true");

  const checkPaths: string[] = [];
  await page.route("**/api/check/**", async (route) => {
    checkPaths.push(new URL(route.request().url()).pathname);
    await route.fulfill({
      contentType: "application/json",
      body: '{"installed":true,"appName":"BugDrop"}',
    });
  });
  await page.route("**/api/feedback", (route) => route.abort());
  await page.goto("/");

  const openClassic = page.getByRole("button", { name: "Open General Feedback" });
  await openClassic.click();
  const classicHost = page.locator("#bugdrop-host").first();
  await expect(classicHost.getByRole("heading", { name: "Send Feedback" })).toBeVisible();
  await classicHost.getByRole("button", { name: "Cancel" }).click();

  await page.getByRole("link", { name: "Explore the building blocks" }).click();
  await expect(page.getByRole("button", { name: "Run default-shaped flow" })).toBeEnabled();
  await page.getByRole("link", { name: "BugDrop", exact: true }).first().click();
  await expect(page).toHaveURL(`${origin}/`);
  await expect
    .poll(() =>
      page.evaluate(() => {
        const script = document.querySelector<HTMLScriptElement>("#bugdrop-homepage-demo");
        const bound = script &&
          (script as HTMLScriptElement & { [key: symbol]: unknown })[
            Symbol.for("bugdrop.homepage-demo.exact-api")
          ];
        return Boolean(bound && bound !== window.BugDrop);
      }),
    )
    .toBe(true);

  await page.getByRole("button", { name: "Open General Feedback" }).click();
  await expect(classicHost.getByRole("heading", { name: "Send Feedback" })).toBeVisible();
  expect(checkPaths).toEqual([
    `${runtimePath}/api/check/${repo}`,
    `${runtimePath}/api/check/${repo}`,
  ]);
});

test("borrows the pinned runtime across enabled home to docs to home navigation", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium");
  enabledOnly(testInfo);
  const harness = installLocalBugDropHarness(page);

  await page.goto("/");
  await page.getByRole("button", { name: "Open General Feedback" }).click();
  const classicHost = page.locator("#bugdrop-host");
  await expect(classicHost.getByRole("heading", { name: "Send Feedback" })).toBeVisible();
  await classicHost.getByRole("button", { name: "×" }).click();
  await expect(classicHost.getByRole("heading", { name: "Send Feedback" })).toHaveCount(0);
  expect(
    await page.evaluate(() => {
      const runtimeWindow = window as Window & {
        BugDrop?: unknown;
        __homepageDocsOwnerProof?: {
          script: Element | null;
          api: unknown;
          host: Element | null;
        };
      };
      runtimeWindow.__homepageDocsOwnerProof = {
        script: document.getElementById("bugdrop-homepage-demo"),
        api: runtimeWindow.BugDrop,
        host: document.getElementById("bugdrop-host"),
      };
      return {
        script: runtimeWindow.__homepageDocsOwnerProof.script !== null,
        api: runtimeWindow.__homepageDocsOwnerProof.api !== undefined,
        host: runtimeWindow.__homepageDocsOwnerProof.host !== null,
      };
    }),
  ).toEqual({ script: true, api: true, host: true });

  await page.locator('a[href="/docs"]').first().click();
  await page.waitForURL("**/docs");
  await page.locator('a[href="/docs/flow-examples"]').first().click();
  await expect(page.getByRole("button", { name: "Launch live example" })).toBeEnabled();
  await expect(page.locator("#bugdrop-homepage-demo")).toHaveCount(1);
  await expect(page.locator("#bugdrop-flow-capability-docs-runtime")).toHaveCount(0);
  await expect(page.locator("#bugdrop-host")).toHaveCount(1);
  expect(
    await page.evaluate(() => {
      const runtimeWindow = window as Window & {
        BugDrop?: unknown;
        __homepageDocsOwnerProof?: {
          script: Element | null;
          api: unknown;
          host: Element | null;
        };
      };
      const identity = runtimeWindow.__homepageDocsOwnerProof;
      return {
        script: identity?.script === document.getElementById("bugdrop-homepage-demo"),
        api: identity?.api === runtimeWindow.BugDrop,
        host: identity?.host === document.getElementById("bugdrop-host"),
      };
    }),
  ).toEqual({ script: true, api: true, host: true });

  await page.getByRole("button", { name: "Launch live example" }).click();
  await expect(page.locator('[data-bugdrop-flow^="docs-incident-triage"]')).toHaveCount(1);
  await page.keyboard.press("Escape");
  await expect(page.locator('[data-bugdrop-flow^="docs-"]')).toHaveCount(0);
  await page.getByRole("link", { name: "BugDrop", exact: true }).first().click();
  await expect(page).toHaveURL(`${origin}/`);

  await page.getByRole("button", { name: "Open General Feedback" }).click();
  await expect(classicHost.getByRole("heading", { name: "Send Feedback" })).toBeVisible();
  await classicHost.getByRole("button", { name: "×" }).click();

  await page.locator('a[href="/docs"]').first().click();
  await page.waitForURL("**/docs");
  await page.locator('a[href="/docs/flow-examples"]').first().click();
  const revisitedLauncher = page.getByRole("button", { name: "Launch live example" });
  await expect(revisitedLauncher).toBeEnabled();
  await revisitedLauncher.click();
  await expect(page.locator('[data-bugdrop-flow^="docs-incident-triage"]')).toHaveCount(1);
  await page.keyboard.press("Escape");
  await expect(page.locator('[data-bugdrop-flow^="docs-"]')).toHaveCount(0);
  await page.getByRole("link", { name: "BugDrop", exact: true }).first().click();
  await expect(page).toHaveURL(`${origin}/`);

  await expect(page.locator("#bugdrop-homepage-demo")).toHaveCount(1);
  await expect(page.locator("#bugdrop-flow-capability-docs-runtime")).toHaveCount(0);
  await expect(page.locator("#bugdrop-host")).toHaveCount(1);
  await expect(page.locator("[data-bugdrop-flow]")).toHaveCount(0);
  expect(
    await page.evaluate(() => {
      const runtimeWindow = window as Window & {
        BugDrop?: unknown;
        __homepageDocsOwnerProof?: {
          script: Element | null;
          api: unknown;
          host: Element | null;
        };
      };
      const identity = runtimeWindow.__homepageDocsOwnerProof;
      return {
        script: identity?.script === document.getElementById("bugdrop-homepage-demo"),
        api: identity?.api === runtimeWindow.BugDrop,
        host: identity?.host === document.getElementById("bugdrop-host"),
      };
    }),
  ).toEqual({ script: true, api: true, host: true });
  harness.assertClean();
});

test("isolates the lab API across enabled home to lab to docs to home navigation", async ({
  page,
}, testInfo) => {
  enabledOnly(testInfo);
  const harness = installLocalBugDropHarness(page);

  await page.goto("/");
  await page.getByRole("button", { name: "Open General Feedback" }).click();
  const homepageHost = page.locator("#bugdrop-host");
  await expect(homepageHost.getByRole("heading", { name: "Send Feedback" })).toBeVisible();
  await homepageHost.getByRole("button", { name: "×" }).click();
  expect(
    await page.evaluate(() => {
      const runtimeWindow = window as Window & {
        BugDrop?: unknown;
        __mixedRuntimeOwnerProof?: { script: Element | null; api: unknown; host: Element | null };
      };
      runtimeWindow.__mixedRuntimeOwnerProof = {
        script: document.getElementById("bugdrop-homepage-demo"),
        api: runtimeWindow.BugDrop,
        host: document.getElementById("bugdrop-host"),
      };
      return runtimeWindow.__mixedRuntimeOwnerProof.api !== undefined;
    }),
  ).toBe(true);

  await page.getByRole("link", { name: "Explore the building blocks" }).click();
  await expect(page).toHaveURL(/\/labs\/variants$/);
  await expect(page.getByRole("button", { name: "Run default-shaped flow" })).toBeEnabled();
  expect(
    await page.evaluate(() => {
      const runtimeWindow = window as Window & {
        BugDrop?: unknown;
        __mixedRuntimeOwnerProof?: { api: unknown };
      };
      return runtimeWindow.BugDrop !== runtimeWindow.__mixedRuntimeOwnerProof?.api;
    }),
  ).toBe(true);

  await page.getByRole("navigation").getByRole("link", { name: "Docs", exact: true }).click();
  await expect(page).toHaveURL(`${origin}/docs`);
  await page.locator('a[href="/docs/flow-examples"]').first().click();
  const galleryLauncher = page.getByRole("button", { name: "Launch live example" });
  await expect(galleryLauncher).toBeEnabled();
  await galleryLauncher.click();
  await expect(page.locator('[data-bugdrop-flow^="docs-incident-triage"]')).toHaveCount(1);
  await page.keyboard.press("Escape");
  await expect(page.locator('[data-bugdrop-flow^="docs-"]')).toHaveCount(0);

  await page.getByRole("link", { name: "BugDrop", exact: true }).first().click();
  await expect(page).toHaveURL(`${origin}/`);
  await expect(page.locator("#bugdrop-homepage-demo")).toHaveCount(1);
  await expect(page.locator("#bugdrop-flow-capability-docs-runtime")).toHaveCount(0);
  await expect(page.locator("#bugdrop-host")).toHaveCount(1);
  expect(
    await page.evaluate(() => {
      const runtimeWindow = window as Window & {
        BugDrop?: unknown;
        __mixedRuntimeOwnerProof?: { script: Element | null; api: unknown; host: Element | null };
      };
      const owner = runtimeWindow.__mixedRuntimeOwnerProof;
      const script = document.getElementById("bugdrop-homepage-demo");
      const bound = script &&
        (script as HTMLScriptElement & { [key: symbol]: unknown })[
          Symbol.for("bugdrop.homepage-demo.exact-api")
        ];
      return {
        script: owner?.script === script,
        api: owner?.api === runtimeWindow.BugDrop,
        bound: bound === runtimeWindow.BugDrop,
        host: owner?.host === document.getElementById("bugdrop-host"),
      };
    }),
  ).toEqual({ script: true, api: true, bound: true, host: true });

  await page.getByRole("button", { name: "Open General Feedback" }).click();
  await expect(homepageHost.getByRole("heading", { name: "Send Feedback" })).toBeVisible();
  await homepageHost.getByRole("button", { name: "×" }).click();
  expect(harness.submissions).toHaveLength(0);
  harness.assertClean();
});

test("reclaims a delayed detached docs runtime without deleting the enabled homepage owner", async ({
  page,
}, testInfo) => {
  enabledOnly(testInfo);
  const harness = installLocalBugDropHarness(page);
  let requestCount = 0;
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
    requestCount += 1;
    if (requestCount === 1) {
      noteDocsRequest();
      await docsResponseGate;
      try {
        await route.fallback();
      } finally {
        noteDocsCompletion();
      }
      return;
    }
    await route.fallback();
  });

  await page.goto("/docs/flow-examples");
  await docsRequest;
  await page.getByRole("link", { name: "BugDrop", exact: true }).first().click();
  await expect(page).toHaveURL(`${origin}/`);

  const launcher = page.getByRole("button", { name: "Open General Feedback" });
  await launcher.click();
  await expect(page.getByRole("button", { name: "Loading Feedback…" })).toBeDisabled();

  releaseDocsResponse();
  await docsCompletion;
  const homepageHost = page.locator("#bugdrop-host");
  await expect(homepageHost.getByRole("heading", { name: "Send Feedback" })).toBeVisible();
  const ownerAfterRelease = await page.evaluate(() => {
    const runtimeWindow = window as Window & { BugDrop?: unknown };
    const script = document.getElementById("bugdrop-homepage-demo");
    const host = document.getElementById("bugdrop-host");
    (runtimeWindow as typeof runtimeWindow & {
      __delayedEnabledOwner?: { script: Element | null; api: unknown; host: Element | null };
    }).__delayedEnabledOwner = { script, api: runtimeWindow.BugDrop, host };
    return { script: script !== null, api: runtimeWindow.BugDrop !== undefined, host: host !== null };
  });
  expect(ownerAfterRelease).toEqual({ script: true, api: true, host: true });
  await homepageHost.getByRole("button", { name: "×" }).click();

  await expect(page.locator("#bugdrop-flow-capability-docs-runtime")).toHaveCount(0);
  await expect(page.locator("#bugdrop-homepage-demo")).toHaveCount(1);
  await expect(page.locator("#bugdrop-host")).toHaveCount(1);
  await expect(page.locator('[data-bugdrop-flow^="docs-"]')).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => {
    const runtimeWindow = window as Window & {
      BugDrop?: unknown;
      __delayedEnabledOwner?: { script: Element | null; api: unknown; host: Element | null };
    };
    const owner = runtimeWindow.__delayedEnabledOwner;
    return {
      script: owner?.script === document.getElementById("bugdrop-homepage-demo"),
      api: owner?.api === runtimeWindow.BugDrop,
      host: owner?.host === document.getElementById("bugdrop-host"),
    };
  })).toEqual({ script: true, api: true, host: true });

  await launcher.click();
  await expect(homepageHost.getByRole("heading", { name: "Send Feedback" })).toBeVisible();
  await homepageHost.getByRole("button", { name: "×" }).click();
  harness.assertClean();
});

test("waits for a delayed exact runtime instead of resolving a foreign lab API", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium");
  enabledOnly(testInfo);
  const harness = installLocalBugDropHarness(page, { issueBase: 9500 });
  let releaseExactScript!: () => void;
  let noteExactScriptRequested!: () => void;
  const exactScriptRequested = new Promise<void>((resolve) => {
    noteExactScriptRequested = resolve;
  });
  const exactScriptGate = new Promise<void>((resolve) => {
    releaseExactScript = resolve;
  });
  await page.route(`**${runtimePath}/widget.js`, async (route) => {
    noteExactScriptRequested();
    await exactScriptGate;
    await route.fallback();
  });
  await page.goto("/");

  await page.getByRole("radio", { name: "Quick Rating" }).check();
  await page.getByRole("button", { name: "Open Quick Rating" }).click();
  await exactScriptRequested;
  await page.getByRole("link", { name: "Explore the building blocks" }).click();
  await expect(page).toHaveURL(/\/labs\/variants$/);
  await expect(page.getByRole("button", { name: "Run default-shaped flow" })).toBeEnabled();
  await page.evaluate(() => {
    (window as Window & { __homepageRaceForeignApi?: unknown }).__homepageRaceForeignApi =
      window.BugDrop;
  });

  await page.getByRole("link", { name: "BugDrop", exact: true }).first().click();
  await expect(page).toHaveURL(`${origin}/`);
  await page.getByRole("radio", { name: "Quick Rating" }).check();
  const secondLaunch = page.getByRole("button", { name: "Open Quick Rating" });
  await secondLaunch.click();
  await expect(page.getByRole("button", { name: "Loading Feedback…" })).toBeDisabled();
  await expect(page.locator('[data-bugdrop-flow="quick-rating"]')).toHaveCount(0);
  expect(harness.submissions).toHaveLength(0);
  expect(
    await page.evaluate(() => (window as Window & { BugDrop?: unknown }).BugDrop),
  ).toBeUndefined();

  releaseExactScript();
  const rating = page.locator('[data-bugdrop-flow="quick-rating"]');
  await expect(rating.getByRole("dialog", { name: "How was this experience?" })).toBeVisible();
  expect(
    await page.evaluate(() => {
      const runtimeWindow = window as Window & {
        BugDrop?: unknown;
        __homepageRaceForeignApi?: unknown;
      };
      const script = document.querySelector<HTMLScriptElement>("#bugdrop-homepage-demo");
      const bound = script &&
        (script as HTMLScriptElement & { [key: symbol]: unknown })[
          Symbol.for("bugdrop.homepage-demo.exact-api")
        ];
      return {
        replacedForeign: runtimeWindow.BugDrop !== runtimeWindow.__homepageRaceForeignApi,
        boundExact: bound === runtimeWindow.BugDrop,
      };
    }),
  ).toEqual({ replacedForeign: true, boundExact: true });

  await rating.getByRole("radio", { name: "4 stars" }).click();
  await rating.getByRole("button", { name: "Send rating", exact: true }).click();
  await expect(rating.getByRole("heading", { name: "Rating received" })).toBeVisible();
  expect(harness.submissions).toHaveLength(1);
  expect(harness.submissions[0]).toMatchObject({
    url: `${origin}${runtimePath}/api/feedback`,
    body: { repo, title: "Experience rating 4/5" },
  });
  harness.assertClean();
});

test("settles Classic when the runtime opens and closes before the first poll", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium");
  test.skip(process.env.NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO_ENABLED !== "true");

  await page.route(`**${runtimePath}/widget.js`, (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: `window.BugDrop={open(){},close(){},isOpen(){return false},registerFlow(config){return{id:config.id,open(){throw new Error('not used')}}}};`,
    }),
  );
  await page.goto("/");

  const launch = page.getByRole("button", { name: "Open General Feedback" });
  await launch.click();
  await expect(launch).toBeEnabled();
  await expect(launch).toBeFocused();
});

test("keeps the Classic-only launcher when the feature flag is unset", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium");
  test.skip(process.env.NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO_ENABLED === "true");

  await page.route("**/widget.js", async (route) => {
    await route.fulfill({
      contentType: "application/javascript",
      body: `window.BugDrop={open(){document.body.dataset.classicDemoOpened='true'}};window.dispatchEvent(new CustomEvent('bugdrop:ready'));`,
    });
  });
  await page.goto("/");

  await expect(page.getByRole("button", { name: "Open BugDrop feedback" })).toHaveCount(0);
  await expect(
    page.getByRole("navigation").getByRole("link", { name: "Try Widget" }),
  ).toHaveAttribute("href", "/#try-bugdrop");
  await expect(
    page.locator("header").getByRole("link", { name: "Try it on this page" }),
  ).toHaveAttribute("href", "#try-bugdrop");
  await expect(page.getByRole("link", { name: "Design your flow" })).toHaveCount(0);
  await page.getByRole("button", { name: "Open Feedback demo" }).click();
  await expect(page.locator("body")).toHaveAttribute("data-classic-demo-opened", "true");
});

test("submits the independent Classic journey through the local mock", async ({ page }, testInfo) => {
  test.setTimeout(90_000);
  test.skip(testInfo.project.name !== "desktop-chromium");
  enabledOnly(testInfo);
  const harness = installLocalBugDropHarness(page);
  await page.goto("/");

  await page.getByRole("radio", { name: /General Feedback.*Classic/ }).check();
  const classicLauncher = page.getByRole("button", { name: "Open General Feedback" });
  await classicLauncher.click();

  const classicHost = page.locator("#bugdrop-host");
  await expect(classicHost.getByRole("heading", { name: "Send Feedback" })).toBeVisible();
  await expect(page.locator("#bugdrop-homepage-demo")).toHaveAttribute(
    "data-welcome",
    "This is the BugDrop landing page demo. Send a test report to see what your users would experience.",
  );
  const classicTheme = await classicHost.locator(".bd-modal").evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      background: style.backgroundColor,
      color: style.color,
      radius: style.borderRadius,
    };
  });
  expect(classicTheme).toMatchObject({
    background: "rgb(36, 40, 59)",
    color: "rgb(192, 202, 245)",
    radius: "20px",
  });
  await expect(page.locator("#bugdrop-homepage-demo")).toHaveAttribute("data-radius", "10");
  await expect(page.locator("#bugdrop-homepage-demo")).toHaveAttribute("data-color", "#7dcfff");
  await expect(page.locator("[data-bugdrop-flow]")).toHaveCount(0);

  await classicHost.getByLabel("Title").fill("Classic homepage proof");
  await classicHost.getByLabel("Description").fill("Classic details stay independent.");
  const includeScreenshot = classicHost.getByLabel(/Include a screenshot/);
  await expect(includeScreenshot).toBeChecked();
  const classicSubmit = classicHost.getByRole("button", { name: "Continue" });
  expect(await classicSubmit.evaluate((button) => getComputedStyle(button).backgroundColor))
    .toBe("rgb(125, 207, 255)");
  await classicSubmit.click();

  const classicCapture = page.locator("#bugdrop-host .bd-overlay");
  await expect(classicCapture.getByRole("heading", { name: "Capture Screenshot" })).toBeVisible();
  await classicCapture.getByRole("button", { name: "Full Page" }).click();
  await expect(classicCapture.getByRole("heading", { name: "Review Screenshot" })).toBeVisible({
    timeout: 30_000,
  });
  await classicCapture.getByRole("button", { name: "Submit Feedback" }).click();

  await expect(classicHost.getByRole("heading", { name: "Feedback Submitted!" })).toBeVisible();
  await expect(classicHost).toContainText("Your feedback has been submitted successfully.");
  await expect(classicHost.getByRole("link", { name: "View on GitHub" })).toHaveCount(0);
  await expect(classicHost).not.toContainText(/Issue #\d+ has been created\./);
  expect(harness.submissions).toHaveLength(1);
  expect(harness.submissions[0]).toMatchObject({
    url: `${origin}${runtimePath}/api/feedback`,
    body: {
      repo,
      title: "Classic homepage proof",
      description: "Classic details stay independent.",
      screenshot: expect.stringMatching(/^data:image\/png;base64,/),
    },
  });
  await classicHost.getByRole("button", { name: "Done" }).click();
  await expect(classicLauncher).toBeFocused();
  await expect(page.getByRole("radio", { name: /General Feedback.*Classic/ })).toBeChecked();
  await expect(page.locator("[data-bugdrop-flow]")).toHaveCount(0);
  harness.assertClean();
});

test("keeps the actual local Classic result private and truthful", async ({ page }, testInfo) => {
  test.setTimeout(90_000);
  test.skip(testInfo.project.name !== "desktop-chromium");
  enabledOnly(testInfo);
  const externalRequests: string[] = [];
  const feedbackResponses: Array<Record<string, unknown>> = [];

  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (
      (url.protocol === "http:" || url.protocol === "https:") &&
      url.origin !== origin
    ) {
      externalRequests.push(route.request().url());
      await route.abort("blockedbyclient");
      return;
    }
    await route.continue();
  });
  page.on("response", async (response) => {
    if (
      response.request().method() === "POST" &&
      response.url() === `${origin}${runtimePath}/api/feedback`
    ) {
      feedbackResponses.push(await response.json() as Record<string, unknown>);
    }
  });
  await page.goto("/");

  await expect(page.getByText(/Local dogfood submissions stay in this development process/))
    .toContainText("they do not create a public GitHub Issue");
  await expect(page.getByText(/Demo submissions create a real public GitHub Issue/)).toHaveCount(0);

  await page.getByRole("button", { name: "Open General Feedback" }).click();
  const configuredRuntime = process.env.NEXT_PUBLIC_BUGDROP_WIDGET_URL;
  if (configuredRuntime?.includes("BUGDROP.LOCALHOST")) {
    await expect(page.locator("script#bugdrop-homepage-demo")).toHaveAttribute(
      "src",
      configuredRuntime,
    );
  }
  const classicHost = page.locator("#bugdrop-host");
  await classicHost.getByLabel("Title").fill("Private local Classic proof");
  await classicHost.getByLabel("Description").fill("This result stays in local memory.");
  await classicHost.getByLabel(/Include a screenshot/).uncheck();
  await classicHost.getByRole("button", { name: "Continue", exact: true }).click();

  await expect(classicHost.getByRole("heading", { name: "Feedback Submitted!" })).toBeVisible();
  await expect(classicHost).toContainText("Your feedback has been submitted successfully.");
  await expect(classicHost.getByRole("link", { name: "View on GitHub" })).toHaveCount(0);
  await expect(classicHost).not.toContainText(/Issue #\d+ has been created\./);
  await expect.poll(() => feedbackResponses).toHaveLength(1);
  expect(feedbackResponses[0]).toMatchObject({
    success: true,
    issueUrl: expect.stringMatching(
      new RegExp(`^https://github\\.com/${repo}/issues/\\d+$`),
    ),
    isPublic: false,
  });
  expect(externalRequests).toEqual([]);
});

test("classifies the uppercase-host exact runtime as private", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium");
  enabledOnly(testInfo);
  const configuredRuntime = process.env.NEXT_PUBLIC_BUGDROP_WIDGET_URL;
  const uppercaseHostRuntime = `http://BUGDROP.LOCALHOST:3000${runtimePath}/widget.js`;
  test.skip(
    configuredRuntime !== uppercaseHostRuntime,
    "requires the focused uppercase-host runtime",
  );

  await page.goto("/");

  await expect(page.getByText(/Local dogfood submissions stay in this development process/))
    .toContainText("they do not create a public GitHub Issue");
  await expect(page.getByText(/Demo submissions create a real public GitHub Issue/)).toHaveCount(0);
  await page.getByRole("button", { name: "Open General Feedback" }).click();
  await expect(page.locator("script#bugdrop-homepage-demo")).toHaveAttribute(
    "src",
    uppercaseHostRuntime,
  );
});

test("discloses the exact public v1.56.3 runtime as public", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium");
  enabledOnly(testInfo);
  const configuredRuntime = process.env.NEXT_PUBLIC_BUGDROP_WIDGET_URL;
  const publicRuntime = "https://bugdrop.neonwatty.workers.dev/widget.v1.56.3.js";
  test.skip(
    configuredRuntime !== publicRuntime,
    "requires the focused exact public v1.56.3 runtime",
  );

  await page.goto("/");

  await expect(page.getByText(/Demo submissions create a real public GitHub Issue/)).toBeVisible();
  await expect(page.getByText(/Local dogfood submissions stay in this development process/))
    .toHaveCount(0);
  await page.getByRole("button", { name: "Open General Feedback" }).click();
  await expect(page.locator("script#bugdrop-homepage-demo")).toHaveAttribute(
    "src",
    publicRuntime,
  );
});

test("renders a GitHub link only for an explicitly public result", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium");
  enabledOnly(testInfo);
  const harness = installLocalBugDropHarness(page, { issueBase: 9150, publicResult: true });
  await page.goto("/");

  await chooseInPage(page, "Quick Rating");
  const quick = page.locator('[data-bugdrop-flow="quick-rating"]');
  await quick.getByRole("radio", { name: "5 stars" }).click();
  await quick.getByRole("button", { name: "Send rating", exact: true }).click();

  await expect(quick.getByRole("heading", { name: "Rating received" })).toBeVisible();
  await expect(quick.getByRole("link", { name: "View GitHub Issue" })).toHaveAttribute(
    "href",
    `https://github.com/${repo}/issues/9151`,
  );
  expect(harness.submissions).toHaveLength(1);
  harness.assertClean();
});

test("opens Classic directly and restores the floating launcher focus", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium");
  test.skip(process.env.NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO_ENABLED !== "true");

  await page.route("**/check/**", (route) =>
    route.fulfill({ contentType: "application/json", body: '{"installed":true,"appName":"BugDrop"}' }),
  );
  await page.route("**/feedback", (route) => route.abort());
  await page.goto("/");

  const launcher = page.getByRole("button", { name: "Open BugDrop feedback" });
  await launcher.click();

  const classic = page.locator("#bugdrop-host");
  await expect(classic.getByRole("heading", { name: "Send Feedback" })).toBeVisible();
  await expect(page.locator("[data-bugdrop-flow]")).toHaveCount(0);
  await expect(launcher).toBeDisabled();
  await classic.getByRole("button", { name: "×" }).click();
  await expect(classic.getByRole("heading", { name: "Send Feedback" })).toHaveCount(0);
  await expect(launcher).toBeFocused();
});

test("animates Feature Request forward and back for 500 ms and honors reduced motion", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium");
  enabledOnly(testInfo);
  const harness = installLocalBugDropHarness(page);
  await page.goto("/");

  await chooseInPage(page, "Feature Request");
  let feature = page.locator('[data-bugdrop-flow="feature-request"]');
  await expect(feature.getByRole("dialog", { name: "Request a feature" })).toBeVisible();
  await feature.getByRole("button", { name: "Shape idea" }).click();

  const transition = feature.locator(".bdf-transitioning");
  await expect(transition).toHaveCount(1);
  await expect(feature.locator(".bdf-slide-forward-exit")).toHaveCount(1);
  await expect(feature.locator(".bdf-slide-forward-enter")).toHaveCount(1);
  await expect(transition).toHaveCSS("--bdf-screen-transition-duration", "500ms");
  await expect(transition).toHaveCount(0, { timeout: 2_000 });
  await expect(feature.getByRole("heading", { name: "Shape the opportunity" })).toBeVisible();

  await feature.getByRole("button", { name: "Back" }).click();
  await expect(feature.locator(".bdf-slide-backward-exit")).toHaveCount(1);
  await expect(feature.locator(".bdf-slide-backward-enter")).toHaveCount(1);
  await expect(transition).toHaveCount(0, { timeout: 2_000 });
  await expect(feature.getByRole("heading", { name: "Request a feature" })).toBeVisible();
  await feature.getByRole("button", { name: "Close" }).click();

  await page.emulateMedia({ reducedMotion: "reduce" });
  await chooseInPage(page, "Feature Request");
  feature = page.locator('[data-bugdrop-flow="feature-request"]');
  await feature.getByRole("button", { name: "Shape idea" }).click();
  await expect(feature.locator(".bdf-transitioning")).toHaveCount(0);
  await expect(feature.locator('[class*="bdf-slide-"]')).toHaveCount(0);
  await expect(feature.getByRole("heading", { name: "Shape the opportunity" })).toBeVisible();
  await feature.getByRole("button", { name: "Back" }).click();
  await expect(feature.locator(".bdf-transitioning")).toHaveCount(0);
  await expect(feature.getByRole("heading", { name: "Request a feature" })).toBeVisible();
  await feature.getByRole("button", { name: "Close" }).click();
  expect(harness.submissions).toHaveLength(0);
  harness.assertClean();
});

test("enforces evidence and submits Bug Report through its isolated mock", async ({ page }, testInfo) => {
  test.setTimeout(120_000);
  test.skip(testInfo.project.name !== "desktop-chromium");
  enabledOnly(testInfo);
  const harness = installLocalBugDropHarness(page, {
    failOnceForTitle: "Bug: Settings save is broken",
    issueBase: 9200,
  });
  await page.goto("/");

  const launcher = await chooseInPage(page, "Bug Report");
  const bug = page.locator('[data-bugdrop-flow="bug-report"]');
  await expect(bug.getByRole("dialog", { name: "Report a bug" })).toBeVisible();
  await bug.getByRole("button", { name: "Describe bug" }).click();
  await bug.getByLabel("Summary").fill("Settings save is broken");
  await bug.getByLabel("Steps to reproduce").fill("Open settings, change a value, then save.");
  await bug.getByRole("button", { name: "Add evidence" }).click();

  const evidenceAdvance = bug.getByRole("button", { name: /Continue|Submit/ });
  await evidenceAdvance.click();
  await expect(bug.getByText("Select at least one attachment.")).toBeVisible();
  await expect(bug.getByRole("heading", { name: "Attach proof" })).toBeVisible();
  expect(harness.submissions).toHaveLength(0);

  await bug.locator('input[type="file"]').setInputFiles({
    name: "settings-proof.png",
    mimeType: "image/png",
    buffer: Buffer.from("homepage attachment proof"),
  });
  await bug.getByLabel("Your name").fill("Homepage QA");
  await evidenceAdvance.click();
  await expect(bug.getByRole("heading", { name: "Capture the breakage" })).toBeVisible();
  await bug.getByRole("button", { name: /Continue|Submit/ }).click();

  const capture = page.locator("#bugdrop-host .bd-overlay");
  await expect(capture.getByRole("heading", { name: "Capture Screenshot" })).toBeVisible();
  await expect(capture.getByRole("button", { name: "Skip Screenshot" })).toHaveCount(0);
  expect(harness.submissions).toHaveLength(0);
  await capture.getByRole("button", { name: "×" }).click();
  await expect(bug.getByRole("heading", { name: "Attach proof" })).toBeVisible();
  await expect(bug.getByText("settings-proof.png")).toBeVisible();
  expect(harness.submissions).toHaveLength(0);
  await bug.getByRole("button", { name: /Continue|Submit/ }).click();
  await expect(bug.getByRole("heading", { name: "Capture the breakage" })).toBeVisible();
  await bug.getByRole("button", { name: /Continue|Submit/ }).click();
  await capture.getByRole("button", { name: "Full Page" }).click();
  await expect(capture.getByRole("heading", { name: "Review Screenshot" })).toBeVisible({
    timeout: 30_000,
  });
  await capture.getByRole("button", { name: "Submit Feedback" }).click();

  await expect(bug.getByText("Intentional retry proof")).toBeVisible();
  const firstAttempt = harness.submissions[0]?.body;
  expect(firstAttempt).toMatchObject({
    repo,
    title: "Bug: Settings save is broken",
    description:
      "## Steps\n\n> Open settings, change a value, then save.\n\n## Surface\n\nsettings\n\n## Build\n\n`2026.08.15`",
    submitter: { name: "Homepage QA" },
  });
  expect(firstAttempt.attachments).toEqual([
    expect.objectContaining({ name: "settings-proof.png", type: "image/png" }),
  ]);
  expect(firstAttempt.screenshot).toEqual(expect.stringMatching(/^data:image\/png;base64,/));
  await bug.getByRole("button", { name: "Try Again" }).click();
  await expect(bug.getByRole("heading", { name: "Bug captured" })).toBeVisible();
  await expect(bug.getByRole("link", { name: "View GitHub Issue" })).toHaveCount(0);
  await expect(bug).not.toContainText(/Issue #\d+/);
  expect(harness.submissions).toHaveLength(2);
  expect(harness.submissions[1]?.body).toMatchObject({
    title: firstAttempt.title,
    description: firstAttempt.description,
    attachments: firstAttempt.attachments,
    screenshot: firstAttempt.screenshot,
  });
  await bug.getByRole("button", { name: "Done" }).click();
  await expect(launcher).toBeFocused();
  harness.assertClean();
});

test("submits a structured Feature Request in an isolated journey", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium");
  enabledOnly(testInfo);
  const harness = installLocalBugDropHarness(page, { issueBase: 9300 });
  await page.goto("/");

  const launcher = await chooseInPage(page, "Feature Request");
  const feature = page.locator('[data-bugdrop-flow="feature-request"]');
  await feature.getByRole("button", { name: "Shape idea" }).click();
  await feature.getByLabel("Integration").click();
  await feature.getByLabel("Idea in one sentence").fill("Connect release notes to Slack");
  await feature.getByRole("button", { name: "Add context" }).click();
  await feature.getByLabel("Why would this help?").fill("Keep customer teams current without copying updates.");
  await feature.getByRole("button", { name: "Set priority" }).click();
  await feature.getByLabel("Important").click();
  await feature.getByRole("button", { name: "Send idea" }).click();

  await expect(feature.getByRole("heading", { name: "Idea shared" })).toBeVisible();
  await expect(feature.getByRole("link", { name: "View GitHub Issue" })).toHaveCount(0);
  await expect(feature).not.toContainText(/Issue #\d+/);
  expect(harness.submissions).toHaveLength(1);
  expect(harness.submissions[0]?.body).toMatchObject({
    repo,
    title: "Feature: Connect release notes to Slack",
    category: "feature",
    description:
      "## Area\n\nIntegration\n\n## Opportunity\n\nKeep customer teams current without copying updates.\n\n## Potential impact\n\nImportant",
  });
  await feature.getByRole("button", { name: "Done" }).click();
  await expect(launcher).toBeFocused();
  harness.assertClean();
});

test("submits a one-step Quick Rating with cumulative stars", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium");
  enabledOnly(testInfo);
  const harness = installLocalBugDropHarness(page, { issueBase: 9400 });
  await page.goto("/");

  const launcher = await chooseInPage(page, "Quick Rating");
  const quick = page.locator('[data-bugdrop-flow="quick-rating"]');
  const rating = quick.getByRole("radiogroup", { name: "Overall rating" });
  await rating.getByRole("radio", { name: "4 stars" }).hover();
  for (let value = 1; value <= 4; value += 1) {
    await expect(rating.getByRole("radio", { name: `${value} ${value === 1 ? "star" : "stars"}` }))
      .toHaveClass(/bdv-rating-option--preview/);
  }
  await expect(rating.getByRole("radio", { name: "5 stars" }))
    .not.toHaveClass(/bdv-rating-option--preview/);
  await rating.getByRole("radio", { name: "4 stars" }).click();
  for (let value = 1; value <= 4; value += 1) {
    await expect(rating.getByRole("radio", { name: `${value} ${value === 1 ? "star" : "stars"}` }))
      .toHaveClass(/bdv-rating-option--active/);
  }
  await expect(rating.getByRole("radio", { name: "5 stars" }))
    .not.toHaveClass(/bdv-rating-option--active/);
  await quick.getByRole("button", { name: "Send rating" }).click();
  await expect(quick.getByRole("heading", { name: "Rating received" })).toBeVisible();
  await expect(quick.getByRole("link", { name: "View GitHub Issue" })).toHaveCount(0);
  await expect(quick).not.toContainText(/Issue #\d+/);
  expect(harness.submissions).toHaveLength(1);
  expect(harness.submissions[0]?.body).toMatchObject({
    repo,
    title: "Experience rating 4/5",
    category: "question",
    description: "## Rating\n\n★★★★☆ (4/5)",
  });
  await quick.getByRole("button", { name: "Done" }).click();
  await expect(launcher).toBeFocused();
  harness.assertClean();
});

test("does not open an orphan Flow after navigation during a delayed runtime load", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium");
  test.skip(process.env.NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO_ENABLED !== "true");

  let checkRequests = 0;
  let feedbackRequests = 0;
  let releaseScript: (() => void) | undefined;
  let noteScriptRequested: () => void;
  const scriptRequested = new Promise<void>((resolve) => {
    noteScriptRequested = resolve;
  });
  await page.route("**/vendor/bugdrop/**/widget.js", async (route) => {
    noteScriptRequested();
    await new Promise<void>((release) => {
      releaseScript = release;
    });
    await route.fulfill({ contentType: "application/javascript", body: "" });
  });
  await page.route("**/check/**", (route) => {
    checkRequests += 1;
    return route.fulfill({
      contentType: "application/json",
      body: '{"installed":true,"appName":"BugDrop"}',
    });
  });
  await page.route("**/feedback", (route) => {
    feedbackRequests += 1;
    return route.abort();
  });
  await page.goto("/");
  const initialOverflow = await page.evaluate(() => ({
    body: document.body.style.overflow,
    html: document.documentElement.style.overflow,
  }));

  await page.getByRole("radio", { name: "Bug Report" }).check();
  await page.getByRole("button", { name: "Open Bug Report" }).click();
  await scriptRequested;
  await page.getByRole("link", { name: "Explore the building blocks" }).click();
  await expect(page).toHaveURL(/\/labs\/variants$/);
  await page.evaluate(() => {
    const addOrphan = () => {
      const host = document.createElement("div");
      host.dataset.bugdropInstance = "orphan-flow";
      document.body.style.overflow = "hidden";
      document.body.append(host);
      return {
        instanceId: "orphan-flow",
        close() {
          host.remove();
          document.body.style.removeProperty("overflow");
        },
        result: new Promise(() => undefined),
      };
    };
    (window as unknown as { BugDrop?: unknown }).BugDrop = {
      open() {},
      close() {},
      registerFlow(config: { id: string }) {
        return { id: config.id, open: addOrphan };
      },
    };
    document.dispatchEvent(new CustomEvent("bugdrop:ready"));
  });
  if (!releaseScript) throw new Error("The delayed pinned runtime did not become releasable.");
  releaseScript();

  await expect(page.getByRole("heading", { name: "Build feedback your way." })).toBeVisible();
  await expect(page.locator("[data-bugdrop-flow], [data-bugdrop-instance]")).toHaveCount(0);
  await expect(page.locator(".bd-modal, .bd-trigger")).toHaveCount(0);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect
    .poll(() =>
      page.evaluate(() => ({
        body: document.body.style.overflow,
        html: document.documentElement.style.overflow,
      })),
    )
    .toEqual(initialOverflow);
  expect(checkRequests).toBe(0);
  expect(feedbackRequests).toBe(0);
});

test("does not resume a cancelled Classic modal after delayed preflight navigation", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium");
  test.skip(process.env.NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO_ENABLED !== "true");

  let releaseCheck!: () => void;
  let noteCheckStarted!: () => void;
  const checkStarted = new Promise<void>((resolve) => {
    noteCheckStarted = resolve;
  });
  await page.route(`**${runtimePath}/api/check/${repo}`, async (route) => {
    noteCheckStarted();
    await new Promise<void>((resolve) => {
      releaseCheck = resolve;
    });
    await route.fulfill({
      contentType: "application/json",
      body: '{"installed":true,"appName":"BugDrop"}',
    });
  });
  await page.goto("/");
  const initialOverflow = await page.evaluate(() => document.body.style.overflow);

  await page.getByRole("button", { name: "Open General Feedback" }).click();
  await checkStarted;
  await page.getByRole("navigation").getByRole("link", { name: "Docs", exact: true }).click();
  await expect(page).toHaveURL(`${origin}/docs`);
  releaseCheck();

  await expect(page.getByRole("heading", { name: "Getting Started" })).toBeVisible();
  await expect(page.locator("#bugdrop-host").getByRole("heading", { name: "Send Feedback" }))
    .toHaveCount(0);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe(initialOverflow);
});

test("keeps one active owner and tears capture down on client navigation", async ({ page }, testInfo) => {
  test.setTimeout(90_000);
  test.skip(testInfo.project.name !== "desktop-chromium");
  enabledOnly(testInfo);
  const harness = installLocalBugDropHarness(page);
  await page.goto("/");
  const initialOverflow = await page.evaluate(() => ({
    body: document.body.style.overflow,
    html: document.documentElement.style.overflow,
  }));

  await page.getByRole("radio", { name: "Bug Report" }).check();
  const openBug = page.getByRole("button", { name: "Open Bug Report" });
  await openBug.evaluate((button: HTMLButtonElement) => {
    button.click();
    button.click();
    button.click();
  });
  const bug = page.locator('[data-bugdrop-flow="bug-report"]');
  await expect(bug).toHaveCount(1);
  await expect(page.locator("[data-bugdrop-flow], [data-bugdrop-instance]")).toHaveCount(1);
  await bug.getByRole("button", { name: "Close" }).click();
  await expect(bug).toHaveCount(0);

  await chooseInPage(page, "Bug Report");
  await bug.getByRole("button", { name: "Describe bug" }).click();
  await bug.getByLabel("Summary").fill("Capture navigation teardown");
  await bug.getByLabel("Steps to reproduce").fill("Open the flow and navigate during capture.");
  await bug.getByRole("button", { name: "Add evidence" }).click();
  await bug.locator('input[type="file"]').setInputFiles({
    name: "capture-proof.png",
    mimeType: "image/png",
    buffer: Buffer.from("capture teardown proof"),
  });
  await bug.getByRole("button", { name: /Continue|Submit/ }).click();
  await bug.getByRole("button", { name: /Continue|Submit/ }).click();
  const capture = page.locator("#bugdrop-host .bd-overlay");
  await expect(capture.getByRole("heading", { name: "Capture Screenshot" })).toBeVisible();
  await page.locator('a[href="/docs"]').first().evaluate((link: HTMLAnchorElement) => link.click());
  await page.waitForURL("**/docs");
  await expect(page.getByRole("heading", { name: "Getting Started" })).toBeVisible();
  await expect(page.locator("[data-bugdrop-flow], [data-bugdrop-instance]")).toHaveCount(0);
  await expect(page.locator("#bugdrop-host .bd-overlay")).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => ({
    body: document.body.style.overflow,
    html: document.documentElement.style.overflow,
  }))).toEqual(initialOverflow);
  expect(harness.submissions).toHaveLength(0);
  harness.assertClean();
});

test("tears down a submitted Flow on client navigation", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium");
  enabledOnly(testInfo);
  const harness = installLocalBugDropHarness(page);
  await page.goto("/");
  const initialOverflow = await page.evaluate(() => document.body.style.overflow);
  await chooseInPage(page, "Quick Rating");
  const quick = page.locator('[data-bugdrop-flow="quick-rating"]');
  await quick.getByRole("radio", { name: "4 stars" }).click();
  await quick.getByRole("button", { name: "Send rating", exact: true }).click();
  await expect(quick.getByRole("heading", { name: "Rating received" })).toBeVisible();
  expect(harness.submissions).toHaveLength(1);
  await page.locator('a[href="/docs"]').first().evaluate((link: HTMLAnchorElement) => link.click());
  await page.waitForURL("**/docs");
  await expect(page.getByRole("heading", { name: "Getting Started" })).toBeVisible();
  await expect(page.locator("[data-bugdrop-flow], [data-bugdrop-instance]")).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe(initialOverflow);
  harness.assertClean();
});

test("supports the direct keyboard launcher and mobile focus containment without overflow", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium");
  enabledOnly(testInfo);
  const harness = installLocalBugDropHarness(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

  const floating = page.getByRole("button", { name: "Open BugDrop feedback" });
  await floating.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("radio", { name: /General Feedback.*Classic/ })).toBeChecked();
  const keyboardClassic = page.locator("#bugdrop-host");
  await expect(keyboardClassic.getByRole("heading", { name: "Send Feedback" })).toBeVisible();
  await keyboardClassic.getByRole("button", { name: "×" }).click();
  await expect(keyboardClassic.getByRole("heading", { name: "Send Feedback" })).toHaveCount(0);
  await expect(floating).toBeFocused();

  await page.keyboard.press("Enter");
  await expect(keyboardClassic.getByRole("heading", { name: "Send Feedback" })).toBeVisible();
  await keyboardClassic.getByRole("button", { name: "×" }).click();
  await expect(keyboardClassic.getByRole("heading", { name: "Send Feedback" })).toHaveCount(0);
  await expect(floating).toBeFocused();
  expect(await floating.evaluate((element) => ({
    reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
    transitionProperty: getComputedStyle(element).transitionProperty,
    transform: getComputedStyle(element).transform,
  }))).toEqual({ reduced: true, transitionProperty: "none", transform: "none" });

  const picker = page.getByRole("group", { name: "Feedback experience" });
  await picker.scrollIntoViewIfNeeded();
  await expect(floating).toHaveAttribute("data-in-page-chooser-visible", "true");
  await expect(floating).toHaveCSS("opacity", "0");
  await expect(floating).toHaveCSS("pointer-events", "none");

  const inPageLauncher = await chooseInPage(page, "Quick Rating");
  const quick = page.locator('[data-bugdrop-flow="quick-rating"]');
  const dialog = quick.getByRole("dialog", { name: "How was this experience?" });
  await expect(dialog).toBeVisible();
  const close = dialog.getByRole("button", { name: "Close" });
  const submit = dialog.getByRole("button", { name: "Send rating", exact: true });
  await close.focus();
  await expectComposedShadowFocus(close);
  await close.press("Shift+Tab");
  await expectComposedShadowFocus(submit);
  await submit.press("Tab");
  await expectComposedShadowFocus(close);
  const bounds = await dialog.boundingBox();
  expect(bounds?.width).toBeLessThanOrEqual(390);
  await page.keyboard.press("Escape");
  await expect(quick).toHaveCount(0);
  await expect(inPageLauncher).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(harness.submissions).toHaveLength(0);
  harness.assertClean();
});

test("keeps the floating launcher concealed while an in-page mobile launch loads", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium");
  enabledOnly(testInfo);

  let releaseRuntime: (() => void) | undefined;
  let noteRuntimeRequested: () => void;
  const runtimeRequested = new Promise<void>((resolve) => {
    noteRuntimeRequested = resolve;
  });
  await page.route(`**${runtimePath}/widget.js`, async (route) => {
    noteRuntimeRequested();
    await new Promise<void>((resolve) => {
      releaseRuntime = resolve;
    });
    await route.continue();
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const picker = page.getByRole("group", { name: "Feedback experience" });
  const floating = page.getByRole("button", { name: "Open BugDrop feedback" });
  await picker.scrollIntoViewIfNeeded();
  await expect(floating).toHaveAttribute("data-in-page-chooser-visible", "true");
  await page.getByRole("radio", { name: "Quick Rating" }).check();
  await page.getByRole("button", { name: "Open Quick Rating" }).click();
  await runtimeRequested;

  await expect(floating).toBeDisabled();
  await expect(floating).toHaveAttribute("data-in-page-chooser-visible", "true");
  await expect(floating).toHaveCSS("opacity", "0");
  await expect(floating).toHaveCSS("pointer-events", "none");

  if (!releaseRuntime) throw new Error("The delayed homepage runtime was not requested.");
  releaseRuntime();
  const quick = page.locator('[data-bugdrop-flow="quick-rating"]');
  await expect(quick.getByRole("dialog", { name: "How was this experience?" })).toBeVisible();
  await expect(floating).toHaveAttribute("data-in-page-chooser-visible", "true");
  await page.keyboard.press("Escape");
  await expect(quick).toHaveCount(0);
});
