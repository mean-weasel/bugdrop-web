import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { describe, expect, it } from "vitest";

describe("monitoring schema migration", () => {
  it("backfills retained checks once and remains idempotent", () => {
    const schema = readFileSync(new URL("../monitoring/schema.sql", import.meta.url), "utf8");
    const rollupStart = schema.indexOf("CREATE TABLE IF NOT EXISTS monitoring_daily_component_rollups");
    expect(rollupStart).toBeGreaterThan(0);

    const database = new DatabaseSync(":memory:");
    try {
      database.exec(schema.slice(0, rollupStart));
      database.exec(`
        INSERT INTO monitoring_components (
          id, name, description, impact_on_failure, failure_threshold, recovery_threshold, updated_at
        ) VALUES
          ('website', 'Website', 'Public website', 'outage', 2, 2, '2026-08-01T00:00:00Z'),
          ('fresh', 'Fresh service', 'No baseline yet', 'outage', 2, 2, '2026-08-01T00:00:00Z');
        INSERT INTO monitoring_check_results (component_id, checked_at, ok, latency_ms, error_code)
        VALUES
          ('website', '2026-08-01T00:01:00Z', 1, 25, NULL),
          ('website', '2026-08-01T00:06:00Z', 0, NULL, 'http_503'),
          ('fresh', '2026-08-01T00:01:00Z', 0, NULL, 'http_503');
      `);

      database.exec(schema);
      expect(database.prepare("SELECT * FROM monitoring_daily_component_rollups WHERE component_id = 'website'").get()).toMatchObject({
        component_id: "website",
        day: "2026-08-01",
        total_samples: 2,
        operational_samples: 0,
        unknown_samples: 2,
        successful_checks: 1,
        source: "backfill",
      });
      expect(database.prepare("SELECT * FROM monitoring_daily_component_rollups WHERE component_id = 'fresh'").get()).toMatchObject({
        operational_samples: 0,
        unknown_samples: 1,
        successful_checks: 0,
      });
      database.exec(schema);
      expect(database.prepare("SELECT COUNT(*) AS count, SUM(total_samples) AS samples FROM monitoring_daily_component_rollups").get()).toEqual({
        count: 2,
        samples: 3,
      });
    } finally {
      database.close();
    }
  });
});
