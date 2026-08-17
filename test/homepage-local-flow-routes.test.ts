import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "@/app/vendor/bugdrop/81293491bf9924879465c668a391a5e4aeae912d/api/check/[...repo]/route";
import { POST } from "@/app/vendor/bugdrop/81293491bf9924879465c668a391a5e4aeae912d/api/feedback/route";
import {
  clearLocalSubmissionsForTests,
  getLocalSubmission,
  MAX_LOCAL_SUBMISSION_BYTES,
} from "@/lib/public-flow-lab/local-submissions";

const RUNTIME_PATH = "/vendor/bugdrop/81293491bf9924879465c668a391a5e4aeae912d";
const ORIGIN = "http://bugdrop.localhost:3000";
const REPO = "mean-weasel/bugdrop-widget-test";

function localHeaders(overrides: Record<string, string> = {}) {
  return {
    host: "bugdrop.localhost:3000",
    origin: ORIGIN,
    "content-type": "application/json",
    ...overrides,
  };
}

function checkContext(repo = REPO) {
  return { params: Promise.resolve({ repo: repo.split("/") }) } as RouteContext<
    "/vendor/bugdrop/81293491bf9924879465c668a391a5e4aeae912d/api/check/[...repo]"
  >;
}

function streamingRequest(
  chunks: Uint8Array[],
  options: {
    headers?: Record<string, string>;
    onCancel?: () => void;
    onPull?: () => void;
  } = {},
) {
  let index = 0;
  const body = new ReadableStream<Uint8Array>(
    {
      pull(controller) {
        options.onPull?.();
        const chunk = chunks[index];
        index += 1;
        if (chunk) controller.enqueue(chunk);
        else controller.close();
      },
      cancel() {
        options.onCancel?.();
      },
    },
    { highWaterMark: 0 },
  );

  return new Request(`${ORIGIN}${RUNTIME_PATH}/api/feedback`, {
    method: "POST",
    headers: localHeaders(options.headers),
    body,
    duplex: "half",
  } as RequestInit & { duplex: "half" });
}

function oversizedChunks() {
  return [
    new Uint8Array(32 * 1024 * 1024),
    new Uint8Array(17 * 1024 * 1024),
    new Uint8Array([1]),
  ];
}

describe("homepage local flow inspector routes", () => {
  beforeEach(() => {
    clearLocalSubmissionsForTests();
    vi.stubEnv("NODE_ENV", "development");
  });

  afterEach(() => vi.unstubAllEnvs());

  it("returns the development-only preflight result for the pinned demo repo", async () => {
    const response = await GET(
      new Request(`${ORIGIN}${RUNTIME_PATH}/api/check/${REPO}`, {
        headers: localHeaders(),
      }),
      checkContext(),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    await expect(response.json()).resolves.toEqual({
      installed: true,
      appName: "BugDrop local inspector",
    });
  });

  it("fails preflight closed for a wrong host, repo, or environment", async () => {
    const wrongHost = await GET(
      new Request(`${ORIGIN}${RUNTIME_PATH}/api/check/${REPO}`, {
        headers: localHeaders({ host: "localhost:3000" }),
      }),
      checkContext(),
    );
    expect(wrongHost.status).toBe(404);

    const wrongRepo = await GET(
      new Request(`${ORIGIN}${RUNTIME_PATH}/api/check/owner/repo`, {
        headers: localHeaders(),
      }),
      checkContext("owner/repo"),
    );
    expect(wrongRepo.status).toBe(404);

    vi.stubEnv("NODE_ENV", "production");
    const production = await GET(
      new Request(`${ORIGIN}${RUNTIME_PATH}/api/check/${REPO}`, {
        headers: localHeaders(),
      }),
      checkContext(),
    );
    expect(production.status).toBe(404);
  });

  it("stores a valid submission locally and returns a synthetic private Issue", async () => {
    const payload = { repo: REPO, message: "The local-only record." };
    const response = await POST(
      new Request(`${ORIGIN}${RUNTIME_PATH}/api/feedback`, {
        method: "POST",
        headers: localHeaders(),
        body: JSON.stringify(payload),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      success: true,
      issueNumber: 1,
      issueUrl: `https://github.com/${REPO}/issues/1`,
      isPublic: false,
    });
    expect(getLocalSubmission(1)).toMatchObject({ id: 1, payload });
  });

  it("rejects wrong host, origin, content type, repo, and production mutations", async () => {
    const payload = JSON.stringify({ repo: REPO });
    const forbiddenRequests = [
      new Request(`${ORIGIN}${RUNTIME_PATH}/api/feedback`, {
        method: "POST",
        headers: localHeaders({ host: "localhost:3000" }),
        body: payload,
      }),
      new Request(`${ORIGIN}${RUNTIME_PATH}/api/feedback`, {
        method: "POST",
        headers: localHeaders({ origin: "http://evil.localhost:3000" }),
        body: payload,
      }),
      new Request(`${ORIGIN}${RUNTIME_PATH}/api/feedback`, {
        method: "POST",
        headers: localHeaders({ "content-type": "text/plain" }),
        body: payload,
      }),
      new Request(`${ORIGIN}${RUNTIME_PATH}/api/feedback`, {
        method: "POST",
        headers: localHeaders(),
        body: JSON.stringify({ repo: "owner/repo" }),
      }),
    ];

    for (const request of forbiddenRequests) {
      expect((await POST(request)).status).toBe(404);
    }

    vi.stubEnv("NODE_ENV", "production");
    expect(
      (
        await POST(
          new Request(`${ORIGIN}${RUNTIME_PATH}/api/feedback`, {
            method: "POST",
            headers: localHeaders(),
            body: payload,
          }),
        )
      ).status,
    ).toBe(404);
    expect(getLocalSubmission(1)).toBeNull();
  });

  it("rejects oversized and invalid payloads without recording them", async () => {
    const oversized = await POST(
      new Request(`${ORIGIN}${RUNTIME_PATH}/api/feedback`, {
        method: "POST",
        headers: localHeaders({
          "content-length": String(MAX_LOCAL_SUBMISSION_BYTES + 1),
        }),
        body: "{}",
      }),
    );
    expect(oversized.status).toBe(413);

    const invalidJson = await POST(
      new Request(`${ORIGIN}${RUNTIME_PATH}/api/feedback`, {
        method: "POST",
        headers: localHeaders(),
        body: "not json",
      }),
    );
    expect(invalidJson.status).toBe(400);

    const invalidObject = await POST(
      new Request(`${ORIGIN}${RUNTIME_PATH}/api/feedback`, {
        method: "POST",
        headers: localHeaders(),
        body: "[]",
      }),
    );
    expect(invalidObject.status).toBe(400);
    expect(getLocalSubmission(1)).toBeNull();
  });

  it("stops and cancels a chunked body as soon as its actual bytes exceed the limit", async () => {
    let pulls = 0;
    let cancellations = 0;
    const response = await POST(
      streamingRequest(oversizedChunks(), {
        onPull: () => {
          pulls += 1;
        },
        onCancel: () => {
          cancellations += 1;
        },
      }),
    );

    expect(response.status).toBe(413);
    expect(pulls).toBe(2);
    expect(cancellations).toBe(1);
    expect(getLocalSubmission(1)).toBeNull();
  });

  it("does not trust a forged small Content-Length for an oversized stream", async () => {
    let cancellations = 0;
    const response = await POST(
      streamingRequest(oversizedChunks(), {
        headers: { "content-length": "1" },
        onCancel: () => {
          cancellations += 1;
        },
      }),
    );

    expect(response.status).toBe(413);
    expect(cancellations).toBe(1);
    expect(getLocalSubmission(1)).toBeNull();
  });

  it("accepts a valid JSON body at the exact byte limit", async () => {
    const prefix = `{"repo":"${REPO}","message":"`;
    const suffix = '"}';
    const payload = `${prefix}${"a".repeat(
      MAX_LOCAL_SUBMISSION_BYTES - prefix.length - suffix.length,
    )}${suffix}`;
    expect(new TextEncoder().encode(payload)).toHaveLength(
      MAX_LOCAL_SUBMISSION_BYTES,
    );

    const response = await POST(
      new Request(`${ORIGIN}${RUNTIME_PATH}/api/feedback`, {
        method: "POST",
        headers: localHeaders(),
        body: payload,
      }),
    );

    expect(response.status).toBe(200);
    expect(getLocalSubmission(1)?.payload.repo).toBe(REPO);
  });

  it("decodes multibyte UTF-8 split across chunks before parsing", async () => {
    const bytes = new TextEncoder().encode(
      JSON.stringify({ repo: REPO, message: "Flow ready ✨" }),
    );
    const sparkle = new TextEncoder().encode("✨");
    const sparkleStart = bytes.findIndex((value) => value === sparkle[0]);
    const response = await POST(
      streamingRequest([
        bytes.slice(0, sparkleStart + 1),
        bytes.slice(sparkleStart + 1),
      ]),
    );

    expect(response.status).toBe(200);
    expect(getLocalSubmission(1)?.payload.message).toBe("Flow ready ✨");
  });

  it("rejects a null or errored body without recording it", async () => {
    const nullBody = await POST(
      new Request(`${ORIGIN}${RUNTIME_PATH}/api/feedback`, {
        method: "POST",
        headers: localHeaders(),
      }),
    );
    expect(nullBody.status).toBe(400);

    const erroredBody = new ReadableStream<Uint8Array>({
      pull(controller) {
        controller.error(new Error("simulated read failure"));
      },
    });
    const errored = await POST(
      new Request(`${ORIGIN}${RUNTIME_PATH}/api/feedback`, {
        method: "POST",
        headers: localHeaders(),
        body: erroredBody,
        duplex: "half",
      } as RequestInit & { duplex: "half" }),
    );
    expect(errored.status).toBe(400);
    expect(getLocalSubmission(1)).toBeNull();
  });
});
