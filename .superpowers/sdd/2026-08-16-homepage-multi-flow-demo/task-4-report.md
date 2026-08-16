# Task 4 report — homepage launcher and synchronized experience section

Commits: `feat: add homepage feedback experience picker` and its Task 4 fix follow-ups

Implemented the feature-flagged homepage experience picker:

- Added the website-owned, safe-area-aware floating Base UI radio menu with the four canonical choices.
- Rebuilt the enabled homepage demo as one reducer-owned controller shared by the floating launcher and semantic in-page picker.
- Kept the disabled/unset flag on the extracted Classic component, preserving its prior markup, lazy script behavior, and `BugDrop.open()` path with no chooser.
- Added the exported building-blocks path, public-Issue notice, one live region, retryable load error, active-launch locking, Flow close focus restoration, and unmount cleanup.
- Added browser coverage that uses the local pinned runtime, mocks the installation check, blocks feedback submission, proves a single active Flow, proves focus restoration, and separately proves the flag-unset Classic-only path.

Verification passed:

- `npx vitest run test/homepage-demo-model.test.ts test/homepage-demo-runtime.test.ts test/integration-resource.test.ts` — 21 tests passed.
- `npx playwright test e2e/homepage-flow-demo.spec.ts --project=desktop-chromium` — Classic-only path passed (two enabled-only tests skipped).
- `NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO_ENABLED=true NEXT_PUBLIC_BUGDROP_WIDGET_URL=http://bugdrop.localhost:3000/vendor/bugdrop/81293491bf9924879465c668a391a5e4aeae912d/widget.js npx playwright test e2e/homepage-flow-demo.spec.ts --project=desktop-chromium` — enabled chooser and lifecycle tests passed (Classic-only test skipped).
- `npm run lint` — passed with the existing warnings from the pinned minified runtime.
- `npm run build` — passed.
- `git diff --check` — passed.

Strongest falsification: the enabled browser journey selects Bug Report through the floating menu, receives a mocked installation response and blocks the feedback endpoint, verifies exactly one Flow host while the launcher is disabled, closes the Flow, and verifies focus returns to the original floating launcher. The flag-unset journey verifies the chooser is absent and the classic `BugDrop.open()` path is still invoked by a mocked runtime. No real GitHub Issue or external mutation was made.

## Fix round 1 — stale asynchronous launch

Added a mounted-generation guard around the asynchronous Flow launch. Every continuation after the runtime await now verifies that the originating launcher is still mounted and current; stale continuations return without dispatching, registering, or opening. If an experience is created after a generation becomes stale, it is immediately closed. Cleanup invalidates the current generation before it closes active state, so it does not dispatch after unmount.

The browser regression delays the exact local pinned-runtime path, starts Bug Report, navigates through `Explore the building blocks`, then releases the mocked delayed runtime. It checks that no Flow instance is opened and that no modal, trigger, scroll lock, preflight, or feedback request appears. The pre-fix implementation fails this test by creating an orphan Flow after navigation; the guarded implementation passes.

## Fix round 2 — runtime-host contract correction

Corrected the pending-load regression to match the SDK's intentional SPA lifecycle: released v1.56.2 may retain an inert, zero-height page-global `#bugdrop-host` and `window.BugDrop` after loading. Those are not leaks and match the documented SDK and pre-change Classic behavior. The test now targets only the user-visible and mutation-capable invariant: no Flow instance, dialog, modal, trigger, scroll-lock change, preflight request, or feedback request after the originating homepage controller unmounts.

## Fix round 3 — submission-to-close lifecycle boundary

Composable submission results resolve when the success surface is shown, before the user closes that surface with Done. The homepage controller now keeps ownership through that success state and uses a `MutationObserver` scoped to the active Flow ID to settle only after that exact Flow host is removed. This preserves the visible success message and public Issue link, keeps launchers disabled while the Flow remains visible, and restores focus to the exact initiating launcher only after actual closure. The observer is disconnected during settle or unmount, and the existing generation guard still prevents stale work.

The production-faithful three-Flow browser journey previously failed at the first post-Done focus assertion. With this fix it passes that assertion and proceeds into Product Triage; its later current failure is an unrelated Task 5 screenshot-default expectation under active development. Task 4's focused direct-close lifecycle, enabled discovery, delayed-load navigation, Classic-only browser path, Vitest contracts, lint, build, and diff check all pass.
