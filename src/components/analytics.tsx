"use client";

import Script from "next/script";
import { Suspense, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useReportWebVitals } from "next/web-vitals";

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
const attributionStorageKey = "bugdrop_attribution_v2";
const gaIntentEvent = "bugdrop:ga-intent";
const gaReadyEvent = "bugdrop:ga-ready";
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
const paidClickParamKeys = ["gclid", "gbraid", "wbraid", "msclkid", "fbclid"] as const;
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

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    bugdropGaConfigured?: boolean;
    bugdropGaIntent?: boolean;
    bugdropGaReady?: boolean;
  }
}

function pagePath(pathname: string) {
  return pathname.startsWith("/") ? pathname.split(/[?#]/, 1)[0] : "/";
}

function safeLocalStorageGet(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeLocalStorageSet(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable in private browsing or restricted contexts.
  }
}

function campaignSignals(searchParams: URLSearchParams) {
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
    return parsed as StoredAttribution;
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

function acquisitionChannel(
  campaign: ReturnType<typeof campaignSignals>,
  referrer: ReturnType<typeof referrerSignals>,
) {
  if (campaign.paid_click_present || campaign.campaign_medium_category === "paid") return "paid_search";
  if (campaign.campaign_medium_category === "organic" || referrer.referrer_type === "search") return "organic_search";
  if (campaign.campaign_medium_category === "email") return "email";
  if (campaign.campaign_medium_category === "social" || referrer.referrer_type === "social") return "social";
  if (campaign.campaign_present) return "campaign";
  if (referrer.referrer_type === "referral") return "referral";
  return "direct";
}

function attributionProperties(currentPagePath: string, searchParams: URLSearchParams) {
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
    event_model_version: "2026-08-14",
  };
}

function currentAttributionProperties() {
  return attributionProperties(
    pagePath(window.location.pathname),
    new URLSearchParams(window.location.search),
  );
}

function safeDestination(href: string | null) {
  if (!href) return undefined;
  try {
    const destination = new URL(href, window.location.origin);
    if (!new Set(["http:", "https:"]).has(destination.protocol)) return destination.protocol;
    return destination.origin === window.location.origin
      ? destination.pathname
      : `${destination.origin}${destination.pathname}`;
  } catch {
    return undefined;
  }
}

function ensureGoogleAnalyticsQueue() {
  if (!gaMeasurementId) return null;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = window.gtag ?? ((...args: unknown[]) => {
    window.dataLayer?.push(args);
  });

  if (!window.bugdropGaConfigured) {
    window.gtag("js", new Date());
    window.gtag("config", gaMeasurementId, { send_page_view: false });
    window.bugdropGaConfigured = true;
  }

  return window.gtag;
}

function activateGoogleAnalytics() {
  if (!gaMeasurementId || window.bugdropGaIntent) return;
  window.bugdropGaIntent = true;
  window.dispatchEvent(new Event(gaIntentEvent));
}

function waitForGoogleAnalytics() {
  if (!gaMeasurementId || window.bugdropGaReady) return Promise.resolve();

  return new Promise<void>((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.removeEventListener(gaReadyEvent, finish);
      window.setTimeout(resolve, 150);
    };
    window.addEventListener(gaReadyEvent, finish, { once: true });
    window.setTimeout(finish, 1500);
  });
}

function sendGoogleAnalytics(command: string, ...args: unknown[]) {
  ensureGoogleAnalyticsQueue()?.(command, ...args);
}

function posthogDistinctId() {
  const storageKey = "bugdrop_posthog_distinct_id";
  const existing = safeLocalStorageGet(storageKey);
  if (existing) return existing;

  const nextId = window.crypto.randomUUID();
  safeLocalStorageSet(storageKey, nextId);
  return nextId;
}

function capturePostHogEvent(
  eventName: string,
  properties: Record<string, unknown>,
) {
  if (!posthogKey) return;

  const body = JSON.stringify({
    api_key: posthogKey,
    event: eventName,
    distinct_id: posthogDistinctId(),
    properties: {
      $current_url: `${window.location.origin}${pagePath(window.location.pathname)}`,
      $host: window.location.host,
      $pathname: window.location.pathname,
      ...properties,
    },
  });

  const url = `${posthogHost}/capture/`;
  const blob = new Blob([body], { type: "application/json" });

  if (navigator.sendBeacon?.(url, blob)) return;

  void fetch(url, {
    method: "POST",
    body,
    headers: { "Content-Type": "application/json" },
    keepalive: true,
  });
}

function captureEvent(eventName: string, properties: Record<string, unknown>) {
  sendGoogleAnalytics("event", eventName, properties);
  activateGoogleAnalytics();
  capturePostHogEvent(eventName, properties);
}

function sendGooglePageView(
  currentPagePath: string,
  properties: Record<string, unknown>,
) {
  sendGoogleAnalytics("event", "page_view", {
    page_location: `${window.location.origin}${pagePath(window.location.pathname)}`,
    page_path: currentPagePath,
    ...properties,
  });
}

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const currentPagePath = pagePath(pathname);
    const attribution = attributionProperties(currentPagePath, searchParams);

    capturePostHogEvent("$pageview", {
      page_path: currentPagePath,
      ...attribution,
    });
    sendGooglePageView(currentPagePath, attribution);
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const el = target.closest<HTMLElement>("[data-analytics-event]");
      if (!el) return;

      const anchor = el instanceof HTMLAnchorElement ? el : el.closest<HTMLAnchorElement>("a[href]");
      const anchorOrigin = anchor ? new URL(anchor.href, window.location.href).origin : null;
      const delaySameTabNavigation = Boolean(
        gaMeasurementId &&
        anchor &&
        anchorOrigin !== window.location.origin &&
        !event.defaultPrevented &&
        !anchor.hasAttribute("download") &&
        (!anchor.target || anchor.target === "_self") &&
        event.button === 0 &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.shiftKey &&
        !event.altKey,
      );
      if (delaySameTabNavigation) event.preventDefault();

      captureEvent(el.dataset.analyticsEvent ?? "site_interaction", {
        label: el.dataset.analyticsLabel ?? "unlabeled",
        destination: safeDestination(el.getAttribute("href")),
        page_path: pagePath(pathname),
        ...attributionProperties(pagePath(pathname), searchParams),
      });

      if (delaySameTabNavigation && anchor) {
        const destination = anchor.href;
        void waitForGoogleAnalytics().then(() => window.location.assign(destination));
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleSuccessEvent = (event: Event) => {
      const detail = (event as CustomEvent<{ eventName?: string; label?: string }>).detail;
      if (
        !detail ||
        !detail.eventName?.match(/^[a-z0-9_]{3,64}$/) ||
        !detail.label?.match(/^[A-Za-z0-9 .:/+_-]{3,80}$/)
      ) return;

      captureEvent(detail.eventName, {
        label: detail.label,
        page_path: pagePath(pathname),
        ...attributionProperties(pagePath(pathname), searchParams),
      });
    };

    window.addEventListener("bugdrop:analytics-success", handleSuccessEvent);
    return () => window.removeEventListener("bugdrop:analytics-success", handleSuccessEvent);
  }, [pathname, searchParams]);

  return null;
}

export function Analytics() {
  const [gaActivated, setGaActivated] = useState(false);

  useEffect(() => {
    const handleIntent = () => setGaActivated(true);
    if (window.bugdropGaIntent) handleIntent();
    window.addEventListener(gaIntentEvent, handleIntent);
    return () => window.removeEventListener(gaIntentEvent, handleIntent);
  }, []);

  useReportWebVitals((metric) => {
    const attribution = currentAttributionProperties();
    const value =
      metric.name === "CLS" ? Math.round(metric.value * 1000) : Math.round(metric.value);

    sendGoogleAnalytics("event", metric.name, {
      event_category: "Web Vitals",
      event_label: metric.id,
      value,
      non_interaction: true,
      ...attribution,
    });
    capturePostHogEvent("web_vital", {
      id: metric.id,
      name: metric.name,
      value: metric.value,
      rating: "rating" in metric ? metric.rating : undefined,
      ...attribution,
    });
  });

  return (
    <>
      {gaMeasurementId && gaActivated ? (
        <Script
          id="ga4-intent-library"
          src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
          strategy="afterInteractive"
          data-ga-intent-library
          onLoad={() => {
            window.bugdropGaReady = true;
            window.dispatchEvent(new Event(gaReadyEvent));
          }}
        />
      ) : null}
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  );
}
