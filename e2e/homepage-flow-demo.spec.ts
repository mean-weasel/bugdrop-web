import {
  expect,
  test,
  type Locator,
  type Page,
} from "@playwright/test";

const origin = process.env.HOMEPAGE_E2E_ORIGIN ?? "http://bugdrop.localhost:3000";
const runtimePath =
  "/vendor/bugdrop/81293491bf9924879465c668a391a5e4aeae912d";
const repo = "mean-weasel/bugdrop-widget-test";

type Submission = Readonly<{
  url: string;
  body: Record<string, unknown>;
}>;

function installLocalBugDropHarness(
  page: Page,
  options: { failOnceForTitle?: string; issueBase?: number } = {},
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
          isPublic: true,
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

test("exposes the homepage feedback experience picker", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium");
  test.skip(process.env.NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO_ENABLED !== "true");

  await page.goto("/");
  await page.getByRole("button", { name: "Try BugDrop experiences" }).click();

  const menu = page.getByRole("menu", { name: "Feedback experience" });
  await expect(menu.getByRole("menuitemradio")).toHaveCount(4);
  await expect(menu).toContainText("The familiar screenshot-first feedback widget.");
  await expect(menu).toContainText("Capture a reproducible problem with evidence.");
  await expect(menu).toContainText("Route product signals with conditional follow-up.");
  await expect(menu).toContainText("Ask a focused customer satisfaction question.");
  await expect(
    menu.getByRole("menuitemradio", { name: /General Feedback.*Classic/ }),
  ).toHaveAttribute("aria-checked", "true");
  await expect(
    page.getByRole("link", { name: "Explore the building blocks" }),
  ).toHaveAttribute("href", "/labs/variants");
});

test("fails visibly after a client navigation leaves a foreign runtime active", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium");
  test.skip(process.env.NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO_ENABLED !== "true");

  await page.goto("/labs/variants");
  await expect(page.getByRole("button", { name: "Run default-shaped flow" })).toBeEnabled();
  await page.getByRole("link", { name: "BugDrop", exact: true }).click();
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
  await page.getByRole("link", { name: "BugDrop", exact: true }).click();
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

  await expect(page.getByRole("button", { name: "Try BugDrop experiences" })).toHaveCount(0);
  await page.getByRole("button", { name: "Open Feedback demo" }).click();
  await expect(page.locator("body")).toHaveAttribute("data-classic-demo-opened", "true");
});

test("submits the independent Classic journey through the local mock", async ({ page }, testInfo) => {
  test.setTimeout(90_000);
  test.skip(testInfo.project.name !== "desktop-chromium");
  enabledOnly(testInfo);
  const harness = installLocalBugDropHarness(page);
  await page.goto("/");

  const floatingLauncher = page.getByRole("button", { name: "Try BugDrop experiences" });
  await floatingLauncher.click();
  await page
    .getByRole("menu", { name: "Feedback experience" })
    .getByRole("menuitemradio", { name: /General Feedback.*Classic/ })
    .click();

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
  await expect(classicHost.getByRole("link", { name: "View on GitHub" })).toHaveAttribute(
    "href",
    `https://github.com/${repo}/issues/9101`,
  );
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
  await expect(floatingLauncher).toBeFocused();
  await floatingLauncher.click();
  await expect(
    page
      .getByRole("menu", { name: "Feedback experience" })
      .getByRole("menuitemradio", { name: /General Feedback.*Classic/ }),
  ).toHaveAttribute("aria-checked", "true");
  await expect(page.locator("[data-bugdrop-flow]")).toHaveCount(0);
  harness.assertClean();
});

test("opens one selected Flow and restores the floating launcher focus", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium");
  test.skip(process.env.NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO_ENABLED !== "true");

  await page.route("**/check/**", (route) =>
    route.fulfill({ contentType: "application/json", body: '{"installed":true,"appName":"BugDrop"}' }),
  );
  await page.route("**/feedback", (route) => route.abort());
  await page.goto("/");

  const launcher = page.getByRole("button", { name: "Try BugDrop experiences" });
  await launcher.click();
  await page
    .getByRole("menu", { name: "Feedback experience" })
    .getByRole("menuitemradio", { name: "Bug Report" })
    .click();

  const flow = page.locator('[data-bugdrop-instance]');
  await expect(flow).toHaveCount(1);
  await expect(launcher).toBeDisabled();
  await page.getByRole("button", { name: "Close" }).click();
  await expect(flow).toHaveCount(0);
  await expect(launcher).toBeFocused();
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
  await expect(bug.getByRole("dialog", { name: "Report a problem" })).toBeVisible();
  await bug.getByRole("button", { name: "Start report" }).click();
  await bug.getByLabel("Summary").fill("Settings save is broken");
  await bug.getByLabel("Steps to reproduce").fill("Open settings, change a value, then save.");
  await bug.getByRole("button", { name: "Add evidence" }).click();

  const evidenceAdvance = bug.getByRole("button", { name: /Continue|Submit/ });
  await evidenceAdvance.click();
  await expect(bug.getByText("Select at least one attachment.")).toBeVisible();
  await expect(bug.getByRole("heading", { name: "Evidence and contact" })).toBeVisible();
  expect(harness.submissions).toHaveLength(0);

  await bug.locator('input[type="file"]').setInputFiles({
    name: "settings-proof.png",
    mimeType: "image/png",
    buffer: Buffer.from("homepage attachment proof"),
  });
  await bug.getByLabel("Your name").fill("Homepage QA");
  await evidenceAdvance.click();
  await expect(bug.getByRole("heading", { name: "Show us the problem" })).toBeVisible();
  await bug.getByRole("button", { name: /Continue|Submit/ }).click();

  const capture = page.locator("#bugdrop-host .bd-overlay");
  await expect(capture.getByRole("heading", { name: "Capture Screenshot" })).toBeVisible();
  await expect(capture.getByRole("button", { name: "Skip Screenshot" })).toHaveCount(0);
  expect(harness.submissions).toHaveLength(0);
  await capture.getByRole("button", { name: "×" }).click();
  await expect(bug.getByRole("heading", { name: "Evidence and contact" })).toBeVisible();
  await expect(bug.getByText("settings-proof.png")).toBeVisible();
  expect(harness.submissions).toHaveLength(0);
  await bug.getByRole("button", { name: /Continue|Submit/ }).click();
  await expect(bug.getByRole("heading", { name: "Show us the problem" })).toBeVisible();
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
  await expect(bug.getByRole("heading", { name: "Report received" })).toBeVisible();
  await expect(bug.getByRole("link", { name: "View GitHub Issue" })).toHaveAttribute(
    "href",
    `https://github.com/${repo}/issues/9202`,
  );
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

test("prunes hidden Product Triage answers in an isolated journey", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium");
  enabledOnly(testInfo);
  const harness = installLocalBugDropHarness(page, { issueBase: 9300 });
  await page.goto("/");

  const launcher = await chooseInPage(page, "Product Triage");
  const triage = page.locator('[data-bugdrop-flow="product-triage"]');
  await expect(triage.getByRole("dialog", { name: "Triage product feedback" })).toBeVisible();
  await triage.getByRole("button", { name: "Continue" }).click();
  await triage.getByLabel("Bug").click();
  await triage.getByRole("radio", { name: "2 stars" }).click();
  await triage.getByLabel("Summary").fill("Stale diagnostics must disappear");
  await triage.getByRole("button", { name: "Continue" }).click();
  await triage.getByLabel("What happened?").fill("hidden-diagnostics-sentinel");
  await triage.getByLabel("Chromium").click();
  await triage.getByRole("button", { name: "Continue" }).click();
  await triage.getByRole("button", { name: "Back" }).click();
  await expect(triage.getByLabel("What happened?")).toHaveValue("hidden-diagnostics-sentinel");
  await triage.getByRole("button", { name: "Back" }).click();
  await triage.getByRole("radio", { name: "5 stars" }).click();
  await triage.getByLabel("Summary").fill("A high-signal product idea");
  await triage.getByRole("button", { name: "Continue" }).click();
  await expect(triage.getByLabel("What happened?")).toHaveCount(0);
  const includeScreenshot = triage.getByLabel("Include a screenshot", { exact: true });
  await expect(includeScreenshot).toBeChecked();
  await includeScreenshot.uncheck();
  await triage.getByRole("button", { name: "Submit" }).click();

  await expect(triage.getByRole("heading", { name: "Thanks for your feedback!" })).toBeVisible();
  await expect(triage.getByRole("link", { name: "View GitHub Issue" })).toHaveAttribute(
    "href",
    `https://github.com/${repo}/issues/9301`,
  );
  expect(harness.submissions).toHaveLength(1);
  const body = harness.submissions[0]?.body;
  expect(body).toMatchObject({
    repo,
    title: "Triage: A high-signal product idea",
    description: "## Type\n\nBug\n\n## Experience\n\n★★★★★ (5/5)",
    screenshot: null,
  });
  expect(JSON.stringify(body)).not.toContain("hidden-diagnostics-sentinel");
  expect(JSON.stringify(body)).not.toContain("Chromium");
  await triage.getByRole("button", { name: "Done" }).click();
  await expect(launcher).toBeFocused();
  harness.assertClean();
});

test("submits Customer Pulse with cumulative rating behavior in isolation", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium");
  enabledOnly(testInfo);
  const harness = installLocalBugDropHarness(page, { issueBase: 9400 });
  await page.goto("/");

  const launcher = await chooseInPage(page, "Customer Pulse");
  const pulse = page.locator('[data-bugdrop-flow="customer-pulse"]');
  const rating = pulse.getByRole("radiogroup", { name: "Ease score" });
  await rating.getByRole("radio", { name: "7 stars" }).hover();
  for (let value = 1; value <= 7; value += 1) {
    await expect(rating.getByRole("radio", { name: `${value} ${value === 1 ? "star" : "stars"}` }))
      .toHaveClass(/bdv-rating-option--preview/);
  }
  await expect(rating.getByRole("radio", { name: "8 stars" }))
    .not.toHaveClass(/bdv-rating-option--preview/);
  await rating.getByRole("radio", { name: "3 stars" }).click();
  for (let value = 1; value <= 3; value += 1) {
    await expect(rating.getByRole("radio", { name: `${value} ${value === 1 ? "star" : "stars"}` }))
      .toHaveClass(/bdv-rating-option--active/);
  }
  await expect(rating.getByRole("radio", { name: "4 stars" }))
    .not.toHaveClass(/bdv-rating-option--active/);
  await pulse.getByRole("button", { name: "Continue" }).click();
  await pulse.getByLabel("What made this difficult?").fill("Invoice controls were hard to find.");
  await pulse.getByLabel("Yes").click();
  await pulse.getByLabel("I consent to a product follow-up").check();
  await pulse.getByRole("button", { name: "Send pulse" }).click();

  await expect(pulse.getByRole("heading", { name: "Pulse recorded" })).toBeVisible();
  await expect(pulse.getByRole("link", { name: "View GitHub Issue" })).toHaveAttribute(
    "href",
    `https://github.com/${repo}/issues/9401`,
  );
  expect(harness.submissions).toHaveLength(1);
  expect(harness.submissions[0]?.body).toMatchObject({
    repo,
    title: "Billing pulse 3/10",
    category: "question",
    description:
      "## Score\n\n3\n\n## Follow-up\n\nInvoice controls were hard to find.\n\n## Contact\n\nYes\n\n## Consent\n\ntrue",
  });
  await pulse.getByRole("button", { name: "Done" }).click();
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

  await chooseInPage(page, "Product Triage");
  const triage = page.locator('[data-bugdrop-flow="product-triage"]');
  await triage.getByRole("button", { name: "Continue" }).click();
  await triage.getByLabel("Bug").click();
  await triage.getByRole("radio", { name: "5 stars" }).click();
  await triage.getByLabel("Summary").fill("Capture navigation teardown");
  await triage.getByRole("button", { name: "Continue" }).click();
  await triage.getByRole("button", { name: "Submit" }).click();
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
  await chooseInPage(page, "Customer Pulse");
  const pulse = page.locator('[data-bugdrop-flow="customer-pulse"]');
  await pulse.getByRole("radio", { name: "8 stars" }).click();
  await pulse.getByRole("button", { name: "Continue" }).click();
  await expect(pulse.getByRole("heading", { name: "Pulse recorded" })).toBeVisible();
  expect(harness.submissions).toHaveLength(1);
  await page.locator('a[href="/docs"]').first().evaluate((link: HTMLAnchorElement) => link.click());
  await page.waitForURL("**/docs");
  await expect(page.getByRole("heading", { name: "Getting Started" })).toBeVisible();
  await expect(page.locator("[data-bugdrop-flow], [data-bugdrop-instance]")).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe(initialOverflow);
  harness.assertClean();
});

test("supports keyboard menu and mobile focus containment without overflow", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium");
  enabledOnly(testInfo);
  const harness = installLocalBugDropHarness(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

  const floating = page.getByRole("button", { name: "Try BugDrop experiences" });
  await floating.focus();
  await page.keyboard.press("Enter");
  const menu = page.getByRole("menu", { name: "Feedback experience" });
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("menuitemradio")).toHaveCount(4);
  const bugItem = menu.getByRole("menuitemradio", { name: "Bug Report" });
  await page.keyboard.press("ArrowDown");
  await expect(bugItem).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(menu).toBeHidden();
  await expect(page.getByRole("radio", { name: "Bug Report" })).toBeChecked();
  const keyboardFlow = page.locator('[data-bugdrop-flow="bug-report"]');
  await expect(keyboardFlow.getByRole("dialog", { name: "Report a problem" })).toBeVisible();
  await keyboardFlow.getByRole("button", { name: "Close" }).click();
  await expect(keyboardFlow).toHaveCount(0);
  await expect(floating).toBeFocused();

  await page.keyboard.press("Enter");
  await expect(menu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(floating).toBeFocused();
  expect(await floating.evaluate((element) => ({
    reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
    transitionProperty: getComputedStyle(element).transitionProperty,
    transform: getComputedStyle(element).transform,
  }))).toEqual({ reduced: true, transitionProperty: "none", transform: "none" });

  const inPageLauncher = await chooseInPage(page, "Customer Pulse");
  const pulse = page.locator('[data-bugdrop-flow="customer-pulse"]');
  const dialog = pulse.getByRole("dialog", { name: "How easy was this?" });
  await expect(dialog).toBeVisible();
  const close = dialog.getByRole("button", { name: "Close" });
  const submit = dialog.getByRole("button", { name: "Continue" });
  await close.focus();
  await expectComposedShadowFocus(close);
  await close.press("Shift+Tab");
  await expectComposedShadowFocus(submit);
  await submit.press("Tab");
  await expectComposedShadowFocus(close);
  const bounds = await dialog.boundingBox();
  expect(bounds?.width).toBeLessThanOrEqual(390);
  await page.keyboard.press("Escape");
  await expect(pulse).toHaveCount(0);
  await expect(inPageLauncher).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(harness.submissions).toHaveLength(0);
  harness.assertClean();
});
