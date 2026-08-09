import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { normalizeD1Statement, type D1Statement, type MonitoringDatabase } from "@/lib/monitoring/db";

export function createTestMonitoringDatabase(): {
  adapter: MonitoringDatabase;
  clear(): void;
  close(): void;
} {
  const sqlite = new DatabaseSync(":memory:");
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
        return execute(statement);
      },
      async batch(statements) {
        sqlite.exec("BEGIN IMMEDIATE");
        try {
          const results = statements.map(execute);
          sqlite.exec("COMMIT");
          return results;
        } catch (error) {
          sqlite.exec("ROLLBACK");
          throw error;
        }
      },
    },
    clear() {
      sqlite.exec(`
        DELETE FROM monitoring_alert_outbox;
        DELETE FROM monitoring_events;
        DELETE FROM monitoring_daily_component_rollups;
        DELETE FROM monitoring_check_results;
        DELETE FROM monitoring_heartbeat_receipts;
        DELETE FROM monitoring_incidents;
        DELETE FROM monitoring_components;
        DELETE FROM monitoring_meta;
        DELETE FROM monitoring_locks;
      `);
    },
    close() {
      sqlite.close();
    },
  };
}
