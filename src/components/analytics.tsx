"use client";

import Script from "next/script";
import { analyticsPageLocation, analyticsReferrerLocation, attributionProperties, currentAttributionProperties, pagePath } from "@/lib/analytics-attribution";
import { sendPostHogEvent } from "@/lib/analytics-capture";
import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useReportWebVitals } from "next/web-vitals";

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
const gaIntentEvent = "bugdrop:ga-intent";
const gaReadyEvent = "bugdrop:ga-ready";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    bugdropGaConfigured?: boolean;
    bugdropGaIntent?: boolean;
    bugdropGaReady?: boolean;
  }
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
    window.gtag("set", {
      page_location: analyticsPageLocation(),
      page_referrer: analyticsReferrerLocation(),
    });
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

function capturePostHogEvent(eventName: string, properties: Record<string, unknown>) {
  if (!posthogKey) return;
  sendPostHogEvent(posthogKey, posthogHost, eventName, properties);
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
  sendGoogleAnalytics("set", {
    page_location: analyticsPageLocation(),
    page_referrer: analyticsReferrerLocation(),
  });
  sendGoogleAnalytics("event", "page_view", {
    page_location: analyticsPageLocation(),
    page_path: currentPagePath,
    ...properties,
  });
}

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPageView = useRef<string | null>(null);

  useEffect(() => {
    const navigationKey = `${pathname}?${searchParams.toString()}`;
    if (lastPageView.current === navigationKey) return;
    lastPageView.current = navigationKey;
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
