#!/usr/bin/env node

import { mkdir, readFile } from "node:fs/promises";
import { chromium } from "playwright";

const baseArg = process.argv.slice(2).find((arg) => arg.startsWith("--base-url="));
const baseUrl = (baseArg?.slice("--base-url=".length) ?? "http://127.0.0.1:3210").replace(/\/$/, "");
const outputArg = process.argv.slice(2).find((arg) => arg.startsWith("--output="));
const output = outputArg?.slice("--output=".length) ?? "/tmp/bugdrop-t010-visual";
const slugs = [
  "website-feedback-widget",
  "free-website-feedback-widget",
  "github-issues-feedback",
  "screenshot-feedback-widget",
  "visual-bug-reporting",
  "nextjs-feedback-widget",
  "vercel-preview-feedback",
  "open-source",
  "open-source-feedback-widget",
  "internal-tools",
  "client-projects",
  "client-website-feedback-tool",
];
const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport, hasTouch: viewport.name === "mobile" });
    for (const slug of slugs) {
      const page = await context.newPage();
      const errors = [];
      page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
      page.on("pageerror", (error) => errors.push(error.message));
      const response = await page.goto(`${baseUrl}/use-cases/${slug}`, { waitUntil: "networkidle" });
      assert(response?.status() === 200, `${slug}/${viewport.name}: HTTP ${response?.status()}`);

      const audit = await page.evaluate((expectedSlug) => {
        const article = document.querySelector(`[data-use-case-page="${expectedSlug}"]`);
        const h1 = article?.querySelector("h1");
        const jobBoundary = [...(article?.querySelectorAll("p") ?? [])].find((paragraph) => paragraph.textContent?.includes("Use this guide when:"));
        const paragraphSizes = [...(article?.querySelectorAll("p, li") ?? [])].map((element) => Number.parseFloat(getComputedStyle(element).fontSize));
        const overflowing = [...document.querySelectorAll("main *")].filter((element) => {
          const rect = element.getBoundingClientRect();
          return rect.left < -1 || rect.right > document.documentElement.clientWidth + 1;
        }).map((element) => element.tagName.toLowerCase()).slice(0, 10);
        return {
          article: Boolean(article),
          h1Count: document.querySelectorAll("h1").length,
          h1Text: h1?.textContent?.trim() ?? "",
          h1Top: h1?.getBoundingClientRect().top ?? null,
          jobBoundaryVisible: Boolean(jobBoundary),
          jobBoundaryBottom: jobBoundary?.getBoundingClientRect().bottom ?? null,
          minProseFontSize: paragraphSizes.length ? Math.min(...paragraphSizes) : 0,
          horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          overflowing,
          conversion: Boolean(document.querySelector(`[data-use-case-conversion="${expectedSlug}"]`)),
          demoLink: Boolean(document.querySelector("a[href='/demo']")),
          installLink: Boolean(document.querySelector("a[href='/docs/installation']")),
          relatedLinks: document.querySelectorAll("[data-acquisition-related-link]").length,
        };
      }, slug);

      assert(audit.article && audit.h1Count === 1 && audit.h1Text, `${slug}/${viewport.name}: article or H1 contract failed`);
      assert(audit.jobBoundaryVisible, `${slug}/${viewport.name}: distinct job boundary is missing`);
      assert(audit.conversion && audit.demoLink && audit.installLink, `${slug}/${viewport.name}: conversion path is incomplete`);
      assert(audit.relatedLinks >= 3, `${slug}/${viewport.name}: contextual related links are missing`);
      assert(audit.horizontalOverflow <= 1 && audit.overflowing.length === 0, `${slug}/${viewport.name}: horizontal overflow ${JSON.stringify(audit)}`);
      assert(audit.minProseFontSize >= 14, `${slug}/${viewport.name}: prose font is too small (${audit.minProseFontSize}px)`);
      if (viewport.name === "mobile") {
        assert(audit.h1Top !== null && audit.h1Top < 360, `${slug}/mobile: primary intent is not above the fold`);
        assert(audit.jobBoundaryBottom !== null && audit.jobBoundaryBottom < 844, `${slug}/mobile: job boundary is not visible above the fold`);
      }
      assert(errors.length === 0, `${slug}/${viewport.name}: browser errors: ${errors.join(" | ")}`);

      const screenshot = `${output}/${viewport.name}-${slug}.png`;
      await page.screenshot({ path: screenshot, fullPage: true });
      results.push({ slug, viewport: viewport.name, screenshot, ...audit });
      await page.close();
    }
    await context.close();
  }
} finally {
  await browser.close();
}

const contactBrowser = await chromium.launch({ headless: true });
try {
  for (const viewport of viewports) {
    const page = await contactBrowser.newPage({ viewport: { width: viewport.name === "desktop" ? 1440 : 1280, height: 900 } });
    const cards = await Promise.all(slugs.map(async (slug) => {
      const screenshot = await readFile(`${output}/${viewport.name}-${slug}.png`, "base64");
      return `<figure><figcaption>${slug} · ${viewport.name}</figcaption><img src="data:image/png;base64,${screenshot}" alt="${slug} ${viewport.name}"></figure>`;
    }));
    await page.setContent(`<style>
      *{box-sizing:border-box}body{margin:0;padding:20px;background:#111827;color:#fff;font:16px sans-serif}
      main{display:grid;grid-template-columns:repeat(${viewport.name === "desktop" ? 3 : 6},minmax(0,1fr));gap:16px;align-items:start}
      figure{margin:0;background:#030712;border:1px solid #374151;border-radius:8px;overflow:hidden}
      figcaption{padding:10px;font-weight:700;overflow-wrap:anywhere}img{display:block;width:100%;height:auto}
    </style><main>${cards.join("")}</main>`, { waitUntil: "load" });
    await page.screenshot({ path: `${output}/contact-${viewport.name}.png`, fullPage: true });
    await page.close();
  }
} finally {
  await contactBrowser.close();
}

console.log(JSON.stringify({ status: "pass", pages: slugs.length, renderedStates: results.length, output, results }, null, 2));
