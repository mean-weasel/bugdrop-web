import {
  expect,
  test,
  type BrowserContext,
  type Locator,
  type Page,
} from "@playwright/test";

const origin = "http://bugdrop.localhost:3000";
const querySentinel = "query-sentinel-must-not-escape";
const fragmentSentinel = "fragment-sentinel-must-not-escape";
const contextSentinel = "public-flow-lab-private-context";

function watchContextForEscapes(context: BrowserContext) {
  const escaped: string[] = [];
  context.on("request", (request) => {
    const url = new URL(request.url());
    if (
      (url.protocol === "http:" || url.protocol === "https:") &&
      url.origin !== origin
    ) {
      escaped.push(request.url());
    }
  });
  return escaped;
}

async function expectComposedShadowFocus(control: Locator) {
  const focusChain = await control.evaluate((element) => {
    const root = element.getRootNode() as ShadowRoot;

    return {
      shadowActiveIsControl: root.activeElement === element,
      documentActiveIsHost: document.activeElement === root.host,
      focusVisible: element.matches(":focus-visible"),
    };
  });

  expect(focusChain).toEqual({
    shadowActiveIsControl: true,
    documentActiveIsHost: true,
    focusVisible: true,
  });
}

async function openRawPayload(page: Page, launcherName: string) {
  const card = page.locator("article").filter({
    has: page.getByRole("button", { name: launcherName }),
  });
  const link = card.getByRole("link", { name: /Inspect stored payload #/ });
  await expect(link).toHaveAttribute(
    "href",
    /\/labs\/variants\/submissions\/\d+$/,
  );
  const [viewer] = await Promise.all([
    page.context().waitForEvent("page"),
    link.click(),
  ]);
  await viewer.waitForLoadState("domcontentloaded");
  expect(new URL(viewer.url()).origin).toBe(origin);
  const raw = viewer.getByTestId("raw-payload");
  await expect(raw).toBeVisible();
  const payload = JSON.parse((await raw.textContent()) ?? "null") as Record<
    string,
    unknown
  >;
  return { payload, viewer };
}

test("both pinned public flows submit only to inspectable local payloads", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium");
  const escaped = watchContextForEscapes(page.context());
  await page.goto(
    `/labs/variants?sentinel=${querySentinel}#${fragmentSentinel}`,
  );

  await expect(
    page.getByRole("heading", { name: "Build feedback your way." }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Run default-shaped flow" }),
  ).toBeEnabled();
  await expect(
    page.getByRole("button", { name: "Run product-triage flow" }),
  ).toBeEnabled();

  await page.getByRole("button", { name: "Run default-shaped flow" }).click();
  const defaultFlow = page.locator(
    '[data-bugdrop-flow="lab-default-shaped-flow"]',
  );
  await expect(
    defaultFlow.getByRole("dialog", { name: "Share feedback" }),
  ).toBeVisible();
  await defaultFlow.getByRole("button", { name: "Continue" }).click();
  await defaultFlow.getByLabel("Title").fill("Website default-shaped feedback");
  await defaultFlow
    .getByLabel("Description")
    .fill("Stored by the website inspector.");
  await defaultFlow.getByLabel("Name").fill("Website Flow Tester");
  await defaultFlow.getByRole("button", { name: "Continue" }).click();
  await defaultFlow
    .getByLabel("Include a screenshot", { exact: true })
    .uncheck();
  await defaultFlow.getByRole("button", { name: "Submit" }).click();
  await expect(
    defaultFlow.getByRole("heading", { name: "Thanks for your feedback!" }),
  ).toBeVisible();
  await expect(defaultFlow.getByRole("link")).toHaveCount(0);
  await defaultFlow.getByRole("button", { name: "Done" }).click();
  await expect(
    page.getByRole("button", { name: "Run default-shaped flow" }),
  ).toBeFocused();

  const defaultViewer = await openRawPayload(page, "Run default-shaped flow");
  expect(defaultViewer.payload).toMatchObject({
    repo: "mean-weasel/bugdrop-widget-test",
    title: "Website default-shaped feedback",
    description: "## Description\n\nStored by the website inspector.",
    category: "bug",
    screenshot: null,
    attachments: [],
    submitter: { name: "Website Flow Tester" },
    metadata: { url: `${origin}/labs/variants` },
  });
  const defaultRaw = JSON.stringify(defaultViewer.payload);
  expect(defaultRaw).not.toContain(querySentinel);
  expect(defaultRaw).not.toContain(fragmentSentinel);
  expect(defaultRaw).not.toContain(contextSentinel);
  await defaultViewer.viewer.close();

  await page.getByRole("button", { name: "Run product-triage flow" }).click();
  const triageFlow = page.locator(
    '[data-bugdrop-flow="lab-product-triage-flow"]',
  );
  await expect(
    triageFlow.getByRole("dialog", { name: "Help us prioritize" }),
  ).toBeVisible();
  await triageFlow.getByRole("button", { name: "Continue" }).click();
  await triageFlow.getByLabel("Bug").click();
  await triageFlow.getByRole("radio", { name: "1 star" }).click();
  await triageFlow.getByLabel("Summary").fill("Initial website bug");
  await triageFlow.getByRole("button", { name: "Continue" }).click();
  await triageFlow
    .getByLabel("Steps to reproduce")
    .fill("stale-hidden-answer-sentinel");
  await triageFlow.getByRole("button", { name: "Continue" }).click();
  await triageFlow.getByRole("button", { name: "Back" }).click();
  await expect(triageFlow.getByLabel("Steps to reproduce")).toHaveValue(
    "stale-hidden-answer-sentinel",
  );
  await triageFlow.getByRole("button", { name: "Back" }).click();
  await triageFlow.getByLabel("Idea").click();
  await triageFlow.getByRole("radio", { name: "5 stars" }).click();
  await triageFlow.getByLabel("Summary").fill("A website product idea");
  await expect(
    triageFlow.getByRole("button", { name: "Submit" }),
  ).toBeVisible();
  await triageFlow.getByRole("button", { name: "Submit" }).click();
  await expect(
    triageFlow.getByRole("heading", { name: "Thanks for your feedback!" }),
  ).toBeVisible();
  await expect(triageFlow.getByRole("link")).toHaveCount(0);
  await triageFlow.getByRole("button", { name: "Done" }).click();
  await expect(
    page.getByRole("button", { name: "Run product-triage flow" }),
  ).toBeFocused();

  const triageViewer = await openRawPayload(page, "Run product-triage flow");
  expect(triageViewer.payload).toMatchObject({
    repo: "mean-weasel/bugdrop-widget-test",
    title: "A website product idea",
    description: "## Type\n\nIdea\n\n## Experience\n\n★★★★★ (5/5)",
    category: "bug",
    screenshot: null,
    attachments: [],
    metadata: { url: `${origin}/labs/variants` },
  });
  const triageRaw = JSON.stringify(triageViewer.payload);
  expect(triageRaw).not.toContain("stale-hidden-answer-sentinel");
  expect(triageRaw).not.toContain(querySentinel);
  expect(triageRaw).not.toContain(fragmentSentinel);
  expect(triageRaw).not.toContain(contextSentinel);
  await triageViewer.viewer.close();

  expect(escaped).toEqual([]);
});

test("the public runtime section and dialog remain accessible at mobile width", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium");
  const escaped = watchContextForEscapes(page.context());
  await page.goto("/labs/variants");

  const heading = page.getByRole("heading", {
    name: "Run the real FlowConfig examples",
  });
  await expect(heading).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Run product-triage flow" }),
  ).toBeEnabled();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);

  await page.getByRole("button", { name: "Run product-triage flow" }).focus();
  await expect(
    page.getByRole("button", { name: "Run product-triage flow" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  const dialog = page
    .locator('[data-bugdrop-flow="lab-product-triage-flow"]')
    .getByRole("dialog", { name: "Help us prioritize" });
  await expect(dialog).toBeVisible();
  const close = dialog.getByRole("button", { name: "Close" });
  const continueButton = dialog.getByRole("button", { name: "Continue" });
  await close.focus();
  await expectComposedShadowFocus(close);
  await close.press("Tab");
  await expectComposedShadowFocus(continueButton);
  await continueButton.press("Shift+Tab");
  await expectComposedShadowFocus(close);
  await close.press("Shift+Tab");
  await expectComposedShadowFocus(continueButton);
  await continueButton.press("Tab");
  await expectComposedShadowFocus(close);
  const bounds = await dialog.boundingBox();
  expect(bounds?.width).toBeLessThanOrEqual(390);
  await close.click();
  await expect(dialog).toBeHidden();
  await expect(
    page.getByRole("button", { name: "Run product-triage flow" }),
  ).toBeFocused();
  expect(escaped).toEqual([]);
});

test("client navigation closes an active public flow and restores page scrolling", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium");
  await page.goto("/labs/variants");
  await page.getByRole("button", { name: "Run default-shaped flow" }).click();
  const host = page.locator('[data-bugdrop-flow="lab-default-shaped-flow"]');
  await expect(
    host.getByRole("dialog", { name: "Share feedback" }),
  ).toBeVisible();
  await page
    .locator('a[href="/docs"]')
    .first()
    .evaluate((link: HTMLAnchorElement) => link.click());
  await page.waitForURL("**/docs");
  await expect(
    page.getByRole("heading", { name: "Getting Started" }),
  ).toBeVisible();
  await expect(host).toHaveCount(0);
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe(
    "hidden",
  );
});
