"use client";

import Link from "next/link";
import { useState } from "react";
import { MARKETPLACE_URL, HOMEPAGE_SHOWCASE_WIDGET_URL } from "@/lib/links";

export function QuickStart() {
  const [copied, setCopied] = useState(false);
  const codeSnippet = `<script src="${HOMEPAGE_SHOWCASE_WIDGET_URL}" data-repo="owner/repo"></script>`;

  function handleCopy() {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-w-0 rounded-3xl border border-border bg-bg-surface p-8 max-md:p-6">
      <h3 className="text-2xl font-semibold text-text-primary">Add BugDrop to your site.</h3>
      <p className="mt-2 text-text-subtle">Connect your repository, then add one script tag.</p>
      <a
        href={MARKETPLACE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center justify-center rounded-[10px] bg-gradient-to-br from-accent-warm to-accent-rose px-5 py-3 text-sm font-semibold text-bg-deep no-underline transition-transform hover:-translate-y-0.5 max-sm:w-full"
      >
        Install from GitHub Marketplace
      </a>
      <div className="mt-6 min-w-0 w-full max-w-full overflow-hidden">
        <p className="mb-3 break-words text-sm text-text-subtle">
          Replace <code className="rounded bg-bg-deep px-1.5 py-0.5 font-mono text-xs text-accent-cyan">owner/repo</code> with your repository:
        </p>
            <div className="relative max-w-full overflow-x-auto rounded-lg border border-border bg-bg-deep p-4 pr-12 font-mono text-sm max-sm:text-xs">
              <button onClick={handleCopy} className="absolute top-3 right-3 bg-bg-elevated border border-border text-text-subtle px-3 py-1.5 rounded-md text-xs cursor-pointer hover:bg-border hover:text-text-primary transition-all">{copied ? "Copied!" : "Copy"}</button>
              <code className="text-text-subtle">
                <span className="text-accent-rose">&lt;script</span>
                {"\n  "}
                <span className="text-accent-purple">src</span>=
                <span className="text-accent-green">&quot;{HOMEPAGE_SHOWCASE_WIDGET_URL}&quot;</span>
                {"\n  "}
                <span className="text-accent-purple">data-repo</span>=
                <span className="text-accent-green">&quot;owner/repo&quot;</span>
                <span className="text-accent-rose">&gt;&lt;/script&gt;</span>
              </code>
            </div>
      </div>
      <div className="mt-6 border-t border-border/70 pt-5">
        <Link
          href="/docs/installation"
          className="inline-flex text-sm font-medium text-accent-cyan no-underline transition-colors hover:text-text-primary"
        >
          Read the complete setup guide&nbsp;→
        </Link>
      </div>
    </div>
  );
}
