import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { describe, expect, it } from "vitest";

describe("monitoring schema migration", () => {
  it("indexes both high-frequency retention deletes by their cutoff columns", () => {
    const schema = readFileSync(new URL("../monitoring/schema.sql", import.meta.url), "utf8");
    const database = new DatabaseSync(":memory:");
    try {
      database.exec(schema);
      database.exec(`
        INSERT INTO monitoring_components (
          id, name, description, impact_on_failure, failure_threshold, recovery_threshold, updated_at
        ) VALUES ('feedback_api', 'Feedback API', 'test', 'outage', 2, 2, '2026-08-24T00:00:00Z');
        WITH RECURSIVE sequence(value) AS (
          VALUES (0)
          UNION ALL
          SELECT value + 1 FROM sequence WHERE value < 999
        )
        INSERT INTO monitoring_check_results (component_id, checked_at, ok)
        SELECT 'feedback_api', printf('2026-08-%02dT00:00:00Z', (value % 28) + 1), 1
        FROM sequence;
        WITH RECURSIVE sequence(value) AS (
          VALUES (0)
          UNION ALL
          SELECT value + 1 FROM sequence WHERE value < 499
        )
        INSERT INTO monitoring_meta (key, value, updated_at)
        SELECT printf('evaluation_window:%04d', value), '{}',
          printf('2026-08-%02dT00:00:00Z', (value % 28) + 1)
        FROM sequence;
        ANALYZE;
      `);

      const checkPlan = database
        .prepare(
          "EXPLAIN QUERY PLAN DELETE FROM monitoring_check_results WHERE checked_at < ?",
        )
        .all("2026-01-01T00:00:00Z") as Array<{ detail: string }>;
      const evaluationWindowPlan = database
        .prepare(
          `EXPLAIN QUERY PLAN DELETE FROM monitoring_meta
            WHERE key LIKE 'evaluation_window:%' AND updated_at < ?`,
        )
        .all("2026-01-01T00:00:00Z") as Array<{ detail: string }>;

      const checkDetails = checkPlan.map((row) => row.detail).join(" ");
      const evaluationWindowDetails = evaluationWindowPlan.map((row) => row.detail).join(" ");
      expect(checkDetails).toMatch(
        /SEARCH monitoring_check_results USING (?:COVERING )?INDEX monitoring_check_results_checked_at_idx \(checked_at<\?\)/,
      );
      expect(evaluationWindowDetails).toMatch(
        /SEARCH monitoring_meta USING INDEX monitoring_meta_evaluation_window_updated_at_idx \(updated_at<\?\)/,
      );
      expect(checkDetails).not.toContain("SCAN");
      expect(evaluationWindowDetails).not.toContain("SCAN");
    } finally {
      database.close();
    }
  });

  it("adds normalized outcome persistence idempotently without raw payload columns", () => {
    const schema = readFileSync(new URL("../monitoring/schema.sql", import.meta.url), "utf8");
    const database = new DatabaseSync(":memory:");
    try {
      database.exec(schema);
      database.exec(schema);
      const columns = database.prepare("PRAGMA table_info(monitoring_heartbeat_outcomes)").all() as Array<{ name: string }>;
      expect(columns.map((column) => column.name)).toEqual([
        "id",
        "request_id_hash",
        "schema_version",
        "outcome",
        "reason_code",
        "observed_at",
        "received_at",
      ]);
      expect(columns.map((column) => column.name)).not.toEqual(expect.arrayContaining(["payload", "payload_hash", "run_url", "issue_body", "secret"]));
    } finally {
      database.close();
    }
  });

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
