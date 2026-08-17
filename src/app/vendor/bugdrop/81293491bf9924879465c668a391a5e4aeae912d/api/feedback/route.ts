import {
  createLocalSubmission,
  isLocalInspectorMutationRequest,
  MAX_LOCAL_SUBMISSION_BYTES,
} from "@/lib/public-flow-lab/local-submissions";

const LOCAL_DEMO_REPO = "mean-weasel/bugdrop-widget-test";

const payloadTooLarge = () =>
  Response.json(
    { success: false, error: "Local payload is too large." },
    { status: 413 },
  );

async function cancelQuietly(
  reader: ReadableStreamDefaultReader<Uint8Array>,
) {
  try {
    await reader.cancel();
  } catch {
    // An errored stream is already closed to further reads.
  }
}

async function readBoundedBody(request: Request) {
  if (!request.body) {
    return {
      ok: false as const,
      response: Response.json(
        { success: false, error: "Local payload must be JSON." },
        { status: 400 },
      ),
    };
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let byteSize = 0;

  try {
    while (true) {
      let result: ReadableStreamReadResult<Uint8Array>;
      try {
        result = await reader.read();
      } catch {
        await cancelQuietly(reader);
        return {
          ok: false as const,
          response: Response.json(
            { success: false, error: "Local payload could not be read." },
            { status: 400 },
          ),
        };
      }

      if (result.done) break;
      if (byteSize + result.value.byteLength > MAX_LOCAL_SUBMISSION_BYTES) {
        await cancelQuietly(reader);
        return { ok: false as const, response: payloadTooLarge() };
      }

      chunks.push(result.value);
      byteSize += result.value.byteLength;
    }
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(byteSize);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return { ok: true as const, bytes, byteSize };
}

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
    try {
      await request.body?.cancel();
    } catch {
      // A body that cannot be cancelled is still rejected without being read.
    }
    return payloadTooLarge();
  }

  const body = await readBoundedBody(request);
  if (!body.ok) return body.response;

  let payload: unknown;
  try {
    payload = JSON.parse(
      new TextDecoder("utf-8", { fatal: true }).decode(body.bytes),
    );
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

  const submission = payload as Record<string, unknown>;
  if (submission.repo !== LOCAL_DEMO_REPO) {
    return new Response("Not found", { status: 404 });
  }

  const record = createLocalSubmission(submission, body.byteSize);

  return Response.json(
    {
      success: true,
      issueNumber: record.id,
      issueUrl: `https://github.com/${LOCAL_DEMO_REPO}/issues/${record.id}`,
      isPublic: false,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
