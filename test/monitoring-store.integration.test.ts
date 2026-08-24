import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { dispatchPendingAlerts } from "@/lib/monitoring/alerts";
import { COMPONENTS } from "@/lib/monitoring/config";
import { evaluateMonitoring } from "@/lib/monitoring/evaluator";
import { monitoringDatabase, setMonitoringDatabaseForTests } from "@/lib/monitoring/db";
import {
  acquireEvaluatorLease,
  applyHeartbeatEvaluation,
  applyObservation,
  claimPendingAlert,
  getPublicStatusSnapshot,
  getHeartbeatBaseline,
  markAlertDelivered,
  pruneMonitoringHistory,
  recordHeartbeatReceipt,
  recordHeartbeatOutcome,
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

  it("records normalized outcomes idempotently and rejects conflicting ID reuse", async () => {
    const definition = COMPONENTS.find((component) => component.id === "issue_delivery")!;
    const observedAt = new Date("2026-08-05T01:30:00.000Z");
    await seedMonitoringComponents(observedAt);
    const report = { schemaVersion: 1 as const, outcome: "verified" as const, reasonCode: "issue_verified", observedAt };
    expect(await recordHeartbeatOutcome("run:1", report, observedAt, definition, [])).toEqual({ status: "inserted", effect: "verified" });
    expect(await recordHeartbeatOutcome("run:1", report, observedAt, definition, [])).toEqual({ status: "duplicate", effect: "recorded_only" });
    expect(await recordHeartbeatOutcome("run:1", { ...report, reasonCode: "different" }, observedAt, definition, [])).toEqual({ status: "conflict", effect: "recorded_only" });

    const rows = (await monitoringDatabase().query({ sql: "SELECT * FROM monitoring_heartbeat_outcomes" })).results;
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ schema_version: 1, outcome: "verified", reason_code: "issue_verified" });
    expect(rows[0].request_id_hash).toMatch(/^[a-f0-9]{64}$/);
    expect(rows[0]).not.toHaveProperty("payload_hash");
    expect(JSON.stringify(rows)).not.toContain("run:1");
  });

  it("preserves confirmed failure through inconclusive reports until newer verification", async () => {
    const definition = COMPONENTS.find((component) => component.id === "issue_delivery")!;
    const started = new Date("2026-08-05T00:00:00.000Z");
    await seedMonitoringComponents(started);
    await recordHeartbeatOutcome("run:verified", { schemaVersion: 1, outcome: "verified", reasonCode: "issue_verified", observedAt: new Date("2026-08-05T01:00:00.000Z") }, new Date("2026-08-05T01:00:01.000Z"), definition, []);
    await recordHeartbeatOutcome("run:failed", { schemaVersion: 1, outcome: "delivery_failed", reasonCode: "issue_absent", observedAt: new Date("2026-08-05T02:00:00.000Z") }, new Date("2026-08-05T02:00:01.000Z"), definition, []);
    const failed = await getPublicStatusSnapshot(new Date("2026-08-05T02:01:00.000Z"));
    expect(failed.components.find((component) => component.id === definition.id)).toMatchObject({
      status: "degraded",
      statusDetail: null,
      lastVerifiedAt: "2026-08-05T01:00:00.000Z",
    });
    expect(failed.incidents[0]).toMatchObject({ impact: "degraded", statusDetail: null });

    await recordHeartbeatOutcome("run:unknown", { schemaVersion: 1, outcome: "inconclusive", reasonCode: "github_rate_limited", observedAt: new Date("2026-08-05T03:00:00.000Z") }, new Date("2026-08-05T03:00:01.000Z"), definition, []);
    const inconclusive = await getPublicStatusSnapshot(new Date("2026-08-05T03:01:00.000Z"));
    expect(inconclusive.components.find((component) => component.id === definition.id)).toMatchObject({
      status: "degraded",
      statusDetail: null,
      lastVerifiedAt: "2026-08-05T01:00:00.000Z",
    });
    expect(inconclusive.incidents[0].state).toBe("open");
    expect((await getHeartbeatBaseline()).confirmedFailureActive).toBe(true);

    await recordHeartbeatOutcome("run:recovered", { schemaVersion: 1, outcome: "verified", reasonCode: "issue_verified", observedAt: new Date("2026-08-05T04:00:00.000Z") }, new Date("2026-08-05T04:00:01.000Z"), definition, []);
    const recovered = await getPublicStatusSnapshot(new Date("2026-08-05T04:01:00.000Z"));
    expect(recovered.components.find((component) => component.id === definition.id)).toMatchObject({
      status: "operational",
      statusDetail: null,
      lastVerifiedAt: "2026-08-05T04:00:00.000Z",
    });
    expect(recovered.incidents[0].state).toBe("resolved");
  });

  it("records inconclusive evidence neutrally without changing raw component truth", async () => {
    const definition = COMPONENTS.find((component) => component.id === "issue_delivery")!;
    await seedMonitoringComponents(new Date("2026-08-05T00:00:00.000Z"));
    await recordHeartbeatOutcome("run:verified", { schemaVersion: 1, outcome: "verified", reasonCode: "issue_verified", observedAt: new Date("2026-08-05T01:00:00.000Z") }, new Date("2026-08-05T01:00:01.000Z"), definition, []);
    await recordHeartbeatOutcome("run:unknown", { schemaVersion: 1, outcome: "inconclusive", reasonCode: "github_network", observedAt: new Date("2026-08-05T02:00:00.000Z") }, new Date("2026-08-05T02:00:01.000Z"), definition, []);
    const snapshot = await getPublicStatusSnapshot(new Date("2026-08-05T02:01:00.000Z"));
    expect(snapshot.components.find((component) => component.id === definition.id)).toMatchObject({
      status: "operational",
      statusDetail: "verification_delayed",
      lastVerifiedAt: "2026-08-05T01:00:00.000Z",
    });
    expect(snapshot.incidents).toHaveLength(0);
  });

  it("returns a coherent pre-failure or post-failure snapshot across an interleaved commit", async () => {
    const definition = COMPONENTS.find((component) => component.id === "issue_delivery")!;
    await seedMonitoringComponents(new Date("2026-08-05T00:00:00.000Z"));
    await recordHeartbeatOutcome("coherent:verified", { schemaVersion: 1, outcome: "verified", reasonCode: "issue_verified", observedAt: new Date("2026-08-05T01:00:00.000Z") }, new Date("2026-08-05T01:00:01.000Z"), definition, []);
    await recordHeartbeatOutcome("coherent:unknown", { schemaVersion: 1, outcome: "inconclusive", reasonCode: "github_network", observedAt: new Date("2026-08-05T02:00:00.000Z") }, new Date("2026-08-05T02:00:01.000Z"), definition, []);
    testDatabase.afterNextBatch(async () => {
      await recordHeartbeatOutcome("coherent:failed", { schemaVersion: 1, outcome: "delivery_failed", reasonCode: "issue_absent", observedAt: new Date("2026-08-05T03:00:00.000Z") }, new Date("2026-08-05T03:00:01.000Z"), definition, []);
    });

    const racing = await getPublicStatusSnapshot(new Date("2026-08-05T03:01:00.000Z"));
    expect(racing.components.find((component) => component.id === definition.id)).toMatchObject({
      status: "operational",
      statusDetail: "verification_delayed",
    });
    const committed = await getPublicStatusSnapshot(new Date("2026-08-05T03:01:01.000Z"));
    expect(committed.components.find((component) => component.id === definition.id)).toMatchObject({
      status: "degraded",
      statusDetail: null,
    });
    expect(committed.incidents.find((incident) => incident.state === "open")).toBeDefined();
  });

  it("returns a coherent pre-recovery or post-recovery snapshot across an interleaved commit", async () => {
    const definition = COMPONENTS.find((component) => component.id === "issue_delivery")!;
    await seedMonitoringComponents(new Date("2026-08-05T00:00:00.000Z"));
    await recordHeartbeatOutcome("coherent:failure", { schemaVersion: 1, outcome: "delivery_failed", reasonCode: "issue_absent", observedAt: new Date("2026-08-05T01:00:00.000Z") }, new Date("2026-08-05T01:00:01.000Z"), definition, []);
    testDatabase.afterNextBatch(async () => {
      await recordHeartbeatOutcome("coherent:recovery", { schemaVersion: 1, outcome: "verified", reasonCode: "issue_verified", observedAt: new Date("2026-08-05T02:00:00.000Z") }, new Date("2026-08-05T02:00:01.000Z"), definition, []);
    });

    const racing = await getPublicStatusSnapshot(new Date("2026-08-05T02:01:00.000Z"));
    expect(racing.components.find((component) => component.id === definition.id)).toMatchObject({
      status: "degraded",
      statusDetail: null,
    });
    expect(racing.incidents.find((incident) => incident.state === "open")).toBeDefined();
    const committed = await getPublicStatusSnapshot(new Date("2026-08-05T02:01:01.000Z"));
    expect(committed.components.find((component) => component.id === definition.id)).toMatchObject({
      status: "operational",
      statusDetail: null,
    });
    expect(committed.incidents.every((incident) => incident.state === "resolved")).toBe(true);
  });

  it("treats newer legacy success as verified for confirmed-failure precedence", async () => {
    const definition = COMPONENTS.find((component) => component.id === "issue_delivery")!;
    await seedMonitoringComponents(new Date("2026-08-05T00:00:00.000Z"));
    await recordHeartbeatOutcome("run:failed", { schemaVersion: 1, outcome: "delivery_failed", reasonCode: "issue_absent", observedAt: new Date("2026-08-05T01:00:00.000Z") }, new Date("2026-08-05T01:00:01.000Z"), definition, []);
    expect((await getHeartbeatBaseline()).confirmedFailureActive).toBe(true);
    await recordHeartbeatSuccess("legacy:recovery", new Date("2026-08-05T02:00:00.000Z"), definition, []);
    expect((await getHeartbeatBaseline()).confirmedFailureActive).toBe(false);
    expect(await applyHeartbeatEvaluation(new Date("2026-08-05T02:30:00.000Z"), definition, [])).toMatchObject({
      observation: { ok: true, errorCode: null, markVerifiedSuccess: false },
    });
    const snapshot = await getPublicStatusSnapshot(new Date("2026-08-05T02:01:00.000Z"));
    expect(snapshot.components.find((component) => component.id === definition.id)).toMatchObject({
      status: "operational",
      statusDetail: null,
      lastVerifiedAt: "2026-08-05T02:00:00.000Z",
    });
  });

  it("supersedes stale verification with a distinct confirmed-failure incident", async () => {
    const definition = COMPONENTS.find((component) => component.id === "issue_delivery")!;
    await seedMonitoringComponents(new Date("2026-08-05T00:00:00.000Z"));
    const stale = await applyObservation(definition, {
      ok: false,
      checkedAt: new Date("2026-08-05T11:00:00.001Z"),
      latencyMs: null,
      errorCode: "heartbeat_stale",
    }, []);
    await recordHeartbeatOutcome("run:failed", {
      schemaVersion: 1,
      outcome: "delivery_failed",
      reasonCode: "issue_absent",
      observedAt: new Date("2026-08-05T12:00:00.000Z"),
    }, new Date("2026-08-05T12:00:01.000Z"), definition, ["webhook"]);
    const confirmed = await getPublicStatusSnapshot(new Date("2026-08-05T12:01:00.000Z"));
    const staleIncident = confirmed.incidents.find((incident) => incident.id === stale?.incidentId)!;
    const confirmedIncident = confirmed.incidents.find((incident) => incident.state === "open")!;
    expect(staleIncident).toMatchObject({
      state: "resolved",
      impact: "degraded",
      statusDetail: "verification_delayed",
      message: definition.failureMessage,
      resolvedAt: "2026-08-05T12:00:01.000Z",
    });
    expect(confirmedIncident).toMatchObject({
      state: "open",
      impact: "degraded",
      statusDetail: null,
      message: "BugDrop confirmed that end-to-end Issue delivery failed.",
    });
    expect(confirmedIncident.id).not.toBe(staleIncident.id);
    const alerts = (await monitoringDatabase().query({
      sql: "SELECT incident_id, event_kind FROM monitoring_alert_outbox ORDER BY event_kind",
    })).results;
    expect(alerts).toEqual(expect.arrayContaining([
      expect.objectContaining({ incident_id: staleIncident.id, event_kind: "resolved" }),
      expect.objectContaining({ incident_id: confirmedIncident.id, event_kind: "opened" }),
    ]));
    expect(confirmed.components.find((component) => component.id === definition.id)?.history30d.find((day) => day.date === "2026-08-05")).toMatchObject({
      status: "degraded",
      incidentIds: expect.arrayContaining([staleIncident.id, confirmedIncident.id]),
    });

    await recordHeartbeatOutcome("run:unknown-after-failure", {
      schemaVersion: 1,
      outcome: "inconclusive",
      reasonCode: "cleanup_failed",
      observedAt: new Date("2026-08-05T13:00:00.000Z"),
    }, new Date("2026-08-05T13:00:01.000Z"), definition, []);
    const afterInconclusive = await getPublicStatusSnapshot(new Date("2026-08-05T13:01:00.000Z"));
    expect(afterInconclusive.incidents.find((incident) => incident.id === confirmedIncident.id)).toMatchObject({
      state: "open",
      statusDetail: null,
      message: "BugDrop confirmed that end-to-end Issue delivery failed.",
    });
    expect(afterInconclusive.components.find((component) => component.id === definition.id)).toMatchObject({
      status: "degraded",
      statusDetail: null,
    });
  });

  it("applies delayed authoritative failure at receipt time without backdating proof or history", async () => {
    const definition = COMPONENTS.find((component) => component.id === "issue_delivery")!;
    await seedMonitoringComponents(new Date("2026-08-05T00:00:00.000Z"));
    await recordHeartbeatOutcome("proof:t1", { schemaVersion: 1, outcome: "verified", reasonCode: "issue_verified", observedAt: new Date("2026-08-05T01:00:00.000Z") }, new Date("2026-08-05T01:00:01.000Z"), definition, []);
    await applyObservation(definition, { ok: true, checkedAt: new Date("2026-08-05T03:00:00.000Z"), latencyMs: null, errorCode: null, markVerifiedSuccess: false }, []);
    const result = await recordHeartbeatOutcome("failure:t2", { schemaVersion: 1, outcome: "delivery_failed", reasonCode: "issue_absent", observedAt: new Date("2026-08-05T02:00:00.000Z") }, new Date("2026-08-05T04:00:00.000Z"), definition, []);
    expect(result).toEqual({ status: "inserted", effect: "degraded" });
    const snapshot = await getPublicStatusSnapshot(new Date("2026-08-05T04:01:00.000Z"));
    expect(snapshot.components.find((component) => component.id === definition.id)).toMatchObject({
      status: "degraded",
      lastCheckedAt: "2026-08-05T04:00:00.000Z",
      lastVerifiedAt: "2026-08-05T01:00:00.000Z",
    });
    expect(snapshot.incidents.find((incident) => incident.state === "open")?.startedAt).toBe("2026-08-05T04:00:00.000Z");
  });

  it("uses deterministic equal-time precedence across v1 and legacy evidence in either order", async () => {
    const definition = COMPONENTS.find((component) => component.id === "issue_delivery")!;
    const tiedAt = new Date("2026-08-05T01:00:00.000Z");
    const verified = { schemaVersion: 1 as const, outcome: "verified" as const, reasonCode: "issue_verified", observedAt: tiedAt };
    const failed = { schemaVersion: 1 as const, outcome: "delivery_failed" as const, reasonCode: "issue_absent", observedAt: tiedAt };

    await seedMonitoringComponents(new Date("2026-08-05T00:00:00.000Z"));
    expect((await recordHeartbeatOutcome("v-first", verified, tiedAt, definition, [])).effect).toBe("verified");
    expect((await recordHeartbeatOutcome("f-second", failed, new Date("2026-08-05T01:00:01.000Z"), definition, [])).effect).toBe("degraded");
    expect((await recordHeartbeatOutcome("v-third", verified, new Date("2026-08-05T01:00:02.000Z"), definition, [])).effect).toBe("recorded_only");
    expect((await getPublicStatusSnapshot(new Date("2026-08-05T01:01:00.000Z"))).components.find((item) => item.id === definition.id)?.status).toBe("degraded");

    testDatabase.clear();
    await seedMonitoringComponents(new Date("2026-08-05T00:00:00.000Z"));
    await recordHeartbeatSuccess("legacy-first", tiedAt, definition, []);
    expect((await recordHeartbeatOutcome("failure-after-legacy", failed, new Date("2026-08-05T01:00:01.000Z"), definition, [])).effect).toBe("degraded");

    testDatabase.clear();
    await seedMonitoringComponents(new Date("2026-08-05T00:00:00.000Z"));
    await recordHeartbeatOutcome("failure-first", failed, tiedAt, definition, []);
    await recordHeartbeatSuccess("legacy-after", tiedAt, definition, []);
    expect(await applyHeartbeatEvaluation(new Date("2026-08-05T02:00:00.000Z"), definition, [])).toBeNull();
    expect((await getPublicStatusSnapshot(new Date("2026-08-05T01:01:00.000Z"))).components.find((item) => item.id === definition.id)?.status).toBe("degraded");
  });

  it("serializes concurrent exact replays and conflicting reuse", async () => {
    const definition = COMPONENTS.find((component) => component.id === "issue_delivery")!;
    const observedAt = new Date("2026-08-05T01:00:00.000Z");
    const report = { schemaVersion: 1 as const, outcome: "inconclusive" as const, reasonCode: "setup_failed", observedAt };
    await seedMonitoringComponents(new Date("2026-08-05T00:00:00.000Z"));
    const exact = await Promise.all([
      recordHeartbeatOutcome("concurrent:exact", report, observedAt, definition, []),
      recordHeartbeatOutcome("concurrent:exact", report, observedAt, definition, []),
    ]);
    expect(exact.map((item) => item.status).sort()).toEqual(["duplicate", "inserted"]);
    const conflict = await Promise.all([
      recordHeartbeatOutcome("concurrent:conflict", report, observedAt, definition, []),
      recordHeartbeatOutcome("concurrent:conflict", { ...report, reasonCode: "venue_failed" }, observedAt, definition, []),
    ]);
    expect(conflict.map((item) => item.status).sort()).toEqual(["conflict", "inserted"]);
  });

  it("rolls back outcome, component, incident, event, alert, check, and rollup writes together", async () => {
    const definition = COMPONENTS.find((component) => component.id === "issue_delivery")!;
    await seedMonitoringComponents(new Date("2026-08-05T00:00:00.000Z"));
    testDatabase.failNextBatchAt(3);
    await expect(recordHeartbeatOutcome("rollback:1", { schemaVersion: 1, outcome: "delivery_failed", reasonCode: "issue_absent", observedAt: new Date("2026-08-05T01:00:00.000Z") }, new Date("2026-08-05T01:00:01.000Z"), definition, ["webhook"])).rejects.toThrow("injected monitoring batch failure");
    for (const table of ["monitoring_heartbeat_outcomes", "monitoring_incidents", "monitoring_events", "monitoring_alert_outbox", "monitoring_check_results", "monitoring_daily_component_rollups"]) {
      expect((await monitoringDatabase().query({ sql: `SELECT COUNT(*) AS count FROM ${table}` })).results[0].count).toBe(0);
    }
    expect((await getPublicStatusSnapshot(new Date("2026-08-05T01:01:00.000Z"))).components.find((item) => item.id === definition.id)?.status).toBe("unknown");
  });

  it("does not let inconclusive evidence mask genuine Issue delivery degradation", async () => {
    const definition = { ...COMPONENTS.find((component) => component.id === "issue_delivery")!, failureMessage: "Issue delivery genuinely failed." };
    await seedMonitoringComponents(new Date("2026-08-05T00:00:00.000Z"));
    await applyObservation(definition, failureAtDate("2026-08-05T01:00:00.000Z"), []);
    await recordHeartbeatOutcome("genuine:unknown", { schemaVersion: 1, outcome: "inconclusive", reasonCode: "classification_failed", observedAt: new Date("2026-08-05T02:00:00.000Z") }, new Date("2026-08-05T02:00:01.000Z"), definition, []);
    const snapshot = await getPublicStatusSnapshot(new Date("2026-08-05T02:01:00.000Z"));
    expect(snapshot.components.find((item) => item.id === definition.id)).toMatchObject({ status: "degraded", statusDetail: null });
    expect(snapshot.incidents[0]).toMatchObject({ state: "open", statusDetail: null, message: "Issue delivery genuinely failed." });
  });

  it("suppresses a racing evaluator write after a confirmed failure wins the writer lock", async () => {
    const definition = COMPONENTS.find((component) => component.id === "issue_delivery")!;
    await seedMonitoringComponents(new Date("2026-08-05T00:00:00.000Z"));
    await recordHeartbeatSuccess("linearized:proof", new Date("2026-08-05T01:00:00.000Z"), definition, []);
    let releaseFailure!: () => void;
    let failureEntered!: () => void;
    const held = new Promise<void>((resolve) => { releaseFailure = resolve; });
    const entered = new Promise<void>((resolve) => { failureEntered = resolve; });
    testDatabase.beforeNextQueryMatching("SELECT schema_version", async () => {
      failureEntered();
      await held;
    });
    const failure = recordHeartbeatOutcome("linearized:failure", {
      schemaVersion: 1,
      outcome: "delivery_failed",
      reasonCode: "issue_absent",
      observedAt: new Date("2026-08-05T02:00:00.000Z"),
    }, new Date("2026-08-05T02:00:01.000Z"), definition, []);
    await entered;
    const evaluation = applyHeartbeatEvaluation(new Date("2026-08-05T03:00:00.000Z"), definition, []);
    releaseFailure();

    expect((await failure).effect).toBe("degraded");
    expect(await evaluation).toBeNull();
    const snapshot = await getPublicStatusSnapshot(new Date("2026-08-05T03:01:00.000Z"));
    expect(snapshot.components.find((component) => component.id === definition.id)).toMatchObject({
      status: "degraded",
      lastCheckedAt: "2026-08-05T02:00:01.000Z",
      lastVerifiedAt: "2026-08-05T01:00:00.000Z",
    });
    expect((await monitoringDatabase().query({ sql: "SELECT checked_at FROM monitoring_check_results WHERE component_id = ? ORDER BY checked_at", params: [definition.id] })).results).toHaveLength(2);
  });

  it("recomputes freshness after a racing verified recovery and never overwrites it as stale", async () => {
    const definition = COMPONENTS.find((component) => component.id === "issue_delivery")!;
    await seedMonitoringComponents(new Date("2026-08-05T00:00:00.000Z"));
    await recordHeartbeatSuccess("linearized:old-proof", new Date("2026-08-05T00:30:00.000Z"), definition, []);
    let releaseRecovery!: () => void;
    let recoveryEntered!: () => void;
    const held = new Promise<void>((resolve) => { releaseRecovery = resolve; });
    const entered = new Promise<void>((resolve) => { recoveryEntered = resolve; });
    testDatabase.beforeNextQueryMatching("SELECT schema_version", async () => {
      recoveryEntered();
      await held;
    });
    const recovery = recordHeartbeatOutcome("linearized:recovery", {
      schemaVersion: 1,
      outcome: "verified",
      reasonCode: "issue_verified",
      observedAt: new Date("2026-08-05T12:00:00.000Z"),
    }, new Date("2026-08-05T12:00:01.000Z"), definition, []);
    await entered;
    const evaluation = applyHeartbeatEvaluation(new Date("2026-08-05T13:00:00.000Z"), definition, []);
    releaseRecovery();

    expect((await recovery).effect).toBe("verified");
    expect(await evaluation).toMatchObject({
      componentId: definition.id,
      observation: { ok: true, errorCode: null, markVerifiedSuccess: false },
    });
    const snapshot = await getPublicStatusSnapshot(new Date("2026-08-05T13:01:00.000Z"));
    expect(snapshot.components.find((component) => component.id === definition.id)).toMatchObject({
      status: "operational",
      lastCheckedAt: "2026-08-05T13:00:00.000Z",
      lastVerifiedAt: "2026-08-05T12:00:00.000Z",
    });
    expect(snapshot.incidents).toHaveLength(0);
  });

  it("uses activation and verified proof at the exact eleven-hour evaluator boundary", async () => {
    const definition = COMPONENTS.find((component) => component.id === "issue_delivery")!;
    const startedAt = new Date("2026-08-05T00:00:00.000Z");
    await seedMonitoringComponents(startedAt);
    expect(await applyHeartbeatEvaluation(new Date("2026-08-05T11:00:00.000Z"), definition, [])).toBeNull();
    const activated = await applyHeartbeatEvaluation(new Date("2026-08-05T11:00:00.001Z"), definition, []);
    expect(activated?.observation).toMatchObject({ ok: false, errorCode: "heartbeat_stale", markVerifiedSuccess: false });
    let snapshot = await getPublicStatusSnapshot(new Date("2026-08-05T11:01:00.000Z"));
    expect(snapshot.components.find((component) => component.id === definition.id)).toMatchObject({
      status: "degraded",
      lastVerifiedAt: null,
    });

    testDatabase.clear();
    await seedMonitoringComponents(startedAt);
    await recordHeartbeatSuccess("boundary:legacy", startedAt, definition, []);
    expect((await applyHeartbeatEvaluation(new Date("2026-08-05T11:00:00.000Z"), definition, []))?.observation).toMatchObject({
      ok: true,
      errorCode: null,
      markVerifiedSuccess: false,
    });
    expect((await applyHeartbeatEvaluation(new Date("2026-08-05T11:00:00.001Z"), definition, []))?.observation).toMatchObject({
      ok: false,
      errorCode: "heartbeat_stale",
      markVerifiedSuccess: false,
    });
    snapshot = await getPublicStatusSnapshot(new Date("2026-08-05T11:01:00.000Z"));
    expect(snapshot.components.find((component) => component.id === definition.id)).toMatchObject({
      status: "degraded",
      lastVerifiedAt: startedAt.toISOString(),
    });
    expect(snapshot.components.find((component) => component.id === definition.id)?.history30d.find((day) => day.date === "2026-08-05")).toMatchObject({
      checks: 3,
      successfulChecks: 2,
      status: "degraded",
    });
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

  it("preserves stale-verification incident detail and raw history after heartbeat recovery", async () => {
    const definition = COMPONENTS.find((component) => component.id === "issue_delivery")!;
    const failedAt = new Date("2026-08-05T01:31:00Z");
    const recoveredAt = new Date("2026-08-05T01:32:00Z");
    await seedMonitoringComponents(new Date("2026-08-05T01:30:00Z"));

    const opened = await applyObservation(
      definition,
      {
        ok: false,
        checkedAt: failedAt,
        latencyMs: null,
        errorCode: "heartbeat_stale",
      },
      [],
    );
    expect(opened?.kind).toBe("opened");

    const failedSnapshot = await getPublicStatusSnapshot(new Date("2026-08-05T01:31:30Z"));
    expect(failedSnapshot.incidents[0]).toMatchObject({
      id: opened?.incidentId,
      state: "open",
      impact: "degraded",
      statusDetail: "verification_delayed",
      message: definition.failureMessage,
      resolvedAt: null,
    });

    expect(await recordHeartbeatSuccess("recovery:1", recoveredAt, definition, [])).toBe(true);
    const recoveredSnapshot = await getPublicStatusSnapshot(new Date("2026-08-05T01:33:00Z"));
    expect(recoveredSnapshot.schemaVersion).toBe(1);
    expect(recoveredSnapshot.components.find((item) => item.id === definition.id)).toMatchObject({
      status: "operational",
      statusDetail: null,
      lastVerifiedAt: recoveredAt.toISOString(),
    });
    expect(recoveredSnapshot.incidents[0]).toMatchObject({
      id: opened?.incidentId,
      state: "resolved",
      impact: "degraded",
      statusDetail: "verification_delayed",
      message: definition.failureMessage,
      resolvedAt: recoveredAt.toISOString(),
    });
    expect(recoveredSnapshot.components.find((item) => item.id === definition.id)?.history30d.find((day) => day.date === "2026-08-05")).toMatchObject({
      status: "degraded",
      incidentIds: [opened?.incidentId],
    });
  });

  it("does not classify genuine open or resolved Issue delivery incidents as verification delayed", async () => {
    const definition = { ...COMPONENTS.find((component) => component.id === "issue_delivery")!, failureMessage: "Issue delivery failed after confirmed GitHub verification." };
    await seedMonitoringComponents(new Date("2026-08-05T02:00:00Z"));
    const opened = await applyObservation(definition, failureAtDate("2026-08-05T02:01:00Z"), []);

    const openSnapshot = await getPublicStatusSnapshot(new Date("2026-08-05T02:01:30Z"));
    expect(openSnapshot.incidents[0]).toMatchObject({
      id: opened?.incidentId,
      state: "open",
      impact: "degraded",
      statusDetail: null,
      message: definition.failureMessage,
    });

    await recordHeartbeatSuccess("genuine-recovery:1", new Date("2026-08-05T02:02:00Z"), definition, []);
    const resolvedSnapshot = await getPublicStatusSnapshot(new Date("2026-08-05T02:03:00Z"));
    expect(resolvedSnapshot.incidents[0]).toMatchObject({
      id: opened?.incidentId,
      state: "resolved",
      impact: "degraded",
      statusDetail: null,
      message: definition.failureMessage,
    });
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

  it("keeps the exact 90-day boundary and unrelated old metadata while pruning history", async () => {
    const now = new Date("2026-08-05T00:00:00Z");
    const cutoff = "2026-05-07T00:00:00.000Z";
    await seedMonitoringComponents(now);
    await monitoringDatabase().batch([
      {
        sql: `INSERT INTO monitoring_check_results (component_id, checked_at, ok)
          VALUES ('feedback_api', ?, 1), ('feedback_api', ?, 1), ('feedback_api', ?, 1)`,
        params: ["2026-05-06T23:59:59.999Z", cutoff, "2026-05-07T00:00:00.001Z"],
      },
      {
        sql: `INSERT INTO monitoring_meta (key, value, updated_at) VALUES
          ('evaluation_window:old', '{}', ?),
          ('evaluation_window:boundary', '{}', ?),
          ('evaluation_window:new', '{}', ?),
          ('unrelated_old_metadata', '{}', ?)`,
        params: ["2026-05-06T23:59:59.999Z", cutoff, "2026-05-07T00:00:00.001Z", "2025-01-01T00:00:00.000Z"],
      },
    ]);

    await pruneMonitoringHistory(now);

    expect(
      (
        await monitoringDatabase().query({
          sql: "SELECT checked_at FROM monitoring_check_results ORDER BY checked_at",
        })
      ).results,
    ).toEqual([{ checked_at: cutoff }, { checked_at: "2026-05-07T00:00:00.001Z" }]);
    expect(
      (
        await monitoringDatabase().query({
          sql: `SELECT key FROM monitoring_meta
            WHERE key LIKE 'evaluation_window:%' OR key = 'unrelated_old_metadata'
            ORDER BY key`,
        })
      ).results,
    ).toEqual([
      { key: "evaluation_window:boundary" },
      { key: "evaluation_window:new" },
      { key: "unrelated_old_metadata" },
    ]);
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
