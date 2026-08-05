import { afterEach, describe, expect, it, vi } from "vitest";
import { configurationIssues } from "@/lib/monitoring/config";

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
});

function setRequiredConfiguration() {
  vi.stubEnv("DATABASE_URL", "postgresql://example.invalid/bugdrop");
  vi.stubEnv("CRON_SECRET", "a".repeat(16));
  vi.stubEnv("MONITOR_HEARTBEAT_SECRET", "b".repeat(32));
}
