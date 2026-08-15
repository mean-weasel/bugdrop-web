/* eslint-disable @next/next/no-sync-scripts -- BugDrop's official loading contract requires normal parser execution. */
import { WIDGET_URL } from "@/lib/links";

export function shouldLoadBugDropInPreview(environment: string | undefined) {
  return environment === "preview";
}

export function VercelPreviewBugDrop({
  repo,
  environment = process.env.VERCEL_ENV,
  scriptUrl = WIDGET_URL,
}: {
  repo: string;
  environment?: string;
  scriptUrl?: string;
}) {
  if (!shouldLoadBugDropInPreview(environment)) return null;

  return (
    <script
      src={scriptUrl}
      data-repo={repo}
      data-label="Preview feedback"
      data-welcome="Report a problem on this preview deployment"
      data-screenshot="optional"
    />
  );
}
