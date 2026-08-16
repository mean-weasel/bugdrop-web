#!/usr/bin/env node

import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { chromium } from "playwright";

const baseArg = process.argv.slice(2).find((arg) => arg.startsWith("--base-url="));
assert(baseArg, "Usage: node scripts/integration-resource-contract.mjs --base-url=http://127.0.0.1:3211");
const baseUrl = new URL(baseArg.slice("--base-url=".length));
assert(["127.0.0.1", "localhost"].includes(baseUrl.hostname), "Contract must target localhost");

const slugs = ["visual-bug-report-template", "client-website-qa-checklist", "screenshot-privacy-checklist"];
const files = (await readdir(new URL("../src/content/resources/", import.meta.url)))
  .filter((file) => file.endsWith(".mdx"))
  .map((file) => file.replace(/\.mdx$/, ""))
  .sort();
assert.deepEqual(files, [...slugs].sort(), "Resource content inventory must contain exactly three approved assets");

const architecture = JSON.parse(await readFile(new URL("../src/lib/acquisition-architecture.json", import.meta.url), "utf8"));
const owners = new Map([
  ["visual-bug-report-template", "visual bug report template"],
  ["client-website-qa-checklist", "client website qa checklist"],
  ["screenshot-privacy-checklist", "screenshot privacy checklist"],
]);
const secondaryConversions = new Map([
  ["visual-bug-report-template", { href: "/demo", event: "resource_demo_click", printLabel: "Print template" }],
  ["client-website-qa-checklist", { href: "/sandbox", event: "resource_sandbox_click", printLabel: "Print checklist" }],
  ["screenshot-privacy-checklist", { href: "/demo", event: "privacy_checklist_demo_click", printLabel: "Print checklist" }],
]);

for (const slug of slugs) {
  const route = `/resources/${slug}`;
  const response = await fetch(new URL(route, baseUrl), { redirect: "manual" });
  assert.equal(response.status, 200, `${route} must return 200`);
  const html = await response.text();
  const visibleText = html.replace(/<script\b[\s\S]*?<\/script>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  assert(html.includes(`data-resource-page="${slug}"`), `${route} is missing resource shell`);
  const h1 = html.match(/<h1[^>]*>(.*?)<\/h1>/is)?.[1]?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().toLowerCase() ?? "";
  assert(h1.includes(owners.get(slug)), `${route} H1 does not own its query`);
  assert(visibleText.includes(`Sources reviewed ${slug === "screenshot-privacy-checklist" ? "2026-08-16" : "2026-08-14"}`), `${route} is missing visible source/review date`);
  assert(html.includes("data-resource-actions"), `${route} is missing copy/download/print actions`);
  const actionTags = [...html.matchAll(/<(?:a|button)\b[^>]*>/gi)].map((match) => match[0]);
  for (const event of ["resource_copy_click", "resource_download_click", "resource_print_click"]) {
    const matches = actionTags.filter((tag) => tag.includes(`data-analytics-event="${event}"`) && tag.includes(`data-analytics-label="${slug}"`));
    assert.equal(matches.length, 1, `${route} must render one ${event} action with its resource analytics label`);
  }
  const secondary = secondaryConversions.get(slug);
  assert(html.includes(`data-resource-secondary-conversion="${slug}"`), `${route} is missing its secondary conversion section`);
  assert(actionTags.some((tag) => tag.includes(`href="${secondary.href}"`) && tag.includes(`data-analytics-event="${secondary.event}"`) && tag.includes(`data-analytics-label="${slug}"`)), `${route} secondary conversion is not fully instrumented`);
  assert(visibleText.includes(secondary.printLabel), `${route} print action label is not resource-specific`);
  assert(html.includes(`href="/resources/${slug}.md"`), `${route} is missing its portable download`);
  assert((html.match(/data-resource-related-link/g) ?? []).length >= 3, `${route} needs contextual links`);
  assert(visibleText.includes("JavaScript is off"), `${route} lacks an explicit no-JavaScript path`);
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i)?.[1]
    ?? html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.[1];
  assert.equal(new URL(canonical).pathname, route, `${route} must be self-canonical`);
  const page = architecture.pages.find((candidate) => candidate.path === route);
  assert.equal(page?.primaryQuery.toLowerCase(), owners.get(slug), `${route} query owner drifted`);

  const download = await fetch(new URL(`/resources/${slug}.md`, baseUrl));
  assert.equal(download.status, 200, `${route} download must return 200`);
  assert((await download.text()).length > 500, `${route} download is unexpectedly thin`);
}

const browser = await chromium.launch({ headless: true });
const fragmentNavigationProof = [];
try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const preview = await context.newPage();
  await preview.addInitScript(() => {
    window.addEventListener("bugdrop:ready", () => document.documentElement.setAttribute("data-bugdrop-ready", "true"), { once: true });
  });
  await preview.goto(new URL("/labs/integration-proof/preview", baseUrl).href, { waitUntil: "networkidle" });
  await preview.locator("#bugdrop-host").waitFor({ state: "attached" });
  await preview.waitForFunction(() => document.documentElement.dataset.bugdropReady === "true");
  const script = preview.locator('script[data-label="Preview feedback"]');
  assert.equal(await script.count(), 1, "preview must contain one integration script");
  assert.equal(await script.getAttribute("async"), null, "preview script must not be async");
  assert.equal(await script.getAttribute("defer"), null, "preview script must not be deferred");
  await preview.locator("#bugdrop-host .bd-trigger").click();
  await preview.locator("#bugdrop-host .bd-modal").waitFor();
  await preview.locator("#bugdrop-host .bd-close").waitFor();

  const production = await context.newPage();
  await production.goto(new URL("/labs/integration-proof/production", baseUrl).href, { waitUntil: "networkidle" });
  assert.equal(await production.locator('script[data-label="Preview feedback"]').count(), 0, "production must omit preview script");
  assert.equal(await production.locator("#bugdrop-host").count(), 0, "production must omit preview widget host");
  await context.close();

  for (const viewport of [{ name: "desktop", width: 1280, height: 900 }, { name: "mobile", width: 390, height: 844 }]) {
    const fragmentContext = await browser.newContext({ viewport });
    const page = await fragmentContext.newPage();
    await page.goto(new URL("/resources/screenshot-privacy-checklist", baseUrl).href, { waitUntil: "networkidle" });
    const link = page.locator('a[href="/docs/security#screenshot-masking"]').first();
    assert.equal(await link.count(), 1, `${viewport.name}: privacy checklist must link to screenshot masking`);
    await link.click();
    await page.waitForURL(/\/docs\/security#screenshot-masking$/);
    const target = page.locator("#screenshot-masking");
    await target.waitFor();
    assert.equal((await target.textContent())?.trim(), "Screenshot masking", `${viewport.name}: fragment must target the Screenshot masking heading`);
    await page.waitForFunction(() => {
      const heading = document.getElementById("screenshot-masking");
      const bounds = heading?.getBoundingClientRect();
      return location.hash === "#screenshot-masking" && bounds && bounds.top >= -1 && bounds.top < innerHeight;
    });
    fragmentNavigationProof.push({ viewport: viewport.name, hash: await page.evaluate(() => location.hash), target: await target.getAttribute("id") });
    await fragmentContext.close();
  }
} finally {
  await browser.close();
}

console.log(JSON.stringify({ status: "pass", resources: 3, integrationModes: 2, fragmentNavigationProof, loading: "synchronous", selectors: ["#bugdrop-host", ".bd-trigger", ".bd-modal", ".bd-close"] }, null, 2));
