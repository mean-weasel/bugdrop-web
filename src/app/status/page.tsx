import type { Metadata } from "next";
import { StatusLive } from "@/components/status/status-live";
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
      <StatusLive />
    </main>
  );
}
