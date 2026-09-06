import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const approvedPolicyHash =
  "e37f4372b1202a3c02b528aef48422893566cb477e0c0dcb83e3c396fb17a360";

describe("privacy page", () => {
  it("publishes the approved policy as a first-party route", async () => {
    const page = await readFile("src/app/privacy/page.tsx", "utf8");
    const policy = await readFile("src/content/privacy.mdx", "utf8");

    expect(page).toContain('path: "/privacy"');
    expect(page).toContain("<PrivacyPolicy />");
    expect(policy).toContain("# Privacy Policy");
    expect(policy).toContain("## Installation Information");
    expect(policy).toContain(
      "best-effort, unrounded per-installation count of successful GitHub",
    );
    expect(policy).toMatch(
      /The count begins when this collection is\s+enabled/,
    );
    expect(policy).toMatch(
      /anonymous aggregate counter and each\s+installation counter retain up to 1,024 recent random identifiers/,
    );
    expect(policy).toMatch(
      /deletion guard derived from the GitHub App installation\s+ID/,
    );
    expect(policy).toContain("The guard contains only an expiry time");
    expect(policy).toContain("deleted when the app is uninstalled");
    expect(policy).not.toContain(
      "does not currently retain per-installation feedback counts",
    );
    expect(policy).toContain("## App Names, Logos, Links, and Testimonials");
    expect(policy).toContain("privacy@bugdrop.dev");
    expect(createHash("sha256").update(policy).digest("hex")).toBe(
      approvedPolicyHash,
    );
  });

  it("links the landing-page footer and sitemap to the policy", async () => {
    const footer = await readFile("src/components/footer.tsx", "utf8");
    const sitemap = await readFile("src/app/sitemap.ts", "utf8");
    const showcase = await readFile("src/app/showcase/page.tsx", "utf8");

    expect(footer).toContain('{ label: "Privacy", href: "/privacy" }');
    expect(sitemap).toContain("{ url: `${base}/privacy` }");
    expect(showcase).toContain(
      "BugDrop publishes only aggregate install and feedback totals.",
    );
    expect(showcase).not.toContain(
      "BugDrop does not publish install data automatically.",
    );
  });
});
