# Homepage Composable Showcase Polish

## Objective

Turn the hidden homepage dogfood into a release-quality showcase for BugDrop's composable-flow SDK while preserving Classic behavior and keeping public exposure disabled. Complete the website/configuration polish first, then leave an exact separately gated SDK patch/release/repin handoff for the attachment-field and Classic-accessibility findings.

## Original Request

Plan the work required after an independent UX critique so the large composable-flow feature set is presented in its most polished form.

## Intake Summary

- Input shape: `existing_plan`
- Audience: prospective BugDrop users evaluating composable flows
- Authority: `requested` for planning; implementation begins only through a later `/goal` run
- Proof type: `demo`
- Completion proof: the hidden website passes desktop/mobile walkthroughs for all five experiences, automated verification, independent UX review, and PR Review Toolkit; the SDK-only work is captured in a separate non-executed authority-gated handoff
- Goal oracle: a reviewer can exercise Classic, Bug Report, Quick Rating, Feature Request, and Onboarding Check-in locally without obstruction, overflow, confusing pacing, weak differentiation, incorrect branching, or regression
- Likely misfire: maximizing the number of fields/components instead of making the examples compelling, or expanding website polish into an unauthorized SDK release
- Blind spots considered: mobile floating-launcher overlap; attachment presentation; Feature Request density; chooser differentiation; branch-sensitive Onboarding copy; Classic accessibility; immutable runtime/release boundaries
- Existing plan facts: no P0 issue; three P1 presentation findings; user chose two linked tranches with website work first and SDK work separately gated

## Goal Oracle

The oracle for this goal is:

`At desktop and 390×844 mobile, all five hidden homepage experiences can be discovered, launched, completed, closed, and understood as meaningfully different examples; no showcase content is obscured or overflows; the 500ms transitions and reduced-motion fallback are correct; Classic remains unchanged when the feature flag is false/unset; and the separately gated SDK handoff is complete.`

Planning, a good-looking single screenshot, or passing happy-path tests are insufficient. The final Judge must map browser evidence, test/build results, review receipts, and the dirty diff back to the complete oracle.

## Goal Kind

`existing_plan`

## Current Tranche

The current continuous tranche is website/configuration polish only:

1. validate the critique against current behavior and scope;
2. complete the largest safe website package covering mobile obstruction, chooser differentiation, Feature Request pacing, Onboarding branch-neutral copy, and configurable Bug Report layout;
3. verify all five experiences on desktop/mobile, including transitions, reduced motion, branching, payloads, focus, and feature-off Classic;
4. run independent UX/accessibility review and PR Review Toolkit, then correct accepted findings;
5. finalize the linked SDK plan without editing, releasing, or repinning the SDK.

The linked SDK tranche is specified in `notes/sdk-tranche.md`. It is not part of this goal's write authority.

## Non-Negotiable Constraints

- Keep `NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO_ENABLED` false/unset outside explicit local and CI dogfood.
- Preserve the existing Classic implementation, styling, payload, screenshot journey, and feature-off behavior.
- Use only released v1.56.3 public FlowConfig primitives in the website tranche; do not fork or modify the vendored runtime.
- Preserve the exact authenticated v1.56.3 artifact and SHA-scoped local routes.
- Keep local/CI submissions non-public and production copy truthful for its configured backend.
- Do not commit, push, open a PR, enter a merge queue, publish, deploy, release, approve an environment, or repin without separate explicit authority.
- Treat the existing dirty worktree as intended user-owned work; do not discard or reconstruct it from tracked diff alone.
- Use named `.localhost` origins for browser proof.

## Stop Rule

Stop only when a final audit proves the full website/configuration oracle for this tranche and the SDK handoff is complete. Do not claim the SDK findings fixed, released, or repinned from this plan.

If safe website work remains, continue through the board. If only SDK implementation or external release authority remains, preserve the exact handoff and stop for separate owner authorization.

## Slice Sizing

The first Worker package should be one coherent showcase pass, not one task per flow. It should update the controller/configuration, tests, and current documentation together, then receive one independent phase-boundary review.

## Board Health

Run:

```bash
node /Users/neonwatty/.codex/plugins/cache/goalbuddy/goalbuddy/0.4.3/skills/goal-prep/scripts/check-goal-state.mjs docs/goals/homepage-composable-showcase-polish
```

before trusting a stale or ambiguous board.

## Canonical Board

Machine truth lives at `docs/goals/homepage-composable-showcase-polish/state.yaml`.

## Run Command

```text
Codex: /goal Follow docs/goals/homepage-composable-showcase-polish/goal.md.
Claude Code: /goalbuddy Follow docs/goals/homepage-composable-showcase-polish/goal.md.
```

## PM Loop

On each continuation, read this charter and `state.yaml`, work only on the active task, require bounded Worker files and verification, record a receipt, update the board, and continue until the final Judge can truthfully record `full_outcome_complete: true` for this website tranche.
