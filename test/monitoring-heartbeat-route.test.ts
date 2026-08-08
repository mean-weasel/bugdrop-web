import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/monitor/heartbeat/route";

const originalEnvironment = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnvironment };
  vi.restoreAllMocks();
});

describe("heartbeat route validation", () => {
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
