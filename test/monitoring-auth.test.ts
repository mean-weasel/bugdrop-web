import { describe, expect, it } from "vitest";
import { hasValidBearer, safeRequestId } from "@/lib/monitoring/auth";

describe("monitoring authentication", () => {
  it("accepts only the exact bearer secret", () => {
    const request = new Request("https://bugdrop.dev/api/monitor/run", {
      headers: { authorization: "Bearer correct-secret" },
    });
    expect(hasValidBearer(request, "correct-secret")).toBe(true);
    expect(hasValidBearer(request, "wrong-secret")).toBe(false);
    expect(hasValidBearer(request, undefined)).toBe(false);
  });

  it("rejects malformed idempotency identifiers", () => {
    expect(safeRequestId("run:123:1")).toBe("run:123:1");
    expect(safeRequestId("contains a space")).toBeNull();
    expect(safeRequestId("a".repeat(201))).toBeNull();
  });
});
