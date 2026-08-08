"use client";

import { useEffect, useState } from "react";
import { StatusDashboard, StatusUnavailable } from "./status-dashboard";
import type { PublicStatusSnapshot } from "@/lib/monitoring/types";

export function StatusLive() {
  const [snapshot, setSnapshot] = useState<PublicStatusSnapshot | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/status", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Status API returned HTTP ${response.status}`);
        return response.json() as Promise<PublicStatusSnapshot>;
      })
      .then(setSnapshot)
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setUnavailable(true);
      });
    return () => controller.abort();
  }, []);

  if (snapshot) return <StatusDashboard snapshot={snapshot} />;
  if (unavailable) return <StatusUnavailable />;
  return <StatusLoading />;
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
