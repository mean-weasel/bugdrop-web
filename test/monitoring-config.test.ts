import { afterEach, describe, expect, it, vi } from "vitest";
import { HEARTBEAT_STALE_AFTER_MS, configurationIssues } from "@/lib/monitoring/config";
import { isHeartbeatStale } from "@/lib/monitoring/evaluator";

describe("monitoring configuration", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("fails closed when alert delivery is missing", () => {
    setRequiredConfiguration();
    vi.stubEnv("MONITOR_ALERT_WEBHOOK_URL", "");
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("MONITOR_ALERT_EMAIL_FROM", "");
    vi.stubEnv("MONITOR_ALERT_EMAIL_TO", "");
    expect(configurationIssues()).toContain("At least one alert channel must be configured");
  });

  it("rejects a webhook that could expose its secret over plaintext", () => {
    setRequiredConfiguration();
    vi.stubEnv("MONITOR_ALERT_WEBHOOK_URL", "http://alerts.example.com/bugdrop");
    expect(configurationIssues()).toContain("MONITOR_ALERT_WEBHOOK_URL must use HTTPS");
  });

  it("accepts a complete email-only configuration", () => {
    setRequiredConfiguration();
    vi.stubEnv("MONITOR_ALERT_WEBHOOK_URL", "");
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("MONITOR_ALERT_EMAIL_FROM", "status@bugdrop.dev");
    vi.stubEnv("MONITOR_ALERT_EMAIL_TO", "operator@example.com");
    expect(configurationIssues()).toEqual([]);
  });

  it("uses an exact eleven-hour dead-man boundary", () => {
    expect(HEARTBEAT_STALE_AFTER_MS).toBe(11 * 60 * 60 * 1000);
    const reference = new Date("2026-08-05T00:00:00.000Z");
    expect(isHeartbeatStale(reference, new Date("2026-08-05T11:00:00.000Z"))).toBe(false);
    expect(isHeartbeatStale(reference, new Date("2026-08-05T11:00:00.001Z"))).toBe(true);
  });
});

function setRequiredConfiguration() {
  vi.stubEnv("CLOUDFLARE_ACCOUNT_ID", "account-id");
  vi.stubEnv("CLOUDFLARE_D1_DATABASE_ID", "database-id");
  vi.stubEnv("CLOUDFLARE_D1_API_TOKEN", "api-token");
  vi.stubEnv("CRON_SECRET", "a".repeat(16));
  vi.stubEnv("MONITOR_HEARTBEAT_SECRET", "b".repeat(32));
}
