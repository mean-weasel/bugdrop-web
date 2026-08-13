import type { ComponentDefinition } from "./types";

export const STATUS_URL = "https://bugdrop.dev/status";
export const EVALUATOR_STALE_AFTER_MS = 15 * 60 * 1000;
export const HEARTBEAT_FREQUENCY_MS = 4 * 60 * 60 * 1000;
export const HEARTBEAT_GRACE_MS = 7 * 60 * 60 * 1000;
export const HEARTBEAT_STALE_AFTER_MS = HEARTBEAT_FREQUENCY_MS + HEARTBEAT_GRACE_MS;

export const HEARTBEAT_REASON_CODES = {
  verified: ["issue_verified"],
  delivery_failed: ["issue_absent", "issue_duplicate", "issue_contract_invalid"],
  inconclusive: [
    "setup_failed",
    "identity_failed",
    "venue_failed",
    "browser_inconclusive",
    "github_network",
    "github_5xx",
    "github_rate_limited",
    "github_auth_failed",
    "cleanup_failed",
    "sweep_failed",
    "artifact_failed",
    "incident_failed",
    "classification_failed",
  ],
} as const;

export const COMPONENTS: ComponentDefinition[] = [
  {
    id: "landing_page",
    name: "BugDrop website",
    description: "The BugDrop landing page and documentation.",
    impactOnFailure: "outage",
    failureThreshold: 2,
    recoveryThreshold: 2,
    failureMessage: "The BugDrop website is not responding normally.",
  },
  {
    id: "widget_delivery",
    name: "Widget delivery",
    description: "Delivery of the hosted BugDrop JavaScript widget.",
    impactOnFailure: "outage",
    failureThreshold: 2,
    recoveryThreshold: 2,
    failureMessage: "The hosted BugDrop widget is not being delivered normally.",
  },
  {
    id: "feedback_api",
    name: "Feedback API",
    description: "Availability and production identity of the BugDrop API.",
    impactOnFailure: "outage",
    failureThreshold: 2,
    recoveryThreshold: 2,
    failureMessage: "The BugDrop feedback API is not responding normally.",
  },
  {
    id: "github_integration",
    name: "GitHub integration",
    description: "Connectivity between BugDrop and its GitHub App installation.",
    impactOnFailure: "degraded",
    failureThreshold: 2,
    recoveryThreshold: 2,
    failureMessage: "BugDrop cannot currently verify its GitHub integration.",
  },
  {
    id: "issue_delivery",
    name: "Issue delivery",
    description: "Recent end-to-end proof that feedback reaches a verified GitHub Issue.",
    impactOnFailure: "degraded",
    failureThreshold: 1,
    recoveryThreshold: 1,
    failureMessage: "BugDrop has not received a recent end-to-end delivery verification.",
  },
];

export function monitoringTargets() {
  return {
    landingUrl: process.env.MONITOR_LANDING_URL?.trim() || "https://bugdrop.dev/",
    widgetUrl:
      process.env.MONITOR_WIDGET_URL?.trim() ||
      "https://bugdrop.neonwatty.workers.dev/widget.js",
    healthUrl:
      process.env.MONITOR_HEALTH_URL?.trim() ||
      "https://bugdrop.neonwatty.workers.dev/api/health",
    githubCheckUrl:
      process.env.MONITOR_GITHUB_CHECK_URL?.trim() ||
      "https://bugdrop.neonwatty.workers.dev/api/check/mean-weasel/bugdrop-widget-test",
  };
}

export function configurationIssues(): string[] {
  const issues: string[] = [];
  const cronSecret = process.env.CRON_SECRET?.trim();
  const heartbeatSecret = process.env.MONITOR_HEARTBEAT_SECRET?.trim();
  const webhookUrl = process.env.MONITOR_ALERT_WEBHOOK_URL?.trim();
  const resendValues = [
    process.env.RESEND_API_KEY,
    process.env.MONITOR_ALERT_EMAIL_FROM,
    process.env.MONITOR_ALERT_EMAIL_TO,
  ].filter((value) => Boolean(value?.trim()));

  if (!process.env.CLOUDFLARE_ACCOUNT_ID?.trim()) issues.push("CLOUDFLARE_ACCOUNT_ID is missing");
  if (!process.env.CLOUDFLARE_D1_DATABASE_ID?.trim()) {
    issues.push("CLOUDFLARE_D1_DATABASE_ID is missing");
  }
  if (!process.env.CLOUDFLARE_D1_API_TOKEN?.trim()) {
    issues.push("CLOUDFLARE_D1_API_TOKEN is missing");
  }
  if (!cronSecret || cronSecret.length < 16) issues.push("CRON_SECRET must be at least 16 characters");
  if (!heartbeatSecret || heartbeatSecret.length < 32) {
    issues.push("MONITOR_HEARTBEAT_SECRET must be at least 32 characters");
  }
  if (resendValues.length > 0 && resendValues.length !== 3) {
    issues.push("Resend email alert configuration is incomplete");
  }
  if (!webhookUrl && resendValues.length === 0) {
    issues.push("At least one alert channel must be configured");
  }
  if (webhookUrl) {
    try {
      if (new URL(webhookUrl).protocol !== "https:") {
        issues.push("MONITOR_ALERT_WEBHOOK_URL must use HTTPS");
      }
    } catch {
      issues.push("MONITOR_ALERT_WEBHOOK_URL is not a valid URL");
    }
  }

  for (const [name, value] of Object.entries(monitoringTargets())) {
    try {
      const url = new URL(value);
      if (url.protocol !== "https:") issues.push(`${name} must use HTTPS`);
    } catch {
      issues.push(`${name} is not a valid URL`);
    }
  }

  return issues;
}
