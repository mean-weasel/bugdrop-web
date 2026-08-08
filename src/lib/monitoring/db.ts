export type D1Value = string | number | null;

export type D1Statement = {
  sql: string;
  params?: D1Value[];
};

export type D1Result = {
  results: Record<string, unknown>[];
  meta?: Record<string, unknown>;
};

export interface MonitoringDatabase {
  query(statement: D1Statement): Promise<D1Result>;
  batch(statements: D1Statement[]): Promise<D1Result[]>;
}

let testDatabase: MonitoringDatabase | null = null;

export function isDatabaseConfigured(): boolean {
  return Boolean(
    testDatabase ||
      (process.env.CLOUDFLARE_ACCOUNT_ID?.trim() &&
        process.env.CLOUDFLARE_D1_DATABASE_ID?.trim() &&
        process.env.CLOUDFLARE_D1_API_TOKEN?.trim()),
  );
}

export function monitoringDatabase(): MonitoringDatabase {
  if (testDatabase) return testDatabase;

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
  const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID?.trim();
  const apiToken = process.env.CLOUDFLARE_D1_API_TOKEN?.trim();
  if (!accountId || !databaseId || !apiToken) {
    throw new Error("Cloudflare D1 monitoring database is not configured");
  }

  return createCloudflareD1Database(accountId, databaseId, apiToken);
}

export function setMonitoringDatabaseForTests(database: MonitoringDatabase | null): void {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("The monitoring database override is only available in tests");
  }
  testDatabase = database;
}

function createCloudflareD1Database(
  accountId: string,
  databaseId: string,
  apiToken: string,
): MonitoringDatabase {
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/d1/database/${encodeURIComponent(databaseId)}/query`;

  async function request(body: object): Promise<D1Result[]> {
    const response = await fetch(endpoint, {
      method: "POST",
      redirect: "error",
      headers: {
        authorization: `Bearer ${apiToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`Cloudflare D1 returned HTTP ${response.status}`);

    const payload = (await response.json()) as {
      success?: boolean;
      errors?: Array<{ message?: string }>;
      result?: Array<{ success?: boolean; results?: Record<string, unknown>[]; meta?: Record<string, unknown> }>;
    };
    if (!payload.success || !payload.result?.every((result) => result.success !== false)) {
      const detail = payload.errors?.map((error) => error.message).filter(Boolean).join("; ");
      throw new Error(`Cloudflare D1 query failed${detail ? `: ${detail}` : ""}`);
    }
    return payload.result.map((result) => ({ results: result.results || [], meta: result.meta }));
  }

  return {
    async query(statement) {
      const results = await request({ sql: statement.sql, params: statement.params || [] });
      if (results.length !== 1) throw new Error("Cloudflare D1 returned an unexpected result count");
      return results[0];
    },
    async batch(statements) {
      if (statements.length === 0) return [];
      return request({
        batch: statements.map((statement) => ({
          sql: statement.sql,
          params: statement.params || [],
        })),
      });
    },
  };
}
