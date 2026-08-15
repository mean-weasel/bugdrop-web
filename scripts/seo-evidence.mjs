#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const SCHEMA_VERSION = 1;
const DEFAULT_CANONICAL_ORIGIN = "https://bugdrop.dev";
const DEFAULT_PATHS = [
  "/",
  "/docs/installation",
  "/docs/getting-started",
  "/sandbox",
  "/labs/variants",
  "/compare/sentry-user-feedback",
  "/widget.js",
];
const REPRESENTATIVE_PATHS = ["/", "/docs/installation", "/sandbox"];
const SECURITY_HEADERS = [
  "content-security-policy",
  "strict-transport-security",
  "x-content-type-options",
  "referrer-policy",
  "permissions-policy",
  "x-frame-options",
];

function usage() {
  return `Usage:
  npm run seo:evidence -- --target local=http://127.0.0.1:3000 --target live=https://bugdrop.dev [options]

Options:
  --target <label=url>       Explicitly named crawl target; repeat for dual-target evidence
  --canonical-origin <url>   Public origin used by canonical URLs (default: ${DEFAULT_CANONICAL_ORIGIN})
  --output <path>            Write the JSON report to this path as well as stdout
  --max-routes <number>      Bounded route limit per target (default: 100)
  --timeout-ms <number>      Per-request timeout (default: 15000)
  --help                     Show this help

The command only performs GET requests. It never calls IndexNow or another mutation endpoint.`;
}

function parseArgs(argv) {
  const options = {
    targets: [],
    canonicalOrigin: DEFAULT_CANONICAL_ORIGIN,
    output: null,
    maxRoutes: 100,
    timeoutMs: 15_000,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--help" || argument === "-h") return { ...options, help: true };
    const [flag, inlineValue] = argument.split(/=(.*)/s, 2);
    const value = inlineValue ?? argv[index + 1];
    if (["--target", "--canonical-origin", "--output", "--max-routes", "--timeout-ms"].includes(flag) && inlineValue === undefined) {
      index += 1;
    }
    if (!value && flag !== "--output") throw new Error(`Missing value for ${flag}`);

    if (flag === "--target") {
      const separator = value.indexOf("=");
      if (separator < 1) throw new Error("Targets must use an explicit label=url identity");
      options.targets.push({ label: value.slice(0, separator), baseUrl: value.slice(separator + 1) });
    } else if (flag === "--canonical-origin") options.canonicalOrigin = value;
    else if (flag === "--output") options.output = value;
    else if (flag === "--max-routes") options.maxRoutes = Number(value);
    else if (flag === "--timeout-ms") options.timeoutMs = Number(value);
    else throw new Error(`Unknown option: ${flag}`);
  }

  if (options.targets.length === 0) throw new Error("At least one explicitly named --target is required");
  if (!Number.isInteger(options.maxRoutes) || options.maxRoutes < DEFAULT_PATHS.length) {
    throw new Error(`--max-routes must be an integer of at least ${DEFAULT_PATHS.length}`);
  }
  if (!Number.isInteger(options.timeoutMs) || options.timeoutMs < 100) {
    throw new Error("--timeout-ms must be an integer of at least 100");
  }

  const labels = new Set();
  const origins = new Set();
  for (const target of options.targets) {
    if (!/^[a-z0-9][a-z0-9_-]*$/i.test(target.label)) throw new Error(`Invalid target label: ${target.label}`);
    const url = new URL(target.baseUrl);
    if (!/^https?:$/.test(url.protocol)) throw new Error(`Target must use HTTP(S): ${target.baseUrl}`);
    target.baseUrl = url.origin + url.pathname.replace(/\/$/, "");
    if (labels.has(target.label)) throw new Error(`Duplicate target label: ${target.label}`);
    if (origins.has(target.baseUrl)) throw new Error(`Targets must have distinct endpoint identities: ${target.baseUrl}`);
    labels.add(target.label);
    origins.add(target.baseUrl);
  }
  options.canonicalOrigin = new URL(options.canonicalOrigin).origin;
  return options;
}

function decodeHtml(value = "") {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&quot;/gi, '"')
    .replace(/&apos;|&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&")
    .replace(/&nbsp;/gi, " ");
}

function stripTags(value = "") {
  return decodeHtml(value.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function firstMatch(html, expression) {
  const match = expression.exec(html);
  return match ? decodeHtml(match[1]).trim() : null;
}

function attribute(tag, name) {
  const expression = new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i");
  const match = expression.exec(tag);
  return match ? decodeHtml(match[1] ?? match[2] ?? match[3] ?? "") : null;
}

function metaContent(html, name) {
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const key = attribute(match[0], "name") ?? attribute(match[0], "property");
    if (key?.toLowerCase() === name.toLowerCase()) return attribute(match[0], "content");
  }
  return null;
}

function linkHref(html, relName) {
  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    const rel = attribute(match[0], "rel")?.toLowerCase().split(/\s+/) ?? [];
    if (rel.includes(relName)) return attribute(match[0], "href");
  }
  return null;
}

function parseJsonLd(html) {
  const blocks = [];
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (attribute(match[1], "type")?.toLowerCase() !== "application/ld+json") continue;
    try {
      const value = JSON.parse(decodeHtml(match[2]).trim());
      const types = [];
      const visit = (node) => {
        if (!node || typeof node !== "object") return;
        if (typeof node["@type"] === "string") types.push(node["@type"]);
        if (Array.isArray(node)) node.forEach(visit);
        else Object.values(node).forEach(visit);
      };
      visit(value);
      blocks.push({ valid: true, types: [...new Set(types)].sort() });
    } catch (error) {
      blocks.push({ valid: false, error: error instanceof Error ? error.message : String(error) });
    }
  }
  return blocks;
}

function normalizePath(url, baseUrl, canonicalOrigin) {
  let parsed;
  try {
    parsed = new URL(url, baseUrl);
  } catch {
    return null;
  }
  const allowedOrigins = new Set([new URL(baseUrl).origin, canonicalOrigin]);
  if (!allowedOrigins.has(parsed.origin) || !/^https?:$/.test(parsed.protocol)) return null;
  if (/\.(?:avif|css|gif|ico|jpe?g|js|json|map|mp4|pdf|png|svg|webm|webp|woff2?)$/i.test(parsed.pathname)) return null;
  if (parsed.pathname.startsWith("/_next/") || parsed.pathname.startsWith("/api/") || parsed.pathname.startsWith("/cdn-cgi/")) return null;
  return `${parsed.pathname.replace(/\/{2,}/g, "/") || "/"}${parsed.search}`;
}

function parseLinks(html, pageUrl, baseUrl, canonicalOrigin) {
  const links = [];
  for (const match of html.matchAll(/<a\b[^>]*>/gi)) {
    const href = attribute(match[0], "href");
    if (!href || /^(?:mailto:|tel:|javascript:)/i.test(href)) continue;
    const path = normalizePath(href, pageUrl, canonicalOrigin);
    if (path) links.push(path);
  }
  return [...new Set(links)].sort();
}

function parseSitemap(xml) {
  const entries = [];
  for (const match of xml.matchAll(/<url\b[^>]*>([\s\S]*?)<\/url>/gi)) {
    const loc = firstMatch(match[1], /<loc\b[^>]*>([\s\S]*?)<\/loc>/i);
    if (!loc) continue;
    entries.push({
      loc,
      path: new URL(loc).pathname || "/",
      lastmod: firstMatch(match[1], /<lastmod\b[^>]*>([\s\S]*?)<\/lastmod>/i),
    });
  }
  return entries;
}

async function fetchWithRedirects(url, timeoutMs, maxRedirects = 8) {
  const redirects = [];
  let currentUrl = url;
  for (let index = 0; index <= maxRedirects; index += 1) {
    const response = await fetch(currentUrl, {
      method: "GET",
      redirect: "manual",
      signal: AbortSignal.timeout(timeoutMs),
      headers: { "user-agent": "BugDrop-SEO-Evidence/1.0" },
    });
    const location = response.headers.get("location");
    if (response.status >= 300 && response.status < 400 && location) {
      const nextUrl = new URL(location, currentUrl).toString();
      redirects.push({ url: currentUrl, status: response.status, location: nextUrl });
      currentUrl = nextUrl;
      continue;
    }
    return { response, finalUrl: currentUrl, redirects };
  }
  throw new Error(`Redirect limit exceeded for ${url}`);
}

function targetUrl(baseUrl, path) {
  return new URL(path, `${baseUrl}/`).toString();
}

async function requestText(url, timeoutMs) {
  try {
    const fetched = await fetchWithRedirects(url, timeoutMs);
    return { ...fetched, body: await fetched.response.text(), error: null };
  } catch (error) {
    return {
      response: null,
      finalUrl: url,
      redirects: [],
      body: "",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function selectHeaders(headers) {
  const selected = {};
  for (const name of ["server", "content-type", "x-vercel-id", "cf-ray", ...SECURITY_HEADERS]) {
    selected[name] = headers?.get(name) ?? null;
  }
  return selected;
}

async function inspectRoute(path, config, sitemapByPath) {
  const requestedUrl = targetUrl(config.baseUrl, path);
  const fetched = await requestText(requestedUrl, config.timeoutMs);
  const response = fetched.response;
  const contentType = response?.headers.get("content-type") ?? null;
  const isHtml = contentType?.includes("text/html") ?? false;
  const html = isHtml ? fetched.body : "";
  const headings = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => stripTags(match[1])).filter(Boolean);
  const jsonLd = parseJsonLd(html);
  const internalLinks = parseLinks(html, fetched.finalUrl, config.baseUrl, config.canonicalOrigin);

  return {
    path,
    requestedUrl,
    finalUrl: fetched.finalUrl,
    status: response?.status ?? null,
    error: fetched.error,
    redirects: fetched.redirects,
    contentType,
    title: firstMatch(html, /<title\b[^>]*>([\s\S]*?)<\/title>/i),
    description: metaContent(html, "description"),
    h1: headings,
    canonical: linkHref(html, "canonical"),
    robots: metaContent(html, "robots"),
    sitemap: sitemapByPath.has(path) ? { listed: true, lastmod: sitemapByPath.get(path).lastmod } : { listed: false, lastmod: null },
    internalLinks,
    jsonLd: {
      count: jsonLd.length,
      validCount: jsonLd.filter((block) => block.valid).length,
      invalid: jsonLd.filter((block) => !block.valid),
      types: [...new Set(jsonLd.flatMap((block) => block.types ?? []))].sort(),
    },
    headers: selectHeaders(response?.headers),
    contentSignals: {
      obsoleteWorkerWidgetUrl: /https:\/\/bugdrop\.neonwatty\.workers\.dev\/widget\.js/i.test(decodeHtml(fetched.body)),
      publicOriginWidgetUrl: /https:\/\/bugdrop\.dev\/widget\.js/i.test(decodeHtml(fetched.body)),
      forbidsAsyncOrDefer: /do not use async or defer/i.test(stripTags(fetched.body)),
      errorTriggeredExclusivityClaim: /(?:feedback|widget)[^.!?]{0,40}(?:is|appears)[^.!?]{0,30}error-triggered|widget[^.!?]{0,140}will not activate because there is no error event|(?:only|exclusively)[^.!?]{0,100}(?:error|crash)[^.!?]{0,100}(?:feedback|form)/i.test(stripTags(fetched.body)),
    },
  };
}

function buildFindings(routes, sitemapEntries) {
  const byPath = new Map(routes.map((route) => [route.path, route]));
  const installation = byPath.get("/docs/installation");
  const gettingStarted = byPath.get("/docs/getting-started");
  const sandbox = byPath.get("/sandbox");
  const widget = byPath.get("/widget.js");
  const sentry = byPath.get("/compare/sentry-user-feedback");
  const lastmods = sitemapEntries.map((entry) => entry.lastmod).filter(Boolean);
  const uniqueLastmods = [...new Set(lastmods)];
  const securityLink = routes.find((route) => route.path === "/security");
  const gettingStartedRedirect = gettingStarted?.redirects[0];
  const gettingStartedTarget = gettingStartedRedirect
    ? new URL(gettingStartedRedirect.location).pathname
    : null;
  const representative = routes.filter((route) => REPRESENTATIVE_PATHS.includes(route.path));
  const missingHeaderEvidence = representative.map((route) => ({
    path: route.path,
    missing: SECURITY_HEADERS.filter((header) => !route.headers[header]),
  }));

  return [
    {
      id: "synthetic-sitemap-lastmod",
      observed: lastmods.length > 1 && uniqueLastmods.length === 1,
      evidence: { entryCount: sitemapEntries.length, lastmodCount: lastmods.length, uniqueLastmods },
    },
    {
      id: "broken-installation-security-link",
      observed: Boolean(installation?.internalLinks.includes("/security") && securityLink?.status && securityLink.status >= 400),
      evidence: { source: "/docs/installation", target: "/security", status: securityLink?.status ?? null },
    },
    {
      id: "getting-started-index-contract",
      observed: Boolean(
        gettingStarted &&
          (gettingStarted.redirects.length !== 1 ||
            gettingStartedRedirect?.status !== 308 ||
            gettingStartedTarget !== "/docs" ||
            gettingStarted.sitemap.listed ||
            new URL(gettingStarted.canonical ?? "about:blank").pathname !== "/docs"),
      ),
      evidence: gettingStarted
        ? {
            redirects: gettingStarted.redirects,
            sitemap: gettingStarted.sitemap,
            canonical: gettingStarted.canonical,
            finalUrl: gettingStarted.finalUrl,
          }
        : null,
    },
    {
      id: "indexable-sandbox-omitted-from-sitemap",
      observed: Boolean(sandbox?.status === 200 && !sandbox.sitemap.listed && !/noindex/i.test(sandbox.robots ?? "")),
      evidence: sandbox ? { status: sandbox.status, sitemap: sandbox.sitemap, robots: sandbox.robots, canonical: sandbox.canonical } : null,
    },
    {
      id: "installation-widget-contract-drift",
      observed: Boolean(installation?.contentSignals.obsoleteWorkerWidgetUrl && installation.contentSignals.forbidsAsyncOrDefer),
      evidence: installation?.contentSignals ?? null,
    },
    {
      id: "public-widget-url-returns-error",
      observed: Boolean(widget?.status && widget.status >= 400),
      evidence: widget ? { url: widget.requestedUrl, status: widget.status, contentType: widget.contentType } : null,
    },
    {
      id: "stale-sentry-feedback-claim",
      observed: Boolean(sentry?.contentSignals.errorTriggeredExclusivityClaim),
      evidence: sentry ? { status: sentry.status, matched: sentry.contentSignals.errorTriggeredExclusivityClaim } : null,
    },
    {
      id: "representative-security-headers-missing",
      observed: missingHeaderEvidence.some((entry) => entry.missing.length > 0),
      evidence: missingHeaderEvidence,
    },
  ];
}

async function inspectTarget(target, options) {
  const config = { ...target, canonicalOrigin: options.canonicalOrigin, timeoutMs: options.timeoutMs };
  const robots = await requestText(targetUrl(target.baseUrl, "/robots.txt"), options.timeoutMs);
  const sitemap = await requestText(targetUrl(target.baseUrl, "/sitemap.xml"), options.timeoutMs);
  const sitemapEntries = sitemap.response?.ok ? parseSitemap(sitemap.body) : [];
  const sitemapByPath = new Map(sitemapEntries.map((entry) => [entry.path, entry]));
  const queue = [...new Set([...sitemapEntries.map((entry) => entry.path), ...DEFAULT_PATHS])];
  const seen = new Set();
  const routes = [];

  while (queue.length > 0 && routes.length < options.maxRoutes) {
    const batch = queue.splice(0, Math.min(6, options.maxRoutes - routes.length)).filter((path) => !seen.has(path));
    batch.forEach((path) => seen.add(path));
    const inspected = await Promise.all(batch.map((path) => inspectRoute(path, config, sitemapByPath)));
    routes.push(...inspected);
    for (const route of inspected) {
      for (const linkedPath of route.internalLinks) {
        if (!seen.has(linkedPath) && !queue.includes(linkedPath)) queue.push(linkedPath);
      }
    }
  }

  routes.sort((left, right) => left.path.localeCompare(right.path));
  const routeByPath = new Map(routes.map((route) => [route.path, route]));
  const brokenInternalLinks = [];
  for (const route of routes) {
    for (const link of route.internalLinks) {
      const targetRoute = routeByPath.get(link);
      if (targetRoute?.status && targetRoute.status >= 400) brokenInternalLinks.push({ source: route.path, target: link, status: targetRoute.status });
    }
  }

  const homepage = routeByPath.get("/");
  return {
    identity: {
      label: target.label,
      requestedBaseUrl: target.baseUrl,
      requestedOrigin: new URL(target.baseUrl).origin,
      resolvedHomepageUrl: homepage?.finalUrl ?? null,
      loopback: ["localhost", "127.0.0.1", "::1"].includes(new URL(target.baseUrl).hostname),
      server: homepage?.headers.server ?? null,
      vercelRequestId: homepage?.headers["x-vercel-id"] ?? null,
      cloudflareRay: homepage?.headers["cf-ray"] ?? null,
    },
    robots: {
      url: targetUrl(target.baseUrl, "/robots.txt"),
      status: robots.response?.status ?? null,
      error: robots.error,
      sitemapDirectives: [...robots.body.matchAll(/^\s*sitemap:\s*(\S+)/gim)].map((match) => match[1]),
    },
    sitemap: {
      url: targetUrl(target.baseUrl, "/sitemap.xml"),
      status: sitemap.response?.status ?? null,
      error: sitemap.error,
      entries: sitemapEntries,
    },
    crawl: {
      routeLimit: options.maxRoutes,
      discoveredCount: routes.length,
      truncated: queue.length > 0,
      statusCounts: Object.fromEntries([...new Set(routes.map((route) => String(route.status)))].sort().map((status) => [status, routes.filter((route) => String(route.status) === status).length])),
      brokenInternalLinks,
      routes,
    },
    findings: buildFindings(routes, sitemapEntries),
  };
}

function compareTargets(targets) {
  return {
    distinctTargetIdentity: new Set(targets.map((target) => target.identity.requestedBaseUrl)).size === targets.length,
    labels: targets.map((target) => target.identity.label),
    endpoints: targets.map((target) => target.identity.requestedBaseUrl),
    loopbackByLabel: Object.fromEntries(targets.map((target) => [target.identity.label, target.identity.loopback])),
    findingParity: Object.fromEntries(
      [...new Set(targets.flatMap((target) => target.findings.map((finding) => finding.id)))].map((id) => [
        id,
        Object.fromEntries(targets.map((target) => [target.identity.label, target.findings.find((finding) => finding.id === id)?.observed ?? null])),
      ]),
    ),
  };
}

export async function run(argv = process.argv.slice(2)) {
  const options = parseArgs(argv);
  if (options.help) {
    process.stdout.write(`${usage()}\n`);
    return null;
  }

  const targets = [];
  for (const target of options.targets) targets.push(await inspectTarget(target, options));
  const report = {
    schemaVersion: SCHEMA_VERSION,
    generatedAt: new Date().toISOString(),
    requestPolicy: { method: "GET", externalMutation: false, userAgent: "BugDrop-SEO-Evidence/1.0" },
    canonicalOrigin: options.canonicalOrigin,
    targets,
    comparison: compareTargets(targets),
  };
  const serialized = `${JSON.stringify(report, null, 2)}\n`;
  if (options.output) {
    const outputPath = resolve(options.output);
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, serialized, "utf8");
  }
  process.stdout.write(serialized);
  return report;
}

const invokedDirectly = process.argv[1] && import.meta.url === new URL(`file://${resolve(process.argv[1])}`).href;
if (invokedDirectly) {
  run().catch((error) => {
    process.stderr.write(`seo:evidence failed: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
