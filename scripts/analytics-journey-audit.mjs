#!/usr/bin/env node

import fs from "node:fs";
import { chromium } from "playwright";

const args = process.argv.slice(2);
const baseUrl = args.find((arg) => arg.startsWith("--base-url="))?.slice(11);
const outputPath = args.find((arg) => arg.startsWith("--output="))?.slice(9);

if (!baseUrl || !outputPath) {
  console.error("Usage: node scripts/analytics-journey-audit.mjs --base-url=http://127.0.0.1:3214 --output=/tmp/bugdrop-t014-analytics.json");
  process.exit(1);
}

const forbiddenValues = [
  "sk_live_SUPER_SECRET",
  "private.person@example.com",
  "private-owner/secret-repo",
  "private search phrase",
  "token=",
  "utm_term=",
];
const allowedPropertyKeys = new Set([
  "$current_url",
  "$host",
  "$pathname",
  "page_location",
  "page_path",
  "landing_page",
  "acquisition_channel",
  "referrer_type",
  "search_engine",
  "campaign_present",
  "paid_click_present",
  "campaign_medium_category",
  "first_landing_page",
  "first_acquisition_channel",
  "first_referrer_type",
  "first_search_engine",
  "first_campaign_present",
  "first_paid_click_present",
  "first_seen_at",
  "event_model_version",
  "label",
  "destination",
]);
const failures = [];
const sandboxSource = fs.readFileSync("src/components/sandbox/widget-sandbox.tsx", "utf8");
const promptStart = sandboxSource.indexOf("function buildAgentPrompt");
const promptEnd = sandboxSource.indexOf("function buildBookmarklet", promptStart);
const agentPromptSource = sandboxSource.slice(promptStart, promptEnd);
for (const required of [
  "normal synchronous <script>",
  "Do not add async or defer",
  "do not use next/script for the BugDrop widget",
]) {
  if (!agentPromptSource.includes(required)) failures.push(`sandbox agent prompt missing synchronous loading contract: ${required}`);
}
for (const stale of ["after the app is interactive", 'strategy="afterInteractive"']) {
  if (agentPromptSource.includes(stale)) failures.push(`sandbox agent prompt retains stale loading instruction: ${stale}`);
}
const browser = await chromium.launch({ headless: true });

const journeys = [
  {
    name: "organic-comparison",
    path: "/compare/userback?token=sk_live_SUPER_SECRET&utm_term=private%20search%20phrase",
    referrer: "https://www.google.com/search?q=private.person%40example.com&token=secret",
    clicks: ["compare_demo_click", "compare_installation_click"],
  },
  {
    name: "use-case",
    path: "/use-cases/nextjs-feedback-widget?email=private.person%40example.com",
    clicks: ["use_case_demo_click", "use_case_installation_click", "use_case_marketplace_click"],
  },
  {
    name: "sandbox-install-proxy",
    path: "/sandbox?repo=private-owner%2Fsecret-repo",
    fillSensitiveRepo: true,
    clicks: ["sandbox_preview_open_click", "installation_proxy_script_copy"],
  },
  {
    name: "resource",
    path: "/resources/visual-bug-report-template?notes=private%20free%20text",
    clicks: ["resource_copy_click", "resource_demo_click"],
  },
];
const evidence = [];

for (const journey of journeys) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const capturedPostHog = [];
  const interceptedAnalyticsRequests = [];

  await context.route("https://analytics.invalid/**", async (route) => {
    interceptedAnalyticsRequests.push({ method: route.request().method(), url: route.request().url() });
    const raw = route.request().postData();
    if (raw) {
      try {
        const payload = JSON.parse(raw);
        capturedPostHog.push({
          event: payload.event,
          properties: payload.properties,
          envelope: {
            publicWriteKeyPresent: typeof payload.api_key === "string",
            anonymousDistinctIdPresent: typeof payload.distinct_id === "string",
          },
        });
      } catch {
        failures.push(`${journey.name}: analytics payload was not valid JSON`);
      }
    }
    await route.fulfill({ status: 204, body: "" });
  });
  await context.route(/https:\/\/www\.googletagmanager\.com\/.*/, async (route) => {
    interceptedAnalyticsRequests.push({ method: route.request().method(), url: route.request().url().split("?", 1)[0] });
    await route.fulfill({ status: 200, contentType: "application/javascript", body: "" });
  });
  await context.route(/https:\/\/(?:www|region1)\.google-analytics\.com\/.*/, async (route) => {
    interceptedAnalyticsRequests.push({ method: route.request().method(), url: route.request().url().split("?", 1)[0] });
    await route.fulfill({ status: 204, body: "" });
  });

  const page = await context.newPage();
  await page.goto(new URL(journey.path, baseUrl).href, {
    waitUntil: "domcontentloaded",
    referer: journey.referrer,
  });
  await page.waitForTimeout(2200);
  await page.evaluate(() => {
    document.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest("[data-analytics-event]")) {
        event.preventDefault();
      }
    }, true);
  });

  if (journey.fillSensitiveRepo) {
    await page.getByLabel("GitHub repository").fill("private-owner/secret-repo");
  }

  for (const eventName of journey.clicks) {
    const locator = page.locator(`[data-analytics-event="${eventName}"], [data-analytics-success-event="${eventName}"]`).first();
    if (await locator.count() !== 1) {
      failures.push(`${journey.name}: expected one rendered ${eventName} control`);
      continue;
    }
    await locator.click();
    await page.waitForTimeout(250);
  }
  await page.waitForTimeout(500);

  const browserAudit = await page.evaluate(() => {
    const entries = (window.dataLayer ?? []).map((entry) =>
      Array.isArray(entry) ? entry : Array.from(entry),
    );
    return {
      googleEvents: entries
        .filter((entry) => entry[0] === "event")
        .map((entry) => ({ event: entry[1], properties: entry[2] })),
      nestedMarkers: document.querySelectorAll("[data-analytics-event] [data-analytics-event]").length,
      conflictingMarkers: document.querySelectorAll("[data-analytics-event][data-analytics-success-event]").length,
      unlabeledMarkers: [...document.querySelectorAll("[data-analytics-event]")]
        .concat([...document.querySelectorAll("[data-analytics-success-event]")])
        .filter((element) => !element.getAttribute("data-analytics-label"))
        .map((element) => element.getAttribute("data-analytics-event")),
    };
  });

  const relevantPostHog = capturedPostHog.filter((event) =>
    event.event === "$pageview" || journey.clicks.includes(event.event),
  );
  const relevantGoogle = browserAudit.googleEvents.filter((event) =>
    event.event === "page_view" || journey.clicks.includes(event.event),
  );

  for (const eventName of ["$pageview", ...journey.clicks]) {
    const count = relevantPostHog.filter((event) => event.event === eventName).length;
    if (count !== 1) failures.push(`${journey.name}: PostHog ${eventName} count was ${count}, expected 1`);
  }
  for (const eventName of ["page_view", ...journey.clicks]) {
    const count = relevantGoogle.filter((event) => event.event === eventName).length;
    if (count !== 1) failures.push(`${journey.name}: GA4 ${eventName} count was ${count}, expected 1`);
  }
  if (browserAudit.nestedMarkers) failures.push(`${journey.name}: nested analytics markers could double-count`);
  if (browserAudit.conflictingMarkers) failures.push(`${journey.name}: control has both click and success markers`);
  if (browserAudit.unlabeledMarkers.length) failures.push(`${journey.name}: unlabeled analytics markers: ${browserAudit.unlabeledMarkers.join(", ")}`);

  if (journey.name === "organic-comparison") {
    const pageView = relevantPostHog.find((event) => event.event === "$pageview")?.properties;
    if (pageView?.acquisition_channel !== "organic_search") failures.push("organic landing was not classified as organic_search");
    if (pageView?.search_engine !== "google") failures.push("organic landing did not identify the enumerated Google source");
    if (pageView?.landing_page !== "/compare/userback") failures.push("organic landing path was not query-free");
  }

  const payloads = [...relevantPostHog, ...relevantGoogle];
  for (const payload of payloads) {
    for (const key of Object.keys(payload.properties ?? {})) {
      if (!allowedPropertyKeys.has(key)) failures.push(`${journey.name}/${payload.event}: unexpected property ${key}`);
    }
  }
  const serialized = JSON.stringify(payloads);
  for (const forbidden of forbiddenValues) {
    if (serialized.includes(forbidden)) failures.push(`${journey.name}: payload exposed forbidden value ${forbidden}`);
  }
  if (/https?:\/\/[^" ]+\?/.test(serialized)) failures.push(`${journey.name}: payload included a URL with query values`);

  evidence.push({
    name: journey.name,
    requestedPath: journey.path.split("?", 1)[0],
    posthogEvents: relevantPostHog,
    googleEvents: relevantGoogle,
    interceptedAnalyticsRequests,
    nestedMarkers: browserAudit.nestedMarkers,
    conflictingMarkers: browserAudit.conflictingMarkers,
    unlabeledMarkers: browserAudit.unlabeledMarkers,
  });
  await context.close();
}

await browser.close();

const result = {
  networkPolicy: {
    externalAnalyticsTransmitted: false,
    explanation: "All PostHog, Google Tag Manager, and Google Analytics requests were intercepted and fulfilled locally by Playwright.",
  },
  privacyContract: {
    rawQueryValues: false,
    fullReferrers: false,
    sandboxFreeText: false,
    secrets: false,
    unnecessaryPii: false,
    controlledLabelsOnly: true,
  },
  sandboxLoadingContract: {
    scope: "buildAgentPrompt only; analytics next/script usage is intentionally outside this assertion",
    synchronousScriptRequired: true,
    asyncOrDeferForbidden: true,
    nextScriptForbiddenForBugDrop: true,
  },
  journeys: evidence,
  failures,
  passed: failures.length === 0,
};

fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
if (!result.passed) process.exit(1);
