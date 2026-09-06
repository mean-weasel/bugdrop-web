import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("site navigation and footer", () => {
  it("keeps discovery pages out of the primary navigation", async () => {
    const nav = await readFile("src/components/nav.tsx", "utf8");
    expect(nav).not.toContain('href="/compare"');
    expect(nav).not.toContain('href="/resources"');
    expect(nav).toContain('href="/docs"');
    expect(nav).toContain('<ChapterLink id="flows">');
  });

  it("organizes footer links into standard destination groups", async () => {
    const footer = await readFile("src/components/footer.tsx", "utf8");
    for (const heading of ["Explore", "Developers", "Trust"]) {
      expect(footer).toContain(`title: "${heading}"`);
    }
    for (const destination of ["/compare", "/resources", "/docs", "/docs/security", "/status"]) {
      expect(footer).toContain(`href: "${destination}"`);
    }
    expect(footer).not.toContain("More from the maker");
    expect(footer).not.toContain("makerProducts");
  });

  it("keeps workflow discovery concise on the landing page", async () => {
    const features = await readFile("src/components/landing/features.tsx", "utf8");
    expect(features).not.toContain("Choose Your Feedback Workflow");
    expect(features).not.toContain("home.related.map");
    expect(features).toContain('href="/use-cases"');
    expect(features).toContain("Explore all feedback workflows");
  });

  it("exposes four concise landing chapters through the primary navigation", async () => {
    const hero = await readFile("src/components/landing/hero.tsx", "utf8");
    const nav = await readFile("src/components/nav.tsx", "utf8");
    const page = await readFile("src/app/page.tsx", "utf8");
    const styles = await readFile("src/app/globals.css", "utf8");
    const landingChapter = await readFile(
      "src/components/landing/landing-chapter.tsx",
      "utf8",
    );

    for (const id of ["overview", "demo", "flows", "get-started"]) {
      expect(page).toContain(`id="${id}"`);
      expect(nav).toContain(`id="${id}"`);
    }
    expect(page.match(/<LandingChapter/g)).toHaveLength(4);
    expect(hero).toContain('data-homepage-hero-activate');
    expect(hero).toContain('href="#flows"');
    expect(styles).toContain("scroll-behavior: smooth");
    expect(styles).toContain("min-height: calc(100svh - 4.5rem)");
    expect(styles).toContain("prefers-reduced-motion: reduce");
    const chapterContentRule = styles.match(
      /\.landing-chapter-content\s*{([^}]*)}/,
    )?.[1];
    expect(chapterContentRule).toBeDefined();
    expect(chapterContentRule).not.toContain("opacity: 0");
    expect(landingChapter).not.toContain("IntersectionObserver");
    expect(nav).toContain('behavior: reduceMotion ? "auto" : "smooth"');
  });

  it("audits the current hero and floating Classic feedback controls", async () => {
    const audit = await readFile(
      "scripts/performance-experience-audit.mjs",
      "utf8",
    );

    expect(audit).toContain('[data-analytics-event="landing_cta_click"]');
    expect(audit).toContain('href="#demo"');
    expect(audit).toContain("Open BugDrop feedback|Open Feedback demo");
    expect(audit).not.toContain('data-analytics-label="Try it on this page"');
  });

  it("keeps setup focused on install and the complete guide", async () => {
    const page = await readFile("src/app/page.tsx", "utf8");
    const quickStart = await readFile(
      "src/components/landing/quick-start.tsx",
      "utf8",
    );
    expect(page).not.toContain("Portable review resources");
    expect(page).not.toContain("/resources/visual-bug-report-template");
    expect(quickStart).toContain('href="/docs/installation"');
    expect(quickStart).toContain("Read the complete setup guide");
  });
});
