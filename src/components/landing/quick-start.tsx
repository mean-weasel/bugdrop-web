"use client";

import { useState } from "react";
import { MARKETPLACE_URL, WIDGET_URL, widgetScriptTag } from "@/lib/links";

export function QuickStart() {
  const [copied, setCopied] = useState(false);
  const codeSnippet = widgetScriptTag();

  function handleCopy() {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="bg-bg-surface border border-border rounded-3xl p-12 mb-20 animate-fade-up max-md:p-6" style={{ animationDelay: "0.4s" }}>
      <h3 className="text-2xl font-semibold mb-2 text-text-primary">Quick Start</h3>
      <p className="text-text-subtle mb-8">Get up and running in under a minute.</p>
      <div className="flex flex-col gap-6">
        <div className="flex gap-4 items-start max-sm:flex-col">
          <div className="w-7 h-7 rounded-full bg-bg-elevated border border-border text-accent-warm font-semibold text-sm flex items-center justify-center shrink-0">1</div>
          <div className="min-w-0">
            <p className="text-text-subtle mb-3"><strong className="text-text-primary">Install from GitHub Marketplace</strong> on your repository:</p>
            <p><a href={MARKETPLACE_URL} target="_blank" rel="noopener noreferrer" className="break-words text-accent-cyan no-underline hover:underline">{MARKETPLACE_URL}</a></p>
          </div>
        </div>
        <div className="flex gap-4 items-start max-sm:flex-col">
          <div className="w-7 h-7 rounded-full bg-bg-elevated border border-border text-accent-warm font-semibold text-sm flex items-center justify-center shrink-0">2</div>
          <div className="min-w-0 w-full max-w-full flex-1 overflow-hidden">
            <p className="text-text-subtle mb-3 break-words"><strong className="text-text-primary">Add the script</strong> to your website (replace <code className="bg-bg-deep px-1.5 py-0.5 rounded font-mono text-xs text-accent-cyan">owner/repo</code> with your repo):</p>
            <div className="font-mono text-sm bg-bg-deep border border-border rounded-lg p-4 pr-12 overflow-x-auto relative max-w-full">
              <button onClick={handleCopy} className="absolute top-3 right-3 bg-bg-elevated border border-border text-text-subtle px-3 py-1.5 rounded-md text-xs cursor-pointer hover:bg-border hover:text-text-primary transition-all">{copied ? "Copied!" : "Copy"}</button>
              <code className="text-text-subtle">
                <span className="text-accent-rose">&lt;script</span>
                {"\n  "}
                <span className="text-accent-purple">src</span>=
                <span className="text-accent-green">&quot;{WIDGET_URL}&quot;</span>
                {"\n  "}
                <span className="text-accent-purple">data-repo</span>=
                <span className="text-accent-green">&quot;owner/repo&quot;</span>
                <span className="text-accent-rose">&gt;&lt;/script&gt;</span>
              </code>
            </div>
          </div>
        </div>
        <div className="flex gap-4 items-start max-sm:flex-col">
          <div className="w-7 h-7 rounded-full bg-bg-elevated border border-border text-accent-warm font-semibold text-sm flex items-center justify-center shrink-0">3</div>
          <div><p className="text-text-subtle"><strong className="text-text-primary">That&apos;s it!</strong> Users can now submit feedback that becomes GitHub issues.</p></div>
        </div>
      </div>
    </section>
  );
}
