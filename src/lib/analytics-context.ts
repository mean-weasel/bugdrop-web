// Values fall back to this document's memory when storage is restricted.
const memory = new Map<string, string>();
const failedWrites = new Set<string>();
export function safeLocalStorageGet(key: string) {
  // A readable persisted value may be stale after a quota/write failure.
  if (failedWrites.has(key)) return memory.get(key) ?? null;
  try {
    return window.localStorage.getItem(key) ?? memory.get(key) ?? null;
  } catch {
    return memory.get(key) ?? null;
  }
}
export function safeLocalStorageSet(key: string, value: string) {
  memory.set(key, value);
  try {
    window.localStorage.setItem(key, value);
    failedWrites.delete(key);
  } catch {
    failedWrites.add(key);
    // Never break a user journey because analytics storage is unavailable.
  }
}

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[47][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const sessionKey = "bugdrop_analytics_session_v1";
const idleTimeout = 30 * 60 * 1000;
const maximumSession = 24 * 60 * 60 * 1000;
let windowId: string | undefined;

// PostHog session queries use the timestamp embedded in a UUIDv7.
function timestampedUuid(now: number) {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  let timestamp = now;
  for (let i = 5; i >= 0; i--) {
    bytes[i] = timestamp % 256;
    timestamp = Math.floor(timestamp / 256);
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x70;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function analyticsIdentity(now = Date.now(), passive = false) {
  const key = "bugdrop_posthog_distinct_id";
  const existing = safeLocalStorageGet(key);
  const distinctId = existing && uuidPattern.test(existing) ? existing : crypto.randomUUID();
  if (distinctId !== existing) safeLocalStorageSet(key, distinctId);
  let session: { id: string; started: number; last: number } | undefined;
  try {
    const stored = JSON.parse(safeLocalStorageGet(sessionKey) ?? "null");
    if (stored && typeof stored.id === "string" && uuidPattern.test(stored.id) &&
      stored.id[14] === "7" && Number.isFinite(stored.started) && Number.isFinite(stored.last) &&
      stored.started <= stored.last && stored.last <= now &&
      (passive || now - stored.last < idleTimeout) && now - stored.started < maximumSession) {
      session = { id: stored.id, started: stored.started, last: passive ? stored.last : now };
    }
  } catch {
    // Discard malformed storage instead of copying it to event properties.
  }
  session ??= { id: timestampedUuid(now), started: now, last: now };
  safeLocalStorageSet(sessionKey, JSON.stringify(session));
  windowId ??= timestampedUuid(now);
  return { distinctId, $session_id: session.id, $window_id: windowId };
}

export function browserContext() {
  const ua = navigator.userAgent;
  const ipad = /iPad/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  const tablet = ipad || (/Android/.test(ua) && !/Mobile/.test(ua));
  const mobile = !tablet && /Mobile|iPhone|iPod|Android/.test(ua);
  const browser = /Edg(?:e|A|iOS)?\//.test(ua) ? "Microsoft Edge"
    : /(?:OPR|Opera)\//.test(ua) ? "Opera"
    : /(?:Firefox|FxiOS)\//.test(ua) ? "Firefox"
    : /(?:Chrome|CriOS)\//.test(ua) ? "Chrome"
    : /Safari\//.test(ua) ? "Safari" : "Unknown";
  const os = ipad || /iPhone|iPod/.test(ua) ? "iOS"
    : /Android/.test(ua) ? "Android" : /Windows/.test(ua) ? "Windows"
    : /Macintosh|Mac OS X/.test(ua) ? "Mac OS X" : /Linux/.test(ua) ? "Linux" : "Unknown";
  const hostname = window.location.hostname;
  const local = hostname === "localhost" || hostname.endsWith(".localhost") || hostname === "127.0.0.1" || hostname === "[::1]";
  const automated = navigator.webdriver === true || /HeadlessChrome|Googlebot|bingbot/i.test(ua);
  const internal = local || safeLocalStorageGet("bugdrop_analytics_internal") === "true";
  return {
    $browser: browser,
    $os: os,
    $device_type: tablet ? "Tablet" : mobile ? "Mobile" : "Desktop",
    $viewport_width: window.innerWidth,
    $viewport_height: window.innerHeight,
    analytics_collector: "bugdrop-browser",
    analytics_context_version: "2026-09-06",
    is_internal: internal,
    is_synthetic: automated,
    traffic_type: automated ? "synthetic" : internal ? "internal" : "unclassified",
  };
}
