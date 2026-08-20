# Homepage v1.56.3 hidden-dogfood handoff

## Local dogfood

- URL: `http://bugdrop.localhost:3000/`
- Mode: `NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO_ENABLED=true`
- Runtime: `/vendor/bugdrop/47a392d1e7b1a8d8adeff1692f6bbbd84696280d/widget.js`
- Served SHA-256: `338cdb5b19c69dc3429fdcb8f800e3b98a3bdd442fee78563523cd731e2bdf0e`
- Public exposure: disabled by default; this local server is feature-enabled only for dogfood.
- Submission safety: local SHA-scoped check/feedback routes only; no real GitHub Issues.

## Manual checklist

1. Open the chooser and launch Classic, Bug Report, Product Triage, and Customer Pulse.
2. Confirm Classic remains the existing experience and returns focus to its exact launcher.
3. In Product Triage, move forward and Back through the flow; confirm the horizontal transition is smooth and lasts 500 ms.
4. With reduced motion enabled, confirm Product Triage replaces screens immediately without animation.
5. In Customer Pulse, confirm the first action says Continue for score 3 and score 8; score 3 opens Name the friction before submission, while score 8 submits directly.
6. Exercise keyboard chooser navigation, Escape, focus restoration, mobile layout, capture cancellation, and route-navigation cleanup.
7. Confirm successful local submissions use the private inspector and no request reaches a nonlocal check/feedback endpoint.

## Proven scope

- Exact homepage runtime repin from v1.56.2 to authenticated v1.56.3, with old homepage-only namespace removed.
- Bounded local copy/presentation overlay; canonical IDs, field paths, conditions, Issue/evidence mappings, payloads, and pruning remain unchanged.
- Product Triage alone opts into `slide-horizontal` at `500` ms; all other flows retain immediate replacement.
- Exact-runtime loader remains fail-closed during a delayed-script/foreign-lab/second-launch interleaving.
- Classic and false/unset feature-flag behavior remain unchanged.
- Full local tests, lint, build, desktop/mobile browser suites, and corrected-head PR Review Toolkit are green.

## External authority boundary

No commit, push, PR, merge queue, merge, deployment, or public feature enablement has been performed.

If external handoff is desired, the required approval is:

> I authorize committing the complete audited homepage v1.56.3 hidden-dogfood change in `codex/homepage-flow-demo-design`, including every intended untracked GoalBuddy, runtime, route, overlay, and test file; pushing that branch; and opening a PR against `main`. This does not authorize merge-queue enrollment, merge, deployment, or enabling the homepage feature flag.
