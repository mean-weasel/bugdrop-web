import { expect, test } from "@playwright/test";

test("exposes the homepage feedback experience picker", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium");
  test.skip(process.env.NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO_ENABLED !== "true");

  await page.goto("/");
  await page.getByRole("button", { name: "Try BugDrop experiences" }).click();

  const menu = page.getByRole("menu", { name: "Feedback experience" });
  await expect(menu.getByRole("menuitemradio")).toHaveCount(4);
  await expect(
    menu.getByRole("menuitemradio", { name: /General Feedback.*Classic/ }),
  ).toHaveAttribute("aria-checked", "true");
  await expect(
    page.getByRole("link", { name: "Explore the building blocks" }),
  ).toHaveAttribute("href", "/labs/variants");
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
