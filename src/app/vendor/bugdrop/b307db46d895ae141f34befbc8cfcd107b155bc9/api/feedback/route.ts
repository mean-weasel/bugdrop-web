import {
  createLocalSubmission,
  isLocalInspectorMutationRequest,
  MAX_LOCAL_SUBMISSION_BYTES,
} from "@/lib/public-flow-lab/local-submissions";

export async function POST(request: Request) {
  if (
    !isLocalInspectorMutationRequest(
      request.headers.get("host"),
      request.headers.get("origin"),
      request.headers.get("content-type"),
    )
  ) {
    return new Response("Not found", { status: 404 });
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_LOCAL_SUBMISSION_BYTES) {
    return Response.json(
      { success: false, error: "Local payload is too large." },
      { status: 413 },
    );
  }

  const text = await request.text();
  const byteSize = new TextEncoder().encode(text).byteLength;
  if (byteSize > MAX_LOCAL_SUBMISSION_BYTES) {
    return Response.json(
      { success: false, error: "Local payload is too large." },
      { status: 413 },
    );
  }

  let payload: unknown;
  try {
    payload = JSON.parse(text);
  } catch {
    return Response.json(
      { success: false, error: "Local payload must be JSON." },
      { status: 400 },
    );
  }

  if (
    payload === null ||
    typeof payload !== "object" ||
    Array.isArray(payload)
  ) {
    return Response.json(
      { success: false, error: "Local payload must be an object." },
      { status: 400 },
    );
  }

  const record = createLocalSubmission(
    payload as Record<string, unknown>,
    byteSize,
  );
  const repo =
    typeof record.payload.repo === "string"
      ? record.payload.repo
      : "local/inspector";

  return Response.json(
    {
      success: true,
      issueNumber: record.id,
      issueUrl: `https://github.com/${repo}/issues/${record.id}`,
      isPublic: false,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
