import { readFile, readdir } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { shouldLoadBugDropInPreview } from "@/components/integrations/vercel-preview-bugdrop";
import { resourceNav } from "@/lib/resource-nav";
import { portableResourceText } from "@/lib/resources/portable-text";
import { widgetScriptTag } from "@/lib/links";
import { widgetCspSource } from "../next.config";

const homepageCiRuntime =
  "/vendor/bugdrop/81293491bf9924879465c668a391a5e4aeae912d/widget.js";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractYamlBlock(source: string, header: RegExp, label: string) {
  const lines = source.split(/\r?\n/);
  const starts = lines.flatMap((line, index) => (header.test(line) ? [index] : []));
  expect(starts, `expected exactly one ${label} block`).toHaveLength(1);
  const start = starts[0];
  const indentation = lines[start].match(/^ */)?.[0].length ?? 0;
  let end = lines.length;

  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.trim() === "") continue;
    const nextIndentation = line.match(/^ */)?.[0].length ?? 0;
    if (nextIndentation <= indentation) {
      end = index;
      break;
    }
  }

  return lines.slice(start, end).join("\n");
}

function assertHomepageCiContract(workflow: string) {
  const triggers = extractYamlBlock(workflow, /^on:\s*$/, "workflow trigger");
  expect(triggers).toMatch(/^  pull_request:\s*$/m);
  expect(triggers).toMatch(/^  merge_group:\s*$/m);

  const jobs = extractYamlBlock(workflow, /^jobs:\s*$/, "jobs");
  const job = extractYamlBlock(
    jobs,
    /^  homepage-feedback-experiences:\s*$/,
    "homepage-feedback-experiences job",
  );
  expect(job).toMatch(/^    needs:\s*check\s*$/m);
  expect(job).toMatch(/^        run: npx playwright install --with-deps chromium\s*$/m);
  expect(job).toMatch(/^          NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO_ENABLED: "true"\s*$/m);
  expect(job).toMatch(
    new RegExp(
      `^          NEXT_PUBLIC_BUGDROP_WIDGET_URL: ${escapeRegExp(homepageCiRuntime)}\\s*$`,
      "m",
    ),
  );
  expect(job).toMatch(
    /^          npx playwright test e2e\/homepage-flow-demo\.spec\.ts\s*$/m,
  );
  expect(job).toMatch(
    /^          --project=desktop-chromium --project=mobile-chromium --retries=0\s*$/m,
  );
  expect(job).not.toMatch(
    /\b(?:real[-_ ]?canary|canary(?:[_-]?(?:selector|mode|token))?|(?:github|gh|issue)[_-]?token)\b|\btoken\s*:|\bissues?\s*:\s*write\b|\b(?:create|update|delete|close)[-_ ]?issue\b|\bissue[_-]?(?:number|mutation|repo|title)\s*:/i,
  );
}

describe("T012 integration and resource contracts", () => {
  it("uses the external origin for an absolute widget runtime URL", () => {
    expect(
      widgetCspSource("https://bugdrop.neonwatty.workers.dev/widget.js"),
    ).toBe("https://bugdrop.neonwatty.workers.dev");
  });

  it("allows a root-relative widget runtime as a same-origin CSP source", () => {
    expect(
      widgetCspSource(
        "/vendor/bugdrop/81293491bf9924879465c668a391a5e4aeae912d/widget.js",
      ),
    ).toBe("'self'");
  });

  it.each([
    "//cdn.example.com/widget.js",
    "vendor/bugdrop/widget.js",
    "https://",
    "javascript:alert(1)",
    "file:///tmp/widget.js",
    "https://user:password@example.com/widget.js",
    "/\\\\cdn.example.com/widget.js",
    " https://bugdrop.neonwatty.workers.dev/widget.js",
  ])("rejects an unsafe widget runtime URL: %s", (value) => {
    expect(() => widgetCspSource(value)).toThrow("Unsafe BugDrop widget URL");
  });

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

  it("keeps the homepage widget out of the initial critical path", async () => {
    const homepage = await readFile("src/app/page.tsx", "utf8");
    const loader = await readFile("src/components/landing/homepage-widget.tsx", "utf8");
    const runtime = await readFile("src/components/landing/homepage-demo-runtime.ts", "utf8");

    expect(homepage).toContain("<HomepageWidget />");
    expect(homepage).not.toContain("<script");
    expect(loader).toContain('data-homepage-widget-activate');
    expect(loader).toContain('script.src = WIDGET_URL');
    expect(loader).toContain('script.async = false');
    expect(loader).toContain('script.dataset.repo = SAMPLE_DEMO_REPO');
    expect(loader).toContain('document.body.append(script)');
    expect(runtime).toContain('const SCRIPT_ID = "bugdrop-homepage-demo"');
    expect(runtime).toContain('script.async = false');
    expect(runtime).toContain('document.body.append(script)');
    expect(runtime).toContain('button: "false"');
    expect(runtime).toContain('showIssueLink: "always"');
  });

  it("keeps homepage feedback experiences as an additive, local-only browser gate", async () => {
    const workflow = await readFile(".github/workflows/ci.yml", "utf8");
    assertHomepageCiContract(workflow);
  });

  it("rejects decoy or unsafe homepage feedback CI configurations", async () => {
    const workflow = await readFile(".github/workflows/ci.yml", "utf8");
    const moveRequiredLinesToDecoy = workflow
      .replace("        run: npx playwright install --with-deps chromium", "        run: echo skipped")
      .replace('          NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO_ENABLED: "true"', '          NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO_ENABLED: "false"')
      .replace(
        `          NEXT_PUBLIC_BUGDROP_WIDGET_URL: ${homepageCiRuntime}`,
        "          NEXT_PUBLIC_BUGDROP_WIDGET_URL: /widget.js",
      ) + `\n  decoy:\n    steps:\n      - run: npx playwright install --with-deps chromium\n      - env:\n          NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO_ENABLED: "true"\n          NEXT_PUBLIC_BUGDROP_WIDGET_URL: ${homepageCiRuntime}\n`;
    const moveCommandToDecoy = workflow
      .replace(
        "          npx playwright test e2e/homepage-flow-demo.spec.ts\n          --project=desktop-chromium --project=mobile-chromium --retries=0",
        "          echo skipped",
      ) + "\n  decoy-command:\n    steps:\n      - run: >-\n          npx playwright test e2e/homepage-flow-demo.spec.ts\n          --project=desktop-chromium --project=mobile-chromium --retries=0\n";

    const adversarialWorkflows = [
      workflow.replace("  pull_request:\n", "  # pull_request:\n"),
      workflow.replace("  merge_group:\n", "  # merge_group:\n"),
      workflow.replace("    needs: check", "    needs: other"),
      moveRequiredLinesToDecoy,
      moveCommandToDecoy,
      workflow.replace("e2e/homepage-flow-demo.spec.ts", "e2e/other.spec.ts"),
      workflow.replace("--project=desktop-chromium", "--project=chromium"),
      workflow.replace("--project=mobile-chromium", "--project=webkit"),
      workflow.replace("--retries=0", "--retries=1"),
      workflow.replace(homepageCiRuntime, "/vendor/bugdrop/latest/widget.js"),
      workflow.replace(
        'NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO_ENABLED: "true"',
        'NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO_ENABLED: "false"',
      ),
      workflow.replace(
        "      - name: Test homepage feedback experiences",
        "      - name: Test homepage feedback experiences\n        env:\n          REAL_CANARY: true",
      ),
      workflow.replace(
        "      - name: Test homepage feedback experiences",
        "      - name: Test homepage feedback experiences\n        env:\n          GITHUB_TOKEN: secret",
      ),
      workflow.replace(
        "      - name: Test homepage feedback experiences",
        "      - name: Test homepage feedback experiences\n        permissions:\n          issues: write",
      ),
    ];

    for (const adversarial of adversarialWorkflows) {
      expect(() => assertHomepageCiContract(adversarial)).toThrow();
    }
  });

  it("loads GA only after a tracked intent while preserving the queued page view", async () => {
    const analytics = await readFile("src/components/analytics.tsx", "utf8");
    const journeyAudit = await readFile("scripts/analytics-journey-audit.mjs", "utf8");

    expect(analytics).toContain("window.bugdropGaConfigured");
    expect(analytics).toContain('window.gtag("config", gaMeasurementId, { send_page_view: false })');
    expect(analytics).toContain("sendGooglePageView(currentPagePath, attribution)");
    expect(analytics).toMatch(/sendGoogleAnalytics\("event", eventName, properties\);\s+activateGoogleAnalytics\(\);/);
    expect(analytics).toContain("gaMeasurementId && gaActivated");
    expect(analytics).toContain("data-ga-intent-library");
    expect(journeyAudit).toContain("passive browsing requested GTM");
    expect(journeyAudit).toContain("expected 1 after intent");
  });

  it("keeps corrected text colors explicit for emitted-palette proof", async () => {
    const globals = await readFile("src/app/globals.css", "utf8");

    expect(globals).toContain("--color-text-muted: #b8c2e8");
    expect(globals).toContain("--color-text-subtle: #b4bde5");
    expect(globals).not.toContain("--color-text-muted: #565f89");
    expect(globals).not.toContain("--color-text-subtle: #787c99");
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
