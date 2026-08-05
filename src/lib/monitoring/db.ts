import postgres from "postgres";

type MonitoringSql = ReturnType<typeof postgres>;

const globalDatabase = globalThis as typeof globalThis & {
  bugdropMonitoringSql?: MonitoringSql;
};

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function monitoringSql(): MonitoringSql {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) throw new Error("Monitoring database is not configured");

  if (!globalDatabase.bugdropMonitoringSql) {
    globalDatabase.bugdropMonitoringSql = postgres(databaseUrl, {
      max: 3,
      prepare: false,
      connect_timeout: 10,
      idle_timeout: 20,
    });
  }

  return globalDatabase.bugdropMonitoringSql;
}
