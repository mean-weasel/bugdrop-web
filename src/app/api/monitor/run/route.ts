import { hasValidBearer } from "@/lib/monitoring/auth";
import { evaluateMonitoring } from "@/lib/monitoring/evaluator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request): Promise<Response> {
  if (!hasValidBearer(request, process.env.CRON_SECRET)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const summary = await evaluateMonitoring();
    return Response.json(summary, {
      headers: { "cache-control": "no-store" },
    });
  } catch (error) {
    console.error("[monitoring] evaluator failed", safeError(error));
    return Response.json(
      { error: "Monitoring evaluation failed" },
      { status: 500, headers: { "cache-control": "no-store" } },
    );
  }
}

function safeError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  return message.slice(0, 500);
}
