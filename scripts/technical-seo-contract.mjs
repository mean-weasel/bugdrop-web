#!/usr/bin/env node

const baseUrl = new URL(
  process.argv.find((argument) => argument.startsWith("--base-url="))?.split("=")[1] ??
    "http://127.0.0.1:3000",
);
const auditBrowserNetwork = process.argv.includes("--audit-browser-network");
const canonicalOrigin = "https://bugdrop.dev";
const expectedHeaders = [
  "content-security-policy",
  "strict-transport-security",
  "x-content-type-options",
  "referrer-policy",
  "permissions-policy",
  "x-frame-options",
];
const requiredCspSources = {
  "script-src": [
    "https://bugdrop.neonwatty.workers.dev",
    "https://www.googletagmanager.com",
  ],
  "connect-src": [
    "https://bugdrop.neonwatty.workers.dev",
    "https://us.i.posthog.com",
    "https://www.google-analytics.com",
    "https://region1.google-analytics.com",
    "https://www.googletagmanager.com",
  ],
  "img-src": [],
  "frame-src": ["https://www.youtube-nocookie.com"],
};
const forbiddenCspSources = {
  "connect-src": [
    "https://api.producthunt.com",
    "https://img.youtube.com",
    "https://i.ytimg.com",
  ],
  "img-src": [
    "https://api.producthunt.com",
    "https://img.youtube.com",
    "https://i.ytimg.com",
  ],
  "frame-src": ["https://www.youtube.com"],
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function decodeHtml(value = "") {
  return value
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&");
}

function attribute(tag, name) {
  const match = new RegExp(
    `\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`,
    "i",
  ).exec(tag);
  return match ? decodeHtml(match[1] ?? match[2] ?? match[3] ?? "") : null;
}

function metadataValue(html, element, keyName, keyValue, valueName) {
  for (const match of html.matchAll(new RegExp(`<${element}\\b[^>]*>`, "gi"))) {
    if (attribute(match[0], keyName)?.toLowerCase() === keyValue.toLowerCase()) {
      return attribute(match[0], valueName);
    }
  }
  return null;
}

function parseJsonLd(html, path) {
  const values = [];
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (attribute(match[1], "type")?.toLowerCase() !== "application/ld+json") continue;
    try {
      values.push(JSON.parse(decodeHtml(match[2]).trim()));
    } catch (error) {
      throw new Error(`${path} has invalid JSON-LD: ${error.message}`);
    }
  }
  return values;
}

function visit(value, callback) {
  if (!value || typeof value !== "object") return;
  callback(value);
  if (Array.isArray(value)) value.forEach((item) => visit(item, callback));
  else Object.values(value).forEach((item) => visit(item, callback));
}

function schemaTypes(values) {
  const types = new Set();
  values.forEach((value) =>
    visit(value, (node) => {
      if (typeof node["@type"] === "string") types.add(node["@type"]);
    }),
  );
  return types;
}

function parseCsp(value) {
  return new Map(
    value
      .split(";")
      .map((directive) => directive.trim().split(/\s+/))
      .filter(([name]) => name)
      .map(([name, ...sources]) => [name, new Set(sources)]),
  );
}

async function request(path, redirect = "follow", headers = {}) {
  return fetch(new URL(path, baseUrl), {
    redirect,
    headers: { "user-agent": "BugDrop-Technical-SEO-Contract/1.0", ...headers },
  });
}

const sitemapResponse = await request("/sitemap.xml");
assert(sitemapResponse.status === 200, `sitemap returned ${sitemapResponse.status}`);
const sitemapXml = await sitemapResponse.text();
const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (match) => match[1],
);
const sitemapPaths = sitemapUrls.map((url) => new URL(url).pathname);
assert(sitemapUrls.length === new Set(sitemapUrls).size, "sitemap contains duplicate URLs");
assert(sitemapUrls.every((url) => new URL(url).origin === canonicalOrigin), "sitemap has a non-canonical origin");
assert(sitemapPaths.includes("/sandbox"), "indexable sandbox is missing from sitemap");
for (const omitted of ["/docs/getting-started", "/security", "/labs/variants"]) {
  assert(!sitemapPaths.includes(omitted), `${omitted} must be omitted from sitemap`);
}
assert(!/<(?:lastmod|changefreq|priority)>/i.test(sitemapXml), "sitemap contains unsupported or synthetic freshness signals");

const robotsResponse = await request("/robots.txt");
assert(robotsResponse.status === 200, `robots.txt returned ${robotsResponse.status}`);
const robotsText = await robotsResponse.text();
assert(/User-Agent:\s*\*\s+[\s\S]*?Allow:\s*\//i.test(robotsText), "robots.txt does not allow public crawling");
assert(/User-Agent:\s*GPTBot\s+[\s\S]*?Disallow:\s*\//i.test(robotsText), "GPTBot training policy is missing");
assert(robotsText.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`), "robots.txt sitemap is not canonical");

for (const [source, destination] of [
  ["/docs/getting-started", "/docs"],
  ["/security", "/docs/security"],
]) {
  const response = await request(source, "manual");
  assert(response.status === 308, `${source} must return 308, got ${response.status}`);
  assert(new URL(response.headers.get("location"), baseUrl).pathname === destination, `${source} has the wrong redirect target`);
}

const expectedSchemaType = (path) => {
  if (path === "/docs" || path === "/compare" || path === "/use-cases") return "CollectionPage";
  if (path.startsWith("/docs/")) return "TechArticle";
  if (path.startsWith("/compare/") || path.startsWith("/use-cases/")) return "WebPage";
  if (path === "/resources/visual-bug-report-template") return "HowTo";
  if (path === "/resources/client-website-qa-checklist") return "ItemList";
  return null;
};

for (const [index, url] of sitemapUrls.entries()) {
  const path = sitemapPaths[index];
  const response = await request(path);
  assert(response.status === 200, `${path} returned ${response.status}`);
  const html = await response.text();
  const canonical = metadataValue(html, "link", "rel", "canonical", "href");
  assert(canonical === url, `${path} canonical ${canonical ?? "missing"} does not match ${url}`);
  assert(metadataValue(html, "meta", "name", "description", "content"), `${path} is missing a description`);

  const schemas = parseJsonLd(html, path);
  schemas.forEach((schema) =>
    visit(schema, (node) => {
      assert(!("datePublished" in node), `${path} contains an unproven datePublished`);
      assert(!("dateModified" in node), `${path} contains an unproven dateModified`);
    }),
  );
  const expectedType = expectedSchemaType(path);
  if (expectedType) {
    const types = schemaTypes(schemas);
    assert(types.has(expectedType), `${path} is missing ${expectedType} structured data`);
    if (expectedType !== "TechArticle") {
      assert(!types.has("Article") && !types.has("TechArticle"), `${path} incorrectly claims article structured data`);
    }
  }
}

for (const path of ["/", "/docs/installation", "/sandbox"]) {
  const response = await request(path);
  for (const header of expectedHeaders) {
    assert(response.headers.get(header), `${path} is missing ${header}`);
  }
  assert(response.headers.get("x-content-type-options") === "nosniff", `${path} has an unsafe MIME policy`);
  assert(response.headers.get("x-frame-options") === "DENY", `${path} has an unsafe frame policy`);
}

const homepageResponse = await request("/");
const homepageHtml = await homepageResponse.text();
assert(
  !homepageHtml.includes("https://api.producthunt.com"),
  "homepage HTML must not initiate a Product Hunt API request",
);
const csp = parseCsp(homepageResponse.headers.get("content-security-policy"));
for (const [directive, sources] of Object.entries(requiredCspSources)) {
  const configured = csp.get(directive);
  assert(configured, `CSP is missing ${directive}`);
  for (const source of sources) assert(configured.has(source), `CSP ${directive} blocks required origin ${source}`);
}
for (const [directive, sources] of Object.entries(forbiddenCspSources)) {
  const configured = csp.get(directive);
  assert(configured, `CSP is missing ${directive}`);
  for (const source of sources) assert(!configured.has(source), `CSP ${directive} permits obsolete origin ${source}`);
}
assert(csp.get("object-src")?.has("'none'"), "CSP must block object embedding");
assert(csp.get("frame-ancestors")?.has("'none'"), "CSP must block framing");

let initialHomepageProductHuntRequests = null;
if (auditBrowserNetwork) {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const productHuntRequests = [];
    page.on("request", (browserRequest) => {
      if (new URL(browserRequest.url()).hostname === "api.producthunt.com") {
        productHuntRequests.push(browserRequest.url());
      }
    });
    await page.goto(new URL("/", baseUrl).href, { waitUntil: "networkidle" });
    initialHomepageProductHuntRequests = productHuntRequests.length;
    assert(
      initialHomepageProductHuntRequests === 0,
      `initial homepage requested the Product Hunt API: ${productHuntRequests.join(", ")}`,
    );
  } finally {
    await browser.close();
  }
}

const labResponse = await request("/labs/variants");
const labHtml = await labResponse.text();
const labRobots = metadataValue(labHtml, "meta", "name", "robots", "content") ?? "";
assert(/noindex/i.test(labRobots) && /nofollow/i.test(labRobots), "unpublished lab is not noindex,nofollow");

process.stdout.write(
  `${JSON.stringify({
    status: "pass",
    baseUrl: baseUrl.origin,
    sitemapUrlCount: sitemapUrls.length,
    parsedJsonLdRoutes: sitemapUrls.length,
    representativeHeaderRoutes: 3,
    cspOriginChecks: Object.values(requiredCspSources).flat().length,
    cspForbiddenOriginChecks: Object.values(forbiddenCspSources).flat().length,
    initialHomepageProductHuntRequests,
  })}\n`,
);
