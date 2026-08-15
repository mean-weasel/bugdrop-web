#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const reportPaths = args
  .filter((arg) => arg.startsWith("--reports=") || arg.startsWith("--report="))
  .flatMap((arg) => arg.slice(arg.indexOf("=") + 1).split(","))
  .filter(Boolean);
const baselineReportPaths = args
  .filter((arg) => arg.startsWith("--baseline-reports="))
  .flatMap((arg) => arg.slice(arg.indexOf("=") + 1).split(","))
  .filter(Boolean);
const outputPath = args.find((arg) => arg.startsWith("--output="))?.slice(9);

if (reportPaths.length < 3) {
  console.error("Provide at least three Lighthouse JSON files with --reports=one.json,two.json,three.json.");
  process.exit(1);
}

const budgets = {
  performanceScoreMinimum: 90,
  accessibilityScoreMinimum: 100,
  seoScoreMinimum: 100,
  largestContentfulPaintMaximumMs: 3500,
  cumulativeLayoutShiftMaximum: 0.05,
  totalBlockingTimeMaximumMs: 100,
  totalTransferMaximumBytes: 475_000,
  scriptTransferMaximumBytes: 275_000,
  thirdPartyTransferMaximumBytes: 90_000,
  initialYouTubeRequestsMaximum: 0,
  initialProductHuntRequestsMaximum: 0,
};

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
}

function networkSummary(report) {
  const targetHost = new URL(report.finalDisplayedUrl ?? report.finalUrl).hostname;
  const requests = report.audits["network-requests"]?.details?.items ?? [];
  const isThirdParty = (request) => {
    try {
      return new URL(request.url).hostname !== targetHost;
    } catch {
      return false;
    }
  };
  const matchesHost = (request, pattern) => {
    try {
      return pattern.test(new URL(request.url).hostname);
    } catch {
      return false;
    }
  };

  return {
    scriptTransferBytes: requests
      .filter((request) => request.resourceType === "Script")
      .reduce((sum, request) => sum + (request.transferSize ?? 0), 0),
    thirdPartyTransferBytes: requests
      .filter(isThirdParty)
      .reduce((sum, request) => sum + (request.transferSize ?? 0), 0),
    initialYouTubeRequests: requests.filter((request) =>
      matchesHost(request, /(^|\.)(youtube(?:-nocookie)?\.com|googlevideo\.com|ytimg\.com)$/),
    ).length,
    initialProductHuntRequests: requests.filter((request) =>
      matchesHost(request, /(^|\.)producthunt\.com$/),
    ).length,
  };
}

function summarize(reportPath) {
  const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
  const network = networkSummary(report);
  return {
    path: path.resolve(reportPath),
    lighthouseVersion: report.lighthouseVersion,
    requestedUrl: report.requestedUrl,
    finalDisplayedUrl: report.finalDisplayedUrl ?? report.finalUrl,
    formFactor: report.configSettings?.formFactor,
    throttlingMethod: report.configSettings?.throttlingMethod,
    screenEmulation: report.configSettings?.screenEmulation,
    throttling: report.configSettings?.throttling,
    performanceScore: (report.categories.performance.score ?? 0) * 100,
    accessibilityScore: (report.categories.accessibility.score ?? 0) * 100,
    seoScore: (report.categories.seo.score ?? 0) * 100,
    largestContentfulPaintMs: report.audits["largest-contentful-paint"].numericValue,
    cumulativeLayoutShift: report.audits["cumulative-layout-shift"].numericValue,
    totalBlockingTimeMs: report.audits["total-blocking-time"].numericValue,
    totalTransferBytes: report.audits["total-byte-weight"].numericValue,
    ...network,
  };
}

const runs = reportPaths.map(summarize);
const comparisonKey = (run) => JSON.stringify({
  requestedUrl: run.requestedUrl,
  formFactor: run.formFactor,
  throttlingMethod: run.throttlingMethod,
  screenEmulation: run.screenEmulation,
  throttling: run.throttling,
});
const comparable = runs.every((run) => comparisonKey(run) === comparisonKey(runs[0]));

const metricNames = [
  "performanceScore",
  "accessibilityScore",
  "seoScore",
  "largestContentfulPaintMs",
  "cumulativeLayoutShift",
  "totalBlockingTimeMs",
  "totalTransferBytes",
  "scriptTransferBytes",
  "thirdPartyTransferBytes",
  "initialYouTubeRequests",
  "initialProductHuntRequests",
];
const medians = Object.fromEntries(
  metricNames.map((metric) => [metric, median(runs.map((run) => run[metric]))]),
);
const baselineRuns = baselineReportPaths.map(summarize);
const baselineMedians = baselineRuns.length
  ? Object.fromEntries(
      metricNames.map((metric) => [metric, median(baselineRuns.map((run) => run[metric]))]),
    )
  : null;
const changeFromBaseline = baselineMedians
  ? Object.fromEntries(
      metricNames.map((metric) => [metric, medians[metric] - baselineMedians[metric]]),
    )
  : null;

const checks = [
  { name: "comparable mobile configurations", pass: comparable && runs[0].formFactor === "mobile" },
  { name: "median performance score", pass: medians.performanceScore >= budgets.performanceScoreMinimum },
  { name: "every accessibility score", pass: runs.every((run) => run.accessibilityScore >= budgets.accessibilityScoreMinimum) },
  { name: "every SEO score", pass: runs.every((run) => run.seoScore >= budgets.seoScoreMinimum) },
  { name: "median LCP", pass: medians.largestContentfulPaintMs <= budgets.largestContentfulPaintMaximumMs },
  { name: "median CLS", pass: medians.cumulativeLayoutShift <= budgets.cumulativeLayoutShiftMaximum },
  { name: "median TBT", pass: medians.totalBlockingTimeMs <= budgets.totalBlockingTimeMaximumMs },
  { name: "median total transfer", pass: medians.totalTransferBytes <= budgets.totalTransferMaximumBytes },
  { name: "median script transfer", pass: medians.scriptTransferBytes <= budgets.scriptTransferMaximumBytes },
  { name: "median third-party transfer", pass: medians.thirdPartyTransferBytes <= budgets.thirdPartyTransferMaximumBytes },
  { name: "no initial YouTube request", pass: runs.every((run) => run.initialYouTubeRequests <= budgets.initialYouTubeRequestsMaximum) },
  { name: "no initial Product Hunt request", pass: runs.every((run) => run.initialProductHuntRequests <= budgets.initialProductHuntRequestsMaximum) },
];

const result = {
  methodology: {
    evidenceType: "throttled mobile Lighthouse lab measurements",
    fieldDataStatus: "Not field Core Web Vitals. These local synthetic results must not be presented as real-user or CrUX data.",
    aggregation: `Median of ${runs.length} comparable runs; accessibility, SEO, and initial third-party request gates must pass in every run.`,
    baselineComparison: baselineRuns.length
      ? `Compared with ${baselineRuns.length} pre-change runs using the same synthetic configuration. Differences remain lab deltas, not field trends.`
      : "No pre-change reports supplied.",
  },
  budgets,
  medians,
  runs,
  baseline: baselineRuns.length
    ? { medians: baselineMedians, runs: baselineRuns, changeToCandidate: changeFromBaseline }
    : null,
  checks,
  passed: checks.every((check) => check.pass),
};

const serialized = `${JSON.stringify(result, null, 2)}\n`;
if (outputPath) fs.writeFileSync(outputPath, serialized);
process.stdout.write(serialized);

if (!result.passed) process.exit(1);
