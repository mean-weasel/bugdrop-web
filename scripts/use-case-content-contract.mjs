#!/usr/bin/env node

import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";

const owners = {
  "website-feedback-widget": "website feedback widget",
  "free-website-feedback-widget": "free website feedback widget",
  "github-issues-feedback": "send website feedback to GitHub Issues",
  "screenshot-feedback-widget": "screenshot feedback widget",
  "visual-bug-reporting": "visual bug reporting",
  "nextjs-feedback-widget": "Next.js feedback widget",
  "vercel-preview-feedback": "Vercel preview feedback",
  "open-source": "bug reporting for open-source projects",
  "open-source-feedback-widget": "open-source feedback widget",
  "internal-tools": "feedback widget for internal tools",
  "client-projects": "client feedback workflow for web projects",
  "client-website-feedback-tool": "client website feedback tool",
};

const requiredJobLanguage = {
  "website-feedback-widget": ["broad category question", "reporting surface"],
  "free-website-feedback-widget": ["software cost", "operations cost"],
  "github-issues-feedback": ["What reaches GitHub", "Design the issue for triage"],
  "screenshot-feedback-widget": ["Choose the right screenshot mode", "Annotation, redaction, and masking"],
  "visual-bug-reporting": ["five-part visual bug report", "Triage without guessing"],
  "nextjs-feedback-widget": ["App Router", "Test the integration"],
  "vercel-preview-feedback": ["VERCEL_ENV", "production does not"],
  "open-source": ["maintainer-friendly intake", "community"],
  "open-source-feedback-widget": ["Hosted versus self-hosted", "selection checklist"],
  "internal-tools": ["access model", "sensitive data"],
  "client-projects": ["review round", "Triage and communicate"],
  "client-website-feedback-tool": ["Start with the reporter", "Evaluate the delivery handoff"],
};

const forbiddenUnsupportedLanguage = [
  /works behind VPN/i,
  /without any special network configuration/i,
  /(?<!not )automatically associates? .*pull request/i,
  /zero operational cost/i,
  /(?<!not )guarantees? (?:a )?complete/i,
];

const expectedSlugs = Object.keys(owners).sort();
const contentDir = new URL("../src/content/use-cases/", import.meta.url);
const architecture = JSON.parse(await readFile(new URL("../src/lib/acquisition-architecture.json", import.meta.url), "utf8"));
const contentFiles = (await readdir(contentDir))
  .filter((file) => file.endsWith(".mdx"))
  .map((file) => file.replace(/\.mdx$/, ""))
  .sort();

assert.deepEqual(contentFiles, expectedSlugs, "Use-case content inventory changed");

const useCasePages = architecture.pages.filter((page) => page.kind === "use-case");
assert.equal(useCasePages.length, expectedSlugs.length, "Architecture must retain the exact approved use-case leaves");
assert.equal(new Set(useCasePages.map((page) => page.primaryQuery.toLowerCase())).size, expectedSlugs.length, "Use-case owners must remain unique");

const intros = new Set();
for (const slug of expectedSlugs) {
  const mdx = await readFile(new URL(`${slug}.mdx`, contentDir), "utf8");
  const page = useCasePages.find((candidate) => candidate.path === `/use-cases/${slug}`);
  assert(page, `${slug}: missing architecture page`);
  assert.equal(page.primaryQuery.toLowerCase(), owners[slug].toLowerCase(), `${slug}: primary owner drifted`);

  const headings = [...mdx.matchAll(/^# (.+)$/gm)].map((match) => match[1]);
  assert.equal(headings.length, 1, `${slug}: expected exactly one H1`);
  assert(headings[0].toLowerCase().includes(owners[slug].toLowerCase()), `${slug}: H1 must state owner ${owners[slug]}`);

  const proseWords = mdx
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .match(/[\p{L}\p{N}][\p{L}\p{N}’'.-]*/gu) ?? [];
  assert(proseWords.length >= 475, `${slug}: content is too thin (${proseWords.length} words)`);
  assert((mdx.match(/^## /gm) ?? []).length >= 4, `${slug}: needs at least four substantive sections`);
  assert(mdx.includes("**Use this guide when:**"), `${slug}: missing above-the-fold job boundary`);

  const intro = mdx.split("\n\n")[1]?.replace(/\s+/g, " ").trim().toLowerCase();
  assert(intro?.length >= 120, `${slug}: intro is not substantive`);
  assert(!intros.has(intro), `${slug}: duplicate above-the-fold intro`);
  intros.add(intro);

  for (const marker of requiredJobLanguage[slug]) assert(mdx.toLowerCase().includes(marker.toLowerCase()), `${slug}: missing distinct job marker ${marker}`);
  for (const pattern of forbiddenUnsupportedLanguage) assert(!pattern.test(mdx), `${slug}: contains unsupported language ${pattern}`);

  const links = [...mdx.matchAll(/\]\((\/[^)]+)\)/g)].map((match) => match[1].split("#")[0]);
  assert(new Set(links).size >= 4, `${slug}: needs at least four distinct contextual or conversion destinations`);
  assert(links.some((link) => ["/demo", "/sandbox"].includes(link)), `${slug}: needs a demo or sandbox validation path`);
  assert(links.some((link) => link.startsWith("/docs/")), `${slug}: needs a documentation path`);
  assert(links.some((link) => link.startsWith("/use-cases/") || link.startsWith("/compare")), `${slug}: needs a contextual acquisition path`);
}

const evidenceChecks = [
  ["src/content/docs/installation.mdx", "bugdrop-screenshots"],
  ["src/content/docs/installation.mdx", "without `async` or `defer`"],
  ["src/content/docs/configuration.mdx", "## Automatic System Information"],
  ["src/content/docs/configuration.mdx", "data-auth-token-provider"],
  ["src/content/docs/configuration.mdx", "data-screenshot"],
  ["src/content/docs/security.mdx", "MIT licensed"],
  ["src/content/docs/security.mdx", "Masking is visual coverage, not data-loss prevention"],
  ["src/content/docs/styling.mdx", "Shadow DOM"],
  ["src/content/docs/ci-testing.mdx", "#bugdrop-host"],
  ["src/content/docs/ci-testing.mdx", ".bd-trigger"],
];
for (const [path, marker] of evidenceChecks) {
  const source = await readFile(new URL(`../${path}`, import.meta.url), "utf8");
  assert(source.includes(marker), `Product evidence drifted: ${path} missing ${marker}`);
}

const baseArg = process.argv.slice(2).find((arg) => arg.startsWith("--base-url="));
const baseUrl = baseArg ? new URL(baseArg.slice("--base-url=".length)) : null;
if (baseUrl) {
  assert(["127.0.0.1", "localhost"].includes(baseUrl.hostname), "Rendered contract must target localhost");
  for (const slug of expectedSlugs) {
    const response = await fetch(new URL(`/use-cases/${slug}`, baseUrl), { redirect: "manual" });
    assert.equal(response.status, 200, `${slug}: rendered route must return 200`);
    const html = await response.text();
    assert(html.includes(`data-use-case-page="${slug}"`), `${slug}: missing rendered use-case shell`);
    assert(html.includes(`data-use-case-conversion="${slug}"`), `${slug}: missing rendered conversion path`);
    assert(html.includes("Use this guide when:"), `${slug}: rendered job boundary missing`);
    assert.equal((html.match(/<h1[ >]/g) ?? []).length, 1, `${slug}: rendered page must have one H1`);
    for (const href of ["/demo", "/docs/installation"]) assert(html.includes(`href="${href}"`), `${slug}: rendered CTA missing ${href}`);
  }
}

console.log(JSON.stringify({
  status: "pass",
  useCasePages: expectedSlugs.length,
  uniqueOwners: new Set(useCasePages.map((page) => page.primaryQuery.toLowerCase())).size,
  uniqueIntros: intros.size,
  productEvidenceChecks: evidenceChecks.length,
  rendered: Boolean(baseUrl),
}, null, 2));
