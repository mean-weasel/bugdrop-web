#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import process from "node:process";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
  process.stderr.write("DATABASE_URL is required for monitoring:migrate\n");
  process.exitCode = 1;
} else {
  const sql = postgres(databaseUrl, {
    max: 1,
    prepare: false,
    connect_timeout: 10,
    idle_timeout: 5,
  });

  try {
    const schema = await readFile(new URL("../monitoring/schema.sql", import.meta.url), "utf8");
    await sql.unsafe(schema);
    process.stdout.write("Monitoring schema is ready.\n");
  } finally {
    await sql.end({ timeout: 5 });
  }
}
