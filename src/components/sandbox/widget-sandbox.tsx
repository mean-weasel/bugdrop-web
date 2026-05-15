"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Bot,
  Check,
  Clipboard,
  Code2,
  ExternalLink,
  FileCode2,
  MonitorSmartphone,
  Play,
  RefreshCw,
  Send,
  Settings2,
  Sparkles,
  Wand2,
  X,
} from "lucide-react";
import { WIDGET_URL } from "@/lib/links";
import {
  attributeMap,
  initialConfig,
  numericValue,
  scriptAttributes,
  validateConfig,
  validRepo,
  type SandboxConfig,
  type ValidationMessage,
} from "./widget-config-manifest";

type OutputTab = "script" | "preview" | "agent";
type PreviewState = "closed" | "welcome" | "form" | "success";
type SandboxTarget = "configure" | "preview" | "install";

const outputTabDetails: Record<OutputTab, { label: string; description: string }> = {
  script: {
    label: "Install script",
    description: "Production script without data-preview.",
  },
  preview: {
    label: "Test on my site",
    description: "Real-widget compatibility snippet.",
  },
  agent: {
    label: "Agent prompt",
    description: "Coding-agent setup instructions.",
  },
};

function escapeAttribute(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
}

function buildScriptTag(config: SandboxConfig) {
  const lines = [`<script`, `  src="${WIDGET_URL}"`];
  for (const [key, value] of scriptAttributes(config)) {
    lines.push(`  ${attributeMap[key]}="${escapeAttribute(value)}"`);
  }
  lines[lines.length - 1] = `${lines[lines.length - 1]}></script>`;
  return lines.join("\n");
}

function previewScriptAttributes(config: SandboxConfig) {
  return {
    ...Object.fromEntries(
      scriptAttributes(config).map(([key, value]) => [attributeMap[key], value]),
    ),
    "data-preview": "true",
  } as Record<string, string>;
}

function buildPreviewSnippet(config: SandboxConfig) {
  const attrs = previewScriptAttributes(config);

  return `(() => {
  const widgetSrc = ${JSON.stringify(WIDGET_URL)};
  const attrs = ${JSON.stringify(attrs, null, 2)};
  document.getElementById("bugdrop-preview-script")?.remove();
  document.getElementById("bugdrop-host")?.remove();
  delete window.BugDrop;
  delete window.BugDropPreview;

  const script = document.createElement("script");
  script.id = "bugdrop-preview-script";
  script.src = widgetSrc;
  for (const [name, value] of Object.entries(attrs)) {
    if (value) script.setAttribute(name, value);
  }
  document.body.append(script);
  console.info("[BugDrop compatibility test] Real widget injected. Reload the page to fully reset and remove it.");
})();`;
}

function buildAgentPrompt(config: SandboxConfig) {
  const verification = config.showButton
    ? `- After installing, verify the floating "${config.label || "Feedback"}" button appears and opens the wizard.`
    : `- The script has data-button="false", so no floating button should appear. Add or verify an app-owned trigger that calls window.BugDrop.open() after the widget loads.`;

  return `Install BugDrop in this web app using the script tag below.

Requirements:
- Add the plain script tag globally so it loads on every product page.
- For Next.js App Router, place the plain script tag in the root app/layout.tsx body or equivalent app shell instead of using next/script.
- For Vite, React, Rails, Laravel, or plain HTML, place it near the end of the body or equivalent app shell.
- Preserve all data-* attributes exactly.
- Do not include data-preview="true" in production.
- Mark private fields with data-bugdrop-mask when they should never appear in screenshots.
${verification}
- The default widget URL follows the latest deployed widget. Pin a version for production if this app requires predictable widget upgrades.

${buildScriptTag(config)}`;
}

function buildBookmarklet(snippet: string) {
  return `javascript:${encodeURIComponent(snippet)}`;
}

function escapeScriptJson(value: unknown) {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

function buildIframeHtml(config: SandboxConfig, previewState: PreviewState) {
  const previewData = {
    state: previewState,
    theme: config.theme,
    position: config.position,
    color: config.color,
    label: config.label || "Feedback",
    screenshot: config.screenshot,
    showName: config.showName || config.requireName,
    requireName: config.requireName,
    showEmail: config.showEmail || config.requireEmail,
    requireEmail: config.requireEmail,
    showButton: config.showButton,
    font: config.font,
    radius: numericValue(config.radius) || "8",
    bg: config.bg,
    text: config.text,
    borderWidth: numericValue(config.borderWidth) || "1",
    borderColor: config.borderColor,
    shadow: config.shadow,
  };

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    :root {
      --bg: #f8fafc;
      --ink: #162033;
      --muted: #64748b;
      --line: #dbe3ee;
      --surface: #ffffff;
      --accent: #2563eb;
      --success: #0f766e;
      --warning: #b45309;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      color: var(--ink);
      background: var(--bg);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      letter-spacing: 0;
    }
    button, input { font: inherit; }
    .topbar {
      position: sticky;
      top: 0;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
      padding: 16px 24px;
      background: rgba(255,255,255,0.9);
      border-bottom: 1px solid var(--line);
      backdrop-filter: blur(14px);
    }
    .brand { display: flex; align-items: center; gap: 10px; font-weight: 760; }
    .brand-mark {
      width: 30px;
      height: 30px;
      border-radius: 8px;
      background: var(--accent);
      box-shadow: inset 0 -8px 16px rgba(0,0,0,0.18);
    }
    .nav-actions { display: flex; gap: 10px; }
    .nav-actions button, .secondary-action {
      min-height: 36px;
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 0 12px;
      color: var(--ink);
      background: #fff;
    }
    .hero {
      display: grid;
      grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
      gap: 28px;
      padding: 44px 24px 28px;
      max-width: 1180px;
      margin: 0 auto;
    }
    h1, h2, p { margin: 0; }
    h1 {
      max-width: 680px;
      font-size: clamp(44px, 7vw, 76px);
      line-height: 0.96;
      letter-spacing: 0;
    }
    .hero p {
      max-width: 580px;
      margin-top: 18px;
      color: #53647e;
      font-size: 18px;
      line-height: 1.6;
    }
    .primary-action {
      margin-top: 26px;
      min-height: 44px;
      border: 0;
      border-radius: 8px;
      padding: 0 16px;
      color: #fff;
      background: var(--accent);
      font-weight: 700;
    }
    .health-card, .account-panel, .feedback-list, .notes-panel {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255,255,255,0.78);
      box-shadow: 0 20px 60px rgba(22,32,51,0.06);
    }
    .health-card { padding: 24px; min-height: 260px; }
    .health-card h2, .account-panel h2, .feedback-list h2, .notes-panel h2 {
      font-size: 12px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #61708a;
    }
    .metric {
      display: flex;
      justify-content: space-between;
      margin-top: 12px;
      padding: 14px 16px;
      border: 1px solid var(--line);
      border-radius: 8px;
      color: #64748b;
      font-weight: 650;
    }
    .metric strong { color: var(--ink); }
    .workspace {
      display: grid;
      grid-template-columns: minmax(0, 1.35fr) minmax(320px, 0.9fr);
      gap: 24px;
      padding: 10px 24px 48px;
      max-width: 1180px;
      margin: 0 auto;
    }
    .feedback-list { overflow: hidden; }
    .feedback-head, .task-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto auto;
      gap: 16px;
      align-items: center;
      padding: 14px 18px;
      border-bottom: 1px solid var(--line);
    }
    .task-row:last-child { border-bottom: 0; }
    .task-title { font-weight: 760; }
    .task-meta { margin-top: 3px; color: #64748b; font-size: 13px; }
    .pill {
      border-radius: 999px;
      padding: 5px 10px;
      background: #e6efff;
      color: #1450c8;
      font-size: 12px;
      font-weight: 750;
    }
    .priority { color: var(--warning); font-size: 12px; font-weight: 800; }
    .sidebar { display: grid; gap: 24px; }
    .account-panel, .notes-panel { padding: 18px; }
    .form-stack { display: grid; gap: 12px; margin-top: 16px; }
    .form-stack label { display: grid; gap: 7px; color: #64748b; font-size: 13px; font-weight: 700; }
    .form-stack input {
      min-height: 38px;
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 0 12px;
      color: var(--ink);
      background: #f8fafc;
      font-weight: 650;
    }
    .notes-panel p { margin-top: 10px; color: #64748b; line-height: 1.5; }
    .mock-widget-button {
      position: fixed;
      z-index: 10;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-height: 44px;
      border: 0;
      border-radius: var(--mock-radius);
      padding: 0 14px;
      color: #fff;
      background: var(--mock-accent);
      box-shadow: var(--mock-shadow);
      font: 700 14px/1.2 var(--mock-font);
    }
    .mock-widget-button.bottom-right { right: 18px; bottom: 18px; }
    .mock-widget-button.bottom-left { left: 18px; bottom: 18px; }
    .mock-widget-panel {
      position: fixed;
      z-index: 10;
      bottom: 72px;
      width: min(360px, calc(100vw - 36px));
      border: var(--mock-border-width) solid var(--mock-border);
      border-radius: var(--mock-radius);
      padding: 16px;
      color: var(--mock-text);
      background: var(--mock-bg);
      box-shadow: var(--mock-shadow);
      font: 14px/1.45 var(--mock-font);
    }
    .mock-widget-panel.bottom-right { right: 18px; }
    .mock-widget-panel.bottom-left { left: 18px; }
    .mock-widget-panel h2 { margin: 0 0 10px; font-size: 18px; }
    .mock-widget-panel p { margin: 0 0 12px; color: inherit; }
    .mock-widget-panel label { display: grid; gap: 6px; margin-top: 10px; font-size: 12px; font-weight: 700; }
    .mock-widget-panel input, .mock-widget-panel textarea {
      width: 100%;
      border: 1px solid #dbe3ee;
      border-radius: 8px;
      padding: 8px;
      color: #162033;
      background: #fff;
      font: inherit;
    }
    .mock-widget-panel textarea { min-height: 92px; resize: vertical; }
    .mock-widget-panel button {
      min-height: 36px;
      border: 0;
      border-radius: 8px;
      padding: 0 12px;
      color: #fff;
      background: var(--mock-accent);
      font-weight: 760;
    }
    @media (max-width: 760px) {
      .hero, .workspace { grid-template-columns: 1fr; }
      .nav-actions { display: none; }
      h1 { font-size: 44px; }
    }
  </style>
</head>
<body>
  <header class="topbar">
    <div class="brand"><span class="brand-mark"></span>Acme Console</div>
    <div class="nav-actions"><button>Dashboard</button><button>Settings</button></div>
  </header>
  <section class="hero">
    <main>
      <h1>Ship feedback from the page where users notice it.</h1>
      <p>This preview page gives the widget real layout, forms, private fields, scroll depth, and UI density for setup testing.</p>
      <button class="primary-action">Start review</button>
      <button class="secondary-action" style="margin-left: 8px;">View queue</button>
    </main>
    <aside class="health-card">
      <h2>Release Health</h2>
      <div class="metric"><span>Open reports</span><strong>18</strong></div>
      <div class="metric"><span>Median triage</span><strong>42m</strong></div>
      <div class="metric"><span>Screenshot rate</span><strong>71%</strong></div>
    </aside>
  </section>
  <section class="workspace">
    <main class="feedback-list">
      <div class="feedback-head"><h2>Recent Feedback</h2><strong style="color: var(--success);">Live queue</strong><span></span></div>
      <article class="task-row"><div><div class="task-title">Checkout total changes after coupon edit</div><div class="task-meta">Reported from /billing/checkout</div></div><span class="pill">Bug</span><span class="priority">High</span></article>
      <article class="task-row"><div><div class="task-title">Add export option for filtered events</div><div class="task-meta">Reported from /events</div></div><span class="pill">Feature</span><span class="priority">Medium</span></article>
      <article class="task-row"><div><div class="task-title">Clarify which workspace owns audit logs</div><div class="task-meta">Reported from /settings/security</div></div><span class="pill">Question</span><span class="priority">Low</span></article>
    </main>
    <aside class="sidebar">
      <section class="account-panel">
        <h2>Account Details</h2>
        <div class="form-stack">
          <label>Customer name<input value="Jordan Watts" readonly /></label>
          <label>API key<input data-bugdrop-mask value="sk_live_sandbox_example_42" readonly /></label>
          <label>Payment method<input data-bugdrop-mask value="Visa ending in 4242" readonly /></label>
        </div>
      </section>
      <section class="notes-panel">
        <h2>Private Notes</h2>
        <p>Enterprise renewal negotiation details and account-specific implementation notes.</p>
        <p>Unmarked content remains visible in screenshots.</p>
      </section>
    </aside>
  </section>
  <script>
    const config = ${escapeScriptJson(previewData)};
    const shadowMap = {
      none: "none",
      soft: "0 18px 40px rgba(22,32,51,0.09)",
      hard: "8px 8px 0 rgba(22,32,51,0.28)"
    };

    function safeColor(value, fallback) {
      if (typeof value !== "string" || value.length > 80) return fallback;
      return CSS.supports("color", value) ? value : fallback;
    }

    function safeFont(value) {
      if (typeof value !== "string" || !value.trim()) return "system-ui, sans-serif";
      if (/[;<>]|url\\(/i.test(value)) return "system-ui, sans-serif";
      return value;
    }

    function applyMockStyles() {
      const root = document.documentElement;
      root.style.setProperty("--mock-accent", safeColor(config.color, "#2563eb"));
      root.style.setProperty("--mock-bg", safeColor(config.bg, "#ffffff"));
      root.style.setProperty("--mock-text", safeColor(config.text, "#162033"));
      root.style.setProperty("--mock-border", safeColor(config.borderColor, "#dbe3ee"));
      root.style.setProperty("--mock-radius", Number(config.radius) + "px");
      root.style.setProperty("--mock-border-width", Number(config.borderWidth) + "px");
      root.style.setProperty("--mock-font", safeFont(config.font));
      root.style.setProperty("--mock-shadow", shadowMap[config.shadow] || shadowMap.soft);

      if (config.theme === "dark") {
        root.style.setProperty("--bg", "#111827");
        root.style.setProperty("--ink", "#eef2ff");
        root.style.setProperty("--line", "#334155");
      }
    }

    function el(tag, attrs = {}, text = "") {
      const node = document.createElement(tag);
      for (const [name, value] of Object.entries(attrs)) node.setAttribute(name, value);
      if (text) node.textContent = text;
      return node;
    }

    function renderWidget() {
      applyMockStyles();
      if (config.state === "closed") {
        if (config.showButton) {
          const button = el("button", {
            class: "mock-widget-button " + config.position,
            type: "button",
            "aria-label": config.label
          }, config.label);
          document.body.append(button);
        }
        return;
      }

      const panel = el("section", {
        class: "mock-widget-panel " + config.position,
        role: "dialog",
        "aria-label": "BugDrop representative preview"
      });

      if (config.state === "welcome") {
        panel.append(el("h2", {}, "Welcome to Feedback"));
        panel.append(el("p", {}, "Tell the team what is happening on this page."));
        panel.append(el("button", { type: "button" }, "Get Started"));
      } else if (config.state === "success") {
        panel.append(el("h2", {}, "Preview Complete"));
        panel.append(el("p", {}, "This representative preview did not submit feedback or create a GitHub issue."));
        panel.append(el("button", { type: "button" }, "Close"));
      } else {
        panel.append(el("h2", {}, "Send Feedback"));
        panel.append(el("p", {}, config.screenshot === "required" ? "A screenshot is required before submitting." : config.screenshot === "auto" ? "A screenshot will be attached automatically." : "Screenshot attachment is optional."));
        panel.append(el("textarea", { "aria-label": "Feedback details", placeholder: "What happened?" }));
        if (config.showName) {
          panel.append(el("label", {}, "Name" + (config.requireName ? " *" : "")));
          panel.lastElementChild.append(el("input", { "aria-label": "Name" }));
        }
        if (config.showEmail) {
          panel.append(el("label", {}, "Email" + (config.requireEmail ? " *" : "")));
          panel.lastElementChild.append(el("input", { "aria-label": "Email" }));
        }
        panel.append(el("button", { type: "button" }, "Send preview"));
      }

      document.body.append(panel);
    }

    renderWidget();
  </script>
</body>
</html>`;
}

function Field({
  label,
  attribute,
  children,
}: {
  label: string;
  attribute?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5 text-[13px] font-medium text-slate-400">
      <span className="flex min-w-0 flex-wrap items-center gap-2">
        <span>{label}</span>
        {attribute ? <AttributeChip>{attribute}</AttributeChip> : null}
      </span>
      {children}
    </label>
  );
}

function AttributeChip({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded border border-slate-700 bg-slate-950/65 px-1.5 py-0.5 text-[11px] font-semibold text-slate-300">
      {children}
    </code>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="min-h-10 w-full min-w-0 rounded-[8px] border border-slate-700/80 bg-slate-950/55 px-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
    />
  );
}

function SelectInput({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="min-h-10 w-full min-w-0 rounded-[8px] border border-slate-700/80 bg-slate-950/55 px-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
    >
      {children}
    </select>
  );
}

function Checkbox({
  label,
  attribute,
  checked,
  onChange,
}: {
  label: string;
  attribute?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex min-h-11 items-center gap-2 text-sm font-medium text-slate-200">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="size-4 accent-cyan-400"
      />
      <span className="flex min-w-0 flex-wrap items-center gap-2">
        <span>{label}</span>
        {attribute ? <AttributeChip>{attribute}</AttributeChip> : null}
      </span>
    </label>
  );
}

function HelperText({ children }: { children: React.ReactNode }) {
  return <p className="text-xs leading-5 text-slate-400">{children}</p>;
}

function CopyButton({
  value,
  label = "Copy",
  disabled = false,
  disabledLabel = "Fix warnings",
}: {
  value: string;
  label?: string;
  disabled?: boolean;
  disabledLabel?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={async () => {
        if (disabled) return;
        try {
          await navigator.clipboard.writeText(value);
          setFailed(false);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1400);
        } catch {
          setCopied(false);
          setFailed(true);
          window.setTimeout(() => setFailed(false), 1800);
        }
      }}
      className={`inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-[8px] border px-3 text-sm font-semibold transition sm:w-auto ${
        disabled
          ? "cursor-not-allowed border-slate-700 bg-slate-900/70 text-slate-500"
          : failed
          ? "border-amber-300/45 bg-amber-300/10 text-amber-100"
          : "border-cyan-400/35 bg-cyan-400/10 text-cyan-200 hover:border-cyan-300 hover:bg-cyan-400/15"
      }`}
    >
      {copied ? <Check className="size-4" /> : <Clipboard className="size-4" />}
      {disabled ? disabledLabel : copied ? "Copied" : failed ? "Copy failed" : label}
    </button>
  );
}

function CodeViewer({ value, label }: { value: string; label: string }) {
  return (
    <pre
      aria-label={label}
      tabIndex={0}
      className="mt-4 max-h-64 w-full max-w-full overflow-auto rounded-[8px] bg-[#050914] p-3 text-xs leading-5 text-slate-100 outline-none ring-cyan-300/0 transition focus:ring-2 sm:max-h-72 sm:p-4"
    >
      <code>{value}</code>
    </pre>
  );
}

function ValidationSummary({ messages }: { messages: ValidationMessage[] }) {
  if (messages.length === 0) {
    return (
      <div className="mt-4 break-words rounded-[8px] border border-emerald-400/20 bg-emerald-400/8 p-3 text-sm leading-6 text-emerald-100">
        Script output is valid for the current required configuration.
      </div>
    );
  }

  return (
      <div className="mt-4 grid gap-2 break-words rounded-[8px] border border-amber-300/25 bg-amber-300/10 p-3 text-sm leading-6 text-amber-50">
      {messages.map((message) => (
        <div key={message.key} className="flex gap-2">
          <AlertTriangle className="mt-1 size-4 shrink-0" />
          <span>{message.message}</span>
        </div>
      ))}
    </div>
  );
}

function AdvancedDisclosure({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details className="rounded-[8px] border border-slate-800 bg-slate-950/35 p-3">
      <summary className="cursor-pointer text-sm font-semibold text-slate-200">{title}</summary>
      <div className="mt-3 grid gap-3">{children}</div>
    </details>
  );
}

function PreviewStateButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex min-h-11 items-center justify-center rounded-[8px] px-3 text-sm font-semibold transition ${
        active
          ? "bg-cyan-300 text-slate-950"
          : "border border-slate-700 bg-slate-950 text-slate-200 hover:border-cyan-400/55"
      }`}
    >
      {children}
    </button>
  );
}

function OutputTabButton({
  active,
  onClick,
  icon,
  tabId,
  panelId,
  description,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  tabId: string;
  panelId: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <button
      id={tabId}
      role="tab"
      aria-selected={active}
      aria-controls={panelId}
      type="button"
      onClick={onClick}
      className={`grid min-h-11 w-full min-w-0 flex-1 gap-1 rounded-[8px] px-3 py-2 text-left text-sm font-semibold transition sm:flex-none ${
        active
          ? "bg-slate-100 text-slate-950"
          : "border border-slate-700 bg-slate-950/40 text-slate-300 hover:border-slate-500"
      }`}
    >
      <span className="inline-flex items-center gap-2">
        {icon}
        {children}
      </span>
      <span className={`text-xs font-medium leading-5 ${active ? "text-slate-600" : "text-slate-500"}`}>
        {description}
      </span>
    </button>
  );
}

export function WidgetSandbox() {
  const [config, setConfig] = useState<SandboxConfig>(initialConfig);
  const [previewKey, setPreviewKey] = useState(0);
  const [outputTab, setOutputTab] = useState<OutputTab>("script");
  const [previewState, setPreviewState] = useState<PreviewState>("closed");
  const [activeTarget, setActiveTarget] = useState<SandboxTarget>("configure");
  const [installOpen, setInstallOpen] = useState(false);
  const [installExpanded, setInstallExpanded] = useState(false);
  const installButtonRef = useRef<HTMLButtonElement | null>(null);
  const validationMessages = useMemo(() => validateConfig(config), [config]);
  const repoIsValid = validRepo(config.repo);
  const hasBlockingErrors = validationMessages.some((message) => message.level === "error");
  const highlightClass = (target: SandboxTarget) =>
    activeTarget === target
      ? "border border-cyan-300/55 bg-cyan-300/10 ring-2 ring-cyan-300/65 shadow-lg shadow-cyan-950/30"
      : "ring-1 ring-transparent";

  const scriptTag = useMemo(() => buildScriptTag(config), [config]);
  const iframeHtml = useMemo(() => buildIframeHtml(config, previewState), [config, previewState]);
  const previewSnippet = useMemo(() => buildPreviewSnippet(config), [config]);
  const bookmarklet = useMemo(() => buildBookmarklet(previewSnippet), [previewSnippet]);
  const agentPrompt = useMemo(() => buildAgentPrompt(config), [config]);
  const activeOutput =
    outputTab === "script" ? scriptTag : outputTab === "preview" ? previewSnippet : agentPrompt;
  const copyLabel =
    outputTab === "script"
      ? "Copy install script"
      : outputTab === "preview"
      ? "Copy preview snippet"
      : "Copy agent prompt";

  useEffect(() => {
    if (!installOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setInstallOpen(false);
        window.setTimeout(() => installButtonRef.current?.focus(), 0);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [installOpen]);

  const setSandboxTarget = (target: SandboxTarget, options: { scroll?: boolean } = {}) => {
    setActiveTarget(target);

    if (options.scroll) {
      const targetId = target === "preview" ? "sandbox-preview-panel" : "sandbox-configuration";
      document.getElementById(targetId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const update = <K extends keyof SandboxConfig>(key: K, value: SandboxConfig[K]) => {
    setConfig((current) => {
      const next = { ...current, [key]: value };
      if (key === "requireName" && value === true) next.showName = true;
      if (key === "requireEmail" && value === true) next.showEmail = true;
      return next;
    });
  };

  const selectPreviewState = (state: PreviewState) => {
    setPreviewState(state);
  };

  const selectOutputTab = (tab: OutputTab) => {
    setPreviewState("closed");
    setInstallOpen(true);
    setInstallExpanded(true);
    setOutputTab(tab);
  };

  const jumpToInstallWorkspace = (tab: OutputTab = outputTab) => {
    selectOutputTab(tab);
    setSandboxTarget("install");
  };

  const resetDefaults = () => {
    setPreviewState("closed");
    setConfig(initialConfig);
    setPreviewKey((key) => key + 1);
    setOutputTab("script");
    setActiveTarget("configure");
    setInstallOpen(false);
    setInstallExpanded(false);
  };

  const closeInstall = () => {
    setInstallOpen(false);
    window.setTimeout(() => installButtonRef.current?.focus(), 0);
  };

  return (
    <div className="relative -mt-8 grid w-full min-w-0 gap-5 px-2 sm:left-1/2 sm:w-[min(1580px,calc(100vw-2rem))] sm:-translate-x-1/2 sm:px-4">
      <section className="relative grid min-w-0 gap-4 overflow-visible rounded-[8px] border border-slate-800 bg-[#111827] p-3 shadow-2xl shadow-black/25 sm:p-4 lg:grid-cols-[380px_minmax(0,1fr)]">
        <div className="order-1 flex min-w-0 flex-wrap items-center justify-between gap-3 rounded-[8px] border border-slate-800 bg-slate-950/35 px-3 py-2.5 lg:col-span-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-100">Configure your BugDrop widget</p>
            <p className="mt-0.5 text-sm leading-5 text-slate-400">
              Tune settings, preview the widget, then copy code for your site.
            </p>
          </div>
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <p className="text-xs font-medium text-emerald-100/85">
              Preview mode: no GitHub issues created
            </p>
            <button
              ref={installButtonRef}
              type="button"
              onClick={() => {
                if (installOpen) {
                  closeInstall();
                } else {
                  jumpToInstallWorkspace("script");
                }
              }}
              aria-expanded={installOpen}
              aria-controls="sandbox-install"
              className={`inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-[8px] border px-3 text-sm font-semibold transition ${
                installOpen
                  ? "border-emerald-200 bg-emerald-300 text-slate-950 shadow-lg shadow-emerald-950/30"
                  : "border-emerald-300 bg-emerald-300 text-slate-950 shadow-lg shadow-emerald-950/25 hover:border-emerald-200 hover:bg-emerald-200"
              }`}
            >
              <FileCode2 className="size-4" />
              Get code
            </button>
          </div>
        </div>

        <main className="order-3 grid min-w-0 gap-4 lg:col-start-2 lg:row-start-2">
          <div
            id="sandbox-preview-panel"
            className={`min-w-0 rounded-[8px] border border-slate-700 bg-slate-950/50 p-3 transition ${highlightClass(
              "preview",
            )}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-100">
                  <MonitorSmartphone className="size-4 text-cyan-300" />
                  Widget preview
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  The example app updates as you change settings on the left. Use the state
                  controls to inspect the welcome screen, form, and success view.
                </p>
                <p className="mt-2 text-xs font-medium text-emerald-100/85">
                  Preview mode will not create GitHub issues.
                </p>
              </div>
              <div className="grid w-full gap-2 sm:w-auto">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Widget state
                </p>
                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setPreviewState("closed");
                    setPreviewKey((key) => key + 1);
                  }}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] border border-slate-700 bg-slate-950 px-3 text-sm font-semibold text-slate-200"
                >
                  <RefreshCw className="size-4" />
                  Reload
                </button>
                <PreviewStateButton
                  active={previewState === "closed"}
                  onClick={() => selectPreviewState("closed")}
                >
                  Closed
                </PreviewStateButton>
                <PreviewStateButton
                  active={previewState === "welcome"}
                  onClick={() => selectPreviewState("welcome")}
                >
                  <Play className="mr-1 size-4" />
                  Welcome
                </PreviewStateButton>
                <PreviewStateButton
                  active={previewState === "form"}
                  onClick={() => selectPreviewState("form")}
                >
                  Form
                </PreviewStateButton>
                <PreviewStateButton
                  active={previewState === "success"}
                  onClick={() => selectPreviewState("success")}
                >
                  Success
                </PreviewStateButton>
                </div>
              </div>
            </div>
            {previewState === "success" ? (
              <p className="mt-3 rounded-[8px] border border-emerald-400/20 bg-emerald-400/8 px-3 py-2 text-sm text-emerald-100">
                Success is simulated in preview mode. No GitHub issue is created.
              </p>
            ) : null}
            <iframe
              key={previewKey}
              id="sandbox-preview"
              title="BugDrop sandbox preview"
              sandbox="allow-scripts allow-forms allow-popups"
              srcDoc={iframeHtml}
              className="mt-4 h-[520px] w-full rounded-[8px] border border-slate-700 bg-white sm:h-[620px] lg:h-[720px]"
            />
          </div>

        </main>

        <aside
          id="sandbox-configuration"
          className="order-2 grid min-w-0 content-start gap-4 rounded-[8px] border border-slate-800 bg-slate-950/55 p-3 sm:p-4 lg:col-start-1 lg:row-start-2 lg:max-h-[calc(100vh-2rem)] lg:overflow-auto"
        >
          <section className="grid gap-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-100">
                <Settings2 className="size-4 text-cyan-300" />
                Configuration
              </h2>
              <button
                type="button"
                onClick={resetDefaults}
                className="min-h-8 rounded-[8px] border border-slate-700 px-2.5 text-xs font-semibold text-slate-300 transition hover:border-slate-500"
              >
                Reset
              </button>
            </div>
            <HelperText>
              Start with the common settings. Advanced options stay collapsed until needed.
            </HelperText>
          </section>

          <section
            id="sandbox-destination"
            data-sandbox-section="destination"
            className={`-mx-3 grid gap-3 rounded-[8px] border-t border-slate-800 px-3 pb-3 pt-4 transition ${highlightClass(
              "configure",
            )}`}
          >
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-100">
              <Settings2 className="size-4 text-cyan-300" />
              Destination
            </h2>
            <Field label="GitHub issue destination" attribute="data-repo">
              <TextInput
                value={config.repo}
                onChange={(value) => update("repo", value)}
                placeholder="owner/repo"
              />
            </Field>
            <HelperText>
              {repoIsValid
                ? "Production feedback becomes GitHub issues in this repo after the BugDrop GitHub App is installed. Preview mode will not create issues."
                : "Use GitHub owner/repo format, for example mean-weasel/bugdrop."}
            </HelperText>
          </section>

          <section
            id="sandbox-behavior"
            data-sandbox-section="behavior"
            className={`-mx-3 grid gap-3 rounded-[8px] border-t border-slate-800 px-3 pb-3 pt-4 transition ${highlightClass(
              "configure",
            )}`}
          >
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-100">
              <Wand2 className="size-4 text-cyan-300" />
              Behavior
            </h2>
            <Field label="Screenshot mode" attribute="data-screenshot">
              <SelectInput
                value={config.screenshot}
                onChange={(value) => update("screenshot", value as SandboxConfig["screenshot"])}
              >
                <option value="optional">Optional screenshot</option>
                <option value="auto">Auto-attach screenshot</option>
                <option value="required">Required before submit</option>
              </SelectInput>
            </Field>
            <HelperText>
              Complex pages can reduce full-page capture quality or fall back to smaller captures.
              Use <code>data-bugdrop-mask</code> for fields that should never appear.
            </HelperText>
            <Field label="Welcome screen" attribute="data-welcome">
              <SelectInput
                value={config.welcome}
                onChange={(value) => update("welcome", value as SandboxConfig["welcome"])}
              >
                <option value="once">Once per browser</option>
                <option value="always">Always show</option>
                <option value="never">Skip welcome</option>
              </SelectInput>
            </Field>
            <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
              <Checkbox
                label="Show name"
                attribute="data-show-name"
                checked={config.showName}
                onChange={(value) => update("showName", value)}
              />
              <Checkbox
                label="Require name"
                attribute="data-require-name"
                checked={config.requireName}
                onChange={(value) => update("requireName", value)}
              />
              <Checkbox
                label="Show email"
                attribute="data-show-email"
                checked={config.showEmail}
                onChange={(value) => update("showEmail", value)}
              />
              <Checkbox
                label="Require email"
                attribute="data-require-email"
                checked={config.requireEmail}
                onChange={(value) => update("requireEmail", value)}
              />
            </div>
            {(config.requireName || config.requireEmail) && (
              <HelperText>Required contact fields are automatically shown in the form.</HelperText>
            )}

            <h3 className="flex items-center gap-2 pt-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-100">
              <Send className="size-4 text-emerald-300" />
              Launcher
            </h3>
            <Field label="Button label" attribute="data-label">
              <TextInput value={config.label} onChange={(value) => update("label", value)} />
            </Field>
            <Field label="Position" attribute="data-position">
              <SelectInput
                value={config.position}
                onChange={(value) => update("position", value as SandboxConfig["position"])}
              >
                <option value="bottom-right">Bottom right</option>
                <option value="bottom-left">Bottom left</option>
              </SelectInput>
            </Field>
            <div className="grid gap-2">
              <Checkbox
                label="Show floating button"
                attribute="data-button"
                checked={config.showButton}
                onChange={(value) => update("showButton", value)}
              />
            </div>
            <AdvancedDisclosure title="Advanced launcher options">
              <Field label="Icon" attribute="data-icon">
                <TextInput
                  value={config.icon}
                  onChange={(value) => update("icon", value)}
                  placeholder="default, none, or https://..."
                />
              </Field>
              <Checkbox
                label="Dismissible"
                attribute="data-button-dismissible"
                checked={config.buttonDismissible}
                onChange={(value) => update("buttonDismissible", value)}
              />
              <Checkbox
                label="Show restore tab"
                attribute="data-show-restore"
                checked={config.showRestore}
                onChange={(value) => update("showRestore", value)}
              />
              {config.buttonDismissible && (
                <Field label="Dismiss duration in days" attribute="data-dismiss-duration">
                  <TextInput
                    value={config.dismissDuration}
                    onChange={(value) => update("dismissDuration", value)}
                    placeholder="30"
                  />
                </Field>
              )}
            </AdvancedDisclosure>
          </section>

          <section
            id="sandbox-styling"
            data-sandbox-section="styling"
            className={`-mx-3 grid gap-3 rounded-[8px] border-t border-slate-800 px-3 pb-3 pt-4 transition ${highlightClass(
              "configure",
            )}`}
          >
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-100">
              <Sparkles className="size-4 text-cyan-300" />
              Styling
            </h2>
            <Field label="Theme" attribute="data-theme">
              <SelectInput
                value={config.theme}
                onChange={(value) => update("theme", value as SandboxConfig["theme"])}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </SelectInput>
            </Field>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Accent" attribute="data-color">
                <TextInput
                  type="color"
                  value={config.color}
                  onChange={(value) => update("color", value)}
                />
              </Field>
              <Field label="Radius px" attribute="data-radius">
                <TextInput value={config.radius} onChange={(value) => update("radius", value)} />
              </Field>
              <Field label="Background" attribute="data-bg">
                <TextInput type="color" value={config.bg} onChange={(value) => update("bg", value)} />
              </Field>
              <Field label="Text" attribute="data-text">
                <TextInput
                  type="color"
                  value={config.text}
                  onChange={(value) => update("text", value)}
                />
              </Field>
              <Field label="Border color" attribute="data-border-color">
                <TextInput
                  value={config.borderColor}
                  onChange={(value) => update("borderColor", value)}
                />
              </Field>
            </div>
            <AdvancedDisclosure title="Advanced styling and self-hosted options">
              <Field label="Border width px" attribute="data-border-width">
                <TextInput
                  value={config.borderWidth}
                  onChange={(value) => update("borderWidth", value)}
                />
              </Field>
              <Field label="Shadow" attribute="data-shadow">
                <SelectInput
                  value={config.shadow}
                  onChange={(value) => update("shadow", value as SandboxConfig["shadow"])}
                >
                  <option value="soft">Soft</option>
                  <option value="hard">Hard</option>
                  <option value="none">None</option>
                </SelectInput>
              </Field>
              <Field label="Font" attribute="data-font">
                <TextInput value={config.font} onChange={(value) => update("font", value)} />
              </Field>
              <Field label="Screenshot scale" attribute="data-screenshot-scale">
                <TextInput
                  value={config.screenshotScale}
                  onChange={(value) => update("screenshotScale", value)}
                />
              </Field>
              <Field label="Category labels JSON" attribute="data-category-labels">
                <textarea
                  value={config.categoryLabels}
                  onChange={(event) => update("categoryLabels", event.target.value)}
                  placeholder='{"bug":["defect"],"feature":"product-feedback"}'
                  className="min-h-20 w-full min-w-0 rounded-[8px] border border-slate-700/80 bg-slate-950/55 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
                />
              </Field>
              <HelperText>
                Hosted BugDrop uses built-in categories. Custom label mapping is mainly for
                self-hosted installs that opt into client-provided labels.
              </HelperText>
            </AdvancedDisclosure>
          </section>
        </aside>

        {installOpen ? (
          <button
            type="button"
            aria-label="Dismiss install output"
            onClick={closeInstall}
            className="fixed inset-0 z-40 bg-black/55 lg:hidden"
          />
        ) : null}

        <section
          id="sandbox-install"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sandbox-install-heading"
          className={`fixed inset-x-0 bottom-0 top-auto z-50 w-auto min-w-0 max-w-full max-h-[82vh] overflow-auto rounded-t-[8px] border border-slate-800 bg-slate-950 p-3 shadow-2xl shadow-black/40 transition sm:inset-x-4 sm:bottom-4 sm:rounded-[8px] sm:p-4 lg:absolute lg:bottom-auto lg:left-auto lg:right-4 lg:top-16 lg:z-20 lg:w-[min(440px,calc(100vw-3rem))] lg:max-h-[calc(100vh-7rem)] ${
            installOpen ? "block" : "hidden"
          } ${highlightClass(
            "install",
          )}`}
        >
          <div className="sticky -top-3 z-10 -mx-3 -mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 border-b border-slate-800 bg-slate-950 p-3 sm:-top-4 sm:-mx-4 sm:-mt-4 sm:p-4">
            <div className="min-w-0">
              <h2
                id="sandbox-install-heading"
                className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-100"
              >
                <Code2 className="size-4 text-emerald-300" />
                Get code
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Choose how you want to use this configuration.
              </p>
            </div>
            <button
              type="button"
              onClick={closeInstall}
              aria-label="Close install output"
              className="inline-flex min-h-9 items-center justify-center rounded-[8px] border border-slate-700 px-3 text-sm font-semibold text-slate-300 transition hover:border-slate-500"
            >
              <X className="size-4" />
            </button>
          </div>

          <div
            role="tablist"
            aria-label="Generated install outputs"
            className="mt-4 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap"
          >
            <OutputTabButton
              active={outputTab === "script"}
              onClick={() => selectOutputTab("script")}
              icon={<FileCode2 className="size-4" />}
              tabId="sandbox-output-script-tab"
              panelId="sandbox-output-panel"
              description={outputTabDetails.script.description}
            >
              {outputTabDetails.script.label}
            </OutputTabButton>
            <OutputTabButton
              active={outputTab === "preview"}
              onClick={() => selectOutputTab("preview")}
              icon={<ExternalLink className="size-4" />}
              tabId="sandbox-output-preview-tab"
              panelId="sandbox-output-panel"
              description={outputTabDetails.preview.description}
            >
              {outputTabDetails.preview.label}
            </OutputTabButton>
            <OutputTabButton
              active={outputTab === "agent"}
              onClick={() => selectOutputTab("agent")}
              icon={<Bot className="size-4" />}
              tabId="sandbox-output-agent-tab"
              panelId="sandbox-output-panel"
              description={outputTabDetails.agent.description}
            >
              {outputTabDetails.agent.label}
            </OutputTabButton>
          </div>

          {installExpanded ? (
            <>
              <ValidationSummary messages={validationMessages} />
              <AdvancedDisclosure title="Production checklist">
                <div className="grid gap-2 text-sm text-slate-300">
                  <div className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-emerald-300" />
                    <span>Install the BugDrop GitHub App and grant repo access before production use.</span>
                  </div>
                  <div className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-emerald-300" />
                    <span>Production install scripts omit <code>data-preview</code>.</span>
                  </div>
                  <div className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-emerald-300" />
                  <span>Own-site compatibility snippets load the real widget. Do not submit feedback unless you intend to create an issue.</span>
                  </div>
                  <div className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-emerald-300" />
                    <span>Production submissions create GitHub issues in the selected repo.</span>
                  </div>
                </div>
              </AdvancedDisclosure>
              <div
                id="sandbox-output-panel"
                role="tabpanel"
                aria-labelledby={`sandbox-output-${outputTab}-tab`}
              >
                <CodeViewer value={activeOutput} label={`${outputTab} output code`} />
              </div>

              {outputTab === "preview" ? (
                <div className="mt-3 grid gap-2 rounded-[8px] border border-slate-800 bg-slate-950/55 p-3">
                  <div className="grid gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
                    <p className="text-sm text-slate-400">
                      Bookmarklet version for repeated own-site previews. Reload the page to fully
                      reset and remove the injected preview widget.
                    </p>
                    <CopyButton value={bookmarklet} label="Copy bookmarklet" />
                  </div>
                </div>
              ) : null}
              <div className="sticky -bottom-3 -mx-3 mt-4 border-t border-slate-800 bg-slate-950 p-3 sm:-bottom-4 sm:-mx-4 sm:p-4">
                <CopyButton
                  value={activeOutput}
                  label={copyLabel}
                  disabled={hasBlockingErrors}
                  disabledLabel="Fix repo"
                />
              </div>
            </>
          ) : (
            <p className="mt-4 rounded-[8px] border border-slate-800 bg-slate-950/45 p-3 text-sm leading-6 text-slate-400">
              Pick an install option above to reveal the generated output.
            </p>
          )}
        </section>
      </section>
    </div>
  );
}
