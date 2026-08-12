import { isLocalInspectorRequest } from "@/lib/public-flow-lab/local-submissions";

export async function GET(
  request: Request,
  context: RouteContext<"/vendor/bugdrop/661e81ae3bbb2f2e8512c98b17ee347b1e4caad5/api/check/[...repo]">,
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
