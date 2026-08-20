# Homepage Multi-Flow Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preserve a focused floating Classic feedback action while adding a website-owned “Design your flow” showcase for Classic and three differentiated composable feedback flows.

**Architecture:** A client controller owns one lazy-loaded BugDrop runtime, a direct floating Classic launcher, the in-page customization picker, and the active Classic or Flow handle. The SDK trigger is suppressed with `data-button="false"`; Classic calls `BugDrop.open()` from either launcher. Bug Report wraps the checksum-pinned canonical recipe, while two small website-owned FlowConfigs demonstrate different combinations of the same public SDK primitives. All homepage Flows opt into a 500ms horizontal transition without changing the SDK default.

**Tech Stack:** Next.js 16.3 App Router, React 19, TypeScript, Tailwind CSS, Vitest, Playwright 1.62, GitHub Actions.

## Global Constraints

- General Feedback · Classic is first and selected initially.
- Other exact labels: Bug Report, Quick Rating, Feature Request.
- All five target `mean-weasel/bugdrop-widget-test` and show real Issue links in production.
- The showcase is website-only; never change SDK defaults or customer widget behavior.
- Disable the SDK trigger; only the website launcher is visible.
- Preserve the canonical Bug Report contract and define the two additional composable examples only from public FlowConfig primitives. Keep every configuration immutable, explicitly tested, and local to the hidden homepage dogfood surface.
- Classic remains a separate implementation and test path.
- Runtime loading remains interaction-triggered and deduplicated.
- Every floating launcher click directly opens Classic; the last section choice remains highlighted independently.
- Local, PR, and merge-group tests must not create real Issues.
- Browser-facing local URLs use `bugdrop.localhost`.
- User-approved local desktop/mobile visual QA is required before PR readiness.
- Cleanup in `bugdrop-widget-test` must be live-verified before production enablement.
- `NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO_ENABLED` remains off by default and must not be enabled publicly until cleanup, deployed-preview, review, and separately authorized canary evidence is complete.
- An enabled showcase requires an explicit runtime selected by one shared source/CSP policy: exact public `https://bugdrop.neonwatty.workers.dev/widget.v1.56.3.js`, the exact root-relative authenticated fixture, or its exact `http://bugdrop.localhost:3000` absolute form with hostname case equivalence only. Missing, mutable, wrong-version, unsafe, and normalized-alias values fail closed. Feature-off/unset Classic retains its mutable `widget.js` default.
- Read the installed Next.js Script, scripts guide, and Server/Client Component docs before implementation.

---

## File Map

> **Dogfood refinement:** The implementation exposes exactly four examples in the “Design your flow” section—Classic, Bug Report, Quick Rating, and Feature Request—while the floating launcher directly opens Classic. The current source, specification, and operations guide remain authoritative for exact behavior and rollout contracts.

| Path | Responsibility |
|---|---|
| `scripts/vendor-homepage-flow-recipes.mjs` | Verify and transform a pinned SDK recipe fixture. |
| `src/components/landing/flow-recipes-source/a100e69976ce0a5912df8f07af1b2e53029663b2/*` | Byte-exact source and provenance. |
| `src/components/landing/homepage-flow-recipes.generated.ts` | Generated recipes used by the homepage. |
| `src/components/landing/homepage-flow-demo-recipes.ts` | Bounded presentation/copy overlay that preserves canonical recipe invariants. |
| `public/vendor/bugdrop/47a392d1e7b1a8d8adeff1692f6bbbd84696280d/*` | Exact v1.56.3 runtime: 238591 bytes, SHA-256 `338cdb5b19c69dc3429fdcb8f800e3b98a3bdd442fee78563523cd731e2bdf0e`. |
| `src/components/landing/homepage-demo-model.ts` | IDs, copy, and pure state transitions. |
| `src/components/landing/homepage-demo-runtime.ts` | Lazy loading, registration, and launch routing. |
| `src/components/landing/homepage-demo-launcher.tsx` | Direct floating feedback launcher. |
| `src/components/landing/homepage-widget.tsx` | Shared ownership and “Design your flow” picker. |
| `test/homepage-*.test.ts` | Provenance/model/runtime contracts. |
| `e2e/homepage-flow-demo.spec.ts` | Five independent browser journeys and lifecycle proof. |
| `.github/workflows/ci.yml` | Additive PR/merge-group browser gate. |
| `docs/homepage-flow-demo-operations.md` | Enablement, canary, visual QA, and rollback. |

### Task 1: Pin the canonical recipes and exact test runtime

**Files:**
- Create: `scripts/vendor-homepage-flow-recipes.mjs`
- Create: `src/components/landing/flow-recipes-source/a100e69976ce0a5912df8f07af1b2e53029663b2/flow-recipes.ts.txt`
- Create: `src/components/landing/flow-recipes-source/a100e69976ce0a5912df8f07af1b2e53029663b2/PROVENANCE.json`
- Create: `src/components/landing/homepage-flow-recipes.generated.ts`
- Create: `src/components/landing/homepage-flow-demo-recipes.ts`
- Create: `test/homepage-flow-recipes.test.ts`
- Create: `test/homepage-flow-demo-recipes.test.ts`
- Create: `public/vendor/bugdrop/47a392d1e7b1a8d8adeff1692f6bbbd84696280d/widget.js`
- Create: `public/vendor/bugdrop/47a392d1e7b1a8d8adeff1692f6bbbd84696280d/PROVENANCE.json`

**Interfaces:**
- Consumes: recipe source commit `a100e69976ce0a5912df8f07af1b2e53029663b2` and released runtime v1.56.3 target `47a392d1e7b1a8d8adeff1692f6bbbd84696280d`.
- Produces: authenticated generated recipe inputs, the four-entry `homepageFlowDemoRecipes`/`homepageFlowDemoRecipeList` overlay, and an exact local runtime path.

- [ ] **Step 1: Authenticate source bytes**

```bash
sdk_root=/absolute/path/to/bugdrop
git -C "$sdk_root" fetch origin main
sdk_sha=$(git -C "$sdk_root" rev-parse origin/main)
git -C "$sdk_root" merge-base --is-ancestor 47a392d1e7b1a8d8adeff1692f6bbbd84696280d "$sdk_sha"
git -C "$sdk_root" show "$sdk_sha:test/fixtures/flow-recipes.ts" > /tmp/flow-recipes.ts
shasum -a 256 /tmp/flow-recipes.ts
wc -c /tmp/flow-recipes.ts
```

The recipe source must be 8,537 bytes with SHA-256 `ca205013c47e14cb37cc6f763439922a448d5d06c569940a8b08fc4364b0372d`. Download `https://github.com/mean-weasel/bugdrop/releases/download/v1.56.3/widget.v1.56.3.js`; it must be 238591 bytes with SHA-256 `338cdb5b19c69dc3429fdcb8f800e3b98a3bdd442fee78563523cd731e2bdf0e`. Record both identities in provenance and stop on drift.

- [ ] **Step 2: Write the failing provenance test**

```ts
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { expect, it } from "vitest";
import { HOMEPAGE_FLOW_RECIPE_SOURCE }
  from "@/components/landing/homepage-flow-recipes.generated";
import { homepageFlowDemoRecipeList }
  from "@/components/landing/homepage-flow-demo-recipes";

it("pins the recipe source and exposes the three current homepage Flows", async () => {
  const source = await readFile(HOMEPAGE_FLOW_RECIPE_SOURCE.localPath);
  expect(source.byteLength).toBe(HOMEPAGE_FLOW_RECIPE_SOURCE.byteLength);
  expect(createHash("sha256").update(source).digest("hex"))
    .toBe(HOMEPAGE_FLOW_RECIPE_SOURCE.sha256);
  expect(homepageFlowDemoRecipeList.map(({ id }) => id)).toEqual([
    "bug-report", "quick-rating", "feature-request",
  ]);
});
```

- [ ] **Step 3: Confirm failure**

Run `npx vitest run test/homepage-flow-recipes.test.ts`.

Expected: FAIL because generated artifacts do not exist.

- [ ] **Step 4: Implement deterministic generation**

The script accepts `--source`, `--source-sha`, and one of `--write|--check`. It must verify provenance, remove only the SDK type-only import, prepend local structural `HomepageFlowConfig`/`HomepageFlowOpenOptions` types, rename exports to the homepage names above, and emit a frozen source-provenance constant. `--check` generates in memory and exits nonzero unless output is byte-identical. Build the immutable homepage overlay from the canonical Bug Report plus website-owned Quick Rating and Feature Request FlowConfigs, all using only public SDK primitives.

Generated structural types:

```ts
type HomepageFlowConfig = {
  readonly configVersion: 1;
  readonly id: string;
  readonly [key: string]: unknown;
};
type HomepageFlowOpenOptions = {
  readonly context?: Readonly<Record<string, string | number | boolean>>;
};
```

- [ ] **Step 5: Generate and verify**

```bash
node scripts/vendor-homepage-flow-recipes.mjs --source src/components/landing/flow-recipes-source/a100e69976ce0a5912df8f07af1b2e53029663b2/flow-recipes.ts.txt --source-sha a100e69976ce0a5912df8f07af1b2e53029663b2 --write
node scripts/vendor-homepage-flow-recipes.mjs --source src/components/landing/flow-recipes-source/a100e69976ce0a5912df8f07af1b2e53029663b2/flow-recipes.ts.txt --source-sha a100e69976ce0a5912df8f07af1b2e53029663b2 --check
npx vitest run test/homepage-flow-recipes.test.ts
npx vitest run test/homepage-flow-demo-recipes.test.ts
npm run build
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add scripts/vendor-homepage-flow-recipes.mjs src/components/landing/flow-recipes-source src/components/landing/homepage-flow-recipes.generated.ts src/components/landing/homepage-flow-demo-recipes.ts public/vendor/bugdrop/47a392d1e7b1a8d8adeff1692f6bbbd84696280d test/homepage-flow-recipes.test.ts test/homepage-flow-demo-recipes.test.ts
git commit -m "test: pin homepage flow recipes"
```

### Task 2: Build the pure experience model

**Files:**
- Create: `src/components/landing/homepage-demo-model.ts`
- Create: `test/homepage-demo-model.test.ts`

**Interfaces:**
- Consumes: the three current homepage Flow IDs/labels.
- Produces: `HomepageExperienceId`, `HomepageDemoState`, `homepageExperiences`, `initialHomepageDemoState`, `reduceHomepageDemo`.

- [ ] **Step 1: Write failing tests**

```ts
expect(homepageExperiences.map(({ id, label }) => ({ id, label }))).toEqual([
  { id: "classic", label: "General Feedback" },
  { id: "bug-report", label: "Bug Report" },
  { id: "quick-rating", label: "Quick Rating" },
  { id: "feature-request", label: "Feature Request" },
]);
const selected = reduceHomepageDemo(initialHomepageDemoState,
  { type: "select", id: "feature-request" });
const settled = reduceHomepageDemo(
  reduceHomepageDemo(selected, { type: "launch" }),
  { type: "settled" },
);
expect(settled).toMatchObject({ selectedId: "feature-request", activeId: null });
```

- [ ] **Step 2: Confirm failure**

Run `npx vitest run test/homepage-demo-model.test.ts`.

- [ ] **Step 3: Implement exact state**

```ts
export type HomepageExperienceId = "classic" | HomepageDemoFlowRecipeId;
export interface HomepageDemoState {
  readonly selectedId: HomepageExperienceId;
  readonly activeId: HomepageExperienceId | null;
  readonly runtimeState: "idle" | "loading" | "ready" | "error";
  readonly announcement: string;
}
```

Reject duplicate launch while active, preserve selection on error, and clear active state on settle/unmount. Add exact descriptions and launch labels to the immutable inventory.

- [ ] **Step 4: Verify and commit**

```bash
npx vitest run test/homepage-demo-model.test.ts test/homepage-flow-recipes.test.ts
git add src/components/landing/homepage-demo-model.ts test/homepage-demo-model.test.ts
git commit -m "feat: model homepage demo choices"
```

### Task 3: Add the lazy runtime and launch adapter

**Files:**
- Create: `src/components/landing/homepage-demo-runtime.ts`
- Create: `test/homepage-demo-runtime.test.ts`
- Modify: `test/integration-resource.test.ts`

**Interfaces:**
- Produces: `loadHomepageBugDrop()`, `registerHomepageFlow(api, id)`, `openHomepageExperience(api, handle, id)`.

- [ ] **Step 1: Write failing contracts**

Assert `homepageRuntimeAttributes()` returns the existing Classic theme attributes plus:

```ts
expect(homepageRuntimeAttributes()).toMatchObject({
  repo: "mean-weasel/bugdrop-widget-test",
  button: "false",
  theme: "dark",
  color: "#7dcfff",
  bg: "#24283b",
  text: "#c0caf5",
  radius: "10",
  font: "inherit",
  showIssueLink: "public",
});
```

Use a fake API to assert that registration is lazy and singular: launching one selected Flow registers only that Flow, reuses its cached handle on a later launch, and does not register the other three. Assert separately that `classic` calls `api.open()` without registering or opening a Flow handle.

- [ ] **Step 2: Confirm failure**

Run `npx vitest run test/homepage-demo-runtime.test.ts test/integration-resource.test.ts`.

- [ ] **Step 3: Implement structural SDK types**

```ts
export interface HomepageOpenedFlow {
  readonly instanceId: string;
  close(): void;
  readonly result: Promise<
    | { status: "submitted"; result: { issueNumber: number; issueUrl: string } }
    | { status: "closed" | "busy" }
  >;
}
export interface HomepageFlowHandle {
  readonly id: string;
  open(options?: { context?: Record<string, string | number | boolean> }): HomepageOpenedFlow;
}
export interface HomepageBugDropApi {
  open(): void;
  close(): void;
  registerFlow(config: unknown): HomepageFlowHandle;
}
```

- [ ] **Step 4: Implement one retryable in-flight load**

Reuse one module promise and one `#bugdrop-homepage-demo` script. Apply all dataset values before appending. Resolve only when `open`, `close`, and `registerFlow` exist. On error/missing API, remove the failed script, clear the promise, and reject so the next user action retries. Continue using manual DOM insertion because the load must happen only after explicit intent, later than Next’s `lazyOnload` strategy.

- [ ] **Step 5: Implement registration and launch routing**

Register only the selected Flow on launch, cache its handle by ID, and validate `handle.id === config.id`. Classic calls the established API and never creates a Flow host. Flow IDs call `handle.open(recipe.openOptions)`. Unmount closes the active Flow and calls `BugDrop.close()` for Classic. Do not add or infer an SDK completion promise for Classic.

- [ ] **Step 6: Verify and commit**

```bash
npx vitest run test/homepage-demo-runtime.test.ts test/integration-resource.test.ts
npm run build
git add src/components/landing/homepage-demo-runtime.ts test/homepage-demo-runtime.test.ts test/integration-resource.test.ts
git commit -m "feat: load homepage demo runtime on demand"
```

### Task 4: Build the direct launcher and customization section

**Files:**
- Create: `src/components/landing/homepage-demo-launcher.tsx`
- Modify: `src/components/landing/homepage-widget.tsx`
- Modify: `src/lib/links.ts`
- Create: `e2e/homepage-flow-demo.spec.ts`

**Interfaces:**
- Consumes: Tasks 2–3.
- Produces: one direct floating launcher, one in-page picker, and `BUILDING_BLOCKS_PATH`.

- [ ] **Step 1: Write a failing browser discovery test**

```ts
await page.goto("/");
await expect(page.getByRole("button", { name: "Open BugDrop feedback" })).toBeVisible();
await expect(page.getByRole("menu", { name: "Feedback experience" })).toHaveCount(0);
await expect(page.getByRole("heading", { name: "One widget for every feedback moment." })).toBeVisible();
await expect(page.getByRole("group", { name: "Feedback experience" }).getByRole("radio"))
  .toHaveCount(4);
await expect(page.getByRole("link", { name: "Explore the building blocks" }))
  .toHaveAttribute("href", "/labs/variants");
```

- [ ] **Step 2: Confirm failure**

```bash
NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO_ENABLED=true NEXT_PUBLIC_BUGDROP_WIDGET_URL=/vendor/bugdrop/47a392d1e7b1a8d8adeff1692f6bbbd84696280d/widget.js npx playwright test e2e/homepage-flow-demo.spec.ts --project=desktop-chromium --grep "exposes"
```

- [ ] **Step 3: Build the direct floating launcher**

Use a semantic button that is visible before SDK load, fixed bottom-right, safe-area aware, keyboard accessible, and reduced-motion aware. Activating it launches Classic directly; it never displays the four-example chooser.

- [ ] **Step 4: Rebuild `HomepageWidget` as shared owner**

Use one reducer for active ownership and section selection. The section is titled “Design your flow” and has five semantic radio choices, selected description, one launch button, a runtime-aware disclosure, and `Explore the building blocks`. Add navigation and hero links to the section. The exact local vendored-runtime URL, whether root-relative or absolute same-origin, says submissions stay private; a genuinely public runtime retains the public-Issue warning. Load/register only inside launch. Disable launches while loading/active. Announce state through one live region. Restore focus to the exact initiating launcher after close/submission.

Gate the new surface with `process.env.NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO_ENABLED === "true"`. When false or unset, render a `ClassicHomepageWidget` extraction whose markup, styling, lazy loading, and `BugDrop.open()` behavior are identical to the pre-change component. Add a browser assertion that the false path has no direct flow launcher or five-example showcase and still opens Classic.

Add:

```ts
export const BUILDING_BLOCKS_PATH = "/labs/variants";
```

- [ ] **Step 5: Verify and commit**

```bash
npx vitest run test/homepage-demo-model.test.ts test/homepage-demo-runtime.test.ts test/integration-resource.test.ts
NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO_ENABLED=true NEXT_PUBLIC_BUGDROP_WIDGET_URL=/vendor/bugdrop/47a392d1e7b1a8d8adeff1692f6bbbd84696280d/widget.js npx playwright test e2e/homepage-flow-demo.spec.ts --project=desktop-chromium
npm run build
git add src/components/landing/homepage-demo-launcher.tsx src/components/landing/homepage-widget.tsx src/lib/links.ts e2e/homepage-flow-demo.spec.ts
git commit -m "feat: add homepage feedback experience picker"
```

### Task 5: Prove all four journeys, lifecycle, accessibility, and mobile

**Files:**
- Modify: `e2e/homepage-flow-demo.spec.ts`

**Interfaces:**
- Produces: fail-closed local proof with mocked Issue-shaped results and no real Issue creation.

- [ ] **Step 1: Add exact endpoint mocks and escape auditing**

Mock only BugDrop check/feedback requests. Record POST bodies and use explicit public `isPublic: true` Issue-shaped results with unique canonical URLs under `mean-weasel/bugdrop-widget-test` for browser-flow proof. Separately exercise the actual local route and require its intentional synthetic `issueUrl` together with `isPublic: false`; presentation must hide the GitHub action and Issue-created claim for that private result. Reject other external requests except the already-approved exact payload-free Google Fonts request.

- [ ] **Step 2: Add independent Classic coverage**

Assert the old dark/cyan/radius styling, complete welcome/details/screenshot choice, submit one payload, see a valid Issue link only for the mocked public result, and confirm Classic remains selected in the customization section. Independently prove the actual local/private success omits the link and public-Issue implication. Assert no `[data-bugdrop-flow]` host exists.

- [ ] **Step 3: Add the four differentiated Flow journeys**

- Bug Report: required attachment, required screenshot, retry preservation, bug title/evidence.
- Quick Rating: one-screen cumulative 1–5 star selection and question output.
- Feature Request: cards, concise product detail, impact rating, and feature output.

- [ ] **Step 4: Add lifecycle and accessibility proof**

Cover keyboard traversal/Escape, focus restoration from both launchers, rapid-click single ownership, capture teardown, client-navigation cleanup before and after submission, body scroll restoration, reduced motion, zero console errors, and `390×844` no-overflow behavior.

- [ ] **Step 5: Run and commit**

```bash
NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO_ENABLED=true NEXT_PUBLIC_BUGDROP_WIDGET_URL=/vendor/bugdrop/47a392d1e7b1a8d8adeff1692f6bbbd84696280d/widget.js npx playwright test e2e/homepage-flow-demo.spec.ts --project=desktop-chromium --project=mobile-chromium --retries=0
git add e2e/homepage-flow-demo.spec.ts
git commit -m "test: cover homepage feedback experiences"
```

### Task 6: Gate merge-group localhost candidates and document rollout

**Files:**
- Modify: `.github/workflows/ci.yml`
- Modify: `test/integration-resource.test.ts`
- Create: `docs/homepage-flow-demo-operations.md`

**Interfaces:**
- Produces: additive browser gate, feature flag, visual-QA checklist, canary/rollback runbook.

- [ ] **Step 1: Write a failing CI contract**

Require `merge_group`, Chromium installation, exact spec path, `--retries=0`, the enabled feature flag, pinned runtime path, and absence of a real-canary selector.

- [ ] **Step 2: Confirm failure**

Run `npx vitest run test/integration-resource.test.ts`.

- [ ] **Step 3: Add the additive CI gate**

```yaml
- name: Install Chromium
  run: npx playwright install --with-deps chromium
- name: Test homepage feedback experiences
  env:
    NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO_ENABLED: "true"
    NEXT_PUBLIC_BUGDROP_WIDGET_URL: /vendor/bugdrop/47a392d1e7b1a8d8adeff1692f6bbbd84696280d/widget.js
  run: >-
    npx playwright test e2e/homepage-flow-demo.spec.ts
    --project=desktop-chromium --project=mobile-chromium --retries=0
```

Preserve unit, lint, and build gates. This job proves the exact website merge
commit against the authenticated runtime fixture on
`http://bugdrop.localhost:3000`; it does not exercise a deployed preview.
Existing SDK CI remains responsible for exact SDK candidate lanes. A separate
deployed-preview walkthrough remains required as pre-enable evidence.

- [ ] **Step 4: Write the operations guide**

Document `NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO_ENABLED`, the mandatory exact enabled runtime variable and digest check, pinned provenance, cleanup prerequisite, desktop/mobile visual checklist, separately authorized one-Issue-per-experience canary, and rollback by disabling only the website feature flag.

- [ ] **Step 5: Run all gates and strongest falsification**

```bash
node scripts/vendor-homepage-flow-recipes.mjs --source src/components/landing/flow-recipes-source/a100e69976ce0a5912df8f07af1b2e53029663b2/flow-recipes.ts.txt --source-sha a100e69976ce0a5912df8f07af1b2e53029663b2 --check
npm test
npx eslint .
npm run build
NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO_ENABLED=true NEXT_PUBLIC_BUGDROP_WIDGET_URL=/vendor/bugdrop/47a392d1e7b1a8d8adeff1692f6bbbd84696280d/widget.js npx playwright test e2e/homepage-flow-demo.spec.ts --project=desktop-chromium --project=mobile-chromium --retries=0
git diff --check
```

Temporarily force one composable registration to throw and prove Classic still launches unchanged while the failed choice remains visibly retryable. Restore the source and rerun the focused tests.

- [ ] **Step 6: Perform collaborative visual QA**

Run on `http://bugdrop.localhost:3000` with analytics unset and the feature enabled. Review the direct launcher, “Design your flow” section, Classic, and all three composable flows together at desktop and mobile sizes. Treat this as localhost-candidate evidence only; separately record the required deployed-preview walkthrough before enablement. Correct and recheck every visual finding before PR review.

- [ ] **Step 7: Commit**

```bash
git add .github/workflows/ci.yml test/integration-resource.test.ts docs/homepage-flow-demo-operations.md
git commit -m "ci: gate homepage multi-flow demo"
```

## Final Review Checklist

- [ ] Recipe/runtime bytes match provenance.
- [ ] Classic is first, separate, unchanged, and independently tested.
- [ ] Exactly four experiences are exposed: Classic, Bug Report, Quick Rating, and Feature Request.
- [ ] Bug Report preserves the generated canonical contract through the bounded overlay; the other three composable examples use immutable website-owned public FlowConfigs.
- [ ] All three composable experiences launch through registered handles with their exact current IDs, paths, conditions, mappings, payloads, and pruning verified.
- [ ] Floating launcher opens Classic directly; all four examples remain discoverable in the section.
- [ ] Runtime remains outside the initial critical path.
- [ ] SDK trigger is absent.
- [ ] No ordinary test creates a real Issue.
- [ ] `showIssueLink: "public"` exposes a valid link for public `isPublic: true` results and no GitHub action or public-Issue claim for local/private results.
- [ ] User approves desktop/mobile visual QA.
- [ ] Localhost-candidate evidence and the separate deployed-preview walkthrough are both recorded without treating one as the other.
- [ ] Cleanup is live-verified before any canary or production enablement.
- [ ] Each real-Issue canary is separately authorized; implementation, CI, preview, and review do not grant that authority.
- [ ] The public feature flag remains off until every pre-enable prerequisite is satisfied.
- [ ] Run the PR review toolkit before merge.
