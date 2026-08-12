import { isLocalInspectorRequest } from "@/lib/public-flow-lab/local-submissions";

export async function GET(
  request: Request,
  context: RouteContext<"/vendor/bugdrop/d4b989b5acc568ffcc54dc6f7409a3dc20bc89db/api/check/[...repo]">,
) {
  const { repo } = await context.params;
  if (
    !isLocalInspectorRequest(request.headers.get("host")) ||
    repo.join("/") !== "mean-weasel/bugdrop-widget-test"
  ) {
    return new Response("Not found", { status: 404 });
  }

  return Response.json(
    { installed: true, appName: "BugDrop local inspector" },
    { headers: { "Cache-Control": "no-store" } },
  );
}
