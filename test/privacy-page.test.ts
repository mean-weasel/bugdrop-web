import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const approvedPolicyHash =
  "200a804728e3b16c76eeeb88a1fc4cd33a4b07bb3b1b267647444244a07f4b90";

describe("privacy page", () => {
  it("publishes the approved policy as a first-party route", async () => {
    const page = await readFile("src/app/privacy/page.tsx", "utf8");
    const policy = await readFile("src/content/privacy.mdx", "utf8");

    expect(page).toContain('path: "/privacy"');
    expect(page).toContain("<PrivacyPolicy />");
    expect(policy).toContain("# Privacy Policy");
    expect(policy).toContain("## Installation Information");
    expect(policy).toMatch(
      /BugDrop does not\s+currently retain per-installation feedback counts or last-active dates\./,
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
