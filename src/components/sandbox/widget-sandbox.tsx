"use client";

import { useMemo, useState } from "react";
import {
  Bot,
  Check,
  Clipboard,
  Code2,
  ExternalLink,
  Eye,
  FileCode2,
  MonitorSmartphone,
  Palette,
  Play,
  RefreshCw,
  Send,
  Settings2,
  Sparkles,
  Wand2,
} from "lucide-react";
import { WIDGET_URL } from "@/lib/links";

type SandboxConfig = {
  repo: string;
  theme: "auto" | "light" | "dark";
  position: "bottom-right" | "bottom-left";
  color: string;
  label: string;
  icon: string;
  screenshot: "optional" | "auto" | "required";
  welcome: "once" | "always" | "never";
  showName: boolean;
  requireName: boolean;
  showEmail: boolean;
  requireEmail: boolean;
  buttonDismissible: boolean;
  dismissDuration: string;
  showRestore: boolean;
  showButton: boolean;
  screenshotScale: string;
  font: string;
  radius: string;
  bg: string;
  text: string;
  borderWidth: string;
  borderColor: string;
  shadow: string;
  categoryLabels: string;
};

type OutputTab = "script" | "preview" | "agent";

const initialConfig: SandboxConfig = {
  repo: "mean-weasel/bugdrop-widget-test",
  theme: "light",
  position: "bottom-right",
  color: "#2563eb",
  label: "Feedback",
  icon: "",
  screenshot: "optional",
  welcome: "always",
  showName: false,
  requireName: false,
  showEmail: false,
  requireEmail: false,
  buttonDismissible: false,
  dismissDuration: "session",
  showRestore: true,
  showButton: true,
  screenshotScale: "2",
  font: "inherit",
  radius: "8px",
  bg: "#ffffff",
  text: "#162033",
  borderWidth: "1px",
  borderColor: "#dbe3ee",
  shadow: "0 18px 40px rgba(22,32,51,0.09)",
  categoryLabels: "",
};

const attributeMap: Record<keyof SandboxConfig, string> = {
  repo: "data-repo",
  theme: "data-theme",
  position: "data-position",
  color: "data-color",
  label: "data-label",
  icon: "data-icon",
  screenshot: "data-screenshot",
  welcome: "data-welcome",
  showName: "data-show-name",
  requireName: "data-require-name",
  showEmail: "data-show-email",
  requireEmail: "data-require-email",
  buttonDismissible: "data-button-dismissible",
  dismissDuration: "data-dismiss-duration",
  showRestore: "data-show-restore",
  showButton: "data-button",
  screenshotScale: "data-screenshot-scale",
  font: "data-font",
  radius: "data-radius",
  bg: "data-bg",
  text: "data-text",
  borderWidth: "data-border-width",
  borderColor: "data-border-color",
  shadow: "data-shadow",
  categoryLabels: "data-category-labels",
};

function escapeAttribute(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
}

function scriptAttributes(config: SandboxConfig) {
  const attrs: Partial<Record<keyof SandboxConfig, string>> = {
    repo: config.repo,
    theme: config.theme,
    position: config.position,
    color: config.color,
    label: config.label,
    icon: config.icon,
    screenshot: config.screenshot,
    welcome: config.welcome,
    showName: config.showName ? "true" : "",
    requireName: config.requireName ? "true" : "",
    showEmail: config.showEmail ? "true" : "",
    requireEmail: config.requireEmail ? "true" : "",
    buttonDismissible: config.buttonDismissible ? "true" : "",
    dismissDuration: config.buttonDismissible ? config.dismissDuration : "",
    showRestore: config.showRestore ? "" : "false",
    showButton: config.showButton ? "" : "false",
    screenshotScale: config.screenshotScale === "2" ? "" : config.screenshotScale,
    font: config.font,
    radius: config.radius,
    bg: config.bg,
    text: config.text,
    borderWidth: config.borderWidth,
    borderColor: config.borderColor,
    shadow: config.shadow,
    categoryLabels: config.categoryLabels,
  };

  return Object.entries(attrs).filter(([, value]) => Boolean(value)) as Array<
    [keyof SandboxConfig, string]
  >;
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
  console.info("[BugDrop preview] Widget injected in preview mode. Reload to remove.");
})();`;
}

function buildAgentPrompt(config: SandboxConfig) {
  return `Install BugDrop in this web app using the script tag below.

Requirements:
- Add the script globally so it loads on every product page after the app is interactive.
- If this is Next.js App Router, use next/script in the root layout with strategy="afterInteractive".
- If this is Vite, React, Rails, Laravel, or plain HTML, place it near the end of the body or equivalent app shell.
- Preserve all data-* attributes exactly.
- Do not include data-preview="true" in production.
- Mark private fields with data-bugdrop-mask when they should never appear in screenshots.
- After installing, verify the floating "${config.label || "Feedback"}" button appears and opens the wizard.

${buildScriptTag(config)}`;
}

function buildBookmarklet(snippet: string) {
  return `javascript:${encodeURIComponent(snippet)}`;
}

function buildIframeHtml(config: SandboxConfig) {
  const attrs = Object.entries(previewScriptAttributes(config))
    .filter(([, value]) => Boolean(value))
    .map(([name, value]) => `${name}="${escapeAttribute(value)}"`)
    .join(" ");

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
    window.addEventListener("message", event => {
      if (!event.data || event.data.source !== "bugdrop-sandbox") return;
      const runPreviewAction = () => {
        if (!window.BugDropPreview) {
          setTimeout(runPreviewAction, 100);
          return;
        }
        if (event.data.action === "open") window.BugDropPreview.openWelcome();
        if (event.data.action === "form") window.BugDropPreview.openForm();
        if (event.data.action === "success") window.BugDropPreview.openSuccess();
        if (event.data.action === "close") window.BugDropPreview.close();
      };
      runPreviewAction();
    });
  </script>
  <script src="${WIDGET_URL}" ${attrs}></script>
</body>
</html>`;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5 text-[13px] font-medium text-slate-400">
      <span>{label}</span>
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="min-h-10 rounded-[8px] border border-slate-700/80 bg-slate-950/55 px-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
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
      className="min-h-10 rounded-[8px] border border-slate-700/80 bg-slate-950/55 px-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
    >
      {children}
    </select>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex min-h-8 items-center gap-2 text-sm font-medium text-slate-200">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="size-4 accent-cyan-400"
      />
      {label}
    </label>
  );
}

function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
      }}
      className="inline-flex min-h-9 items-center gap-2 rounded-[8px] border border-cyan-400/35 bg-cyan-400/10 px-3 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-400/15"
    >
      {copied ? <Check className="size-4" /> : <Clipboard className="size-4" />}
      {copied ? "Copied" : label}
    </button>
  );
}

function GuideStep({
  index,
  title,
  description,
  active,
  icon,
}: {
  index: number;
  title: string;
  description: string;
  active?: boolean;
  icon: React.ReactNode;
}) {
  return (
    <div
      className={`grid grid-cols-[32px_minmax(0,1fr)] gap-3 rounded-[8px] border p-3 ${
        active
          ? "border-cyan-400/45 bg-cyan-400/10 text-slate-50"
          : "border-slate-800 bg-slate-950/25 text-slate-300"
      }`}
    >
      <div className="flex size-8 items-center justify-center rounded-[8px] border border-slate-700 bg-slate-950 text-xs font-bold text-cyan-200">
        {index}
      </div>
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold">
          {icon}
          {title}
        </div>
        <p className="mt-1 text-xs leading-5 text-slate-400">{description}</p>
      </div>
    </div>
  );
}

function OutputTabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-9 items-center gap-2 rounded-[8px] px-3 text-sm font-semibold transition ${
        active
          ? "bg-slate-100 text-slate-950"
          : "border border-slate-700 bg-slate-950/40 text-slate-300 hover:border-slate-500"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

export function WidgetSandbox() {
  const [config, setConfig] = useState<SandboxConfig>(initialConfig);
  const [previewKey, setPreviewKey] = useState(0);
  const [outputTab, setOutputTab] = useState<OutputTab>("script");

  const scriptTag = useMemo(() => buildScriptTag(config), [config]);
  const iframeHtml = useMemo(() => buildIframeHtml(config), [config]);
  const previewSnippet = useMemo(() => buildPreviewSnippet(config), [config]);
  const bookmarklet = useMemo(() => buildBookmarklet(previewSnippet), [previewSnippet]);
  const agentPrompt = useMemo(() => buildAgentPrompt(config), [config]);
  const activeOutput =
    outputTab === "script" ? scriptTag : outputTab === "preview" ? previewSnippet : agentPrompt;

  const update = <K extends keyof SandboxConfig>(key: K, value: SandboxConfig[K]) => {
    setConfig((current) => {
      const next = { ...current, [key]: value };
      if (key === "requireName" && value === true) next.showName = true;
      if (key === "requireEmail" && value === true) next.showEmail = true;
      return next;
    });
  };

  const postPreviewAction = (action: "open" | "form" | "success" | "close") => {
    const iframe = document.getElementById("sandbox-preview") as HTMLIFrameElement | null;
    iframe?.contentWindow?.postMessage({ source: "bugdrop-sandbox", action }, "*");
  };

  const selectOutputTab = (tab: OutputTab) => {
    postPreviewAction("close");
    setOutputTab(tab);
  };

  return (
    <div className="relative left-1/2 -mt-8 grid w-[min(1580px,calc(100vw-2rem))] -translate-x-1/2 gap-5 max-sm:w-[calc(100vw-1rem)]">
      <section className="grid min-w-0 gap-4 rounded-[8px] border border-slate-800 bg-[#111827] p-4 shadow-2xl shadow-black/25 lg:grid-cols-[280px_minmax(0,1fr)_340px] max-sm:p-3">
        <aside className="grid content-start gap-3">
          <div className="mb-1">
            <h1 className="text-2xl font-bold leading-tight text-slate-50 md:text-3xl">
              Configure BugDrop before it touches production.
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              A guided sandbox for understanding widget options, previewing the wizard, and handing
              an exact install plan to a human or coding agent.
            </p>
          </div>
          <GuideStep
            index={1}
            title="Destination"
            description="Choose the GitHub repo that receives feedback."
            active
            icon={<Settings2 className="size-4" />}
          />
          <GuideStep
            index={2}
            title="Behavior"
            description="Decide screenshots, contact fields, and button behavior."
            active
            icon={<Wand2 className="size-4" />}
          />
          <GuideStep
            index={3}
            title="Styling"
            description="Tune colors, borders, radius, shadows, and font inheritance."
            active
            icon={<Palette className="size-4" />}
          />
          <GuideStep
            index={4}
            title="Preview"
            description="Walk through welcome, form, success, and submit states."
            active
            icon={<Eye className="size-4" />}
          />
          <GuideStep
            index={5}
            title="Install"
            description="Copy a script tag, site preview snippet, or agent prompt."
            icon={<FileCode2 className="size-4" />}
          />
        </aside>

        <main className="grid min-w-0 gap-4">
          <div className="rounded-[8px] border border-slate-700 bg-slate-950/50 p-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-100">
                  <MonitorSmartphone className="size-4 text-cyan-300" />
                  Live preview canvas
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  The embedded app uses the current script attributes with preview mode enabled.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewKey((key) => key + 1)}
                  className="inline-flex min-h-9 items-center gap-2 rounded-[8px] border border-slate-700 bg-slate-950 px-3 text-sm font-semibold text-slate-200"
                >
                  <RefreshCw className="size-4" />
                  Reload
                </button>
                <button
                  type="button"
                  onClick={() => postPreviewAction("open")}
                  className="inline-flex min-h-9 items-center gap-2 rounded-[8px] bg-cyan-300 px-3 text-sm font-semibold text-slate-950"
                >
                  <Play className="size-4" />
                  Welcome
                </button>
                <button
                  type="button"
                  onClick={() => postPreviewAction("form")}
                  className="inline-flex min-h-9 items-center rounded-[8px] border border-cyan-400/35 bg-cyan-400/10 px-3 text-sm font-semibold text-cyan-200"
                >
                  Form
                </button>
                <button
                  type="button"
                  onClick={() => postPreviewAction("success")}
                  className="inline-flex min-h-9 items-center rounded-[8px] border border-emerald-400/35 bg-emerald-400/10 px-3 text-sm font-semibold text-emerald-200"
                >
                  Success
                </button>
              </div>
            </div>
            <iframe
              key={previewKey}
              id="sandbox-preview"
              title="BugDrop sandbox preview"
              sandbox="allow-scripts allow-forms allow-popups allow-same-origin"
              srcDoc={iframeHtml}
              className="mt-4 h-[720px] w-full rounded-[8px] border border-slate-700 bg-white max-sm:h-[620px]"
            />
          </div>

          <section className="rounded-[8px] border border-slate-800 bg-slate-950/45 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-100">
                  <Code2 className="size-4 text-emerald-300" />
                  Install workspace
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Switch between the production artifact, temporary preview, and agent handoff.
                </p>
              </div>
              <CopyButton value={activeOutput} />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <OutputTabButton
                active={outputTab === "script"}
                onClick={() => selectOutputTab("script")}
                icon={<FileCode2 className="size-4" />}
              >
                Production script
              </OutputTabButton>
              <OutputTabButton
                active={outputTab === "preview"}
                onClick={() => selectOutputTab("preview")}
                icon={<ExternalLink className="size-4" />}
              >
                Preview snippet
              </OutputTabButton>
              <OutputTabButton
                active={outputTab === "agent"}
                onClick={() => selectOutputTab("agent")}
                icon={<Bot className="size-4" />}
              >
                Agent prompt
              </OutputTabButton>
            </div>

            <pre className="mt-4 max-h-72 overflow-auto rounded-[8px] bg-[#050914] p-4 text-xs leading-5 text-slate-100">
              <code>{activeOutput}</code>
            </pre>

            {outputTab === "preview" ? (
              <div className="mt-3 grid gap-2 rounded-[8px] border border-slate-800 bg-slate-950/55 p-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-slate-400">
                    Bookmarklet version for repeated own-site previews.
                  </p>
                  <CopyButton value={bookmarklet} label="Copy bookmarklet" />
                </div>
              </div>
            ) : null}
          </section>
        </main>

        <aside className="grid max-h-[calc(100vh-2rem)] content-start gap-4 overflow-auto rounded-[8px] border border-slate-800 bg-slate-950/55 p-4">
          <section className="grid gap-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-100">
              <Settings2 className="size-4 text-cyan-300" />
              Configuration
            </h2>
            <Field label="GitHub repository">
              <TextInput
                value={config.repo}
                onChange={(value) => update("repo", value)}
                placeholder="owner/repo"
              />
            </Field>
            <Field label="Screenshot mode">
              <SelectInput
                value={config.screenshot}
                onChange={(value) => update("screenshot", value as SandboxConfig["screenshot"])}
              >
                <option value="optional">Optional: include or skip</option>
                <option value="auto">Auto: attach without review</option>
                <option value="required">Required before submit</option>
              </SelectInput>
            </Field>
            <Field label="Welcome screen">
              <SelectInput
                value={config.welcome}
                onChange={(value) => update("welcome", value as SandboxConfig["welcome"])}
              >
                <option value="once">Once per browser</option>
                <option value="always">Always show</option>
                <option value="never">Skip welcome</option>
              </SelectInput>
            </Field>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <Checkbox
                label="Show name"
                checked={config.showName}
                onChange={(value) => update("showName", value)}
              />
              <Checkbox
                label="Require name"
                checked={config.requireName}
                onChange={(value) => update("requireName", value)}
              />
              <Checkbox
                label="Show email"
                checked={config.showEmail}
                onChange={(value) => update("showEmail", value)}
              />
              <Checkbox
                label="Require email"
                checked={config.requireEmail}
                onChange={(value) => update("requireEmail", value)}
              />
            </div>
          </section>

          <section className="grid gap-3 border-t border-slate-800 pt-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-100">
              <Send className="size-4 text-emerald-300" />
              Launcher
            </h2>
            <Field label="Button label">
              <TextInput value={config.label} onChange={(value) => update("label", value)} />
            </Field>
            <Field label="Position">
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
                checked={config.showButton}
                onChange={(value) => update("showButton", value)}
              />
              <Checkbox
                label="Dismissible"
                checked={config.buttonDismissible}
                onChange={(value) => update("buttonDismissible", value)}
              />
              <Checkbox
                label="Show restore tab"
                checked={config.showRestore}
                onChange={(value) => update("showRestore", value)}
              />
            </div>
          </section>

          <section className="grid gap-3 border-t border-slate-800 pt-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-100">
              <Sparkles className="size-4 text-cyan-300" />
              Styling
            </h2>
            <Field label="Theme">
              <SelectInput
                value={config.theme}
                onChange={(value) => update("theme", value as SandboxConfig["theme"])}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </SelectInput>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Accent">
                <TextInput value={config.color} onChange={(value) => update("color", value)} />
              </Field>
              <Field label="Radius">
                <TextInput value={config.radius} onChange={(value) => update("radius", value)} />
              </Field>
              <Field label="Background">
                <TextInput value={config.bg} onChange={(value) => update("bg", value)} />
              </Field>
              <Field label="Text">
                <TextInput value={config.text} onChange={(value) => update("text", value)} />
              </Field>
              <Field label="Border width">
                <TextInput
                  value={config.borderWidth}
                  onChange={(value) => update("borderWidth", value)}
                />
              </Field>
              <Field label="Border color">
                <TextInput
                  value={config.borderColor}
                  onChange={(value) => update("borderColor", value)}
                />
              </Field>
            </div>
            <Field label="Shadow">
              <TextInput value={config.shadow} onChange={(value) => update("shadow", value)} />
            </Field>
          </section>
        </aside>
      </section>
    </div>
  );
}
