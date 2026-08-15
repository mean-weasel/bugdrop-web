#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { chromium } from "playwright";

const require = createRequire(import.meta.url);
const args = process.argv.slice(2);
const baseUrl = args.find((arg) => arg.startsWith("--base-url="))?.slice(11);
const outputDir = args.find((arg) => arg.startsWith("--output="))?.slice(9);

if (!baseUrl || !outputDir) {
  console.error("Usage: node scripts/performance-experience-audit.mjs --base-url=http://127.0.0.1:3213 --output=/tmp/bugdrop-t013-experience");
  process.exit(1);
}

fs.mkdirSync(outputDir, { recursive: true });
const axeSource = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  isMobile: true,
  hasTouch: true,
  reducedMotion: "reduce",
});
await context.addInitScript(() => {
  globalThis.__bugdropLcpEntries = [];
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      globalThis.__bugdropLcpEntries.push({
        startTime: entry.startTime,
        renderTime: entry.renderTime,
        loadTime: entry.loadTime,
        size: entry.size,
        tag: entry.element?.tagName ?? null,
        text: entry.element?.textContent?.trim().replace(/\s+/g, " ").slice(0, 160) ?? null,
      });
    }
  }).observe({ type: "largest-contentful-paint", buffered: true });
});
await context.route(/https:\/\/www\.googletagmanager\.com\/.*/, async (route) => {
  await route.fulfill({ status: 200, contentType: "application/javascript", body: "" });
});
await context.route(/https:\/\/(?:www|region1)\.google-analytics\.com\/.*/, async (route) => {
  await route.fulfill({ status: 204, body: "" });
});
await context.route(/https:\/\/(?:analytics\.invalid|us\.i\.posthog\.com)\/.*/, async (route) => {
  await route.fulfill({ status: 204, body: "" });
});

const routes = [
  "/",
  "/demo",
  "/compare/userback",
  "/resources/visual-bug-report-template",
  "/resources/client-website-qa-checklist",
];
const routeResults = [];
const failures = [];

for (const route of routes) {
  const page = await context.newPage();
  const requests = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.goto(new URL(route, baseUrl).href, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1200);
  await page.evaluate(axeSource);
  const axe = await page.evaluate(async () => {
    const result = await globalThis.axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
    });
    return {
      violations: result.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        help: violation.help,
        targets: violation.nodes.map((node) => node.target),
      })),
      passes: result.passes.length,
      incomplete: result.incomplete.map((item) => item.id),
    };
  });
  const layout = await page.evaluate(() => ({
    viewportWidth: document.documentElement.clientWidth,
    documentWidth: document.documentElement.scrollWidth,
    overflowPx: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
  }));
  const screenshot = path.join(outputDir, `${route === "/" ? "home" : route.slice(1).replaceAll("/", "-")}-mobile.png`);
  await page.screenshot({ path: screenshot, fullPage: true });

  if (axe.violations.length) failures.push(`${route}: ${axe.violations.map((item) => item.id).join(", ")}`);
  if (layout.overflowPx > 1) failures.push(`${route}: ${layout.overflowPx}px document overflow`);
  if (route === "/" && requests.some((url) => /\/widget(?:\.v[\d.]+)?\.js(?:\?|$)/.test(url))) {
    failures.push("homepage requested widget.js before demo activation");
  }
  routeResults.push({ route, axe, layout, requestCount: requests.length, screenshot });
  await page.close();
}

const page = await context.newPage();
const initialRequests = [];
const initialRequestRecords = [];
const initialRscResponses = [];
const initialResponseTasks = [];
const videoResponses = [];
page.on("request", (request) => {
  initialRequests.push(request.url());
  initialRequestRecords.push({ url: request.url(), resourceType: request.resourceType() });
});
page.on("response", (response) => {
  initialResponseTasks.push((async () => {
    const headers = await response.allHeaders();
    if ((headers["content-type"] ?? "").includes("text/x-component")) {
      const request = response.request();
      const requestHeaders = await request.allHeaders();
      initialRscResponses.push({
        url: response.url(),
        status: response.status(),
        contentType: headers["content-type"],
        nextRouterPrefetch: requestHeaders["next-router-prefetch"] ?? null,
        startEpochMs: request.timing().startTime,
      });
    }
    if (/youtube-nocookie\.com/.test(response.url())) {
      videoResponses.push({ url: response.url(), status: response.status() });
    }
  })());
});
await page.goto(new URL("/", baseUrl).href, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1200);
await Promise.all(initialResponseTasks);

const homepageRenderTimeline = await page.evaluate(() => ({
  timeOrigin: performance.timeOrigin,
  lcp: globalThis.__bugdropLcpEntries.at(-1) ?? null,
  headerLinks: [...document.querySelectorAll("nav a[href]")].map((link) => ({
    text: link.textContent?.trim() ?? "",
    href: link.getAttribute("href"),
  })),
}));
const initialRscSnapshot = initialRscResponses.slice();
const initialStylesheetRequests = initialRequestRecords.filter(({ resourceType }) => resourceType === "stylesheet");
const headerDestinations = new Set(
  homepageRenderTimeline.headerLinks
    .map(({ href }) => href)
    .filter((href) => href?.startsWith("/") && !href.includes("#")),
);
const headerRscRequests = initialRscSnapshot.map((request) => ({
  ...request,
  pathname: new URL(request.url).pathname,
  startRelativeMs: request.startEpochMs - homepageRenderTimeline.timeOrigin,
})).filter((request) => headerDestinations.has(request.pathname));
const headerRscBeforeLcp = headerRscRequests.filter((request) =>
  homepageRenderTimeline.lcp && request.startRelativeMs < homepageRenderTimeline.lcp.startTime,
);
if (initialRscSnapshot.length) failures.push(`homepage prefetched RSC payloads before LCP proof: ${initialRscSnapshot.map(({ url }) => url).join(", ")}`);
if (initialStylesheetRequests.length) failures.push(`homepage requested external stylesheets: ${initialStylesheetRequests.map(({ url }) => url).join(", ")}`);
if (!homepageRenderTimeline.lcp || homepageRenderTimeline.lcp.tag !== "H1") failures.push("homepage H1 was not observed as LCP");

const initialWidgetRequests = initialRequests.filter((url) => /\/widget(?:\.v[\d.]+)?\.js(?:\?|$)/.test(url));
if (initialWidgetRequests.length) failures.push(`initial widget requests: ${initialWidgetRequests.join(", ")}`);
const initialGtmRequests = initialRequests.filter((url) => /www\.googletagmanager\.com\/gtag\/js/.test(url));
if (initialGtmRequests.length) failures.push(`passive homepage requested GTM: ${initialGtmRequests.join(", ")}`);
const initialThirdPartyMedia = initialRequests.filter((url) =>
  /youtube(?:-nocookie)?\.com|googlevideo\.com|ytimg\.com|api\.producthunt\.com/.test(url),
);
if (initialThirdPartyMedia.length) failures.push(`initial third-party media requests: ${initialThirdPartyMedia.join(", ")}`);
if (await page.locator("iframe").count()) failures.push("homepage contains an iframe before video activation");

const palette = await page.evaluate(async () => {
  const stylesheetUrls = [...document.querySelectorAll('link[rel="stylesheet"]')]
    .map((link) => link instanceof HTMLLinkElement ? link.href : "")
    .filter(Boolean);
  const inlineStyles = [...document.querySelectorAll("style")]
    .map((style) => style.textContent ?? "")
    .filter(Boolean);
  const emittedCss = inlineStyles.join("\n").toLowerCase();
  const computedColor = (selector) => {
    const element = document.querySelector(selector);
    return element ? getComputedStyle(element).color : null;
  };
  return {
    stylesheetUrls,
    inlineStyleCount: inlineStyles.length,
    inlineCssBytes: new TextEncoder().encode(inlineStyles.join("\n")).byteLength,
    emitted: {
      correctedMuted: emittedCss.includes("#b8c2e8"),
      correctedSubtle: emittedCss.includes("#b4bde5"),
      staleMuted: emittedCss.includes("#565f89"),
      staleSubtle: emittedCss.includes("#787c99"),
    },
    computed: {
      muted: computedColor(".text-text-muted"),
      subtle: computedColor(".text-text-subtle"),
    },
  };
});
if (palette.stylesheetUrls.length) failures.push(`homepage retained stylesheet links: ${palette.stylesheetUrls.join(", ")}`);
if (!palette.inlineStyleCount || !palette.inlineCssBytes) failures.push("homepage is missing inlined CSS");
if (!palette.emitted.correctedMuted || !palette.emitted.correctedSubtle) failures.push("emitted CSS is missing the corrected text palette");
if (palette.emitted.staleMuted || palette.emitted.staleSubtle) failures.push("emitted CSS retains stale text palette tokens");
if (palette.computed.muted !== "rgb(184, 194, 232)") failures.push(`computed muted text color was ${palette.computed.muted}`);
if (palette.computed.subtle !== "rgb(180, 189, 229)") failures.push(`computed subtle text color was ${palette.computed.subtle}`);

const keyboardSequence = [];
await page.evaluate(() => {
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
});
for (let index = 0; index < 30; index += 1) {
  await page.keyboard.press("Tab");
  keyboardSequence.push(await page.evaluate(() => {
    const element = document.activeElement;
    if (!(element instanceof HTMLElement)) return null;
    return {
      tag: element.tagName.toLowerCase(),
      text: element.textContent?.trim().replace(/\s+/g, " ").slice(0, 100),
      href: element.getAttribute("href"),
      analyticsEvent: element.dataset.analyticsEvent,
      videoConsent: element.hasAttribute("data-video-consent"),
      widgetActivation: element.hasAttribute("data-homepage-widget-activate"),
    };
  }));
}
const keyboardReachedTry = keyboardSequence.some((item) => item?.analyticsEvent === "landing_cta_click");
const keyboardReachedVideo = keyboardSequence.some((item) => item?.videoConsent);
const keyboardReachedWidget = keyboardSequence.some((item) => item?.widgetActivation);
if (!keyboardReachedTry) failures.push("keyboard sequence did not reach the primary try CTA");
if (!keyboardReachedVideo) failures.push("keyboard sequence did not reach the deferred video control");
if (!keyboardReachedWidget) failures.push("keyboard sequence did not reach the homepage feedback demo");

const coreTouchTargets = await page.locator('[data-analytics-label="Try it on this page"], [data-analytics-label="Install from GitHub Marketplace"], [data-video-consent], [data-homepage-widget-activate]').evaluateAll((elements) =>
  elements.map((element) => {
    const rect = element.getBoundingClientRect();
    return {
      label: element.getAttribute("data-analytics-label") ?? element.getAttribute("aria-label"),
      width: rect.width,
      height: rect.height,
    };
  }),
);
for (const target of coreTouchTargets) {
  if (target.width < 44 || target.height < 44) failures.push(`${target.label}: touch target smaller than 44px`);
}

await page.locator('[data-analytics-label="Try it on this page"]').click();
await page.waitForTimeout(250);
const activatedGtmRequests = initialRequests.filter((url) => /www\.googletagmanager\.com\/gtag\/js/.test(url));
if (activatedGtmRequests.length !== 1) failures.push(`tracked intent requested GTM ${activatedGtmRequests.length} times`);

const widgetButton = page.locator("[data-homepage-widget-activate]");
await widgetButton.scrollIntoViewIfNeeded();
await widgetButton.focus();
const widgetFocusScreenshot = path.join(outputDir, "home-widget-keyboard-focus.png");
await page.screenshot({ path: widgetFocusScreenshot, fullPage: false });
await page.keyboard.press("Enter");
await page.locator(".bd-modal").waitFor({ state: "visible", timeout: 15_000 });
const widgetScriptContract = await page.locator("#bugdrop-homepage-demo").evaluate((script) => ({
  src: script.getAttribute("src"),
  repo: script.getAttribute("data-repo"),
  async: script.hasAttribute("async"),
  defer: script.hasAttribute("defer"),
}));
if (widgetScriptContract.repo !== "mean-weasel/bugdrop-widget-test") failures.push("homepage widget repository configuration drifted");
if (widgetScriptContract.async || widgetScriptContract.defer) failures.push("homepage widget loader added async/defer attributes");
const activatedWidgetRequests = initialRequests.filter((url) => /\/widget(?:\.v[\d.]+)?\.js(?:\?|$)/.test(url));
if (activatedWidgetRequests.length !== 1) failures.push(`widget activation requested widget.js ${activatedWidgetRequests.length} times`);
const widgetKeyboardScreenshot = path.join(outputDir, "home-widget-keyboard-open.png");
await page.screenshot({ path: widgetKeyboardScreenshot, fullPage: false });
await page.locator(".bd-close").click();
await page.locator(".bd-modal").waitFor({ state: "hidden" });
await widgetButton.click();
await page.locator(".bd-modal").waitFor({ state: "visible" });
const widgetPointerScreenshot = path.join(outputDir, "home-widget-pointer-open.png");
await page.screenshot({ path: widgetPointerScreenshot, fullPage: false });
await page.locator(".bd-close").click();

const videoButton = page.locator("[data-video-consent]");
await videoButton.scrollIntoViewIfNeeded();
await videoButton.focus();
const focusScreenshot = path.join(outputDir, "home-video-keyboard-focus.png");
await page.screenshot({ path: focusScreenshot, fullPage: false });
await page.keyboard.press("Enter");
await page.locator('iframe[title="BugDrop demo: feedback form to GitHub issue"]').waitFor({ state: "attached" });
await page.waitForTimeout(2500);
const activatedVideoRequests = initialRequests.filter((url) => /youtube-nocookie\.com/.test(url));
if (!activatedVideoRequests.length) failures.push("video activation did not request the privacy-enhanced YouTube embed");
if (!videoResponses.some((response) => response.status >= 200 && response.status < 400)) {
  failures.push("privacy-enhanced YouTube embed did not return a successful response");
}
const loadedScreenshot = path.join(outputDir, "home-video-loaded.png");
await page.screenshot({ path: loadedScreenshot, fullPage: false });

const conversions = await page.evaluate(() => ({
  trySection: Boolean(document.querySelector("#try-bugdrop")),
  primaryTryLink: Boolean(document.querySelector('[data-analytics-label="Try it on this page"][href="#try-bugdrop"]')),
  demoLink: Boolean(document.querySelector('a[href="/demo"]')),
  productHuntAttribution: Boolean(document.querySelector('a[href*="producthunt.com"]')) && document.body.textContent?.includes("#6 Product of the Day"),
  videoDirectLink: Boolean(document.querySelector('a[href*="youtube.com/watch"]')),
}));
for (const [name, pass] of Object.entries(conversions)) {
  if (!pass) failures.push(`missing conversion/attribution contract: ${name}`);
}

const proveSpaHeaderNavigation = async ({ href, activation }) => {
  const navigationPage = await context.newPage();
  await navigationPage.goto(new URL("/", baseUrl).href, { waitUntil: "domcontentloaded" });
  const timeOriginBefore = await navigationPage.evaluate(() => performance.timeOrigin);
  const link = navigationPage.locator(`nav a[href="${href}"]`);
  if (activation === "keyboard") {
    await link.focus();
    await navigationPage.keyboard.press("Enter");
  } else {
    await link.click();
  }
  await navigationPage.waitForURL(new URL(href, baseUrl).href);
  await navigationPage.waitForTimeout(250);
  const after = await navigationPage.evaluate(() => ({
    timeOrigin: performance.timeOrigin,
    background: getComputedStyle(document.body).backgroundColor,
    textColor: getComputedStyle(document.body).color,
    stylesheetUrls: [...document.querySelectorAll('link[rel="stylesheet"]')].map((link) => link.href),
    inlineStyleCount: document.querySelectorAll("style").length,
    overflowPx: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
  }));
  const proof = {
    href,
    activation,
    destination: navigationPage.url(),
    timeOriginBefore,
    timeOriginAfter: after.timeOrigin,
    spaPreserved: timeOriginBefore === after.timeOrigin,
    styling: after,
  };
  if (!proof.spaPreserved) failures.push(`${activation} header navigation to ${href} reloaded the document`);
  if (!after.inlineStyleCount && !after.stylesheetUrls.length) failures.push(`${activation} header navigation to ${href} lost route styling`);
  if (after.overflowPx > 1) failures.push(`${activation} header navigation to ${href} introduced overflow`);
  await navigationPage.close();
  return proof;
};
const headerNavigation = {
  initialRscResponses: initialRscSnapshot,
  allObservedRscResponses: initialRscResponses,
  initialStylesheetRequests,
  homepageRenderTimeline,
  headerRscRequests,
  headerRscBeforeLcp,
  pointer: await proveSpaHeaderNavigation({ href: "/docs", activation: "pointer" }),
  keyboard: await proveSpaHeaderNavigation({ href: "/use-cases", activation: "keyboard" }),
};

const result = {
  evidenceType: "local browser accessibility, keyboard, and 390x844 mobile interaction proof",
  fieldDataStatus: "Browser interaction evidence only; not field Core Web Vitals.",
  routes: routeResults,
  keyboard: {
    reachedPrimaryTryCta: keyboardReachedTry,
    reachedDeferredVideoControl: keyboardReachedVideo,
    reachedHomepageWidget: keyboardReachedWidget,
    sequence: keyboardSequence,
    focusScreenshot,
  },
  mobile: { viewport: "390x844", coreTouchTargets, loadedScreenshot },
  media: {
    initialThirdPartyMedia,
    iframeBeforeActivation: false,
    iframeAfterKeyboardActivation: true,
    activatedVideoRequests,
    videoResponses,
  },
  homepageWidget: {
    initialRequests: initialWidgetRequests,
    activatedRequests: activatedWidgetRequests,
    script: widgetScriptContract,
    keyboardOperable: true,
    pointerOperable: true,
    focusScreenshot: widgetFocusScreenshot,
    keyboardScreenshot: widgetKeyboardScreenshot,
    pointerScreenshot: widgetPointerScreenshot,
  },
  analytics: {
    passiveGtmRequests: initialGtmRequests,
    intentGtmRequests: activatedGtmRequests,
  },
  palette,
  conversions,
  headerNavigation,
  failures,
  passed: failures.length === 0,
};

fs.writeFileSync(path.join(outputDir, "audit.json"), `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
await page.close();
await context.close();
await browser.close();

if (!result.passed) process.exit(1);
