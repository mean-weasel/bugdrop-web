import { readFileSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/vendor/bugdrop/d4b989b5acc568ffcc54dc6f7409a3dc20bc89db/api/feedback/route";
import {
  clearLocalSubmissionsForTests,
  createLocalSubmission,
  getLocalSubmission,
  isLocalInspectorMutationRequest,
  isLocalInspectorRequest,
} from "@/lib/public-flow-lab/local-submissions";

describe("public runtime lab boundary", () => {
  beforeEach(() => clearLocalSubmissionsForTests());
  afterEach(() => vi.unstubAllEnvs());

  it("is available only on the exact development origin", () => {
    expect(
      isLocalInspectorRequest("bugdrop.localhost:3000", "development"),
    ).toBe(true);
    expect(isLocalInspectorRequest("localhost:3000", "development")).toBe(
      false,
    );
    expect(
      isLocalInspectorRequest("bugdrop.localhost:3001", "development"),
    ).toBe(false);
    expect(
      isLocalInspectorRequest("bugdrop.localhost:3000", "production"),
    ).toBe(false);
  });

  it("returns a private local result with a canonical synthetic Issue URL", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const response = await POST(
      new Request(
        "http://bugdrop.localhost:3000/vendor/bugdrop/d4b989b5acc568ffcc54dc6f7409a3dc20bc89db/api/feedback",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            host: "bugdrop.localhost:3000",
            origin: "http://bugdrop.localhost:3000",
          },
          body: JSON.stringify({ repo: "mean-weasel/bugdrop-widget-test" }),
        },
      ),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      success: true,
      issueNumber: 1,
      issueUrl: "https://github.com/mean-weasel/bugdrop-widget-test/issues/1",
      isPublic: false,
    });
  });

  it("rejects cross-origin and simple-content-type mutations", async () => {
    expect(
      isLocalInspectorMutationRequest(
        "bugdrop.localhost:3000",
        "http://bugdrop.localhost:3000",
        "application/json; charset=utf-8",
        "development",
      ),
    ).toBe(true);
    expect(
      isLocalInspectorMutationRequest(
        "bugdrop.localhost:3000",
        "http://evil.localhost:4000",
        "application/json",
        "development",
      ),
    ).toBe(false);
    expect(
      isLocalInspectorMutationRequest(
        "bugdrop.localhost:3000",
        "http://bugdrop.localhost:3000",
        "text/plain",
        "development",
      ),
    ).toBe(false);
    vi.stubEnv("NODE_ENV", "development");
    const response = await POST(
      new Request(
        "http://bugdrop.localhost:3000/vendor/bugdrop/d4b989b5acc568ffcc54dc6f7409a3dc20bc89db/api/feedback",
        {
          method: "POST",
          headers: {
            "content-type": "text/plain",
            host: "bugdrop.localhost:3000",
            origin: "http://evil.localhost:4000",
          },
          body: JSON.stringify({ attacker: true }),
        },
      ),
    );
    expect(response.status).toBe(404);
    expect(getLocalSubmission(1)).toBeNull();
  });

  it("rejects the feedback route off-host and in production", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const offHost = await POST(
      new Request("http://localhost:3000/api/feedback", {
        method: "POST",
        headers: { host: "localhost:3000" },
        body: "{}",
      }),
    );
    expect(offHost.status).toBe(404);

    vi.stubEnv("NODE_ENV", "production");
    const production = await POST(
      new Request("http://bugdrop.localhost:3000/api/feedback", {
        method: "POST",
        headers: { host: "bugdrop.localhost:3000" },
        body: "{}",
      }),
    );
    expect(production.status).toBe(404);
    expect(getLocalSubmission(1)).toBeNull();
  });

  it("keeps a bounded process-local copy of payloads", () => {
    for (let index = 0; index < 24; index += 1) {
      createLocalSubmission({ index });
    }

    expect(getLocalSubmission(1)).toBeNull();
    expect(getLocalSubmission(5)?.payload).toEqual({ index: 4 });
    const record = getLocalSubmission(24);
    expect(record?.payload).toEqual({ index: 23 });
    if (record) record.payload.index = -1;
    expect(getLocalSubmission(24)?.payload).toEqual({ index: 23 });
  });

  it("vendors configs as examples without importing SDK source or declarations", () => {
    const configs = readFileSync(
      "src/components/variants-lab/public-flow-configs.ts",
      "utf8",
    );
    const runtime = readFileSync(
      "src/components/variants-lab/public-flow-lab.tsx",
      "utf8",
    );

    expect(configs).toContain('id: "lab-default-shaped-flow"');
    expect(configs).toContain('id: "lab-product-triage-flow"');
    expect(configs).toContain("NEEDS_TRIAGE_EVIDENCE");
    expect(configs).not.toMatch(/from ["'][^"']*bugdrop/);
    expect(runtime.match(/\.registerFlow\(/g)).toHaveLength(2);
    expect(runtime).toContain('data-show-issue-link="never"');
    expect(runtime).not.toContain("shadowRoot");
    expect(runtime).toContain("activeOpenedFlow.current?.close()");
    expect(runtime).toContain("if (!mounted.current) return;");
  });

  it("preserves generated agent guidance and ignores browser artifacts", () => {
    const agents = readFileSync("AGENTS.md", "utf8");
    const gitignore = readFileSync(".gitignore", "utf8");
    const generatedBlock = `<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in \`node_modules/next/dist/docs/\` (resolved from this file's directory; in monorepos the \`next\` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by \`next dev\` — verify at \`node_modules/next/dist/server/lib/generate-agent-files.js\`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->`;

    expect(agents.startsWith(generatedBlock)).toBe(true);
    expect(gitignore).toMatch(/^\/test-results\/$/m);
  });
});
