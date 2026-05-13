"use client";

import Script from "next/script";
import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useReportWebVitals } from "next/web-vitals";

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
const attributionStorageKey = "bugdrop_attribution";
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

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function currentUrl(pathname: string, searchParams: URLSearchParams) {
  const query = searchParams.toString();
  return query ? `${pathname}?${query}` : pathname;
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

function searchParamsObject(searchParams: URLSearchParams) {
  const params: Record<string, string> = {};

  for (const key of campaignParamKeys) {
    const value = searchParams.get(key);
    if (value) params[key] = value;
  }

  return params;
}

function parseStoredAttribution() {
  const stored = safeLocalStorageGet(attributionStorageKey);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as Record<string, string | undefined>;
  } catch {
    return null;
  }
}

function referrerDomain(referrer: string) {
  if (!referrer) return undefined;

  try {
    return new URL(referrer).hostname;
  } catch {
    return undefined;
  }
}

function attributionProperties(pagePath: string, searchParams: URLSearchParams) {
  const currentParams = searchParamsObject(searchParams);
  const stored = parseStoredAttribution();
  const firstTouch = stored ?? {
    first_landing_page: pagePath,
    first_referrer: document.referrer || undefined,
    first_referring_domain: referrerDomain(document.referrer),
    first_seen_at: new Date().toISOString(),
    ...Object.fromEntries(
      Object.entries(currentParams).map(([key, value]) => [`first_${key}`, value]),
    ),
  };

  if (!stored) {
    safeLocalStorageSet(attributionStorageKey, JSON.stringify(firstTouch));
  }

  return {
    ...firstTouch,
    referrer: document.referrer || undefined,
    referring_domain: referrerDomain(document.referrer),
    landing_page: pagePath,
    ...currentParams,
  };
}

function currentAttributionProperties() {
  return attributionProperties(
    `${window.location.pathname}${window.location.search}`,
    new URLSearchParams(window.location.search),
  );
}

function sendGoogleAnalytics(command: string, ...args: unknown[]) {
  if (!gaMeasurementId) return;

  if (window.gtag) {
    window.gtag(command, ...args);
    return;
  }

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push([command, ...args]);
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
      $current_url: window.location.href,
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
  capturePostHogEvent(eventName, properties);
}

function sendGooglePageView(
  pagePath: string,
  properties: Record<string, unknown>,
) {
  sendGoogleAnalytics("event", "page_view", {
    page_location: window.location.href,
    page_path: pagePath,
    page_title: document.title,
    ...properties,
  });
}

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const pagePath = currentUrl(pathname, searchParams);
    const attribution = attributionProperties(pagePath, searchParams);
    let cancelled = false;
    let attempts = 0;

    capturePostHogEvent("$pageview", {
      page_path: pagePath,
      ...attribution,
    });

    const sendPageViewWhenReady = () => {
      if (cancelled) return;

      if (window.gtag || attempts >= 20) {
        sendGooglePageView(pagePath, attribution);
        return;
      }

      attempts += 1;
      window.setTimeout(sendPageViewWhenReady, 100);
    };

    sendPageViewWhenReady();

    return () => {
      cancelled = true;
    };
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const el = target.closest<HTMLElement>("[data-analytics-event]");
      if (!el) return;

      captureEvent(el.dataset.analyticsEvent ?? "site_interaction", {
        label: el.dataset.analyticsLabel ?? el.textContent?.trim() ?? undefined,
        destination: el.getAttribute("href") ?? undefined,
        page_path: currentUrl(pathname, searchParams),
        ...attributionProperties(currentUrl(pathname, searchParams), searchParams),
      });
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname, searchParams]);

  return null;
}

export function Analytics() {
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
      {gaMeasurementId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${gaMeasurementId}', { send_page_view: false });
            `}
          </Script>
        </>
      ) : null}
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  );
}
