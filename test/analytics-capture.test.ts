import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const chrome = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36";
let storage: Map<string, string>;
let beacon: ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.resetModules();
  storage = new Map();
  beacon = vi.fn(() => true);
  vi.stubGlobal("window", {
    location: { origin: "https://bugdrop.dev", host: "bugdrop.dev", hostname: "bugdrop.dev", pathname: "/demo", search: "?token=secret&utm_medium=email" },
    localStorage: { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => storage.set(key, value) },
    innerWidth: 1280, innerHeight: 800,
  });
  vi.stubGlobal("document", { referrer: "https://www.google.com/search?q=secret" });
  vi.stubGlobal("navigator", { userAgent: chrome, maxTouchPoints: 0, webdriver: false, sendBeacon: beacon });
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));
});
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

async function payload() {
  return JSON.parse(await (beacon.mock.calls.at(-1) as unknown as [string, Blob])[1].text());
}

describe("privacy-preserving browser capture", () => {
  it("captures actual outgoing context while excluding query strings and raw user agents/referrers", async () => {
    const { sendPostHogEvent } = await import("../src/lib/analytics-capture");
    const { currentAttributionProperties } = await import("../src/lib/analytics-attribution");
    sendPostHogEvent("dummy", "https://analytics.invalid", "$pageview", currentAttributionProperties());
    const event = await payload();
    expect(event.properties).toMatchObject({
      $current_url: "https://bugdrop.dev/demo", $device_type: "Desktop", $browser: "Chrome",
      $viewport_width: 1280, $viewport_height: 800, acquisition_channel: "email",
      traffic_type: "unclassified", is_synthetic: false, is_internal: false,
    });
    expect(event.properties.$session_id).toMatch(/^[0-9a-f-]{14}7/);
    expect(JSON.stringify(event)).not.toMatch(/secret|Mozilla|google.com|utm_medium=/);
  });

  it("keeps one anonymous visitor and session across events even when storage throws", async () => {
    Object.defineProperty(window, "localStorage", { get() { throw new Error("blocked"); } });
    const { sendPostHogEvent } = await import("../src/lib/analytics-capture");
    sendPostHogEvent("dummy", "https://analytics.invalid", "$pageview", {});
    const first = await payload();
    sendPostHogEvent("dummy", "https://analytics.invalid", "outbound_marketplace_click", {});
    const second = await payload();
    expect(second.distinct_id).toBe(first.distinct_id);
    expect(second.properties.$session_id).toBe(first.properties.$session_id);
    expect(second.properties.$window_id).toBe(first.properties.$window_id);
    expect(second.event).toBe("outbound_marketplace_click");
  });

  it("preserves first touch in restricted storage across navigation", async () => {
    Object.defineProperty(window, "localStorage", { get() { throw new Error("blocked"); } });
    const { attributionProperties } = await import("../src/lib/analytics-attribution");
    attributionProperties("/start", new URLSearchParams("utm_medium=email"));
    expect(attributionProperties("/demo", new URLSearchParams())).toMatchObject({ first_landing_page: "/start", first_acquisition_channel: "email" });
  });

  it("rotates sessions after inactivity, retains visitor, and never extends activity for vitals", async () => {
    const { analyticsIdentity } = await import("../src/lib/analytics-context");
    const time = 1_800_000_000_000;
    const first = analyticsIdentity(time);
    expect(analyticsIdentity(time + 29 * 60_000).$session_id).toBe(first.$session_id);
    expect(analyticsIdentity(time + 58 * 60_000, true).$session_id).toBe(first.$session_id);
    const next = analyticsIdentity(time + 60 * 60_000);
    expect(next.$session_id).not.toBe(first.$session_id);
    expect(next.distinctId).toBe(first.distinctId);
    expect(next.$window_id).toBe(first.$window_id);
  });

  it("restores a session across full page loads and assigns a fresh document window ID", async () => {
    const first = (await import("../src/lib/analytics-context")).analyticsIdentity();
    vi.resetModules();
    const next = (await import("../src/lib/analytics-context")).analyticsIdentity();
    expect(next.$session_id).toBe(first.$session_id);
    expect(next.distinctId).toBe(first.distinctId);
    expect(next.$window_id).not.toBe(first.$window_id);
  });

  it("rejects malformed storage and strips unexpected first-touch properties", async () => {
    storage.set("bugdrop_posthog_distinct_id", "private@example.com");
    storage.set("bugdrop_analytics_session_v1", '{"id":"private@example.com"}');
    storage.set("bugdrop_attribution_v2", JSON.stringify({
      first_landing_page: "/start", first_acquisition_channel: "email", first_referrer_type: "none",
      first_campaign_present: true, first_paid_click_present: false, first_seen_at: "2026-09-06",
      feedback_body: "private@example.com", first_search_engine: "private@example.com",
    }));
    const { sendPostHogEvent } = await import("../src/lib/analytics-capture");
    const { currentAttributionProperties } = await import("../src/lib/analytics-attribution");
    sendPostHogEvent("dummy", "https://analytics.invalid", "$pageview", currentAttributionProperties());
    expect(JSON.stringify(await payload())).not.toContain("private@example.com");
  });

  it.each([
    ["Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) Version/18.0 Mobile Safari/604.1", 1, "Mobile", "Safari"],
    ["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) Version/18.0 Safari/605.1", 5, "Tablet", "Safari"],
    ["Mozilla/5.0 (Linux; Android 14) Chrome/130.0 Safari/537.36", 5, "Tablet", "Chrome"],
    [chrome + " Edg/130.0", 0, "Desktop", "Microsoft Edge"],
  ])("classifies supported device families without viewport guessing", async (userAgent, maxTouchPoints, device, browser) => {
    vi.stubGlobal("navigator", { userAgent, maxTouchPoints, webdriver: false });
    const { browserContext } = await import("../src/lib/analytics-context");
    expect(browserContext()).toMatchObject({ $device_type: device, $browser: browser });
  });

  it("marks observable automation and explicit internal traffic independently", async () => {
    storage.set("bugdrop_analytics_internal", "true");
    vi.stubGlobal("navigator", { userAgent: chrome, webdriver: true });
    const { browserContext } = await import("../src/lib/analytics-context");
    expect(browserContext()).toMatchObject({ is_internal: true, is_synthetic: true, traffic_type: "synthetic" });
  });

  it("falls back when beacon throws and absorbs rejected network requests", async () => {
    beacon.mockImplementation(() => { throw new Error("blocked"); });
    vi.mocked(fetch).mockRejectedValue(new Error("offline"));
    const { sendPostHogEvent } = await import("../src/lib/analytics-capture");
    expect(() => sendPostHogEvent("dummy", "https://analytics.invalid/", "$pageview", {})).not.toThrow();
    await Promise.resolve();
    expect(fetch).toHaveBeenCalledWith("https://analytics.invalid/capture/", expect.objectContaining({ keepalive: true }));
  });
});

describe("acquisition precedence", () => {
  it("keeps organic referrers with term-only metadata and does not call fbclid a paid search click", async () => {
    const { campaignSignals, acquisitionChannel } = await import("../src/lib/analytics-attribution");
    expect(acquisitionChannel(campaignSignals(new URLSearchParams("utm_term=private")), { referrer_type: "search", search_engine: "google" })).toBe("organic_search");
    const facebook = campaignSignals(new URLSearchParams("fbclid=private"));
    expect(facebook.paid_click_present).toBe(false);
    expect(acquisitionChannel(facebook, { referrer_type: "social" })).toBe("social");
  });
  it.each([["email", "email"], ["social", "social"], ["cpc", "paid_search"], ["organic", "organic_search"], ["unknown", "campaign"]])("uses explicit %s medium before a search referrer", async (medium, channel) => {
    const { campaignSignals, acquisitionChannel } = await import("../src/lib/analytics-attribution");
    expect(acquisitionChannel(campaignSignals(new URLSearchParams({ utm_medium: medium })), { referrer_type: "search", search_engine: "google" })).toBe(channel);
  });
});
