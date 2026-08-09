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
      monitoringStartedAt: "2026-08-01T00:00:00.000Z",
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
          monitoredDays30d: 4,
          history30d: dailyHistory("c6f26444-e385-4dbc-9a37-833f47c7aab4"),
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
    expect(html).toContain("30-day reliability");
    expect(html).toContain("4 of 30");
    expect(html).toContain('href="#incident-c6f26444-e385-4dbc-9a37-833f47c7aab4"');
    expect(html).toContain("Aug 3, 2026: Degraded · No trustworthy monitoring samples were recorded · 1 confirmed incident.");
    expect(html).toContain("Before monitoring");
    expect(html).toContain("Historical checks");
    expect(html).toContain("Monitoring gap");
    expect(html).not.toContain("All systems are operational");
  });
});

function dailyHistory(incidentId: string) {
  return Array.from({ length: 30 }, (_, index) => {
    const date = new Date(Date.UTC(2026, 6, 7 + index)).toISOString().slice(0, 10);
    if (index < 25) {
      return {
        date,
        status: "unknown" as const,
        dataState: "pre_monitoring" as const,
        uptime: null,
        checks: 0,
        successfulChecks: 0,
        incidentIds: [],
      };
    }
    if (index === 26) {
      return {
        date,
        status: "unknown" as const,
        dataState: "historical" as const,
        uptime: 100,
        checks: 20,
        successfulChecks: 20,
        incidentIds: [],
      };
    }
    if (index === 27) {
      return {
        date,
        status: "degraded" as const,
        dataState: "monitoring_gap" as const,
        uptime: null,
        checks: 0,
        successfulChecks: 0,
        incidentIds: [incidentId],
      };
    }
    if (index === 28) {
      return {
        date,
        status: "degraded" as const,
        dataState: "monitored" as const,
        uptime: 95,
        checks: 20,
        successfulChecks: 19,
        incidentIds: [incidentId],
      };
    }
    return {
      date,
      status: "operational" as const,
      dataState: "monitored" as const,
      uptime: 100,
      checks: 20,
      successfulChecks: 20,
      incidentIds: [],
    };
  });
}
