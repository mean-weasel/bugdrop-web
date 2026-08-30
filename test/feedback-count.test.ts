import { afterEach, describe, expect, it, vi } from "vitest";
import {
  formatFeedbackCount,
  getFeedbackIssuesDisplay,
} from "../src/lib/feedback-count";

describe("homepage feedback count", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("uses the rounded public count and requests daily revalidation", async () => {
    const fetch = vi.fn().mockResolvedValue(
      Response.json({
        feedbackIssuesCreated: 3_100,
        display: "3,100+",
      }),
    );
    vi.stubGlobal("fetch", fetch);

    await expect(getFeedbackIssuesDisplay()).resolves.toBe("3,100+");
    expect(fetch).toHaveBeenCalledWith(
      "https://bugdrop.dev/api/stats/feedback-issues",
      {
        next: { revalidate: 86_400 },
        signal: expect.any(AbortSignal),
      },
    );
  });

  it("uses the fallback when the counter request stalls", async () => {
    const controller = new AbortController();
    const timeout = vi
      .spyOn(AbortSignal, "timeout")
      .mockReturnValue(controller.signal);
    vi.stubGlobal(
      "fetch",
      vi.fn((_url: string | URL | Request, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => reject(init.signal?.reason));
        }),
      ),
    );

    const display = getFeedbackIssuesDisplay();
    controller.abort(new DOMException("timed out", "TimeoutError"));

    await expect(display).resolves.toBe("3,100+");
    expect(timeout).toHaveBeenCalledWith(5_000);
  });

  it.each([
    [new Response(null, { status: 503 })],
    [Response.json({ feedbackIssuesCreated: 3_116, display: "3,116+" })],
    [Response.json({ feedbackIssuesCreated: 3_100, display: "3,000+" })],
    [Response.json({ feedbackIssuesCreated: 3_000, display: "3,000+" })],
  ])(
    "falls back to the established lower bound for invalid data",
    async (response) => {
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response));

      await expect(getFeedbackIssuesDisplay()).resolves.toBe("3,100+");
    },
  );

  it("falls back when the counter endpoint is unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("unavailable")));

    await expect(getFeedbackIssuesDisplay()).resolves.toBe("3,100+");
  });

  it("formats rounded counts consistently", () => {
    expect(formatFeedbackCount(3_100)).toBe("3,100+");
  });
});
