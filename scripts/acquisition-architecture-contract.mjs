import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const args = process.argv.slice(2);
const baseArg = args.find((arg) => arg.startsWith("--base-url="));
assert(baseArg, "Usage: node scripts/acquisition-architecture-contract.mjs --base-url=http://127.0.0.1:3206");
const baseUrl = new URL(baseArg.slice("--base-url=".length));
assert(["127.0.0.1", "localhost"].includes(baseUrl.hostname), "Contract is local/read-only; base URL must be localhost");

const architecture = JSON.parse(
  await readFile(new URL("../src/lib/acquisition-architecture.json", import.meta.url), "utf8"),
);

const expectedPaths = [
  "/", "/use-cases", "/use-cases/website-feedback-widget",
  "/use-cases/free-website-feedback-widget", "/use-cases/github-issues-feedback",
  "/use-cases/screenshot-feedback-widget", "/use-cases/visual-bug-reporting",
  "/use-cases/nextjs-feedback-widget", "/use-cases/open-source",
  "/use-cases/vercel-preview-feedback",
  "/use-cases/open-source-feedback-widget", "/use-cases/internal-tools",
  "/use-cases/client-projects", "/use-cases/client-website-feedback-tool",
  "/compare", "/compare/userback", "/compare/marker-io", "/compare/bugherd",
  "/compare/usersnap", "/compare/canny", "/compare/sentry-user-feedback",
  "/compare/open-source-feedback-tools", "/compare/markup-io", "/compare/jam-dev",
  "/resources", "/resources/visual-bug-report-template", "/resources/client-website-qa-checklist",
  "/resources/screenshot-privacy-checklist",
];

const expectedEdges = {
  "/": ["/use-cases", "/compare", "/use-cases/website-feedback-widget", "/use-cases/github-issues-feedback", "/use-cases/screenshot-feedback-widget", "/use-cases/free-website-feedback-widget", "/resources", "/resources/visual-bug-report-template", "/resources/client-website-qa-checklist", "/resources/screenshot-privacy-checklist"],
  "/use-cases/website-feedback-widget": ["/use-cases/github-issues-feedback", "/use-cases/screenshot-feedback-widget", "/use-cases/free-website-feedback-widget", "/compare"],
  "/use-cases/screenshot-feedback-widget": ["/use-cases/visual-bug-reporting", "/demo", "/resources/screenshot-privacy-checklist"],
  "/use-cases/visual-bug-reporting": ["/use-cases/screenshot-feedback-widget", "/use-cases/client-projects", "/use-cases/internal-tools", "/resources/screenshot-privacy-checklist"],
  "/use-cases/open-source": ["/use-cases/open-source-feedback-widget", "/use-cases/github-issues-feedback"],
  "/use-cases/open-source-feedback-widget": ["/use-cases/open-source", "/compare/open-source-feedback-tools", "/docs/self-hosting"],
  "/use-cases/client-projects": ["/use-cases/client-website-feedback-tool", "/use-cases/screenshot-feedback-widget", "/compare/bugherd", "/resources/screenshot-privacy-checklist"],
  "/use-cases/client-website-feedback-tool": ["/use-cases/client-projects", "/use-cases/website-feedback-widget", "/compare/userback", "/compare/marker-io"],
  "/use-cases/internal-tools": ["/use-cases/website-feedback-widget", "/use-cases/visual-bug-reporting", "/use-cases/github-issues-feedback"],
  "/use-cases/nextjs-feedback-widget": ["/use-cases/website-feedback-widget", "/use-cases/github-issues-feedback", "/docs/installation", "/docs/ci-testing", "/use-cases/vercel-preview-feedback"],
  "/use-cases/vercel-preview-feedback": ["/use-cases", "/use-cases/nextjs-feedback-widget", "/use-cases/client-projects", "/docs/ci-testing", "/resources/client-website-qa-checklist"],
  "/compare/userback": ["/compare", "/use-cases/website-feedback-widget", "/use-cases/client-website-feedback-tool"],
  "/compare/marker-io": ["/compare", "/use-cases/website-feedback-widget", "/use-cases/client-website-feedback-tool"],
  "/compare/bugherd": ["/compare", "/use-cases/website-feedback-widget", "/use-cases/client-projects"],
  "/compare/usersnap": ["/compare", "/use-cases/website-feedback-widget"],
  "/compare/canny": ["/compare", "/use-cases/website-feedback-widget"],
  "/compare/sentry-user-feedback": ["/compare", "/use-cases/website-feedback-widget", "/use-cases/visual-bug-reporting", "/use-cases/github-issues-feedback"],
  "/compare/open-source-feedback-tools": ["/compare", "/use-cases/website-feedback-widget", "/use-cases/open-source-feedback-widget", "/use-cases/open-source"],
  "/compare/markup-io": ["/compare", "/use-cases/client-website-feedback-tool", "/compare/marker-io", "/use-cases/github-issues-feedback"],
  "/compare/jam-dev": ["/compare", "/use-cases/github-issues-feedback", "/use-cases/visual-bug-reporting", "/compare/sentry-user-feedback"],
};

const pages = architecture.pages;
assert.equal(pages.length, 28, "Ownership map must contain exactly 28 approved acquisition pages");
assert.deepEqual([...pages.map((page) => page.path)].sort(), [...expectedPaths].sort(), "Acquisition path inventory changed");
assert(pages.every((page) => page.primaryQuery?.trim()), "Every page must declare a primary query");
assert.equal(new Set(pages.map((page) => page.primaryQuery.toLowerCase())).size, 28, "Primary queries must be unique");
assert.equal(pages.find((page) => page.path === "/compare/markup-io")?.primaryQuery, "MarkUp.io alternative", "MarkUp.io must own its distinct alternative query");
assert.equal(pages.find((page) => page.path === "/compare/jam-dev")?.primaryQuery, "Jam.dev alternative", "Jam.dev must own its distinct alternative query");

for (const [source, destinations] of Object.entries(expectedEdges)) {
  const declared = pages.find((page) => page.path === source)?.related.map((edge) => edge.path) ?? [];
  for (const destination of destinations) {
    assert(declared.includes(destination), `Missing approved declared edge ${source} -> ${destination}`);
  }
}

const sitemapResponse = await fetch(new URL("/sitemap.xml", baseUrl), { redirect: "manual" });
assert.equal(sitemapResponse.status, 200, "Sitemap must return 200");
const sitemap = await sitemapResponse.text();
const sitemapPaths = new Set(
  [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => new URL(match[1]).pathname),
);

const rendered = new Map();
for (const page of pages) {
  const response = await fetch(new URL(page.path, baseUrl), { redirect: "manual" });
  assert.equal(response.status, 200, `${page.path} must return 200 without a redirect`);
  const html = await response.text();
  rendered.set(page.path, html);

  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i)?.[1]
    ?? html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.[1];
  const canonicalUrl = new URL(canonical);
  assert.equal(canonicalUrl.origin, "https://bugdrop.dev", `${page.path} canonical must keep the production origin`);
  assert.equal(canonicalUrl.pathname, page.path, `${page.path} must remain self-canonical`);
  const robots = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)/i)?.[1] ?? "";
  assert(!robots.toLowerCase().includes("noindex"), `${page.path} must remain indexable`);
  assert(sitemapPaths.has(page.path), `${page.path} must remain sitemap-listed`);

  const expectedTitle = page.title.toLowerCase();
  const title = html.match(/<title>(.*?)<\/title>/is)?.[1]?.toLowerCase() ?? "";
  const h1 = html.match(/<h1[^>]*>(.*?)<\/h1>/is)?.[1]?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().toLowerCase() ?? "";
  assert(title.includes(expectedTitle), `${page.path} title must align with its declared owner`);
  assert(h1.includes(page.primaryQuery.toLowerCase()), `${page.path} H1 must state its primary query`);
}

const useCaseLeaves = pages.filter((page) => page.kind === "use-case");
const compareLeaves = pages.filter((page) => page.kind === "compare");
const resourceLeaves = pages.filter((page) => page.kind === "resource");
for (const page of [...useCaseLeaves, ...compareLeaves]) {
  const html = rendered.get(page.path);
  const requiredHub = page.kind === "use-case" ? "/use-cases" : "/compare";
  assert(page.related.some((edge) => edge.path === requiredHub), `${page.path} must declare its hub link`);
  assert(page.related.length >= 3, `${page.path} must link to its hub and at least two contextual destinations`);
  for (const related of page.related) {
    assert(related.anchor?.trim() && related.rationale?.trim(), `${page.path} related links need visible intent-specific copy`);
    assert(html.includes(`data-acquisition-related-link="${related.path}"`), `${page.path} must render related edge to ${related.path}`);
  }
}

for (const page of resourceLeaves) {
  const html = rendered.get(page.path);
  assert(page.related.length >= 3, `${page.path} must declare at least three contextual destinations`);
  for (const related of page.related) {
    assert(related.anchor?.trim() && related.rationale?.trim(), `${page.path} related links need intent-specific copy`);
    assert(html.includes(`data-resource-related-link="${related.path}"`), `${page.path} must render related edge to ${related.path}`);
  }
}

for (const [hubPath, leaves, attribute] of [["/use-cases", useCaseLeaves, "data-acquisition-hub-link"], ["/compare", compareLeaves, "data-acquisition-hub-link"], ["/resources", resourceLeaves, "data-resource-hub-link"]]) {
  const html = rendered.get(hubPath);
  for (const leaf of leaves) {
    assert(html.includes(`${attribute}="${leaf.path}"`), `${hubPath} must render a link to ${leaf.path}`);
  }
}

const internalPaths = new Set();
const internalFragments = [];
for (const [sourcePath, html] of rendered) {
  for (const match of html.matchAll(/href=["']([^"']+)["']/g)) {
    const url = new URL(match[1], new URL(sourcePath, baseUrl));
    if (url.origin !== baseUrl.origin) continue;
    internalPaths.add(url.pathname);
    if (url.hash) internalFragments.push({ path: url.pathname, fragment: decodeURIComponent(url.hash.slice(1)) });
  }
}
for (const path of internalPaths) {
  const response = await fetch(new URL(path, baseUrl), { redirect: "manual" });
  assert(response.status < 400, `Broken internal link from acquisition pages: ${path} (${response.status})`);
}

const fragmentPages = new Map(rendered);
for (const { path, fragment } of internalFragments) {
  if (!fragmentPages.has(path)) {
    const response = await fetch(new URL(path, baseUrl), { redirect: "manual" });
    assert.equal(response.status, 200, `Internal fragment page must return 200: ${path} (${response.status})`);
    fragmentPages.set(path, await response.text());
  }
  const ids = new Set([...fragmentPages.get(path).matchAll(/\bid=(?:"([^"]+)"|'([^']+)')/gi)].map((match) => match[1] ?? match[2]));
  assert(ids.has(fragment), `Missing internal fragment target: ${path}#${fragment}`);
}

console.log(JSON.stringify({
  status: "pass",
  acquisitionPages: pages.length,
  uniquePrimaryQueries: new Set(pages.map((page) => page.primaryQuery)).size,
  useCaseLeaves: useCaseLeaves.length,
  comparisonLeaves: compareLeaves.length,
  resourceLeaves: resourceLeaves.length,
  checkedInternalPaths: internalPaths.size,
  checkedInternalFragments: internalFragments.length,
  assertions: ["exact inventory", "unique owners", "approved edges", "200/no redirects", "self-canonical", "indexable", "sitemap-listed", "hub coverage", "contextual links", "zero broken internal links", "all internal fragments resolve"],
}, null, 2));
