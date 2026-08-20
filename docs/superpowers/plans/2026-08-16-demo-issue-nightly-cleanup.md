# Demo Issue Nightly Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a fail-closed nightly workflow to `mean-weasel/bugdrop-widget-test` that closes only BugDrop homepage demo Issues older than 24 hours while preserving their URLs.

**Architecture:** A testable Node script owns eligibility, pagination, dry-run reporting, and bounded mutation. A scheduled/manual GitHub Actions wrapper supplies exact inputs and least-privilege credentials; selection logic never lives in shell.

**Tech Stack:** Node.js 24 built-in test runner/fetch, GitHub REST API, GitHub Actions.

## Global Constraints

- Repository is exactly `mean-weasel/bugdrop-widget-test`.
- Close Issues; never delete them.
- Require open state, age ≥24 hours, BugDrop App author, `bugdrop` label, and exact metadata `| **Page** | https://bugdrop.dev/ |`.
- Never select heartbeat/canary Issues, pull requests, or unrelated Issues.
- Add the pre-created `expired-demo` label after closing.
- Manual dispatch defaults to `dry_run=true`.
- Automatic schedule is gated by repository variable `HOMEPAGE_DEMO_CLEANUP_ENABLED=true`, set only after separately authorized bounded proof.
- Process at most 100 eligible Issues; stop before mutation if exceeded.
- No implementation, PR, or dry-run approval authorizes live mutation.

---

## File Map

| Path | Responsibility |
|---|---|
| `scripts/cleanup-homepage-demo-issues.mjs` | Eligibility, API reads, dry run, close/label operations. |
| `test/cleanup-homepage-demo-issues.test.mjs` | Boundary, exclusions, pagination, and mutation tests. |
| `test/cleanup-workflow-contract.test.mjs` | Trigger, permissions, inputs, and no-delete contract. |
| `.github/workflows/cleanup-homepage-demo-issues.yml` | Nightly/manual entrypoint. |
| `README.md` | Policy, setup, dry run, recovery, disablement. |

### Task 1: Implement exact eligibility

**Files:**
- Create: `scripts/cleanup-homepage-demo-issues.mjs`
- Create: `test/cleanup-homepage-demo-issues.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `isEligibleHomepageDemoIssue(issue, nowMs, cutoffHours)` and `selectEligibleHomepageDemoIssues(...)`.

- [ ] **Step 1: Write failing boundary tests**

```js
import assert from "node:assert/strict";
import test from "node:test";
import { isEligibleHomepageDemoIssue } from "../scripts/cleanup-homepage-demo-issues.mjs";

const now = Date.parse("2026-08-17T12:00:00Z");
const eligible = {
  number: 900,
  state: "open",
  created_at: "2026-08-16T11:59:59Z",
  user: { login: "neonwatty-bugdrop[bot]", type: "Bot" },
  labels: [{ name: "bugdrop" }, { name: "bug" }],
  body: "| **Page** | https://bugdrop.dev/ |",
  title: "Homepage demo report",
};

test("accepts an exact homepage demo older than 24 hours", () => {
  assert.equal(isEligibleHomepageDemoIssue(eligible, now, 24), true);
});
```

Add table tests that reject: closed, one millisecond too new, wrong author, missing `bugdrop`, wrong Page, pull request, invalid timestamp, heartbeat prefix, and CI-canary prefix.

- [ ] **Step 2: Confirm failure**

Run `node --test test/cleanup-homepage-demo-issues.test.mjs`.

Expected: FAIL because the script is absent.

- [ ] **Step 3: Implement pure eligibility**

```js
export const HOMEPAGE_MARKER = "| **Page** | https://bugdrop.dev/ |";
export const BUGDROP_AUTHORS = new Set([
  "neonwatty-bugdrop[bot]",
  "app/neonwatty-bugdrop",
]);
export const EXCLUDED_TITLE_PREFIXES = [
  "[BugDrop production heartbeat]",
  "[BugDrop CI canary]",
];
```

Require all global constraints, parse time fail-closed, and return candidates sorted by Issue number.

- [ ] **Step 4: Add test script and verify**

Add:

```json
"test:cleanup": "node --test test/cleanup-homepage-demo-issues.test.mjs test/cleanup-workflow-contract.test.mjs"
```

Run `npm run test:cleanup` (the missing workflow contract file may be omitted from the script until Task 3).

- [ ] **Step 5: Commit**

```bash
git add scripts/cleanup-homepage-demo-issues.mjs test/cleanup-homepage-demo-issues.test.mjs package.json package-lock.json
git commit -m "feat: identify expired homepage demo issues"
```

### Task 2: Add dry-run and bounded mutation

**Files:**
- Modify: `scripts/cleanup-homepage-demo-issues.mjs`
- Modify: `test/cleanup-homepage-demo-issues.test.mjs`

**Interfaces:**
- Produces: `runCleanup({ repository, token, dryRun, cutoffHours, nowMs, fetchImpl, maxEligible })` and JSON summary.

- [ ] **Step 1: Write failing orchestration tests**

Using injected fake fetch, prove:

- pagination follows only authenticated `api.github.com` next links;
- dry run performs GET only and reports sorted candidates;
- live mode PATCHes `{state:"closed",state_reason:"not_planned"}`, then POSTs `{"labels":["expired-demo"]}`;
- label failure after close is explicit and nonzero;
- >100 candidates causes zero mutation and nonzero exit;
- malformed API JSON causes zero mutation;
- rerunning after closure is idempotent.

- [ ] **Step 2: Confirm failure**

Run `npm run test:cleanup`.

- [ ] **Step 3: Implement the client and CLI**

Export `runCleanup(options)` where `options` has the exact fields `repository`, `token`, `dryRun`, `cutoffHours = 24`, `nowMs = Date.now()`, `fetchImpl = fetch`, and `maxEligible = 100`.

Require the exact repository. GET open Issues filtered by `bugdrop`, follow safe pagination, select before mutation, refuse over-cap batches, and mutate sequentially with no automatic retry. Parse only `--repository`, `--dry-run=true|false`, `--cutoff-hours`, and `--max-eligible`. Write `{mode,repository,cutoff,scanned,eligible,closed,failed}` to stdout and `$GITHUB_STEP_SUMMARY`.

- [ ] **Step 4: Verify and commit**

```bash
npm run test:cleanup
npm run lint
npm run build
git add scripts/cleanup-homepage-demo-issues.mjs test/cleanup-homepage-demo-issues.test.mjs
git commit -m "feat: close expired homepage demo issues"
```

### Task 3: Add the least-privilege workflow and runbook

**Files:**
- Create: `.github/workflows/cleanup-homepage-demo-issues.yml`
- Create: `test/cleanup-workflow-contract.test.mjs`
- Modify: `package.json`
- Modify: `README.md`

**Interfaces:**
- Consumes: Task 2 CLI and existing `expired-demo` label.
- Produces: nightly live entrypoint and manual dry-run entrypoint.

- [ ] **Step 1: Write the failing workflow contract**

Require exact cron `23 4 * * *`, manual `dry_run` default true, permissions only `contents: read`/`issues: write`, constant concurrency with no cancellation, exact repo/cutoff/cap, the exact schedule gate `HOMEPAGE_DEMO_CLEANUP_ENABLED == 'true'`, and absence of push/PR/merge-group/Issue triggers or delete commands.

- [ ] **Step 2: Confirm failure**

Run `node --test test/cleanup-workflow-contract.test.mjs`.

- [ ] **Step 3: Create the workflow**

```yaml
name: Cleanup homepage demo Issues
on:
  schedule:
    - cron: "23 4 * * *"
  workflow_dispatch:
    inputs:
      dry_run:
        description: Report candidates without closing them
        required: true
        default: true
        type: boolean
permissions:
  contents: read
  issues: write
concurrency:
  group: homepage-demo-issue-cleanup
  cancel-in-progress: false
jobs:
  cleanup:
    if: github.event_name == 'workflow_dispatch' || vars.HOMEPAGE_DEMO_CLEANUP_ENABLED == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm run test:cleanup
      - name: Cleanup expired homepage demo Issues
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: >-
          node scripts/cleanup-homepage-demo-issues.mjs
          --repository=mean-weasel/bugdrop-widget-test
          --cutoff-hours=24
          --max-eligible=100
          --dry-run=${{ github.event_name == 'schedule' && 'false' || inputs.dry_run }}
```

- [ ] **Step 4: Document setup and recovery**

README must include exact eligibility, 24-hour policy, one-time `expired-demo` label creation, the default-disabled `HOMEPAGE_DEMO_CLEANUP_ENABLED` variable, manual dry-run, first-live-run authorization requirement, close-without-label partial-failure recovery, and workflow disablement. Never advise blind rerun.

- [ ] **Step 5: Verify strongest failure mode**

```bash
npm run test:cleanup
npm run lint
npm run build
git diff --check
```

Feed a 25-hour-old heartbeat Issue containing the homepage marker into the real selector and prove rejection; feed a normal homepage Issue into dry-run and prove zero PATCH/POST.

- [ ] **Step 6: Commit**

```bash
git add .github/workflows/cleanup-homepage-demo-issues.yml test/cleanup-workflow-contract.test.mjs package.json package-lock.json README.md
git commit -m "ci: clean up expired homepage demo issues"
```

### Task 4: Separately authorize operational rollout

**Files:**
- No code changes expected.

**Interfaces:**
- Produces: one dry-run proof, one separately authorized live proof, and scheduled-run observation.

- [ ] **Step 1: Create or verify the label**

After explicit authority only:

```bash
gh label create expired-demo --repo mean-weasel/bugdrop-widget-test --color 6e7781 --description "Closed automatically after the public homepage demo retention window"
```

If present, inspect only; do not alter without authority.

- [ ] **Step 2: Dispatch one dry run**

```bash
gh workflow run cleanup-homepage-demo-issues.yml --repo mean-weasel/bugdrop-widget-test --ref main -f dry_run=true
```

Verify terminal success, exact candidates, no mutation, and no overlap.

- [ ] **Step 3: Request live authority**

Present exact workflow/ref, cutoff, candidate numbers, and planned close/label mutations. Do not infer authority.

- [ ] **Step 4: Run one bounded live proof if authorized**

Dispatch once with `dry_run=false`, monitor to terminal, verify each candidate closed/labeled, and verify controls unchanged. No rerun or repair is included.

- [ ] **Step 5: Observe one scheduled run**

After separate authority, set `HOMEPAGE_DEMO_CLEANUP_ENABLED=true`. Confirm the next schedule uses identical code/constraints, respects the cap, and emits an authoritative summary before declaring the website cleanup dependency ready. Disable the variable immediately on drift or an ambiguous result.

## Final Review Checklist

- [ ] Exact 24-hour boundary and all selectors tested.
- [ ] Dry run is read-only and manual-default.
- [ ] Schedule is the only automatic live path.
- [ ] No delete or unrelated mutation exists.
- [ ] Safety cap stops before mutation.
- [ ] Partial failures are explicit and non-retrying.
- [ ] First dry run and live proof remain separately authorized.
- [ ] Run the PR review toolkit before merge if repository instructions require it.
