#!/usr/bin/env node

import { readFile, readdir } from "node:fs/promises";

const expectedSlugs = [
  "bugherd",
  "canny",
  "jam-dev",
  "marker-io",
  "markup-io",
  "open-source-feedback-tools",
  "sentry-user-feedback",
  "userback",
  "usersnap",
];
const verifiedDate = "2026-08-14";
const allowedHosts = new Set([
  "bugherd.com",
  "canny.io",
  "docs.sentry.io",
  "github.com",
  "help.canny.io",
  "help.marker.io",
  "jam.dev",
  "marker.io",
  "www.markup.io",
  "support.bugherd.com",
  "userback.io",
  "usersnap.com",
]);

const args = process.argv.slice(2);
const baseArg = args.find((arg) => arg.startsWith("--base-url="));
const baseUrl = baseArg?.slice("--base-url=".length).replace(/\/$/, "");
const checkSources = args.includes("--check-sources");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const data = JSON.parse(
  await readFile("src/components/comparison/comparison-data.json", "utf8"),
);
const slugs = data.map((entry) => entry.slug).sort();
assert(JSON.stringify(slugs) === JSON.stringify(expectedSlugs), `Expected exactly nine comparison records; got ${slugs.join(", ")}`);

const contentFiles = (await readdir("src/content/compare"))
  .filter((file) => file.endsWith(".mdx"))
  .map((file) => file.replace(/\.mdx$/, ""))
  .sort();
assert(JSON.stringify(contentFiles) === JSON.stringify(expectedSlugs), `Comparison content inventory drifted: ${contentFiles.join(", ")}`);

const headings = new Set();
const sourceUrls = new Set();
const globalSourceIds = new Set();
const globalClaimIds = new Set();
const expansionSlugs = new Set(["jam-dev", "markup-io"]);
const intentQueries = new Set();
for (const entry of data) {
  assert(entry.verifiedDate === verifiedDate, `${entry.slug}: verification date must be ${verifiedDate}`);
  assert(typeof entry.publisher === "string" && entry.publisher.trim().length >= 3, `${entry.slug}: missing publisher`);
  for (const field of ["reviewMethod", "researchBasis", "summary", "bugdropWins", "competitorWins", "bugdropLimitation"]) {
    assert(typeof entry[field] === "string" && entry[field].trim().length >= 12, `${entry.slug}: missing substantive ${field}`);
  }
  assert(!("author" in entry) && !("reviewer" in entry), `${entry.slug}: pseudo-author/reviewer fields must not return`);
  assert(entry.publisher === "BugDrop", `${entry.slug}: publisher must truthfully identify BugDrop`);
  assert(/documentation review/i.test(entry.reviewMethod), `${entry.slug}: review method must describe documentation review`);
  assert(/no hands-on/i.test(entry.researchBasis), `${entry.slug}: research basis must disclaim hands-on competitor testing`);
  if (expansionSlugs.has(entry.slug)) {
    const intent = entry.intentEvidence;
    assert(intent?.observedDate === verifiedDate, `${entry.slug}: live intent evidence must be dated ${verifiedDate}`);
    assert(typeof intent.query === "string" && /alternative/i.test(intent.query), `${entry.slug}: missing distinct alternative query owner`);
    assert(!intentQueries.has(intent.query.toLowerCase()), `${entry.slug}: duplicate expansion query owner ${intent.query}`);
    intentQueries.add(intent.query.toLowerCase());
    assert(Array.isArray(intent.resultUrls) && intent.resultUrls.length >= 2, `${entry.slug}: needs at least two current live-intent result URLs`);
    for (const resultUrl of intent.resultUrls) assert(new URL(resultUrl).protocol === "https:", `${entry.slug}: intent evidence URL must use HTTPS`);
    assert(typeof intent.rationale === "string" && intent.rationale.length >= 80, `${entry.slug}: intent evidence needs a substantive distinct-owner rationale`);
  } else {
    assert(!("intentEvidence" in entry), `${entry.slug}: existing evidence record changed shape during expansion`);
  }
  assert(entry.sources.length >= 2, `${entry.slug}: needs at least two visible primary sources`);
  assert(entry.sources.some((source) => !source.url.includes("mean-weasel/bugdrop")), `${entry.slug}: needs an independent product/project source`);
  const claimToSource = new Map();
  for (const source of entry.sources) {
    assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(source.id), `${entry.slug}: invalid source id ${source.id}`);
    assert(!globalSourceIds.has(source.id), `${entry.slug}: duplicate source id ${source.id}`);
    globalSourceIds.add(source.id);
    const url = new URL(source.url);
    assert(url.protocol === "https:", `${entry.slug}: source must use HTTPS: ${source.url}`);
    assert(allowedHosts.has(url.hostname), `${entry.slug}: source host is not approved as first-party: ${url.hostname}`);
    assert(source.supports.length >= 24, `${entry.slug}: source support note is too vague: ${source.label}`);
    assert(Array.isArray(source.claimIds) && source.claimIds.length > 0, `${entry.slug}: ${source.id} has no claim IDs`);
    for (const claimId of source.claimIds) {
      assert(/^[A-Z]{2}-\d{2}$/.test(claimId), `${entry.slug}: invalid claim id ${claimId}`);
      assert(!globalClaimIds.has(claimId), `${entry.slug}: duplicate claim id ${claimId}`);
      globalClaimIds.add(claimId);
      claimToSource.set(claimId, source.id);
    }
    sourceUrls.add(source.url);
  }

  const decisionClaimIds = new Set();
  for (const field of ["summary", "bugdropWins", "competitorWins", "bugdropLimitation"]) {
    const refs = entry.claimRefs?.[field];
    assert(Array.isArray(refs) && refs.length > 0, `${entry.slug}: ${field} has no claim mapping`);
    for (const claimId of refs) {
      assert(claimToSource.has(claimId), `${entry.slug}: ${field} references unmapped claim ${claimId}`);
      decisionClaimIds.add(claimId);
    }
  }

  const mdx = await readFile(`src/content/compare/${entry.slug}.mdx`, "utf8");
  const h1 = mdx.match(/^# (.+)$/m)?.[1];
  assert(h1, `${entry.slug}: missing H1`);
  assert(!headings.has(h1), `${entry.slug}: duplicate H1 ${h1}`);
  headings.add(h1);
  assert(/## Quick comparison|## Shortlist by job/.test(mdx), `${entry.slug}: missing decision table section`);
  assert(/\|---\|/.test(mdx), `${entry.slug}: missing comparison table`);
  const contentClaimIds = new Set();
  const claimReferencePattern = /\[([A-Z]{2}-\d{2})\]\(#source-([a-z0-9]+(?:-[a-z0-9]+)*) "Claim ([A-Z]{2}-\d{2})"\)/g;
  for (const match of mdx.matchAll(claimReferencePattern)) {
    const [, labelId, sourceId, titleId] = match;
    assert(labelId === titleId, `${entry.slug}: claim label/title mismatch ${labelId}/${titleId}`);
    assert(claimToSource.has(labelId), `${entry.slug}: content references unmapped claim ${labelId}`);
    assert(claimToSource.get(labelId) === sourceId, `${entry.slug}: ${labelId} points to ${sourceId}, expected ${claimToSource.get(labelId)}`);
    contentClaimIds.add(labelId);
  }
  const tableRows = mdx.split("\n").filter((line) => /^\|/.test(line) && !/^\|---/.test(line));
  assert(tableRows.length >= 4, `${entry.slug}: comparison table must contain a header and material rows`);
  for (const row of tableRows.slice(1)) {
    assert(/ "Claim [A-Z]{2}-\d{2}"\)/.test(row), `${entry.slug}: table row lacks a claim-to-source reference: ${row}`);
  }
  for (const claimId of claimToSource.keys()) {
    assert(contentClaimIds.has(claimId), `${entry.slug}: orphan claim ${claimId} is not cited by content`);
    assert(decisionClaimIds.has(claimId), `${entry.slug}: orphan claim ${claimId} is not mapped to a decision field`);
  }
  assert(!/\$\s?\d|per month|\/mo\b/i.test(mdx), `${entry.slug}: numeric or recurring pricing claim requires separate current-price review`);
  assert(!/we (tested|used|tried)|our testing|hands-on test/i.test(mdx), `${entry.slug}: unsupported first-hand testing language`);
}

const shell = await readFile("src/components/comparison/comparison-shell.tsx", "utf8");
for (const marker of ["Publisher:", "Review method:", "Last verified", "Research basis:", "BugDrop wins when", "The alternative wins when", "BugDrop limitation", "Claim IDs:", "Sources", 'href="/demo"', 'href="/docs/installation"']) {
  assert(shell.includes(marker), `Reusable presentation is missing: ${marker}`);
}

const sentryData = data.find((entry) => entry.slug === "sentry-user-feedback");
const sentryMdx = await readFile("src/content/compare/sentry-user-feedback.mdx", "utf8");
const sentryConfig = sentryData.sources.find((source) => source.id === "sentry-feedback-config");
assert(sentryConfig?.claimIds.includes("SE-01"), "Sentry configuration source must own SE-01");
for (const marker of ["screenshot", "Highlight", "Hide", "10.10.0+"]) {
  assert(sentryConfig.supports.includes(marker), `Sentry configuration support note missing ${marker}`);
  assert(sentryMdx.includes(marker), `Sentry comparison missing ${marker}`);
}

if (baseUrl) {
  for (const entry of data) {
    const response = await fetch(`${baseUrl}/compare/${entry.slug}`, { redirect: "manual" });
    assert(response.status === 200, `${entry.slug}: rendered route returned ${response.status}`);
    const html = await response.text();
    for (const marker of ["Publisher:", "Review method:", "Last verified", "Research basis:", "BugDrop wins when", "The alternative wins when", "BugDrop limitation", "Claim IDs:", "Sources", "/demo", "/docs/installation"]) {
      assert(html.includes(marker), `${entry.slug}: rendered page missing ${marker}`);
    }
    for (const source of entry.sources) {
      assert(html.includes(source.url.replaceAll("&", "&amp;")), `${entry.slug}: rendered page missing source ${source.url}`);
      assert(html.includes(`id="source-${source.id}"`), `${entry.slug}: rendered page missing source anchor ${source.id}`);
      for (const claimId of source.claimIds) assert(html.includes(claimId), `${entry.slug}: rendered page missing claim ID ${claimId}`);
    }
  }
}

if (checkSources) {
  for (const url of sourceUrls) {
    const response = await fetch(url, {
      redirect: "follow",
      headers: { "user-agent": "Mozilla/5.0 BugDrop source audit (+https://bugdrop.dev)" },
      signal: AbortSignal.timeout(20_000),
    });
    assert(response.status < 400, `Source is not currently reachable (${response.status}): ${url}`);
  }
}

console.log(JSON.stringify({
  contract: "comparison-content",
  comparisonPages: data.length,
  verifiedDate,
  uniqueSources: sourceUrls.size,
  mappedClaims: globalClaimIds.size,
  expansionPages: expansionSlugs.size,
  distinctExpansionQueries: intentQueries.size,
  rendered: Boolean(baseUrl),
  sourcesChecked: checkSources,
}, null, 2));
