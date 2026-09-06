import { analyticsPageLocation, pagePath } from "./analytics-attribution";
import { analyticsIdentity, browserContext } from "./analytics-context";

export function sendPostHogEvent(key: string, host: string, event: string, properties: Record<string, unknown>) {
  const { distinctId, ...session } = analyticsIdentity(Date.now(), event === "web_vital");
  const body = JSON.stringify({
    api_key: key,
    event,
    distinct_id: distinctId,
    properties: {
      ...properties,
      $current_url: analyticsPageLocation(),
      $host: window.location.host,
      $pathname: pagePath(window.location.pathname),
      ...session,
      ...browserContext(),
    },
  });
  const url = `${host.replace(/\/$/, "")}/capture/`;
  try {
    if (navigator.sendBeacon?.(url, new Blob([body], { type: "application/json" }))) return;
  } catch {
    // Some restricted contexts reject beacon synchronously; try fetch next.
  }
  void fetch(url, {
    method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true,
  }).catch(() => {
    // Best-effort telemetry must not create unhandled promise rejections.
  });
}
