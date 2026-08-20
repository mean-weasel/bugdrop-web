import { readFile, readdir } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { shouldLoadBugDropInPreview } from "@/components/integrations/vercel-preview-bugdrop";
import { resourceNav } from "@/lib/resource-nav";
import { portableResourceText } from "@/lib/resources/portable-text";
import {
  CLASSIC_WIDGET_URL,
  HOMEPAGE_DOGFOOD_RUNTIME_PATH,
  HOMEPAGE_SHOWCASE_WIDGET_URL,
  resolveWidgetUrl,
  widgetScriptTag,
} from "@/lib/links";
import { mdxHeadingId } from "@/mdx-components";
import { widgetCspSource } from "../next.config";

const homepageCiRuntime =
  "/vendor/bugdrop/47a392d1e7b1a8d8adeff1692f6bbbd84696280d/widget.js";

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

  const permissions = extractYamlBlock(workflow, /^permissions:\s*$/, "workflow permissions");
  expect(permissions.trim()).toBe("permissions:\n  contents: read");
  expect(workflow).not.toMatch(/^env\s*:/m);
  expect(workflow).not.toMatch(/^defaults\s*:/m);

  const activeWorkflow = workflow
    .split(/\r?\n/)
    .filter((line) => !line.trimStart().startsWith("#"))
    .join("\n");
  expect(
    activeWorkflow
      .split(/\r?\n/)
      .flatMap((line) => {
        const match = line.match(/^([a-z][a-z0-9_-]*):(?:\s|$)/i);
        return match ? [match[1]] : [];
      }),
  ).toEqual(["name", "on", "permissions", "jobs"]);
  expect(activeWorkflow).not.toMatch(
    /\bsecrets\.|\b[A-Z0-9_]*(?:TOKEN|SECRET|CANARY|ISSUE|REPOSITORY)[A-Z0-9_]*\s*:|\bgh\s+(?:api|issue|repo|release)\b|\bcurl\b[^\n]*(?:api\.github\.com|\/issues(?:\/|\s|$))|\bgit\s+push\b|\bnpm\s+publish\b|\b[a-z-]+\s*:\s*write\b/i,
  );

  const jobs = extractYamlBlock(workflow, /^jobs:\s*$/, "jobs");
  const job = extractYamlBlock(
    jobs,
    /^  homepage-feedback-experiences:\s*$/,
    "homepage-feedback-experiences job",
  );
  expect(job.trimEnd()).toBe(`  homepage-feedback-experiences:
    needs: check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm

      - run: npm ci

      - name: Install Chromium
        run: npx playwright install --with-deps chromium

      - name: Test homepage feedback experiences
        env:
          NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO_ENABLED: "true"
          NEXT_PUBLIC_BUGDROP_WIDGET_URL: ${homepageCiRuntime}
        run: >-
          npx playwright test e2e/homepage-flow-demo.spec.ts
          --project=desktop-chromium --project=mobile-chromium --retries=0`);
  expect(job).toMatch(/^    needs:\s*check\s*$/m);
  expect(job).not.toMatch(/^    if\s*:/m);
  expect(job).not.toMatch(/^    permissions\s*:/m);

  const checkout = extractYamlBlock(
    job,
    /^      - uses: actions\/checkout@v4\s*$/,
    "homepage checkout step",
  );
  expect(checkout.trim()).toBe("- uses: actions/checkout@v4");
  const setupNode = extractYamlBlock(
    job,
    /^      - uses: actions\/setup-node@v4\s*$/,
    "homepage setup-node step",
  );
  expect(setupNode).toMatch(/^        with:\s*$/m);
  expect(setupNode).toMatch(/^          node-version:\s*24\s*$/m);
  expect(setupNode).toMatch(/^          cache:\s*npm\s*$/m);
  expect(setupNode.match(/^          (?:node-version|cache):/gm)).toHaveLength(2);

  const npmCi = "      - run: npm ci";
  const installChromium = "        run: npx playwright install --with-deps chromium";
  const testCommand = "          npx playwright test e2e/homepage-flow-demo.spec.ts";
  expect(job.match(/^      - run: npm ci\s*$/gm)).toHaveLength(1);
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
  expect(job.indexOf(checkout)).toBeLessThan(job.indexOf(setupNode));
  expect(job.indexOf(setupNode)).toBeLessThan(job.indexOf(npmCi));
  expect(job.indexOf(npmCi)).toBeLessThan(job.indexOf(installChromium));
  expect(job.indexOf(installChromium)).toBeLessThan(job.indexOf(testCommand));
  expect(job).not.toMatch(
    /\b(?:real[-_ ]?canary|canary(?:[_-]?(?:selector|mode|token))?|(?:github|gh|issue)[_-]?token)\b|\btoken\s*:|\bpermissions\s*:\s*inherit\b|\b[a-z-]+\s*:\s*write\b|\b(?:create|update|delete|close)[-_ ]?issue\b|\bissue[_-]?(?:number|mutation|repo|title)\s*:/i,
  );
}

describe("T012 integration and resource contracts", () => {
  it("shares the fail-closed enabled-showcase runtime policy with CSP", () => {
    const localAbsolute =
      `http://BUGDROP.LOCALHOST:3000${HOMEPAGE_DOGFOOD_RUNTIME_PATH}`;
    const dotSegmentRuntime =
      "http://bugdrop.localhost:3000/vendor/bugdrop/./47a392d1e7b1a8d8adeff1692f6bbbd84696280d/widget.js";

    expect(widgetCspSource(resolveWidgetUrl("true", HOMEPAGE_SHOWCASE_WIDGET_URL)))
      .toBe("https://bugdrop.neonwatty.workers.dev");
    expect(widgetCspSource(resolveWidgetUrl("true", HOMEPAGE_DOGFOOD_RUNTIME_PATH)))
      .toBe("'self'");
    expect(widgetCspSource(resolveWidgetUrl("true", localAbsolute)))
      .toBe("http://bugdrop.localhost:3000");
    expect(widgetCspSource(resolveWidgetUrl("false", undefined))).toBe(
      "https://bugdrop.neonwatty.workers.dev",
    );
    expect(resolveWidgetUrl("false", undefined)).toBe(CLASSIC_WIDGET_URL);

    expect(() => resolveWidgetUrl("true", undefined)).toThrow();
    expect(() => resolveWidgetUrl("true", CLASSIC_WIDGET_URL)).toThrow();
    expect(() => resolveWidgetUrl("true", "https://example.com/widget.v1.56.3.js"))
      .toThrow();
    expect(() => widgetCspSource(resolveWidgetUrl("true", dotSegmentRuntime))).toThrow(
      "Enabled homepage showcase requires the exact v1.56.3 public runtime or an approved local fixture",
    );
  });

  it("uses the external origin for an absolute widget runtime URL", () => {
    expect(
      widgetCspSource(HOMEPAGE_SHOWCASE_WIDGET_URL),
    ).toBe("https://bugdrop.neonwatty.workers.dev");
  });

  it("allows a root-relative widget runtime as a same-origin CSP source", () => {
    expect(
      widgetCspSource(
        "/vendor/bugdrop/47a392d1e7b1a8d8adeff1692f6bbbd84696280d/widget.js",
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

  it("keeps the screenshot privacy checklist identical across page and portable actions", async () => {
    const pageChecklist = await readFile("src/content/resources/screenshot-privacy-checklist.mdx", "utf8");
    const checklistItems = (markdown: string) =>
      [...markdown.matchAll(/^- \[ \] (.+)$/gm)].map((match) => match[1]);

    expect(checklistItems(portableResourceText["screenshot-privacy-checklist"])).toEqual(
      checklistItems(pageChecklist),
    );
  });

  it("generates stable MDX heading IDs without changing heading text", () => {
    expect(mdxHeadingId("Screenshot masking")).toBe("screenshot-masking");
    expect(mdxHeadingId("What “simpler” costs")).toBe("what-simpler-costs");
    expect(mdxHeadingId("429 Response Behavior")).toBe("429-response-behavior");
    expect(mdxHeadingId("Screenshot masking")).toBe(mdxHeadingId("Screenshot masking"));
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
    expect(runtime).toContain('showIssueLink: "public"');
    expect(runtime).not.toContain('showIssueLink: "always"');
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
    const moveSetupToDecoy = workflow
      .replaceAll(
        "      - uses: actions/setup-node@v4\n        with:\n          node-version: 24\n          cache: npm",
        "      - run: echo setup skipped",
      ) + "\n  decoy-setup:\n    steps:\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 24\n          cache: npm\n";
    const moveCheckoutToDecoy = workflow
      .replaceAll("      - uses: actions/checkout@v4", "      - run: echo checkout skipped")
      + "\n  decoy-checkout:\n    steps:\n      - uses: actions/checkout@v4\n";
    const moveNpmCiToDecoy = workflow
      .replaceAll("      - run: npm ci", "      - run: echo npm ci")
      + "\n  decoy-install:\n    steps:\n      - run: npm ci\n";

    const adversarialWorkflows = [
      workflow.replace("  pull_request:\n", "  # pull_request:\n"),
      workflow.replace("  merge_group:\n", "  # merge_group:\n"),
      workflow.replace("    needs: check", "    needs: other"),
      workflow.replace(
        "  homepage-feedback-experiences:\n",
        "  homepage-feedback-experiences:\n    if: github.event_name == 'pull_request'\n",
      ),
      moveCheckoutToDecoy,
      workflow.replaceAll("actions/checkout@v4", "actions/checkout@v3"),
      moveSetupToDecoy,
      workflow.replaceAll("node-version: 24", "node-version: 22"),
      workflow.replaceAll("cache: npm", "cache: yarn"),
      moveNpmCiToDecoy,
      workflow.replaceAll("      - run: npm ci", "      - run: echo npm ci"),
      moveRequiredLinesToDecoy,
      moveCommandToDecoy,
      workflow.replace("e2e/homepage-flow-demo.spec.ts", "e2e/other.spec.ts"),
      workflow.replace("--project=desktop-chromium", "--project=chromium"),
      workflow.replace("--project=mobile-chromium", "--project=webkit"),
      workflow.replace("--retries=0", "--retries=1"),
      workflow.replace(homepageCiRuntime, "/vendor/bugdrop/latest/widget.js"),
      workflow.replace(
        homepageCiRuntime,
        "/vendor/bugdrop/81293491bf9924879465c668a391a5e4aeae912d/widget.js",
      ),
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
      workflow.replace("permissions:\n  contents: read", "permissions:\n  contents: write"),
      workflow.replace(
        "permissions:\n  contents: read",
        "permissions:\n  contents: read\n  issues: write",
      ),
      workflow.replace(
        "  homepage-feedback-experiences:\n",
        "  homepage-feedback-experiences:\n    permissions: inherit\n",
      ),
      workflow.replace(
        "  homepage-feedback-experiences:\n",
        "  homepage-feedback-experiences:\n    permissions:\n      contents: write\n",
      ),
      workflow.replace(
        "permissions:\n  contents: read\n",
        "permissions:\n  contents: read\n\nenv:\n  GITHUB_TOKEN: ${{ secrets.REAL_CANARY_TOKEN }}\n",
      ),
      workflow.replace(
        "permissions:\n  contents: read\n",
        "permissions:\n  contents: read\n\nenv:\n  ISSUE_MUTATION: enabled\n",
      ),
      workflow.replace(
        "permissions:\n  contents: read\n",
        "permissions:\n  contents: read\n\ndefaults:\n  run:\n    shell: bash -c 'gh issue create'\n",
      ),
      workflow.replace(
        "      - name: Test monitoring",
        "      - run: gh issue create --repo mean-weasel/bugdrop-widget-test\n\n      - name: Test monitoring",
      ),
      workflow.replace(
        "      - name: Install Chromium",
        "      - run: node -e \"fetch('https://api.github.com/repos/mean-weasel/bugdrop-widget-test/issues',{method:'POST'})\"\n\n      - name: Install Chromium",
      ),
      workflow.replace(
        "      - name: Install Chromium",
        "      - run: wget --post-data='{}' https://api.github.com/repos/mean-weasel/bugdrop-widget-test/issues\n\n      - name: Install Chromium",
      ),
      workflow.replace(
        "      - name: Install Chromium",
        "      - uses: attacker/public-issue-writer@v1\n\n      - name: Install Chromium",
      ),
      workflow.replace(
        "  homepage-feedback-experiences:\n",
        "  homepage-feedback-experiences:\n    timeout-minutes: 120\n",
      ),
      workflow.replace("permissions:\n", "concurrency: homepage-demo\n\npermissions:\n"),
    ];

    for (const [index, adversarial] of adversarialWorkflows.entries()) {
      expect(
        () => assertHomepageCiContract(adversarial),
        `adversarial workflow ${index + 1} unexpectedly passed`,
      ).toThrow();
    }

    const commentedDecoys = workflow
      + "\n# env:\n#   GITHUB_TOKEN: ${{ secrets.REAL_CANARY_TOKEN }}\n"
      + "# defaults:\n#   run:\n#     shell: gh issue create\n";
    expect(() => assertHomepageCiContract(commentedDecoys)).not.toThrow();
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

  it("publishes exactly the three approved reusable resources", async () => {
    expect(resourceNav.map(({ slug }) => slug).sort()).toEqual([
      "client-website-qa-checklist",
      "screenshot-privacy-checklist",
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
    expect(page).toContain('event: "privacy_checklist_demo_click"');
    expect(page).toContain("data-resource-secondary-conversion={resource.slug}");
    expect(page).toContain("data-analytics-label={resource.slug}");
  });
});
