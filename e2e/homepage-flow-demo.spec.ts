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
