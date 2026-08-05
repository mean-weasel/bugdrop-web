import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { StatusDashboard } from "@/components/status/status-dashboard";
import type { PublicStatusSnapshot } from "@/lib/monitoring/types";

describe("StatusDashboard", () => {
  it("renders degraded proof as degraded instead of claiming an outage or health", () => {
    const snapshot: PublicStatusSnapshot = {
      schemaVersion: 1,
      overall: "degraded",
      generatedAt: "2026-08-05T08:00:00.000Z",
      lastEvaluatedAt: "2026-08-05T07:55:00.000Z",
      evaluatorFresh: true,
      components: [
        {
          id: "issue_delivery",
          name: "Issue delivery",
          description: "Recent end-to-end proof.",
          status: "degraded",
          lastCheckedAt: "2026-08-05T07:55:00.000Z",
          lastVerifiedAt: "2026-08-05T00:00:00.000Z",
          uptime30d: 99.5,
        },
      ],
      incidents: [
        {
          id: "c6f26444-e385-4dbc-9a37-833f47c7aab4",
          componentId: "issue_delivery",
          componentName: "Issue delivery",
          state: "open",
          impact: "degraded",
          title: "Issue delivery is degraded",
          message: "BugDrop has not received recent end-to-end verification.",
          startedAt: "2026-08-05T07:00:00.000Z",
          resolvedAt: null,
        },
      ],
    };

    const html = renderToStaticMarkup(StatusDashboard({ snapshot }));
    expect(html).toContain("Some systems are degraded");
    expect(html).toContain("Issue delivery is degraded");
    expect(html).toContain("Investigating");
    expect(html).not.toContain("All systems are operational");
  });
});
