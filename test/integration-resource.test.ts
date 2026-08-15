import { readFile, readdir } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { shouldLoadBugDropInPreview } from "@/components/integrations/vercel-preview-bugdrop";
import { resourceNav } from "@/lib/resource-nav";
import { portableResourceText } from "@/lib/resources/portable-text";
import { widgetScriptTag } from "@/lib/links";

describe("T012 integration and resource contracts", () => {
  it("loads the Vercel integration only in preview", () => {
    expect(shouldLoadBugDropInPreview("preview")).toBe(true);
    expect(shouldLoadBugDropInPreview("production")).toBe(false);
    expect(shouldLoadBugDropInPreview("development")).toBe(false);
    expect(shouldLoadBugDropInPreview(undefined)).toBe(false);
  });

  it("keeps the authoritative widget snippet synchronous", () => {
    const snippet = widgetScriptTag("owner/repo");
    expect(snippet).toContain('src="https://bugdrop.neonwatty.workers.dev/widget.js"');
    expect(snippet).toContain('data-repo="owner/repo"');
    expect(snippet).not.toMatch(/\b(?:async|defer)\b/);
  });

  it("publishes exactly the two approved reusable resources", async () => {
    expect(resourceNav.map(({ slug }) => slug).sort()).toEqual([
      "client-website-qa-checklist",
      "visual-bug-report-template",
    ]);
    const content = (await readdir("src/content/resources")).filter((file) => file.endsWith(".mdx")).sort();
    const downloads = (await readdir("public/resources")).filter((file) => file.endsWith(".md")).sort();
    expect(content).toEqual(downloads.map((file) => file.replace(/\.md$/, ".mdx")));
  });

  it.each(resourceNav)("keeps $slug download identical to the copy action", async (resource) => {
    const download = await readFile(`public${resource.downloadPath}`, "utf8");
    expect(download.trim()).toBe(portableResourceText[resource.slug].trim());
  });

  it("instruments portable actions and resource-specific secondary conversions", async () => {
    const actions = await readFile("src/components/resources/resource-actions.tsx", "utf8");
    for (const event of ["resource_copy_click", "resource_download_click", "resource_print_click"]) {
      expect(actions).toContain(`data-analytics-event=\"${event}\"`);
    }
    expect(actions).toContain("data-analytics-label={analyticsLabel}");
    expect(actions).toContain("{printLabel}");

    const page = await readFile("src/app/resources/[slug]/page.tsx", "utf8");
    expect(page).toContain('event: "resource_demo_click"');
    expect(page).toContain('event: "resource_sandbox_click"');
    expect(page).toContain("data-resource-secondary-conversion={resource.slug}");
    expect(page).toContain("data-analytics-label={resource.slug}");
  });
});
