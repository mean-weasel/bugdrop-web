import { timingSafeEqual } from "node:crypto";

export function hasValidBearer(request: Request, expectedSecret: string | undefined): boolean {
  const secret = expectedSecret?.trim();
  const header = request.headers.get("authorization");
  if (!secret || !header?.startsWith("Bearer ")) return false;

  const actual = header.slice("Bearer ".length);
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(secret);
  return (
    actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer)
  );
}

export function safeRequestId(value: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  return /^[A-Za-z0-9._:-]{1,200}$/.test(trimmed) ? trimmed : null;
}
