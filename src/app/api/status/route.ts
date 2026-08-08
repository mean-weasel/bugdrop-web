import { getPublicStatusSnapshot } from "@/lib/monitoring/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  if (new URL(request.url).search) {
    return Response.json(
      { error: "Status query parameters are not supported" },
      { status: 400, headers: { "cache-control": "no-store" } },
    );
  }
  try {
    const snapshot = await getPublicStatusSnapshot();
    return Response.json(snapshot, {
      headers: {
        "cache-control": "public, s-maxage=60, must-revalidate",
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
