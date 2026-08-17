import { isLocalInspectorRequest } from "@/lib/public-flow-lab/local-submissions";

const LOCAL_DEMO_REPO = "mean-weasel/bugdrop-widget-test";

export async function GET(
  request: Request,
  context: RouteContext<"/vendor/bugdrop/81293491bf9924879465c668a391a5e4aeae912d/api/check/[...repo]">,
) {
  const { repo } = await context.params;
  if (
    !isLocalInspectorRequest(request.headers.get("host")) ||
    repo.join("/") !== LOCAL_DEMO_REPO
  ) {
    return new Response("Not found", { status: 404 });
  }

  return Response.json(
    { installed: true, appName: "BugDrop local inspector" },
    { headers: { "Cache-Control": "no-store" } },
  );
}
