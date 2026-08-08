import { afterEach, describe, expect, it, vi } from "vitest";
import { monitoringDatabase, setMonitoringDatabaseForTests } from "@/lib/monitoring/db";

afterEach(() => {
  setMonitoringDatabaseForTests(null);
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("Cloudflare D1 monitoring client", () => {
  it("sends a parameterized batch only to the configured D1 database", async () => {
    configureD1();
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({
      success: true,
      errors: [],
      result: [
        { success: true, results: [{ id: "first" }], meta: {} },
        { success: true, results: [], meta: {} },
      ],
    }));

    const result = await monitoringDatabase().batch([
      { sql: "SELECT ? AS id, ? AS attempt, ? AS optional", params: ["first", 2, null] },
      { sql: "DELETE FROM example WHERE id = ? AND note = '?'", params: ["second"] },
    ]);

    expect(result[0].results).toEqual([{ id: "first" }]);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.cloudflare.com/client/v4/accounts/account-id/d1/database/database-id/query",
      expect.objectContaining({
        method: "POST",
        redirect: "error",
        headers: expect.objectContaining({ authorization: "Bearer secret-d1-token" }),
        body: JSON.stringify({
          batch: [
            { sql: "SELECT ? AS id, ? AS attempt, NULL AS optional", params: ["first", "2"] },
            { sql: "DELETE FROM example WHERE id = ? AND note = '?'", params: ["second"] },
          ],
        }),
      }),
    );
  });

  it("fails closed without exposing the D1 token in an API error", async () => {
    configureD1();
    vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json(
      { success: false, errors: [{ message: "not authorized" }], result: [] },
      { status: 403 },
    ));

    await expect(monitoringDatabase().query({ sql: "SELECT 1" })).rejects.toThrow(
      "Cloudflare D1 returned HTTP 403",
    );
    await expect(monitoringDatabase().query({ sql: "SELECT 1" })).rejects.not.toThrow(
      "secret-d1-token",
    );
  });
});

function configureD1() {
  vi.stubEnv("CLOUDFLARE_ACCOUNT_ID", "account-id");
  vi.stubEnv("CLOUDFLARE_D1_DATABASE_ID", "database-id");
  vi.stubEnv("CLOUDFLARE_D1_API_TOKEN", "secret-d1-token");
}
