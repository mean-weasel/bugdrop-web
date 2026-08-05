import { Suspense } from "react";
import { connection } from "next/server";
import type { Metadata } from "next";
import { StatusDashboard, StatusUnavailable } from "@/components/status/status-dashboard";
import { getPublicStatusSnapshot } from "@/lib/monitoring/store";
import type { PublicStatusSnapshot } from "@/lib/monitoring/types";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "BugDrop Status",
  description: "Current operational status and recent incident history for BugDrop services.",
  path: "/status",
});

export default function StatusPage() {
  return (
    <main className="mx-auto max-w-4xl pb-8">
      <header className="mb-10 animate-fade-up">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-cyan">
          Operational status
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">BugDrop Status</h1>
        <p className="mt-4 max-w-2xl text-text-subtle">
          Live availability checks, end-to-end delivery verification, and incident history for the
          hosted BugDrop service.
        </p>
      </header>
      <Suspense fallback={<StatusLoading />}>
        <LiveStatus />
      </Suspense>
    </main>
  );
}

async function LiveStatus() {
  await connection();
  let snapshot: PublicStatusSnapshot | null = null;
  try {
    snapshot = await getPublicStatusSnapshot();
  } catch (error) {
    console.error("[monitoring] status page unavailable", safeError(error));
  }
  return snapshot ? <StatusDashboard snapshot={snapshot} /> : <StatusUnavailable />;
}

function StatusLoading() {
  return (
    <div className="space-y-4" aria-label="Loading current status">
      <div className="h-36 animate-pulse rounded-2xl border border-border bg-bg-surface" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-44 animate-pulse rounded-xl border border-border bg-bg-surface" />
        <div className="h-44 animate-pulse rounded-xl border border-border bg-bg-surface" />
      </div>
    </div>
  );
}

function safeError(error: unknown): string {
  return (error instanceof Error ? error.message : String(error)).slice(0, 500);
}
