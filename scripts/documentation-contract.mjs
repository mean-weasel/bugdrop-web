#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const contentRoots = [
  "src/content/docs",
  "src/content/use-cases",
  "src/content/compare",
  "src/content/resources",
  "src/components",
  "src/lib/links.ts",
];
const canonicalWidgetUrl = "https://bugdrop.neonwatty.workers.dev/widget.js";
const args = process.argv.slice(2);
const baseUrlArg = args.find((arg) => arg.startsWith("--base-url="));
const baseUrl = baseUrlArg ? baseUrlArg.slice("--base-url=".length).replace(/\/$/, "") : null;
const failures = [];

function filesUnder(relativePath) {
  const absolutePath = path.join(repoRoot, relativePath);
  const stat = fs.statSync(absolutePath);
  if (stat.isFile()) return [absolutePath];

  return fs
    .readdirSync(absolutePath, { withFileTypes: true })
    .flatMap((entry) => {
      const child = path.join(absolutePath, entry.name);
      return entry.isDirectory() ? filesUnder(path.relative(repoRoot, child)) : [child];
    })
    .filter((file) => /\.(json|mdx|tsx|ts)$/.test(file));
}

const sourceFiles = contentRoots.flatMap(filesUnder);
const sources = sourceFiles.map((file) => ({
  file: path.relative(repoRoot, file),
  text: fs.readFileSync(file, "utf8"),
}));
const sourceCorpus = sources.map(({ text }) => text).join("\n");

const forbiddenSourcePatterns = [
  ["obsolete bugdrop.dev widget URL", /https:\/\/bugdrop\.dev\/widget(?:\.v[\d.]+)?\.js/],
  ["broken /security documentation link", /\]\(\/security(?:[#/)])/],
  ["modified widget loading example", /<script\b[^>]*\b(?:async|defer)(?:\s|=|>)/is],
  ["obsolete synchronous-loading prohibition", /Do Not Use async or defer/i],
  ["obsolete Sentry error-only claim", /Sentry(?:'s)? (?:feedback|User Feedback)[^\n.]{0,80}error-triggered/i],
  ["obsolete Userback $49 entry price", /Userback[^\n]{0,200}\$49|\$49[^\n]{0,80}Userback/i],
];

for (const [label, pattern] of forbiddenSourcePatterns) {
  for (const { file, text } of sources) {
    if (pattern.test(text)) failures.push(`${label}: ${file}`);
  }
}

const canonicalDefinition = sources.find(({ file }) => file === "src/lib/links.ts")?.text ?? "";
if (!canonicalDefinition.includes(`export const WIDGET_ORIGIN = "https://bugdrop.neonwatty.workers.dev"`)) {
  failures.push("src/lib/links.ts does not define the canonical widget origin");
}
if (!canonicalDefinition.includes("export function widgetScriptTag")) {
  failures.push("src/lib/links.ts does not expose the shared widget snippet builder");
}
if (/\["<script",\s*"\s*(?:async|defer)"/.test(canonicalDefinition)) {
  failures.push("shared widget snippet modifies the authoritative synchronous loading contract");
}

const installationText = sources.find((source) => source.file === "src/content/docs/installation.mdx")?.text ?? "";
if (!installationText.includes("WidgetInstallSnippet")) {
  failures.push("src/content/docs/installation.mdx does not use WidgetInstallSnippet");
}
for (const file of ["src/components/widget-install-snippet.tsx", "src/components/landing/quick-start.tsx"]) {
  const text = sources.find((source) => source.file === file)?.text ?? "";
  if (!text.includes("widgetScriptTag")) failures.push(`${file} does not use the shared widget snippet builder`);
}

const competitorPages = ["bugherd", "canny", "marker-io", "sentry-user-feedback", "userback", "usersnap"];
const comparisonEvidenceFile = "src/components/comparison/comparison-data.json";
const comparisonEvidenceText = sources.find((source) => source.file === comparisonEvidenceFile)?.text ?? "[]";
let comparisonEvidence = [];
try {
  comparisonEvidence = JSON.parse(comparisonEvidenceText);
} catch {
  failures.push(`${comparisonEvidenceFile} is not valid JSON`);
}
for (const slug of competitorPages) {
  const file = `src/content/compare/${slug}.mdx`;
  const text = sources.find((source) => source.file === file)?.text ?? "";
  if (!text) failures.push(`${file} is missing`);
  const evidence = comparisonEvidence.find((entry) => entry.slug === slug);
  if (evidence?.verifiedDate !== "2026-08-14") {
    failures.push(`${file} is missing its centralized dated source check`);
  }
  const officialSourcePattern = /https:\/\/(?:docs\.sentry\.io|userback\.io|canny\.io|help\.canny\.io|marker\.io|help\.marker\.io|bugherd\.com|support\.bugherd\.com|usersnap\.com)/;
  if (!evidence?.sources?.some((source) => officialSourcePattern.test(source.url))) {
    failures.push(`${file} is missing an official competitor source in ${comparisonEvidenceFile}`);
  }
}

if (!sourceCorpus.includes(canonicalWidgetUrl)) {
  failures.push("canonical widget URL is absent from documentation sources");
}

if (baseUrl) {
  const renderedRoutes = [
    "/docs/installation",
    "/use-cases/client-projects",
    "/use-cases/internal-tools",
    "/use-cases/open-source",
    "/use-cases/nextjs-feedback-widget",
    "/use-cases/vercel-preview-feedback",
    "/resources/visual-bug-report-template",
    "/resources/client-website-qa-checklist",
    "/compare/sentry-user-feedback",
  ];
  const widgetGuidanceRoutes = new Set([
    "/docs/installation",
    "/use-cases/nextjs-feedback-widget",
    "/use-cases/vercel-preview-feedback",
  ]);

  for (const route of renderedRoutes) {
    const response = await fetch(`${baseUrl}${route}`, { redirect: "manual" });
    const html = await response.text();
    if (response.status !== 200) failures.push(`${route} rendered with HTTP ${response.status}`);
    if (/https:\/\/bugdrop\.dev\/widget/.test(html)) failures.push(`${route} renders the obsolete widget URL`);
    if (/href="\/security(?:[#/"])/.test(html)) failures.push(`${route} renders a broken /security link`);
    if (widgetGuidanceRoutes.has(route) && !html.includes(canonicalWidgetUrl)) {
      failures.push(`${route} does not render the canonical widget URL`);
    }
  }
}

if (failures.length > 0) {
  console.error(`Documentation contract failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Documentation contract passed: ${sourceFiles.length} source files, ${competitorPages.length} dated competitor checks${baseUrl ? ", 9 rendered routes" : ""}.`,
);
