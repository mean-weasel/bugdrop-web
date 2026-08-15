"use client";

import { useState } from "react";

export function ResourceActions({
  downloadPath,
  copyText,
  analyticsLabel,
  printLabel,
}: {
  downloadPath: string;
  copyText: string;
  analyticsLabel: string;
  printLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(copyText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="not-prose my-6 flex flex-col gap-3 sm:flex-row" data-resource-actions>
      <button type="button" onClick={copy} data-analytics-event="resource_copy_click" data-analytics-label={analyticsLabel} className="rounded-[10px] bg-accent-cyan px-5 py-3 font-medium text-bg-deep">
        {copied ? "Copied" : "Copy portable version"}
      </button>
      <a href={downloadPath} download data-analytics-event="resource_download_click" data-analytics-label={analyticsLabel} className="rounded-[10px] border border-border px-5 py-3 text-center font-medium text-text-primary no-underline">
        Download Markdown
      </a>
      <button type="button" onClick={() => window.print()} data-analytics-event="resource_print_click" data-analytics-label={analyticsLabel} className="rounded-[10px] border border-border px-5 py-3 font-medium text-text-primary">
        {printLabel}
      </button>
    </div>
  );
}
