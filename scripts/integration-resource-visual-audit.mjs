#!/usr/bin/env node

import assert from "node:assert/strict";
import { mkdir, readFile } from "node:fs/promises";
import { chromium } from "playwright";

const baseArg = process.argv.slice(2).find((arg) => arg.startsWith("--base-url="));
const baseUrl = (baseArg?.slice("--base-url=".length) ?? "http://127.0.0.1:3211").replace(/\/$/, "");
const outputArg = process.argv.slice(2).find((arg) => arg.startsWith("--output="));
const output = outputArg?.slice("--output=".length) ?? "/tmp/bugdrop-t012-resources";
const slugs = ["visual-bug-report-template", "client-website-qa-checklist"];
const states = [
  { name: "desktop", width: 1440, height: 1000, javaScriptEnabled: true },
  { name: "mobile", width: 390, height: 844, javaScriptEnabled: true },
  { name: "nojs-mobile", width: 390, height: 844, javaScriptEnabled: false },
];

await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const state of states) {
    const context = await browser.newContext({ viewport: { width: state.width, height: state.height }, javaScriptEnabled: state.javaScriptEnabled });
    for (const slug of slugs) {
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
      const response = await page.goto(`${baseUrl}/resources/${slug}`, { waitUntil: state.javaScriptEnabled ? "networkidle" : "load" });
      assert.equal(response?.status(), 200, `${slug}/${state.name}: HTTP ${response?.status()}`);
      const audit = await page.evaluate(({ expectedSlug, js }) => {
        const root = document.querySelector(`[data-resource-page="${expectedSlug}"]`);
        const paragraphs = [...(root?.querySelectorAll("p, li") ?? [])];
        const overflowing = [...document.querySelectorAll("main *")].filter((element) => {
          const rect = element.getBoundingClientRect();
          return rect.left < -1 || rect.right > document.documentElement.clientWidth + 1;
        }).map((element) => element.tagName.toLowerCase()).slice(0, 10);
        return {
          shell: Boolean(root),
          h1Count: document.querySelectorAll("h1").length,
          h1Top: root?.querySelector("h1")?.getBoundingClientRect().top ?? null,
          minFont: paragraphs.length ? Math.min(...paragraphs.map((node) => Number.parseFloat(getComputedStyle(node).fontSize))) : 0,
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          overflowing,
          articleWords: (root?.querySelector("article")?.textContent?.match(/[A-Za-z0-9]+/g) ?? []).length,
          source: Boolean(root?.querySelector("[data-resource-provenance]")),
          download: Boolean(root?.querySelector('a[download][href$=".md"]')),
          related: root?.querySelectorAll("[data-resource-related-link]").length ?? 0,
          actions: Boolean(root?.querySelector("[data-resource-actions]")),
          trackedActions: ["resource_copy_click", "resource_download_click", "resource_print_click"].every((event) => {
            const action = root?.querySelector(`[data-analytics-event="${event}"]`);
            return action?.getAttribute("data-analytics-label") === expectedSlug;
          }),
          secondaryConversion: (() => {
            const section = root?.querySelector(`[data-resource-secondary-conversion="${expectedSlug}"]`);
            const expectedHref = expectedSlug === "visual-bug-report-template" ? "/demo" : "/sandbox";
            const expectedEvent = expectedSlug === "visual-bug-report-template" ? "resource_demo_click" : "resource_sandbox_click";
            const link = section?.querySelector(`a[href="${expectedHref}"]`);
            return link?.getAttribute("data-analytics-event") === expectedEvent
              && link?.getAttribute("data-analytics-label") === expectedSlug;
          })(),
          truthfulPrintLabel: root?.querySelector('[data-analytics-event="resource_print_click"]')?.textContent?.trim()
            === (expectedSlug === "visual-bug-report-template" ? "Print template" : "Print checklist"),
          noJsHelp: !js ? document.body.textContent?.includes("JavaScript is off") : true,
        };
      }, { expectedSlug: slug, js: state.javaScriptEnabled });
      assert(audit.shell && audit.h1Count === 1, `${slug}/${state.name}: shell or H1 failed`);
      assert(audit.articleWords >= 600, `${slug}/${state.name}: resource is too thin (${audit.articleWords})`);
      assert(audit.source && audit.download && audit.related >= 3, `${slug}/${state.name}: provenance or portable paths missing`);
      assert(audit.actions, `${slug}/${state.name}: action controls missing`);
      assert(audit.trackedActions, `${slug}/${state.name}: portable action analytics missing`);
      assert(audit.secondaryConversion, `${slug}/${state.name}: secondary conversion analytics missing`);
      assert(audit.truthfulPrintLabel, `${slug}/${state.name}: print action label is misleading`);
      assert(audit.noJsHelp, `${slug}/${state.name}: no-JavaScript help missing`);
      assert(audit.minFont >= 14, `${slug}/${state.name}: prose is too small`);
      assert(audit.overflow <= 1 && audit.overflowing.length === 0, `${slug}/${state.name}: horizontal overflow ${JSON.stringify(audit)}`);
      if (state.width === 390) assert(audit.h1Top !== null && audit.h1Top < 360, `${slug}/${state.name}: intent is not above fold`);
      assert.equal(errors.length, 0, `${slug}/${state.name}: browser errors ${errors.join(" | ")}`);
      const screenshot = `${output}/${state.name}-${slug}.png`;
      await page.screenshot({ path: screenshot, fullPage: true });
      results.push({ slug, state: state.name, screenshot, ...audit });
      await page.close();
    }
    await context.close();
  }
} finally {
  await browser.close();
}

const contactBrowser = await chromium.launch({ headless: true });
try {
  const page = await contactBrowser.newPage({ viewport: { width: 1200, height: 900 } });
  const cards = await Promise.all(results.map(async (result) => `<figure><figcaption>${result.slug} · ${result.state}</figcaption><img src="data:image/png;base64,${await readFile(result.screenshot, "base64")}"></figure>`));
  await page.setContent(`<style>*{box-sizing:border-box}body{margin:0;padding:20px;background:#111827;color:#fff;font:14px sans-serif}main{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:12px;align-items:start}figure{margin:0;background:#030712;border:1px solid #374151}figcaption{padding:8px;overflow-wrap:anywhere}img{display:block;width:100%}</style><main>${cards.join("")}</main>`);
  await page.screenshot({ path: `${output}/contact-all.png`, fullPage: true });
  await page.close();
} finally {
  await contactBrowser.close();
}

console.log(JSON.stringify({ status: "pass", resources: slugs.length, renderedStates: results.length, noJsStates: results.filter((result) => result.state.startsWith("nojs")).length, output, results }, null, 2));
