import { isLocalInspectorRequest } from "@/lib/public-flow-lab/local-submissions";

export async function GET(
  request: Request,
  context: RouteContext<"/vendor/bugdrop/fde15f781584509fbc1cf59d50b086f163d2ecd7/api/check/[...repo]">,
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
