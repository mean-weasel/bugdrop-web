import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { StatusDashboard } from "@/components/status/status-dashboard";
import type { PublicStatusSnapshot } from "@/lib/monitoring/types";

describe("StatusDashboard", () => {
  it("presents heartbeat-stale Issue delivery proof as neutral without changing raw severity", () => {
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
          statusDetail: "verification_delayed",
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
    expect(html).toContain("Issue delivery verification is delayed");
    expect(html).toContain("Verification delayed");
    expect(html).not.toContain("Issue delivery is degraded");
    expect(html).not.toContain("Investigating");
    expect(html).toContain("30-day reliability");
    expect(html).toContain("4 of 30");
    expect(html).toContain('href="#incident-c6f26444-e385-4dbc-9a37-833f47c7aab4"');
    expect(html).toContain("Aug 3, 2026: Verification delayed · Recent end-to-end delivery proof is unavailable.");
    expect(html).toContain("Before monitoring");
    expect(html).toContain("Historical checks");
    expect(html).toContain("Monitoring gap");
    expect(html).not.toContain("All systems are operational");
  });

  it("retains genuine severity when another component is degraded or Issue delivery has no delayed detail", () => {
    const delayed = snapshotWithComponents([
      component("issue_delivery", "degraded", "verification_delayed"),
      component("github_integration", "degraded", null),
    ]);
    const delayedHtml = renderToStaticMarkup(StatusDashboard({ snapshot: delayed }));
    expect(delayedHtml).toContain("Some systems are degraded");
    expect(delayedHtml).toContain("GitHub integration is degraded");
    expect(delayedHtml).toContain("Investigating");

    const deliveryFailure = snapshotWithComponents([component("issue_delivery", "degraded", null)]);
    const failureHtml = renderToStaticMarkup(StatusDashboard({ snapshot: deliveryFailure }));
    expect(failureHtml).toContain("Some systems are degraded");
    expect(failureHtml).toContain("Issue delivery is degraded");
    expect(failureHtml).toContain("Investigating");

    const outage = snapshotWithComponents([component("feedback_api", "outage", null)]);
    expect(renderToStaticMarkup(StatusDashboard({ snapshot: outage }))).toContain("A service outage is in progress");
  });
});

function component(id: string, status: "degraded" | "outage", statusDetail: "verification_delayed" | null) {
  return {
    id,
    name: id === "github_integration" ? "GitHub integration" : id === "feedback_api" ? "Feedback API" : "Issue delivery",
    description: "Component status.",
    status,
    statusDetail,
    lastCheckedAt: "2026-08-05T07:55:00.000Z",
    lastVerifiedAt: "2026-08-05T00:00:00.000Z",
    uptime30d: 99.5,
    monitoredDays30d: 4,
    history30d: dailyHistory(`${id}-incident`),
  };
}

function snapshotWithComponents(components: ReturnType<typeof component>[]): PublicStatusSnapshot {
  const overall = components.some((item) => item.status === "outage") ? "outage" : "degraded";
  return {
    schemaVersion: 1,
    overall,
    generatedAt: "2026-08-05T08:00:00.000Z",
    lastEvaluatedAt: "2026-08-05T07:55:00.000Z",
    monitoringStartedAt: "2026-08-01T00:00:00.000Z",
    evaluatorFresh: true,
    components,
    incidents: components.map((item) => ({
      id: `${item.id}-incident`,
      componentId: item.id,
      componentName: item.name,
      state: "open" as const,
      impact: item.status === "outage" ? ("outage" as const) : ("degraded" as const),
      title: `${item.name} is ${item.status}`,
      message: "A confirmed component failure is under investigation.",
      startedAt: "2026-08-05T07:00:00.000Z",
      resolvedAt: null,
    })),
  };
}

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
