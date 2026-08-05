import { getPublicStatusSnapshot } from "@/lib/monitoring/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  try {
    const snapshot = await getPublicStatusSnapshot();
    return Response.json(snapshot, {
      headers: {
        "cache-control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("[monitoring] public status unavailable", safeError(error));
    return Response.json(
      {
        schemaVersion: 1,
        overall: "unknown",
        error: "Status data is temporarily unavailable",
      },
      {
        status: 503,
        headers: { "cache-control": "no-store" },
      },
    );
  }
}

function safeError(error: unknown): string {
  return (error instanceof Error ? error.message : String(error)).slice(0, 500);
}
