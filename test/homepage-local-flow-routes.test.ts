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
});
