import { afterEach, describe, expect, it, vi } from "vitest";
import { POST as heartbeat } from "@/app/api/monitor/heartbeat/route";
import { GET as evaluate } from "@/app/api/monitor/run/route";

describe("monitoring route boundaries", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("fails the evaluator closed when the cron secret is absent", async () => {
    vi.stubEnv("CRON_SECRET", "");
    const response = await evaluate(new Request("https://bugdrop.dev/api/monitor/run"));
    expect(response.status).toBe(401);
  });

  it("fails the heartbeat closed without the exact bearer secret", async () => {
    vi.stubEnv("MONITOR_HEARTBEAT_SECRET", "expected-secret");
    const response = await heartbeat(
      new Request("https://bugdrop.dev/api/monitor/heartbeat", {
        method: "POST",
        headers: { authorization: "Bearer wrong-secret" },
      }),
    );
    expect(response.status).toBe(401);
  });
});
