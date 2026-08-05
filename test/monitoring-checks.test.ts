import { describe, expect, it } from "vitest";
import { checkValidators } from "@/lib/monitoring/checks";

describe("monitoring response validation", () => {
  it("requires strict production health identity", async () => {
    const valid = Response.json({
      status: "ok",
      environment: "production",
      buildSha: "a".repeat(40),
    });
    expect(await checkValidators.validateHealth(valid)).toBeNull();

    const shallow = Response.json({ status: "ok", environment: "production" });
    expect(await checkValidators.validateHealth(shallow)).toBe("invalid_build_identity");
  });

  it("does not treat a generic GitHub response as installed", async () => {
    const valid = Response.json({
      installed: true,
      repo: "mean-weasel/bugdrop-widget-test",
    });
    expect(await checkValidators.validateGithubIntegration(valid)).toBeNull();

    const wrongRepo = Response.json({ installed: true, repo: "other/repo" });
    expect(await checkValidators.validateGithubIntegration(wrongRepo)).toBe(
      "github_app_unavailable",
    );
  });

  it("rejects HTML masquerading as the widget", async () => {
    const response = new Response("<html>" + "x".repeat(2000), {
      headers: { "content-type": "text/html" },
    });
    expect(await checkValidators.validateWidget(response)).toBe("unexpected_content_type");
  });
});
