#!/usr/bin/env node

import { mkdir, readFile } from "node:fs/promises";
import { chromium } from "playwright";

const baseArg = process.argv.slice(2).find((arg) => arg.startsWith("--base-url="));
const baseUrl = (baseArg?.slice("--base-url=".length) ?? "http://127.0.0.1:3207").replace(/\/$/, "");
const outputArg = process.argv.slice(2).find((arg) => arg.startsWith("--output="));
const output = outputArg?.slice("--output=".length) ?? "/tmp/bugdrop-t007-visual";
const slugs = ["userback", "marker-io", "bugherd", "usersnap", "canny", "sentry-user-feedback", "open-source-feedback-tools", "markup-io", "jam-dev"];
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
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      page.on("pageerror", (error) => errors.push(error.message));
      const response = await page.goto(`${baseUrl}/compare/${slug}`, { waitUntil: "networkidle" });
      if (response?.status() !== 200) throw new Error(`${slug}/${viewport.name}: HTTP ${response?.status()}`);
      const audit = await page.evaluate(() => {
        const text = document.body.textContent?.toLowerCase() ?? "";
        const tableScrollers = [...document.querySelectorAll("[data-comparison-table-scroll]")].map((container) => {
          const table = container.querySelector("table");
          const firstHeader = table?.querySelector("th:first-child");
          const finalHeader = table?.querySelector("th:last-child");
          const containerRect = container.getBoundingClientRect();
          const isHorizontallyVisible = (element) => {
            const rect = element?.getBoundingClientRect();
            return Boolean(rect && rect.left >= containerRect.left - 1 && rect.right <= containerRect.right + 1);
          };
          const describedBy = container.getAttribute("aria-describedby");
          const instructions = describedBy ? document.getElementById(describedBy) : null;
          const styles = getComputedStyle(container);
          return {
            tableSemantic: table?.tagName === "TABLE",
            headerCount: table?.querySelectorAll("th").length ?? 0,
            overflowX: styles.overflowX,
            scrollWidth: container.scrollWidth,
            clientWidth: container.clientWidth,
            firstHeaderVisible: isHorizontallyVisible(firstHeader),
            finalHeaderInitiallyVisible: isHorizontallyVisible(finalHeader),
            tabIndex: container.getAttribute("tabindex"),
            role: container.getAttribute("role"),
            label: container.getAttribute("aria-label"),
            instructionsVisible: Boolean(instructions && getComputedStyle(instructions).display !== "none"),
          };
        });
        return {
          h1: document.querySelectorAll("h1").length,
          sourceLinks: document.querySelectorAll("#comparison-sources + p a, [aria-labelledby='comparison-sources'] a").length,
          hasLimitation: text.includes("bugdrop limitation"),
          hasCompetitorWin: text.includes("the alternative wins when"),
          hasVerifiedDate: text.includes("last verified august 14, 2026"),
          hasDemo: Boolean(document.querySelector("a[href='/demo']")),
          hasInstall: Boolean(document.querySelector("a[href='/docs/installation']")),
          horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          tableScrollers,
        };
      });
      if (audit.h1 !== 1) throw new Error(`${slug}/${viewport.name}: expected one H1, got ${audit.h1}`);
      if (audit.sourceLinks < 2 || !audit.hasLimitation || !audit.hasCompetitorWin || !audit.hasVerifiedDate || !audit.hasDemo || !audit.hasInstall) {
        throw new Error(`${slug}/${viewport.name}: missing rendered evidence or conversion element: ${JSON.stringify(audit)}`);
      }
      if (audit.horizontalOverflow > 1) throw new Error(`${slug}/${viewport.name}: ${audit.horizontalOverflow}px horizontal overflow`);
      assert(audit.tableScrollers.length === 1, `${slug}/${viewport.name}: expected one identified table scroller`);
      const tableAudit = audit.tableScrollers[0];
      assert(tableAudit.tableSemantic && tableAudit.headerCount >= 3, `${slug}/${viewport.name}: table semantics or headers missing`);
      assert(["auto", "scroll"].includes(tableAudit.overflowX), `${slug}/${viewport.name}: overflow-x is ${tableAudit.overflowX}`);
      assert(tableAudit.tabIndex === "0" && tableAudit.role === "region" && tableAudit.label, `${slug}/${viewport.name}: table scroller is not keyboard-focusable and labelled`);
      assert(tableAudit.firstHeaderVisible, `${slug}/${viewport.name}: first header is not initially visible`);
      if (viewport.name === "mobile") {
        assert(tableAudit.scrollWidth > tableAudit.clientWidth, `${slug}/mobile: table does not expose a contained overflow range`);
        assert(!tableAudit.finalHeaderInitiallyVisible, `${slug}/mobile: expected final header to require horizontal scrolling`);
        assert(tableAudit.instructionsVisible, `${slug}/mobile: visible scrolling instruction is missing`);
      }
      if (errors.length) throw new Error(`${slug}/${viewport.name}: browser errors: ${errors.join(" | ")}`);
      const screenshot = `${output}/${viewport.name === "mobile" ? "mobile-initial" : "desktop"}-${slug}.png`;
      await page.screenshot({ path: screenshot, fullPage: true });

      let interactionAudit = null;
      if (viewport.name === "mobile") {
        const scroller = page.locator("[data-comparison-table-scroll]");
        await scroller.scrollIntoViewIfNeeded();
        const box = await scroller.boundingBox();
        assert(box, `${slug}/mobile: table scroller has no touch target box`);
        const cdp = await context.newCDPSession(page);
        const y = box.y + Math.min(box.height / 2, 120);
        const startX = box.x + box.width - 20;
        const endX = box.x + 20;
        await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: startX, y }] });
        for (let step = 1; step <= 8; step += 1) {
          const x = startX + ((endX - startX) * step) / 8;
          await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y }] });
        }
        await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
        await page.waitForTimeout(100);
        const touchScrollLeft = await scroller.evaluate((element) => element.scrollLeft);
        assert(touchScrollLeft > 0, `${slug}/mobile: touch gesture did not move the table scroller`);

        const pollScroller = async (predicate, message) => {
          const deadline = Date.now() + 1500;
          let state;
          do {
            state = await scroller.evaluate((element) => ({
              scrollLeft: element.scrollLeft,
              maxScrollLeft: element.scrollWidth - element.clientWidth,
            }));
            if (predicate(state)) return state;
            await page.waitForTimeout(16);
          } while (Date.now() < deadline);
          throw new Error(`${slug}/mobile: ${message}: ${JSON.stringify(state)}`);
        };

        await scroller.evaluate((element) => { element.scrollLeft = 0; });
        const resetState = await pollScroller(({ scrollLeft }) => scrollLeft === 0, "table scroller did not settle at reset zero");
        await scroller.focus();
        const focusOwned = await scroller.evaluate((element) => document.activeElement === element);
        assert(focusOwned, `${slug}/mobile: table scroller did not own focus`);
        await page.keyboard.press("ArrowRight");
        const keyboardState = await pollScroller(({ scrollLeft }) => scrollLeft > 0, "real ArrowRight input did not move the table scroller");

        for (let press = 0; press < 48; press += 1) await page.keyboard.press("ArrowRight");
        const finalState = await pollScroller(
          ({ scrollLeft, maxScrollLeft }) => scrollLeft === maxScrollLeft,
          "real ArrowRight input did not reach the end of the table",
        );

        const finalVisibility = await scroller.evaluate((container) => {
          const table = container.querySelector("table");
          const containerRect = container.getBoundingClientRect();
          const finalCells = [...(table?.querySelectorAll("tr") ?? [])].map((row) => row.lastElementChild?.getBoundingClientRect());
          return {
            finalCellsVisible: finalCells.every((rect) => rect && rect.left >= containerRect.left - 1 && rect.right <= containerRect.right + 1),
          };
        });
        assert(finalState.scrollLeft === finalState.maxScrollLeft, `${slug}/mobile: could not reach the end of the table`);
        assert(finalVisibility.finalCellsVisible, `${slug}/mobile: final header/cells are not fully visible at maximum scroll`);
        const scrolledScreenshot = `${output}/mobile-scrolled-${slug}.png`;
        await page.screenshot({ path: scrolledScreenshot, fullPage: true });
        interactionAudit = {
          touchScrollLeft,
          resetScrollLeft: resetState.scrollLeft,
          focusOwned,
          keyboardScrollLeft: keyboardState.scrollLeft,
          scrolledScreenshot,
          ...finalState,
          ...finalVisibility,
        };
      }
      results.push({ slug, viewport: viewport.name, screenshot, ...audit, interactionAudit });
      await page.close();
    }
    await context.close();
  }
} finally {
  await browser.close();
}

const contactBrowser = await chromium.launch({ headless: true });
try {
  for (const state of ["desktop", "mobile-initial", "mobile-scrolled"]) {
    const page = await contactBrowser.newPage({ viewport: { width: state === "desktop" ? 1320 : 1120, height: 900 } });
    const cards = await Promise.all(slugs.map(async (slug) => {
      const screenshot = await readFile(`${output}/${state}-${slug}.png`, "base64");
      return `<figure><figcaption>${slug} · ${state}</figcaption><img src="data:image/png;base64,${screenshot}" alt="${slug} ${state}"></figure>`;
    }));
    await page.setContent(`<style>
      *{box-sizing:border-box}body{margin:0;padding:20px;background:#111827;color:#fff;font:16px sans-serif}
      main{display:grid;grid-template-columns:repeat(${state === "desktop" ? 4 : 7},minmax(0,1fr));gap:16px;align-items:start}
      figure{margin:0;background:#030712;border:1px solid #374151;border-radius:8px;overflow:hidden}
      figcaption{padding:10px;font-weight:700}img{display:block;width:100%;height:auto}
    </style><main>${cards.join("")}</main>`, { waitUntil: "load" });
    await page.screenshot({ path: `${output}/contact-${state}.png`, fullPage: true });
    await page.close();
  }
} finally {
  await contactBrowser.close();
}

console.log(JSON.stringify({ status: "pass", pages: slugs.length, renderedStates: results.length, output, results }, null, 2));
