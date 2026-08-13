import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/monitor/heartbeat/route";
import { COMPONENTS, HEARTBEAT_REASON_CODES } from "@/lib/monitoring/config";
import { monitoringDatabase, setMonitoringDatabaseForTests } from "@/lib/monitoring/db";
import { recordHeartbeatOutcome, seedMonitoringComponents } from "@/lib/monitoring/store";
import { createTestMonitoringDatabase } from "./helpers/sqlite-monitoring";

const originalEnvironment = { ...process.env };
const testDatabase = createTestMonitoringDatabase();

beforeAll(() => setMonitoringDatabaseForTests(testDatabase.adapter));
afterAll(() => {
  setMonitoringDatabaseForTests(null);
  testDatabase.close();
});

beforeEach(() => testDatabase.clear());

afterEach(() => {
  process.env = { ...originalEnvironment };
  vi.restoreAllMocks();
});

describe("heartbeat route validation", () => {
  it("retains authenticated empty-body legacy success", async () => {
    setCompleteConfiguration();
    const response = await POST(requestWithHeaders({ authorization: bearer(), "x-bugdrop-heartbeat-id": "legacy:1" }));
    expect(response.status).toBe(204);
  });

  it("accepts valid v1 reports idempotently and rejects conflicting ID reuse", async () => {
    setCompleteConfiguration();
    const payload = { schemaVersion: 1, outcome: "inconclusive", reasonCode: "github_network", observedAt: "2026-08-05T01:00:00.000Z" };
    const first = await POST(jsonRequest("run:1", payload));
    const duplicate = await POST(jsonRequest("run:1", payload));
    const conflict = await POST(jsonRequest("run:1", { ...payload, reasonCode: "github_5xx" }));
    expect(first.status).toBe(200);
    expect(first.headers.get("cache-control")).toBe("no-store");
    expect(await first.json()).toEqual({
      schemaVersion: 1,
      accepted: true,
      duplicate: false,
      outcome: "inconclusive",
      effect: "recorded_only",
      observedAt: payload.observedAt,
    });
    expect(duplicate.status).toBe(200);
    expect(await duplicate.json()).toEqual({
      schemaVersion: 1,
      accepted: true,
      duplicate: true,
      outcome: "inconclusive",
      effect: "recorded_only",
      observedAt: payload.observedAt,
    });
    expect(conflict.status).toBe(409);
  });

  it("returns accepted v1 failure when post-commit alert dispatch rejects and keeps one pending alert", async () => {
    setCompleteConfiguration();
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const payload = { schemaVersion: 1, outcome: "delivery_failed", reasonCode: "issue_absent", observedAt: "2026-08-05T01:00:00.000Z" };
    testDatabase.failNextQueryMatching("UPDATE monitoring_alert_outbox");

    const response = await POST(jsonRequest("dispatch:v1", payload));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ accepted: true, duplicate: false, effect: "degraded" });
    expect(error).toHaveBeenCalledWith(
      "[monitoring] heartbeat alert dispatch unavailable",
      "injected monitoring query failure",
    );
    expect((await monitoringDatabase().query({ sql: "SELECT status FROM monitoring_alert_outbox" })).results).toEqual([
      expect.objectContaining({ status: "pending" }),
    ]);

    const duplicate = await POST(jsonRequest("dispatch:v1", payload));
    expect(await duplicate.json()).toMatchObject({ accepted: true, duplicate: true, effect: "recorded_only" });
    expect((await monitoringDatabase().query({ sql: "SELECT id FROM monitoring_alert_outbox" })).results).toHaveLength(1);
  });

  it("returns legacy success when post-commit recovery dispatch rejects and keeps the outbox pending", async () => {
    setCompleteConfiguration();
    const definition = COMPONENTS.find((component) => component.id === "issue_delivery")!;
    await seedMonitoringComponents(new Date("2026-08-05T00:00:00.000Z"));
    await recordHeartbeatOutcome("dispatch:failure", { schemaVersion: 1, outcome: "delivery_failed", reasonCode: "issue_absent", observedAt: new Date("2026-08-05T01:00:00.000Z") }, new Date("2026-08-05T01:00:01.000Z"), definition, []);
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    testDatabase.failNextQueryMatching("UPDATE monitoring_alert_outbox");

    const response = await POST(requestWithHeaders({ authorization: bearer(), "x-bugdrop-heartbeat-id": "dispatch:legacy" }));
    expect(response.status).toBe(204);
    expect(error).toHaveBeenCalledWith(
      "[monitoring] heartbeat alert dispatch unavailable",
      "injected monitoring query failure",
    );
    expect((await monitoringDatabase().query({ sql: "SELECT status, event_kind FROM monitoring_alert_outbox" })).results).toEqual([
      expect.objectContaining({ status: "pending", event_kind: "resolved" }),
    ]);
    const duplicate = await POST(requestWithHeaders({ authorization: bearer(), "x-bugdrop-heartbeat-id": "dispatch:legacy" }));
    expect(duplicate.status).toBe(204);
    expect((await monitoringDatabase().query({ sql: "SELECT id FROM monitoring_alert_outbox" })).results).toHaveLength(1);
  });

  it("returns 500 for a pre-commit transition failure and rolls back acceptance and outbox", async () => {
    setCompleteConfiguration();
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    testDatabase.failNextBatchAt(6);
    const response = await POST(jsonRequest("precommit:failure", {
      schemaVersion: 1,
      outcome: "delivery_failed",
      reasonCode: "issue_absent",
      observedAt: "2026-08-05T01:00:00.000Z",
    }));
    expect(response.status).toBe(500);
    expect(error).toHaveBeenCalledWith("[monitoring] heartbeat failed", "injected monitoring batch failure");
    expect((await monitoringDatabase().query({ sql: "SELECT id FROM monitoring_heartbeat_outcomes" })).results).toHaveLength(0);
    expect((await monitoringDatabase().query({ sql: "SELECT id FROM monitoring_alert_outbox" })).results).toHaveLength(0);
    expect((await monitoringDatabase().query({ sql: "SELECT status FROM monitoring_components WHERE id = 'issue_delivery'" })).results[0]?.status).toBe("unknown");
  });

  it("accepts every exact reason enum with its outcome effect", async () => {
    setCompleteConfiguration();
    const observedAt = "2026-08-05T01:00:00.000Z";
    let index = 0;
    for (const [outcome, reasons] of Object.entries(HEARTBEAT_REASON_CODES)) {
      for (const reasonCode of reasons) {
        testDatabase.clear();
        const response = await POST(jsonRequest(`enum:${index++}`, { schemaVersion: 1, outcome, reasonCode, observedAt }));
        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({
          schemaVersion: 1,
          accepted: true,
          duplicate: false,
          outcome,
          effect: outcome === "verified" ? "verified" : outcome === "delivery_failed" ? "degraded" : "recorded_only",
          observedAt,
        });
      }
    }
  });

  it.each([
    [{ schemaVersion: 2, outcome: "verified", reasonCode: "issue_verified", observedAt: "2026-08-05T01:00:00.000Z" }],
    [{ schemaVersion: 1, outcome: "verified", reasonCode: "github_network", observedAt: "2026-08-05T01:00:00.000Z" }],
    [{ schemaVersion: 1, outcome: "inconclusive", reasonCode: "github_network", observedAt: "not-a-time" }],
    [{ schemaVersion: 1, outcome: "delivery_failed", reasonCode: "issue_absent", observedAt: "2026-08-05T01:00:00.000Z", rawIssue: "secret" }],
  ])("rejects malformed or mismatched v1 payloads", async (payload) => {
    setCompleteConfiguration();
    expect((await POST(jsonRequest("bad:1", payload))).status).toBe(400);
  });

  it("requires a stable ID for JSON v1", async () => {
    setCompleteConfiguration();
    const request = new Request("https://bugdrop.dev/api/monitor/heartbeat", {
      method: "POST",
      headers: { authorization: bearer(), "content-type": "application/json" },
      body: JSON.stringify({ schemaVersion: 1, outcome: "verified", reasonCode: "issue_verified", observedAt: "2026-08-05T01:00:00.000Z" }),
    });
    expect((await POST(request)).status).toBe(400);
  });

  it("rejects a JSON body with a non-JSON content type as 400", async () => {
    setCompleteConfiguration();
    const request = new Request("https://bugdrop.dev/api/monitor/heartbeat", {
      method: "POST",
      headers: { authorization: bearer(), "x-bugdrop-heartbeat-id": "content:1", "content-type": "text/plain" },
      body: JSON.stringify({ schemaVersion: 1, outcome: "verified", reasonCode: "issue_verified", observedAt: "2026-08-05T01:00:00.000Z" }),
    });
    expect((await POST(request)).status).toBe(400);
  });

  it("accepts exact JSON media types with valid parameters and rejects prefix variants", async () => {
    setCompleteConfiguration();
    const payload = { schemaVersion: 1, outcome: "inconclusive", reasonCode: "setup_failed", observedAt: "2026-08-05T01:00:00Z" };
    const accepted = await POST(jsonRequest("media:valid", payload, "Application/JSON; charset=utf-8; profile=heartbeat"));
    expect(accepted.status).toBe(200);
    expect(await accepted.json()).toMatchObject({ observedAt: "2026-08-05T01:00:00.000Z", effect: "recorded_only" });
    expect((await POST(jsonRequest("media:prefix", payload, "application/json-patch+json"))).status).toBe(400);
    expect((await POST(jsonRequest("media:invalid-param", payload, "application/json; charset"))).status).toBe(400);
  });

  it.each([
    "2026-08-05T01:00:00+00:00",
    "2026-08-05T01:00:00-07:00",
    "2026-08-05T01:00:00.0000Z",
    "2026-08-05T01:00:00.000000001Z",
    "2026-08-05T01:00:00.000000002Z",
    "2026-02-30T01:00:00Z",
    "2999-08-05T01:00:00Z",
  ])("rejects non-UTC, sub-millisecond, invalid, or future observedAt %s", async (observedAt) => {
    setCompleteConfiguration();
    const response = await POST(jsonRequest(`time:${observedAt}`, { schemaVersion: 1, outcome: "inconclusive", reasonCode: "setup_failed", observedAt }));
    expect(response.status).toBe(400);
  });

  it("preserves accepted millisecond ordering so newer verification recovers failure", async () => {
    setCompleteConfiguration();
    const failure = await POST(jsonRequest("ordering:failure", {
      schemaVersion: 1,
      outcome: "delivery_failed",
      reasonCode: "issue_absent",
      observedAt: "2026-08-05T01:00:00.001Z",
    }));
    expect(await failure.json()).toMatchObject({ effect: "degraded", observedAt: "2026-08-05T01:00:00.001Z" });

    const recovery = await POST(jsonRequest("ordering:recovery", {
      schemaVersion: 1,
      outcome: "verified",
      reasonCode: "issue_verified",
      observedAt: "2026-08-05T01:00:00.002Z",
    }));
    expect(await recovery.json()).toMatchObject({ effect: "verified", observedAt: "2026-08-05T01:00:00.002Z" });
  });

  it("returns recorded_only for authoritative audit-only evidence", async () => {
    setCompleteConfiguration();
    await POST(jsonRequest("audit:new", { schemaVersion: 1, outcome: "verified", reasonCode: "issue_verified", observedAt: "2026-08-05T02:00:00Z" }));
    const older = await POST(jsonRequest("audit:old", { schemaVersion: 1, outcome: "delivery_failed", reasonCode: "issue_absent", observedAt: "2026-08-05T01:00:00Z" }));
    expect(await older.json()).toMatchObject({ duplicate: false, outcome: "delivery_failed", effect: "recorded_only" });
  });

  it("rejects a malformed supplied heartbeat ID", async () => {
    process.env.MONITOR_HEARTBEAT_SECRET = "a".repeat(32);
    const response = await POST(
      requestWithHeaders({
        authorization: `Bearer ${process.env.MONITOR_HEARTBEAT_SECRET}`,
        "x-bugdrop-heartbeat-id": "not valid",
      }),
    );

    expect(response.status).toBe(400);
  });

  it("fails closed before mutation when activation configuration is incomplete", async () => {
    process.env.MONITOR_HEARTBEAT_SECRET = "a".repeat(32);
    delete process.env.CLOUDFLARE_ACCOUNT_ID;
    delete process.env.CLOUDFLARE_D1_DATABASE_ID;
    delete process.env.CLOUDFLARE_D1_API_TOKEN;
    delete process.env.MONITOR_ALERT_WEBHOOK_URL;
    delete process.env.RESEND_API_KEY;
    delete process.env.MONITOR_ALERT_EMAIL_FROM;
    delete process.env.MONITOR_ALERT_EMAIL_TO;
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await POST(
      requestWithHeaders({
        authorization: `Bearer ${process.env.MONITOR_HEARTBEAT_SECRET}`,
        "x-bugdrop-heartbeat-id": "12345:1",
      }),
    );

    expect(response.status).toBe(503);
    expect(error).toHaveBeenCalledWith(
      "[monitoring] heartbeat configuration invalid",
      expect.stringContaining("At least one alert channel must be configured"),
    );
  });
});

function requestWithHeaders(headers: Record<string, string>): Request {
  return new Request("https://bugdrop.dev/api/monitor/heartbeat", { method: "POST", headers });
}

function jsonRequest(id: string, payload: object, contentType = "application/json"): Request {
  return new Request("https://bugdrop.dev/api/monitor/heartbeat", {
    method: "POST",
    headers: { authorization: bearer(), "x-bugdrop-heartbeat-id": id, "content-type": contentType },
    body: JSON.stringify(payload),
  });
}

function bearer(): string {
  return `Bearer ${process.env.MONITOR_HEARTBEAT_SECRET}`;
}

function setCompleteConfiguration() {
  process.env.MONITOR_HEARTBEAT_SECRET = "a".repeat(32);
  process.env.CRON_SECRET = "b".repeat(16);
  process.env.CLOUDFLARE_ACCOUNT_ID = "account-id";
  process.env.CLOUDFLARE_D1_DATABASE_ID = "database-id";
  process.env.CLOUDFLARE_D1_API_TOKEN = "api-token";
  process.env.MONITOR_ALERT_WEBHOOK_URL = "https://alerts.example.test/hook";
}
