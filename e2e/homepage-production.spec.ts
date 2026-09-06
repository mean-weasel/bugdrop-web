import { expect, test } from "@playwright/test";

test("production homepage loads its responsive hero styles", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const title = page.getByRole("heading", { level: 1 });
  const hero = page.locator("header").filter({ has: title });
  const preview = page.getByRole("figure", { name: "Example report from the BugDrop widget to a GitHub Issue" });
  const install = hero.getByRole("link", { name: "Install on GitHub", exact: true });
  await expect(hero).toHaveCSS("display", "grid");
  await expect(install).toHaveCSS("display", "flex");
  const headingSize = await title.evaluate(el => parseFloat(getComputedStyle(el).fontSize));
  expect(headingSize).toBeGreaterThanOrEqual(30);
  const headingBox = await title.boundingBox();
  const previewBox = await preview.boundingBox();
  expect(headingBox).not.toBeNull();
  expect(previewBox).not.toBeNull();
  const width = page.viewportSize()!.width;
  if (width >= 768) {
    expect(previewBox!.x).toBeGreaterThan(headingBox!.x + headingBox!.width);
  } else {
    expect(previewBox!.y).toBeGreaterThan(headingBox!.y + headingBox!.height);
  }
  expect(previewBox!.width).toBeLessThanOrEqual(455);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  const screenshot = preview.getByRole("img");
  await expect(screenshot).toBeVisible();
  expect(await screenshot.evaluate(el => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
});
