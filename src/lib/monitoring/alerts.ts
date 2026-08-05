import {
  claimPendingAlert,
  markAlertDelivered,
  markAlertFailed,
  type AlertChannel,
} from "./store";
import type { AlertPayload } from "./types";

export function configuredAlertChannels(): AlertChannel[] {
  const channels: AlertChannel[] = [];
  if (process.env.MONITOR_ALERT_WEBHOOK_URL?.trim()) channels.push("webhook");
  if (
    process.env.RESEND_API_KEY?.trim() &&
    process.env.MONITOR_ALERT_EMAIL_FROM?.trim() &&
    process.env.MONITOR_ALERT_EMAIL_TO?.trim()
  ) {
    channels.push("email");
  }
  return channels;
}

export async function dispatchPendingAlerts(limit = 10): Promise<{
  delivered: number;
  failed: number;
  skipped: number;
}> {
  const result = { delivered: 0, failed: 0, skipped: 0 };
  for (let index = 0; index < limit; index += 1) {
    const delivery = await claimPendingAlert();
    if (!delivery) break;

    const id = String(delivery.id);
    const channel = String(delivery.channel) as AlertChannel;
    const payload = delivery.payload as AlertPayload;
    const attempts = Number(delivery.attempts);
    try {
      const sent = await sendAlert(channel, payload);
      if (!sent) {
        await markAlertFailed(id, attempts, `${channel} is temporarily not configured`);
        result.failed += 1;
      } else {
        await markAlertDelivered(id);
        result.delivered += 1;
      }
    } catch (error) {
      await markAlertFailed(id, attempts, safeAlertError(error));
      result.failed += 1;
    }
  }
  return result;
}

async function sendAlert(channel: AlertChannel, payload: AlertPayload): Promise<boolean> {
  if (channel === "webhook") return sendWebhook(payload);
  return sendEmail(payload);
}

async function sendWebhook(payload: AlertPayload): Promise<boolean> {
  const url = process.env.MONITOR_ALERT_WEBHOOK_URL?.trim();
  if (!url) return false;
  const secret = process.env.MONITOR_ALERT_WEBHOOK_SECRET?.trim();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(secret ? { authorization: `Bearer ${secret}` } : {}),
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`Alert webhook returned HTTP ${response.status}`);
  return true;
}

async function sendEmail(payload: AlertPayload): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.MONITOR_ALERT_EMAIL_FROM?.trim();
  const to = process.env.MONITOR_ALERT_EMAIL_TO?.trim();
  if (!apiKey || !from || !to) return false;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: to.split(",").map((address) => address.trim()).filter(Boolean),
      subject: `[BugDrop status] ${payload.event}: ${payload.component}`,
      text: [payload.title, "", payload.message, "", `Status: ${payload.statusUrl}`].join("\n"),
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`Resend returned HTTP ${response.status}`);
  return true;
}

function safeAlertError(error: unknown): string {
  let message = error instanceof Error ? error.message : String(error);
  for (const secret of [
    process.env.MONITOR_ALERT_WEBHOOK_SECRET,
    process.env.RESEND_API_KEY,
  ]) {
    if (secret) message = message.split(secret).join("[REDACTED]");
  }
  return message.slice(0, 500);
}
