const FEEDBACK_COUNT_URL = "https://bugdrop.dev/api/stats/feedback-issues";
const FALLBACK_FEEDBACK_COUNT = 3_100;
const PUBLIC_BUCKET_SIZE = 100;
const FEEDBACK_COUNT_TIMEOUT_MS = 5_000;

type FeedbackCountResponse = {
  feedbackIssuesCreated: number;
  display: string;
};

export async function getFeedbackIssuesDisplay(): Promise<string> {
  try {
    const response = await fetch(FEEDBACK_COUNT_URL, {
      next: { revalidate: 24 * 60 * 60 },
      signal: AbortSignal.timeout(FEEDBACK_COUNT_TIMEOUT_MS),
    });
    if (!response.ok) return formatFeedbackCount(FALLBACK_FEEDBACK_COUNT);

    const body = (await response.json()) as Partial<FeedbackCountResponse>;
    if (!isValidPublicCount(body)) {
      return formatFeedbackCount(FALLBACK_FEEDBACK_COUNT);
    }
    return body.display;
  } catch {
    return formatFeedbackCount(FALLBACK_FEEDBACK_COUNT);
  }
}

export function formatFeedbackCount(count: number): string {
  return `${count.toLocaleString("en-US")}+`;
}

function isValidPublicCount(
  body: Partial<FeedbackCountResponse>,
): body is FeedbackCountResponse {
  const { feedbackIssuesCreated: count, display } = body;
  return (
    Number.isSafeInteger(count) &&
    (count as number) >= FALLBACK_FEEDBACK_COUNT &&
    (count as number) % PUBLIC_BUCKET_SIZE === 0 &&
    display === formatFeedbackCount(count as number)
  );
}
