import { safeLocalStorageGet, safeLocalStorageSet } from "./analytics-context";

const attributionStorageKey = "bugdrop_attribution_v2";
const campaignParamKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "gbraid",
  "wbraid",
  "msclkid",
  "fbclid",
] as const;
// Facebook also adds fbclid to unpaid links; it is not proof of a paid click.
const paidClickParamKeys = ["gclid", "gbraid", "wbraid", "msclkid"] as const;
const paidMediums = new Set(["cpc", "ppc", "paid", "paid-search", "paid_search"]);
const organicMediums = new Set(["organic", "organic-search", "organic_search"]);
const emailMediums = new Set(["email", "newsletter"]);
const socialMediums = new Set(["social", "social-media", "social_media"]);
const searchEngines = [
  [/(^|\.)google\./, "google"],
  [/(^|\.)bing\.com$/, "bing"],
  [/(^|\.)duckduckgo\.com$/, "duckduckgo"],
  [/(^|\.)search\.yahoo\./, "yahoo"],
  [/(^|\.)brave\.com$/, "brave"],
  [/(^|\.)ecosia\.org$/, "ecosia"],
] as const;
const socialHosts = /(^|\.)(facebook\.com|instagram\.com|linkedin\.com|reddit\.com|t\.co|x\.com|youtube\.com)$/;

type StoredAttribution = {
  first_landing_page: string;
  first_acquisition_channel: string;
  first_referrer_type: string;
  first_search_engine?: string;
  first_campaign_present: boolean;
  first_paid_click_present: boolean;
  first_seen_at: string;
};

export function pagePath(pathname: string) {
  return pathname.startsWith("/") ? pathname.split(/[?#]/, 1)[0] : "/";
}

export function analyticsPageLocation(pathname = window.location.pathname) {
  return `${window.location.origin}${pagePath(pathname)}`;
}

export function analyticsReferrerLocation() {
  if (!document.referrer) return undefined;

  try {
    const referrer = new URL(document.referrer);
    if (!new Set(["http:", "https:"]).has(referrer.protocol)) return undefined;
    return `${referrer.origin}${pagePath(referrer.pathname)}`;
  } catch {
    return undefined;
  }
}

export function campaignSignals(searchParams: URLSearchParams) {
  const medium = searchParams.get("utm_medium")?.trim().toLowerCase();
  const campaignPresent = campaignParamKeys.some((key) => searchParams.has(key));
  const paidClickPresent = paidClickParamKeys.some((key) => searchParams.has(key));
  const mediumCategory = !medium
    ? undefined
    : paidMediums.has(medium)
      ? "paid"
      : organicMediums.has(medium)
        ? "organic"
        : emailMediums.has(medium)
          ? "email"
          : socialMediums.has(medium)
            ? "social"
            : "other";

  return {
    campaign_present: campaignPresent,
    paid_click_present: paidClickPresent,
    campaign_medium_category: mediumCategory,
  };
}

function parseStoredAttribution(): StoredAttribution | null {
  const stored = safeLocalStorageGet(attributionStorageKey);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored) as Partial<StoredAttribution>;
    if (
      typeof parsed.first_landing_page !== "string" ||
      !parsed.first_landing_page.startsWith("/") ||
      parsed.first_landing_page.includes("?") ||
      typeof parsed.first_acquisition_channel !== "string" ||
      typeof parsed.first_referrer_type !== "string" ||
      typeof parsed.first_campaign_present !== "boolean" ||
      typeof parsed.first_paid_click_present !== "boolean" ||
      typeof parsed.first_seen_at !== "string"
    ) return null;
    return {
      first_landing_page: pagePath(parsed.first_landing_page),
      first_acquisition_channel: ["paid_search", "organic_search", "email", "social", "campaign", "referral", "direct"].includes(parsed.first_acquisition_channel) ? parsed.first_acquisition_channel : "direct",
      first_referrer_type: ["none", "internal", "search", "social", "referral", "invalid"].includes(parsed.first_referrer_type) ? parsed.first_referrer_type : "invalid",
      first_search_engine: searchEngines.some(([, engine]) => engine === parsed.first_search_engine) ? parsed.first_search_engine : undefined,
      first_campaign_present: parsed.first_campaign_present,
      first_paid_click_present: parsed.first_paid_click_present,
      first_seen_at: Number.isFinite(Date.parse(parsed.first_seen_at)) ? new Date(parsed.first_seen_at).toISOString() : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

function referrerSignals(referrer: string) {
  if (!referrer) return { referrer_type: "none" as const };

  try {
    const hostname = new URL(referrer).hostname.toLowerCase().replace(/^www\./, "");
    if (hostname === window.location.hostname) return { referrer_type: "internal" as const };
    const searchEngine = searchEngines.find(([pattern]) => pattern.test(hostname))?.[1];
    if (searchEngine) return { referrer_type: "search" as const, search_engine: searchEngine };
    if (socialHosts.test(hostname)) return { referrer_type: "social" as const };
    return { referrer_type: "referral" as const };
  } catch {
    return { referrer_type: "invalid" as const };
  }
}

export function acquisitionChannel(
  campaign: ReturnType<typeof campaignSignals>,
  referrer: ReturnType<typeof referrerSignals>,
) {
  if (campaign.paid_click_present || campaign.campaign_medium_category === "paid") return "paid_search";
  if (campaign.campaign_medium_category === "organic") return "organic_search";
  if (campaign.campaign_medium_category === "email") return "email";
  if (campaign.campaign_medium_category === "social") return "social";
  if (campaign.campaign_medium_category === "other") return "campaign";
  if (referrer.referrer_type === "search") return "organic_search";
  if (referrer.referrer_type === "social") return "social";
  if (campaign.campaign_present) return "campaign";
  if (referrer.referrer_type === "referral") return "referral";
  return "direct";
}

export function attributionProperties(currentPagePath: string, searchParams: URLSearchParams) {
  const campaign = campaignSignals(searchParams);
  const referrer = referrerSignals(document.referrer);
  const channel = acquisitionChannel(campaign, referrer);
  const stored = parseStoredAttribution();
  const firstTouch: StoredAttribution = stored ?? {
    first_landing_page: currentPagePath,
    first_acquisition_channel: channel,
    first_referrer_type: referrer.referrer_type,
    first_search_engine: "search_engine" in referrer ? referrer.search_engine : undefined,
    first_campaign_present: campaign.campaign_present,
    first_paid_click_present: campaign.paid_click_present,
    first_seen_at: new Date().toISOString(),
  };

  if (!stored) safeLocalStorageSet(attributionStorageKey, JSON.stringify(firstTouch));

  return {
    ...firstTouch,
    landing_page: currentPagePath,
    acquisition_channel: channel,
    referrer_type: referrer.referrer_type,
    search_engine: "search_engine" in referrer ? referrer.search_engine : undefined,
    ...campaign,
    event_model_version: "2026-09-06",
  };
}

export function currentAttributionProperties() {
  return attributionProperties(
    pagePath(window.location.pathname),
    new URLSearchParams(window.location.search),
  );
}

