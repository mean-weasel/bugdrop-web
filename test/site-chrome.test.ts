import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("site navigation and footer", () => {
  it("keeps discovery pages out of the primary navigation", async () => {
    const nav = await readFile("src/components/nav.tsx", "utf8");

    expect(nav).not.toContain('href="/compare"');
    expect(nav).not.toContain('href="/resources"');
    expect(nav).toContain('href="/docs"');
    expect(nav).toContain('href="/use-cases"');
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

  it("links to resources without rendering a resource directory", async () => {
    const page = await readFile("src/app/page.tsx", "utf8");
    const quickStart = await readFile(
      "src/components/landing/quick-start.tsx",
      "utf8",
    );

    expect(page).not.toContain("Portable review resources");
    expect(page).not.toContain("/resources/visual-bug-report-template");
    expect(quickStart).toContain('href="/resources"');
    expect(quickStart).toContain("Browse portable review resources");
  });
});
