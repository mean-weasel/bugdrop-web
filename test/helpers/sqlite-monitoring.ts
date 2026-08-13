import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { normalizeD1Statement, type D1Statement, type MonitoringDatabase } from "@/lib/monitoring/db";

export function createTestMonitoringDatabase(): {
  adapter: MonitoringDatabase;
  clear(): void;
  failNextBatchAt(statementIndex: number): void;
  failNextQueryMatching(sqlFragment: string): void;
  beforeNextQueryMatching(sqlFragment: string, callback: () => void | Promise<void>): void;
  afterNextBatch(callback: () => void | Promise<void>): void;
  close(): void;
} {
  const sqlite = new DatabaseSync(":memory:");
  let failAt: number | null = null;
  let failingQueryFragment: string | null = null;
  let queryBarrier: { sqlFragment: string; callback: () => void | Promise<void> } | null = null;
  let afterBatch: (() => void | Promise<void>) | null = null;
  sqlite.exec(readFileSync(new URL("../../monitoring/schema.sql", import.meta.url), "utf8"));

  const execute = (statement: D1Statement) => {
    const normalized = normalizeD1Statement(statement);
    return {
      results: sqlite.prepare(normalized.sql).all(...normalized.params) as Record<string, unknown>[],
    };
  };

  return {
    adapter: {
      async query(statement) {
        if (queryBarrier && statement.sql.includes(queryBarrier.sqlFragment)) {
          const callback = queryBarrier.callback;
          queryBarrier = null;
          await callback();
        }
        if (failingQueryFragment && statement.sql.includes(failingQueryFragment)) {
          failingQueryFragment = null;
          throw new Error("injected monitoring query failure");
        }
        return execute(statement);
      },
      async batch(statements) {
        sqlite.exec("BEGIN IMMEDIATE");
        let results;
        try {
          results = statements.map((statement, index) => {
            if (failAt === index) {
              failAt = null;
              throw new Error("injected monitoring batch failure");
            }
            return execute(statement);
          });
          sqlite.exec("COMMIT");
        } catch (error) {
          sqlite.exec("ROLLBACK");
          throw error;
        }
        const callback = afterBatch;
        afterBatch = null;
        await callback?.();
        return results;
      },
    },
    clear() {
      failAt = null;
      failingQueryFragment = null;
      queryBarrier = null;
      afterBatch = null;
      sqlite.exec(`
        DELETE FROM monitoring_alert_outbox;
        DELETE FROM monitoring_events;
        DELETE FROM monitoring_daily_component_rollups;
        DELETE FROM monitoring_check_results;
        DELETE FROM monitoring_heartbeat_receipts;
        DELETE FROM monitoring_heartbeat_outcomes;
        DELETE FROM monitoring_incidents;
        DELETE FROM monitoring_components;
        DELETE FROM monitoring_meta;
        DELETE FROM monitoring_locks;
      `);
    },
    failNextBatchAt(statementIndex) {
      failAt = statementIndex;
    },
    failNextQueryMatching(sqlFragment) {
      failingQueryFragment = sqlFragment;
    },
    beforeNextQueryMatching(sqlFragment, callback) {
      queryBarrier = { sqlFragment, callback };
    },
    afterNextBatch(callback) {
      afterBatch = callback;
    },
    close() {
      sqlite.close();
    },
  };
}
