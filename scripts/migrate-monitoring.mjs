#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import process from "node:process";

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID?.trim();
const apiToken = process.env.CLOUDFLARE_D1_API_TOKEN?.trim();

if (!accountId || !databaseId || !apiToken) {
  process.stderr.write(
    "CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_D1_DATABASE_ID, and CLOUDFLARE_D1_API_TOKEN are required\n",
  );
  process.exitCode = 1;
} else {
  const schema = await readFile(new URL("../monitoring/schema.sql", import.meta.url), "utf8");
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/d1/database/${encodeURIComponent(databaseId)}/query`;
  const response = await fetch(endpoint, {
    method: "POST",
    redirect: "error",
    headers: {
      authorization: `Bearer ${apiToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ sql: schema }),
    signal: AbortSignal.timeout(30_000),
  });
  const payload = await response.json();
  if (!response.ok || !payload.success || !payload.result?.every((result) => result.success !== false)) {
    const detail = payload.errors?.map((error) => error.message).filter(Boolean).join("; ");
    throw new Error(`D1 migration failed${detail ? `: ${detail}` : ` with HTTP ${response.status}`}`);
  }
  process.stdout.write("Monitoring D1 schema is ready.\n");
}
