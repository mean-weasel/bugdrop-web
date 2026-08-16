# Homepage Multi-Flow Demo Design

**Date:** 2026-08-16
**Status:** Approved design
**Repositories:** `mean-weasel/bugdrop-web`, with a separate cleanup change in `mean-weasel/bugdrop-widget-test`

## Summary

The BugDrop landing page will let visitors try four real feedback experiences from the familiar floating launcher and the existing “Try BugDrop” section:

1. General Feedback · Classic
2. Bug Report
3. Product Triage
4. Customer Pulse

Classic remains the initial/default experience. The three composable examples are additive and use the same shared recipe definitions already covered by BugDrop SDK tests. Every completed demo creates a real GitHub Issue in `mean-weasel/bugdrop-widget-test` and links the visitor to it. A separate nightly workflow closes demo Issues older than 24 hours rather than deleting them.

The experience chooser is website-only orchestration. It does not change the public BugDrop widget, the default classic flow, or existing customer installations.

## Goals

- Make the range of BugDrop UX options immediately discoverable on the landing page.
- Preserve the familiar floating feedback launcher.
- Let visitors complete each example end-to-end and inspect the resulting GitHub Issue.
- Keep Classic visibly first and independently verified.
- Explain, through concrete examples, that BugDrop experiences are composed from reusable building blocks.
- Keep the landing page focused rather than reproducing the full developer lab.
- Require collaborative local visual QA before implementation is considered ready for review.

## Non-goals

- Changing the default widget experience installed by existing customers.
- Adding a flow chooser to the public BugDrop SDK.
- Replacing Classic with a composable flow on customer sites.
- Turning the landing page into a flow builder or configuration editor.
- Publishing or redesigning the full variants lab as part of this change.
- Deleting GitHub Issues or cleaning unrelated Issues.

## User Experience

### Floating launcher

The existing bottom-right BugDrop icon remains available throughout the homepage. Clicking it opens a compact, homepage-only experience menu rather than immediately opening Classic.

The menu lists all four experiences with short, use-case-oriented descriptions. General Feedback · Classic is highlighted on first use. After a visitor tries another experience, that option remains highlighted for convenience, but each subsequent launcher click still opens the menu so every variation remains discoverable.

Selecting an experience closes the menu and opens its real feedback UI. Completing or closing the experience returns the launcher to its normal state. Only one menu or feedback surface may be active at a time.

### In-page demo section

The existing “Try BugDrop” section becomes a compact experience picker that mirrors the launcher menu. It contains:

- A short headline explaining that one widget can support different feedback experiences.
- Four compact selectors.
- A description of the currently selected experience.
- One launch button whose label and target follow the selection.
- Clear copy that completion creates a real Issue in `mean-weasel/bugdrop-widget-test`.
- A secondary “Explore the building blocks” link.

Selection state is shared between the floating menu and the in-page picker. Changing one updates the other.

### Mobile behavior

On narrow screens, the four choices form a compact two-column grid or an equivalently readable wrapped layout. The launch action is full width. The menu and every flow must avoid horizontal overflow, preserve scroll locking correctly, and restore focus to the initiating control.

### Deeper playground

The “Explore the building blocks” link points toward the deeper composability playground. Polishing or publishing that destination is a separate follow-up. The landing-page implementation must not depend on an unfinished public lab; the link may remain feature-gated or target an appropriate interim explanation until the destination is ready.

## Runtime Architecture

### Homepage demo controller

A website-owned client controller coordinates:

- Lazy loading one current, pinned BugDrop runtime.
- The floating menu’s open/closed state.
- The selected experience.
- Synchronization with the in-page picker.
- Classic invocation.
- Registration and invocation of the three composable flows.
- Active modal ownership and stale-instance cleanup.
- Visible loading, registration, preflight, and submission errors.

The controller is demo orchestration, not a new SDK abstraction.

### Classic path

General Feedback invokes the established Classic API and retains the homepage’s existing theme, styling, welcome copy, repository, screenshot behavior, and Issue submission behavior. The integration must not reimplement or approximate Classic through a composable recipe.

Classic has an independent regression path throughout local and preview verification.

### Composable paths

Bug Report, Product Triage, and Customer Pulse register through `registerFlow`. Their configurations come from the shared representative recipes used by SDK conformance and browser coverage, or from a versioned website package/module mechanically synchronized with those definitions. Homepage-specific forks of the recipes are not acceptable.

The controller must ensure that repeated clicks, flow switching, navigation, and component unmounting cannot leave multiple dialogs, stale result handlers, body scroll locks, or orphaned capture UI.

### Loading

The runtime remains lazy-loaded. Initial landing-page rendering must not download or initialize the widget before a visitor interacts with the launcher or demo section. Concurrent load requests share one in-flight operation and reach one registered runtime.

## Submission and GitHub Issue Behavior

All four experiences submit to the existing homepage demo repository:

`mean-weasel/bugdrop-widget-test`

Each created Issue identifies its source experience in deterministic metadata, labels, title/body structure, or a combination of those mechanisms. The exact output remains natural for the selected recipe:

- General Feedback demonstrates the established Classic Issue.
- Bug Report emphasizes evidence and debugging detail.
- Product Triage demonstrates conditional branching and omission of irrelevant answers.
- Customer Pulse demonstrates rating and follow-up feedback.

The success surface links directly to the real GitHub Issue. The landing page tells visitors before launch that their submission will be public in the demo repository and must not include sensitive information.

## Nightly Cleanup

Cleanup is implemented separately in `mean-weasel/bugdrop-widget-test` and is a prerequisite for public launch.

The scheduled workflow:

- Runs nightly.
- Selects only open homepage demo Issues.
- Requires an unambiguous automation marker, preferably `homepage-demo` plus the existing BugDrop marker.
- Acts only on Issues at least 24 hours old.
- Closes matching Issues and adds an `expired-demo` label.
- Does not delete Issues, preserving visitor links and an audit trail.
- Does not mutate unrelated Issues, pull requests, discussions, releases, or repository configuration.
- Supports a dry-run mode that reports the exact candidate set without mutation.

The website must not advertise automatic cleanup until the workflow has passed both dry-run proof and one bounded live proof.

## Error Handling

- Runtime load failure leaves the launcher and in-page controls retryable and shows a concise error.
- Registration failure affects only the relevant composable experience and does not silently fall back to Classic.
- Preflight and submission failures remain visible in the selected flow’s normal retry surface.
- A busy or already-owned modal returns a visible, recoverable state rather than opening a second surface.
- Route changes and component unmounts close active website-owned menu/flow handles and restore document scrolling.
- A GitHub submission is never reported as successful unless the SDK returns a valid Issue result for `mean-weasel/bugdrop-widget-test`.

## Accessibility

- The launcher menu follows a documented accessible menu/listbox or dialog pattern appropriate to its final interaction.
- All experience choices have descriptive accessible names and clear selected state.
- Keyboard users can open the menu, traverse all four choices, select one, close it, and return focus to the launcher.
- The in-page picker uses appropriate tabs or radio-group semantics rather than clickable generic containers.
- Loading and error changes are announced without stealing focus.
- Reduced-motion preferences apply to the menu, flow surfaces, and success transitions.
- Focus restoration is correct after cancellation, submission, route navigation, and repeated use.

## Verification Strategy

### Local automated coverage

- Unit/component coverage for selection, synchronization, lazy loading, registration, repeated opens, error/retry, and unmount cleanup.
- Browser coverage for opening and completing all four experiences independently.
- Explicit Classic assertions for existing styling, navigation, screenshots, submission, and success behavior.
- Shared-recipe identity checks for the three composable examples.
- Accessibility, reduced-motion, focus, mobile overflow, console, and external-request privacy checks.

Local browser work uses a named `.localhost` subdomain.

### Collaborative visual QA

Before a PR is declared ready, the implementation is run locally and reviewed manually by the user and implementation agent at minimum across:

- Desktop and mobile viewports.
- Launcher placement and hierarchy.
- Menu open/close and repeated-use behavior.
- All four selected states and descriptions.
- Synchronization between launcher and section.
- Each flow’s first screen and representative subsequent screens.
- Modal size, typography, scroll behavior, focus, and close/reopen transitions.
- Classic styling parity with the existing homepage demo.

Visual QA findings are corrected and rechecked before PR review.

### Merge-queue preview coverage

Preview coverage remains additive:

- Classic runs independently against the exact candidate website/runtime.
- Bug Report, Product Triage, and Customer Pulse each run independently against the exact candidate website/runtime.
- Existing Classic preview and styling protections are not replaced or inferred from composable-flow results.
- Each lane has exact artifact/provenance checks and fail-closed result handling.
- Ordinary PR/merge-queue runs validate Issue-shaped results without creating public Issues.

### Live canary

Before launch, a separately authorized canary exercise creates one real Issue through each experience, verifies the target repository, output structure, success link, and public visibility, and records the resulting Issue URLs. This authorization is not implied by implementation or PR approval.

The cleanup workflow receives separate dry-run and bounded live authorization.

## Rollout

1. Implement and verify the nightly cleanup workflow in the demo repository.
2. Implement the website controller, menu, synchronized section, and shared recipes on a dedicated branch.
3. Pass local automated verification and collaborative visual QA.
4. Pass pull-request review and exact merge-queue preview coverage for Classic plus all three composable flows.
5. Run separately authorized real-Issue canaries.
6. Enable the homepage experience without changing SDK defaults or customer configuration.

If the composable experiences fail after launch, the website can hide those three entries while preserving the established Classic homepage demo. This website-only fallback does not alter SDK behavior.

## Acceptance Criteria

- The floating homepage launcher always opens the four-option demo menu.
- General Feedback · Classic is the initial selection.
- All four experiences launch, submit, and link to real Issues in the existing demo repository.
- The launcher menu and in-page picker stay synchronized.
- Reopening the launcher always returns to the menu with the last experience highlighted.
- Classic behavior and styling remain independently proven.
- The three composable experiences use shared representative recipes.
- Local desktop/mobile visual QA is approved.
- Exact preview tests run Classic plus all three composable flows additively.
- Nightly cleanup safely closes only marked Issues older than 24 hours.
- No public SDK behavior or existing customer installation changes.
