import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { dispatchPendingAlerts } from "@/lib/monitoring/alerts";
import { COMPONENTS } from "@/lib/monitoring/config";
import { evaluateMonitoring } from "@/lib/monitoring/evaluator";
import { monitoringDatabase, setMonitoringDatabaseForTests } from "@/lib/monitoring/db";
import {
  acquireEvaluatorLease,
  applyObservation,
  claimPendingAlert,
  getPublicStatusSnapshot,
  markAlertDelivered,
  pruneMonitoringHistory,
  recordHeartbeatReceipt,
  recordHeartbeatSuccess,
  releaseFailedEvaluatorLease,
  seedMonitoringComponents,
} from "@/lib/monitoring/store";
import { createTestMonitoringDatabase } from "./helpers/sqlite-monitoring";

const testDatabase = createTestMonitoringDatabase();

describe("monitoring D1/SQLite integration", () => {
  beforeAll(() => {
    setMonitoringDatabaseForTests(testDatabase.adapter);
  });

  afterAll(() => {
    setMonitoringDatabaseForTests(null);
    testDatabase.close();
  });

  beforeEach(() => {
    testDatabase.clear();
  });

  it("opens, publishes, alerts, and resolves one stable incident", async () => {
    const definition = COMPONENTS.find((component) => component.id === "feedback_api")!;
    await seedMonitoringComponents(new Date("2026-08-05T00:00:00Z"));

    await applyObservation(definition, failureAt(1), ["webhook"]);
    expect((await getPublicStatusSnapshot(new Date("2026-08-05T00:01:30Z"))).incidents).toHaveLength(0);

    const opened = await applyObservation(definition, failureAt(2), ["webhook"]);
    expect(opened?.kind).toBe("opened");
    const failedSnapshot = await getPublicStatusSnapshot(new Date("2026-08-05T00:02:30Z"));
    expect(failedSnapshot.components.find((component) => component.id === definition.id)?.status).toBe("outage");
    expect(failedSnapshot.incidents).toHaveLength(1);
    const failedDay = failedSnapshot.components.find((component) => component.id === definition.id)?.history30d.find((day) => day.date === "2026-08-05");
    expect(failedDay).toMatchObject({
      dataState: "monitored",
      status: "outage",
      checks: 2,
      successfulChecks: 0,
    });

    const delivery = await claimPendingAlert();
    expect(delivery?.channel).toBe("webhook");
    expect(delivery?.payload).toMatchObject({
      schemaVersion: 1,
      componentId: "feedback_api",
      event: "opened",
    });
    await markAlertDelivered(String(delivery?.id));

    await applyObservation(definition, successAt(3), ["webhook"]);
    const resolved = await applyObservation(definition, successAt(4), ["webhook"]);
    expect(resolved).toEqual({
      kind: "resolved",
      incidentId: opened?.incidentId,
    });
    const recoveredSnapshot = await getPublicStatusSnapshot(new Date("2026-08-05T00:04:30Z"));
    expect(recoveredSnapshot.incidents[0]).toMatchObject({ state: "resolved" });
    expect(recoveredSnapshot.components.find((component) => component.id === definition.id)?.status).toBe("operational");
    expect(recoveredSnapshot.components.find((component) => component.id === definition.id)?.history30d.find((day) => day.date === "2026-08-05")).toMatchObject({
      status: "outage",
      uptime: 50,
      checks: 4,
      successfulChecks: 2,
    });
  });

  it("distinguishes pre-monitoring days from later monitoring gaps", async () => {
    const definition = COMPONENTS.find((component) => component.id === "landing_page")!;
    await seedMonitoringComponents(new Date("2026-08-05T12:00:00Z"));
    await applyObservation(definition, successAtDate("2026-08-05T12:05:00Z"), []);

    const snapshot = await getPublicStatusSnapshot(new Date("2026-08-07T12:00:00Z"));
    const component = snapshot.components.find((item) => item.id === definition.id)!;
    expect(snapshot.monitoringStartedAt).toBe("2026-08-05T12:00:00.000Z");
    expect(component.history30d).toHaveLength(30);
    expect(component.history30d.find((day) => day.date === "2026-08-04")).toMatchObject({
      dataState: "pre_monitoring",
      status: "unknown",
    });
    expect(component.history30d.find((day) => day.date === "2026-08-05")).toMatchObject({
      dataState: "monitored",
      status: "operational",
      uptime: 100,
    });
    expect(component.history30d.find((day) => day.date === "2026-08-06")).toMatchObject({
      dataState: "monitoring_gap",
      status: "unknown",
    });
    expect(component.monitoredDays30d).toBe(1);
    expect(component.uptime30d).toBe(100);
  });

  it("deduplicates retried heartbeat identifiers without storing the raw identifier", async () => {
    const receivedAt = new Date("2026-08-05T01:00:00Z");
    expect(await recordHeartbeatReceipt("12345:1", receivedAt)).toBe(true);
    expect(await recordHeartbeatReceipt("12345:1", receivedAt)).toBe(false);

    const rows = (
      await monitoringDatabase().query({
        sql: "SELECT request_id_hash FROM monitoring_heartbeat_receipts",
      })
    ).results;
    expect(rows).toHaveLength(1);
    expect(rows[0].request_id_hash).toMatch(/^[a-f0-9]{64}$/);
    expect(rows[0].request_id_hash).not.toBe("12345:1");
  });

  it("commits a heartbeat receipt and verified component transition together", async () => {
    const definition = COMPONENTS.find((component) => component.id === "issue_delivery")!;
    const receivedAt = new Date("2026-08-05T01:30:00Z");
    await seedMonitoringComponents(receivedAt);

    expect(await recordHeartbeatSuccess("67890:1", receivedAt, definition, ["webhook"])).toBe(true);
    expect(await recordHeartbeatSuccess("67890:1", receivedAt, definition, ["webhook"])).toBe(false);

    const snapshot = await getPublicStatusSnapshot(new Date("2026-08-05T01:31:00Z"));
    const component = snapshot.components.find((item) => item.id === definition.id);
    expect(component).toMatchObject({
      status: "operational",
      lastCheckedAt: receivedAt.toISOString(),
      lastVerifiedAt: receivedAt.toISOString(),
    });
    expect(
      (
        await monitoringDatabase().query({
          sql: "SELECT id FROM monitoring_heartbeat_receipts",
        })
      ).results,
    ).toHaveLength(1);
    expect(
      (
        await monitoringDatabase().query({
          sql: "SELECT id FROM monitoring_check_results WHERE component_id = ?",
          params: [definition.id],
        })
      ).results,
    ).toHaveLength(1);
  });

  it("publishes verification_delayed only for heartbeat-stale degraded Issue delivery", async () => {
    await seedMonitoringComponents(new Date("2026-08-05T01:30:00Z"));
    await monitoringDatabase().query({
      sql: "UPDATE monitoring_components SET status = 'degraded', last_error_code = 'heartbeat_stale' WHERE id = 'issue_delivery'",
    });

    const delayed = await getPublicStatusSnapshot(new Date("2026-08-05T01:31:00Z"));
    expect(delayed.schemaVersion).toBe(1);
    expect(delayed.overall).toBe("degraded");
    expect(delayed.components.find((item) => item.id === "issue_delivery")).toMatchObject({
      status: "degraded",
      statusDetail: "verification_delayed",
    });

    await monitoringDatabase().batch([
      {
        sql: "UPDATE monitoring_components SET last_error_code = 'http_503' WHERE id = 'issue_delivery'",
      },
      {
        sql: "UPDATE monitoring_components SET status = 'degraded', last_error_code = 'heartbeat_stale' WHERE id = 'github_integration'",
      },
    ]);
    const unrelated = await getPublicStatusSnapshot(new Date("2026-08-05T01:32:00Z"));
    expect(unrelated.components.find((item) => item.id === "issue_delivery")?.statusDetail).toBeNull();
    expect(unrelated.components.find((item) => item.id === "github_integration")?.statusDetail).toBeNull();
  });

  it("does not let an older observation overwrite newer component state", async () => {
    const definition = COMPONENTS.find((component) => component.id === "issue_delivery")!;
    await seedMonitoringComponents(new Date("2026-08-05T02:00:00Z"));
    await applyObservation(definition, { ...successAt(4), markVerifiedSuccess: true }, ["webhook"]);
    await applyObservation(definition, failureAt(3), ["webhook"]);

    const snapshot = await getPublicStatusSnapshot(new Date("2026-08-05T02:05:00Z"));
    expect(snapshot.components.find((item) => item.id === definition.id)).toMatchObject({
      status: "operational",
      lastCheckedAt: new Date("2026-08-05T00:04:00Z").toISOString(),
    });
    expect(snapshot.incidents).toHaveLength(0);
  });

  it("allows only one evaluator lease at a time", async () => {
    const now = new Date("2026-08-05T02:00:00Z");
    expect(await acquireEvaluatorLease(now)).toBe(true);
    expect(await acquireEvaluatorLease(now)).toBe(false);
    expect(await acquireEvaluatorLease(new Date("2026-08-05T02:03:59Z"))).toBe(false);
    expect(await acquireEvaluatorLease(new Date("2026-08-05T02:05:00Z"))).toBe(true);
  });

  it("allows the same cron window to retry after an incomplete evaluator run", async () => {
    const now = new Date("2026-08-05T02:30:00Z");
    expect(await acquireEvaluatorLease(now)).toBe(true);
    await releaseFailedEvaluatorLease(now);
    expect(await acquireEvaluatorLease(now)).toBe(true);
  });

  it("does not reopen a cron window after observations commit and alert delivery fails", async () => {
    const definition = COMPONENTS.find((component) => component.id === "feedback_api")!;
    await seedMonitoringComponents(new Date("2026-08-05T00:00:00Z"));
    await applyObservation(definition, failureAt(1), ["webhook"]);
    await applyObservation(definition, failureAt(2), ["webhook"]);
    vi.stubEnv("CLOUDFLARE_ACCOUNT_ID", "account-id");
    vi.stubEnv("CLOUDFLARE_D1_DATABASE_ID", "database-id");
    vi.stubEnv("CLOUDFLARE_D1_API_TOKEN", "api-token");
    vi.stubEnv("CRON_SECRET", "c".repeat(16));
    vi.stubEnv("MONITOR_HEARTBEAT_SECRET", "h".repeat(32));
    vi.stubEnv("MONITOR_ALERT_WEBHOOK_URL", "https://alerts.example.test/hook");
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = String(input);
      if (url.includes("alerts.example.test")) return new Response(null, { status: 500 });
      if (url.endsWith("widget.js")) {
        return new Response("x".repeat(1200), {
          headers: { "content-type": "application/javascript" },
        });
      }
      if (url.includes("/api/health")) {
        return Response.json({
          status: "ok",
          environment: "production",
          buildSha: "a".repeat(40),
        });
      }
      if (url.includes("/api/check/")) {
        return Response.json({
          installed: true,
          repo: "mean-weasel/bugdrop-widget-test",
        });
      }
      return new Response(`BugDrop ${"x".repeat(600)}`);
    });

    const now = new Date("2026-08-05T00:05:00Z");
    await expect(evaluateMonitoring(now)).rejects.toThrow("Alert delivery is impaired");
    expect(await acquireEvaluatorLease(new Date("2026-08-05T00:05:30Z"))).toBe(false);

    fetchMock.mockRestore();
    vi.unstubAllEnvs();
  });

  it("keeps all open incidents visible beyond the resolved-history window", async () => {
    const definition = COMPONENTS.find((component) => component.id === "feedback_api")!;
    await seedMonitoringComponents(new Date("2026-01-01T00:00:00Z"));
    await applyObservation(definition, failureAtDate("2026-01-01T00:01:00Z"), ["webhook"]);
    await applyObservation(definition, failureAtDate("2026-01-01T00:02:00Z"), ["webhook"]);

    const snapshot = await getPublicStatusSnapshot(new Date("2026-08-05T00:00:00Z"));
    expect(snapshot.incidents).toHaveLength(1);
    expect(snapshot.incidents[0]).toMatchObject({
      state: "open",
      componentId: definition.id,
    });
  });

  it("keeps recently resolved incidents even when they opened more than 90 days ago", async () => {
    const definition = COMPONENTS.find((component) => component.id === "feedback_api")!;
    await seedMonitoringComponents(new Date("2026-01-01T00:00:00Z"));
    await applyObservation(definition, failureAtDate("2026-01-01T00:01:00Z"), ["webhook"]);
    await applyObservation(definition, failureAtDate("2026-01-01T00:02:00Z"), ["webhook"]);
    await applyObservation(definition, successAtDate("2026-08-01T00:03:00Z"), ["webhook"]);
    await applyObservation(definition, successAtDate("2026-08-01T00:04:00Z"), ["webhook"]);

    const snapshot = await getPublicStatusSnapshot(new Date("2026-08-05T00:00:00Z"));
    expect(snapshot.incidents).toHaveLength(1);
    expect(snapshot.incidents[0]).toMatchObject({
      state: "resolved",
      componentId: definition.id,
    });
  });

  it("prunes resolved incident audit data after 365 days", async () => {
    const definition = COMPONENTS.find((component) => component.id === "feedback_api")!;
    await seedMonitoringComponents(new Date("2025-01-01T00:00:00Z"));
    await applyObservation(definition, failureAtDate("2025-01-01T00:01:00Z"), ["webhook"]);
    await applyObservation(definition, failureAtDate("2025-01-01T00:02:00Z"), ["webhook"]);
    await applyObservation(definition, successAtDate("2025-01-01T00:03:00Z"), ["webhook"]);
    await applyObservation(definition, successAtDate("2025-01-01T00:04:00Z"), ["webhook"]);

    await pruneMonitoringHistory(new Date("2026-08-05T00:00:00Z"));
    expect(
      (
        await monitoringDatabase().query({
          sql: "SELECT id FROM monitoring_incidents",
        })
      ).results,
    ).toHaveLength(0);
    expect(
      (
        await monitoringDatabase().query({
          sql: "SELECT id FROM monitoring_events",
        })
      ).results,
    ).toHaveLength(0);
    expect(
      (
        await monitoringDatabase().query({
          sql: "SELECT id FROM monitoring_alert_outbox",
        })
      ).results,
    ).toHaveLength(0);
  });

  it("keeps alerts pending when their configured channel is temporarily absent", async () => {
    const definition = COMPONENTS.find((component) => component.id === "feedback_api")!;
    await seedMonitoringComponents(new Date("2026-08-05T03:00:00Z"));
    await applyObservation(definition, failureAtDate("2026-08-05T03:01:00Z"), ["webhook"]);
    await applyObservation(definition, failureAtDate("2026-08-05T03:02:00Z"), ["webhook"]);
    delete process.env.MONITOR_ALERT_WEBHOOK_URL;

    expect(await dispatchPendingAlerts()).toMatchObject({
      failed: 1,
      skipped: 0,
    });
    const rows = (
      await monitoringDatabase().query({
        sql: "SELECT status, last_error FROM monitoring_alert_outbox",
      })
    ).results;
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      status: "pending",
      last_error: "webhook is temporarily not configured",
    });
  });

  it("refuses webhook redirects instead of accepting a redirected success", async () => {
    const definition = COMPONENTS.find((component) => component.id === "feedback_api")!;
    await seedMonitoringComponents(new Date("2026-08-05T04:00:00Z"));
    await applyObservation(definition, failureAtDate("2026-08-05T04:01:00Z"), ["webhook"]);
    await applyObservation(definition, failureAtDate("2026-08-05T04:02:00Z"), ["webhook"]);
    process.env.MONITOR_ALERT_WEBHOOK_URL = "https://alerts.example.test/hook";
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 204 }));

    expect(await dispatchPendingAlerts()).toMatchObject({
      delivered: 1,
      failed: 0,
    });
    expect(fetchMock).toHaveBeenCalledWith("https://alerts.example.test/hook", expect.objectContaining({ method: "POST", redirect: "error" }));
    fetchMock.mockRestore();
  });
});

function failureAt(minute: number) {
  return {
    ok: false,
    checkedAt: new Date(`2026-08-05T00:0${minute}:00Z`),
    latencyMs: 500,
    errorCode: "http_503",
  };
}

function successAt(minute: number) {
  return {
    ok: true,
    checkedAt: new Date(`2026-08-05T00:0${minute}:00Z`),
    latencyMs: 100,
    errorCode: null,
  };
}

function failureAtDate(checkedAt: string) {
  return {
    ok: false,
    checkedAt: new Date(checkedAt),
    latencyMs: 500,
    errorCode: "http_503",
  };
}

function successAtDate(checkedAt: string) {
  return {
    ok: true,
    checkedAt: new Date(checkedAt),
    latencyMs: 100,
    errorCode: null,
  };
}
