# Homepage Multi-Flow Demo Design

**Date:** 2026-08-16
**Status:** Approved design
**Repositories:** `mean-weasel/bugdrop-web`, with a separate cleanup change in `mean-weasel/bugdrop-widget-test`

## Summary

The BugDrop landing page keeps a familiar, single-purpose floating Classic feedback launcher and lets visitors explore four real feedback experiences in a dedicated “Design your flow” section:

1. General Feedback · Classic
2. Bug Report
3. Quick Rating
4. Feature Request

Classic remains the initial selection in the comparison section and is also what the floating launcher opens, without presenting a choice menu. The three composable examples are additive. Bug Report retains the mechanically pinned canonical SDK recipe contract; Quick Rating and Feature Request deliberately combine the same public FlowConfig primitives into more diverse use cases. All three use a homepage-only 500ms horizontal screen transition while the SDK-wide default remains immediate. Every completed public demo creates a real GitHub Issue in `mean-weasel/bugdrop-widget-test` and links the visitor to it. A separate nightly workflow closes demo Issues older than 24 hours rather than deleting them.

The customization showcase is website-only orchestration. It does not change the public BugDrop widget, the default classic flow, or existing customer installations.

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

The existing bottom-right affordance remains available throughout the homepage as a simple “Feedback” button. It directly opens the established Classic workflow and never presents the four-example chooser. On narrow viewports it yields while the in-page customization section is visible, preventing it from covering content, then returns after the section leaves the viewport.

Completing or closing Classic returns focus to the floating launcher. Only one feedback surface may be active at a time.

### In-page demo section

The existing “Try BugDrop” section becomes a customization showcase titled “Design your flow.” It contains:

- A short explanation that BugDrop flows can be composed for different jobs.
- Four compact examples, each with a distinct icon and concise description.
- A description of the currently selected experience.
- One launch button whose icon, label, and target follow the selection.
- Clear copy that completion creates a real Issue in `mean-weasel/bugdrop-widget-test`.
- A secondary “Explore the building blocks” link.

The examples are intentionally contained in this section so the floating feedback action remains focused and unobtrusive. A navigation link and hero action scroll directly to the section.

### Mobile behavior

On narrow screens, the five choices form a compact two-column grid or an equivalently readable wrapped layout. The launch action is full width. While the in-page showcase is visible, the floating launcher moves out of view and leaves the content unobscured without changing selection, launch, or focus ownership. The section and every flow must avoid horizontal overflow, preserve scroll locking correctly, and restore focus to the initiating control.

### Deeper playground

The “Explore the building blocks” link points toward the deeper composability playground. Polishing or publishing that destination is a separate follow-up. The landing-page implementation must not depend on an unfinished public lab; the link may remain feature-gated or target an appropriate interim explanation until the destination is ready.

## Runtime Architecture

### Homepage demo controller

A website-owned client controller coordinates:

- Lazy loading one current, pinned BugDrop runtime. Enabled builds require an explicit runtime through the shared source/CSP allowlist: exact public v1.56.4 or the approved strict local fixture forms. Missing, mutable, wrong-version, unsafe, and normalized-alias values fail closed; feature-off/unset Classic retains its established mutable Worker default.
- The selected experience.
- Direct floating Classic invocation.
- Classic invocation.
- Registration and invocation of the three composable flows.
- Active modal ownership and stale-instance cleanup.
- Visible loading, registration, preflight, and submission errors.

The controller is demo orchestration, not a new SDK abstraction.

### Classic path

General Feedback invokes the established Classic API and retains the homepage’s existing theme, styling, welcome copy, repository, screenshot behavior, and Issue submission behavior. The integration must not reimplement or approximate Classic through a composable recipe.

Classic has an independent regression path throughout local and preview verification.

### Composable paths

Bug Report, Quick Rating, and Feature Request register through `registerFlow`. Bug Report preserves the canonical representative recipe's fields, screens, Issue mapping, and evidence contract. The two additional configurations are small website-owned compositions of public, versioned FlowConfig primitives. Every homepage Flow explicitly opts into `slide-horizontal` at 500ms; reduced motion remains immediate and no SDK or customer default changes.

The controller must ensure that repeated clicks, flow switching, navigation, and component unmounting cannot leave multiple dialogs, stale result handlers, body scroll locks, or orphaned capture UI.

### Loading

The runtime remains lazy-loaded. Initial landing-page rendering must not download or initialize the widget before a visitor interacts with the launcher or demo section. Concurrent load requests share one in-flight operation and reach one registered runtime. Source selection and CSP derive from the same enabled-showcase policy: `NEXT_PUBLIC_BUGDROP_WIDGET_URL` is mandatory when the flag is true and accepts only `https://bugdrop.neonwatty.workers.dev/widget.v1.56.4.js`, the exact authenticated root-relative fixture, or its exact named-localhost absolute form with hostname case equivalence only.

## Submission and GitHub Issue Behavior

All four experiences submit to the existing homepage demo repository:

`mean-weasel/bugdrop-widget-test`

Each created Issue identifies its source experience in deterministic metadata, labels, title/body structure, or a combination of those mechanisms. The exact output remains natural for the selected recipe:

- General Feedback demonstrates the established Classic Issue.
- Bug Report emphasizes evidence and debugging detail.
- Quick Rating demonstrates a one-screen 1–5 star signal.
- Feature Request demonstrates structured product discovery paced across compact idea, context, and priority screens. Priority uses labeled Nice to have, Important, and Transformative cards rather than a star scale.

Bug Report retains the canonical field IDs/types, screen IDs/order, conditions,
Issue/evidence mapping, accepted files, limits, and serialized payload. Its only
form refinement is layout: attachments and logs span the available columns,
while name and email share a desktop row and stack naturally on mobile.

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
- Route changes and component unmounts close active website-owned flow handles and restore document scrolling.
- A GitHub submission is never reported as successful unless the SDK returns a valid Issue result for `mean-weasel/bugdrop-widget-test`.

## Accessibility

- The floating launcher is a semantic button with a concise accessible name.
- All experience choices have descriptive accessible names and clear selected state.
- Keyboard users can open and close the direct feedback flow and return focus to the launcher.
- The in-page picker uses appropriate tabs or radio-group semantics rather than clickable generic containers.
- Loading and error changes are announced without stealing focus.
- Reduced-motion preferences apply to the launcher, flow surfaces, and success transitions.
- Focus restoration is correct after cancellation, submission, route navigation, and repeated use.

## Verification Strategy

### Local automated coverage

- Unit/component coverage for selection, direct launch, lazy loading, registration, repeated opens, error/retry, and unmount cleanup.
- Browser coverage for opening and completing all four experiences independently.
- Explicit Classic assertions for existing styling, navigation, screenshots, submission, and success behavior.
- Canonical Bug Report identity plus explicit invariant checks for all three composable examples.
- Accessibility, reduced-motion, focus, mobile overflow, console, and external-request privacy checks.

Local browser work uses a named `.localhost` subdomain.

### Collaborative visual QA

Before a PR is declared ready, the implementation is run locally and reviewed manually by the user and implementation agent at minimum across:

- Desktop and mobile viewports.
- Launcher placement and hierarchy.
- Direct floating launch and repeated-use behavior.
- All five selected states and descriptions.
- Clear separation between the direct launcher and customization section.
- Each flow’s first screen and representative subsequent screens.
- Modal size, typography, scroll behavior, focus, and close/reopen transitions.
- Classic styling parity with the existing homepage demo.

Visual QA findings are corrected and rechecked before PR review.

### Merge-queue localhost candidate coverage

The merge-queue lane runs additively against the exact candidate website and
authenticated runtime fixture at `http://bugdrop.localhost:3000`; it does not
exercise a deployed preview:

- Classic runs independently against the exact candidate website/runtime.
- Bug Report, Quick Rating, and Feature Request each run independently against the exact candidate website/runtime.
- Existing Classic candidate and styling protections are not replaced or inferred from composable-flow results.
- Each lane has exact artifact/provenance checks and fail-closed result handling.
- Ordinary PR/merge-queue runs validate Issue-shaped results without creating public Issues.

### Live canary

Before launch, a separately authorized canary exercise creates one real Issue through each experience, verifies the target repository, output structure, success link, and public visibility, and records the resulting Issue URLs. This authorization is not implied by implementation or PR approval.

The cleanup workflow receives separate dry-run and bounded live authorization.

## Rollout

1. Implement and verify the nightly cleanup workflow in the demo repository.
2. Implement the website controller, direct floating launcher, customization section, and shared recipes on a dedicated branch.
3. Pass local automated verification and collaborative visual QA.
4. Pass pull-request review and exact merge-queue localhost candidate coverage for Classic plus all three composable flows, then record the separate deployed-preview walkthrough required before enablement.
5. Run separately authorized real-Issue canaries.
6. Enable the homepage experience without changing SDK defaults or customer configuration.

If the composable experiences fail after launch, disable the homepage flow-demo flag to hide all three composable entries and return to the established Classic-only homepage demo. This website-only fallback does not alter SDK behavior.

## Acceptance Criteria

- The floating homepage launcher directly opens Classic and yields only while the customization section is visible on a narrow viewport.
- General Feedback · Classic is the initial selection.
- All four experiences launch, submit, and link to real Issues in the existing demo repository.
- “Design your flow” navigation scrolls directly to the five-example customization section.
- Closing the direct floating flow restores focus to its launcher.
- Classic behavior and styling remain independently proven.
- The three composable experiences use only the public FlowConfig primitives described above.
- Local desktop/mobile visual QA is approved.
- Exact localhost candidate tests run Classic plus all three composable flows additively; a separate deployed-preview walkthrough is recorded before enablement.
- Nightly cleanup safely closes only marked Issues older than 24 hours.
- No public SDK behavior or existing customer installation changes.
