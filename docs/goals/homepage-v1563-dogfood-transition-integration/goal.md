# Homepage v1.56.3 Dogfood and Transition Integration

## Objective

Repin the hidden homepage feedback-experience dogfood to the exact BugDrop SDK v1.56.3 release, opt Product Triage into the new 500 ms horizontal screen transition, tighten and differentiate the composable experience copy, and prove locally that the Classic experience remains unchanged and all enabled experiences are ready for continued private dogfooding.

## Original Request

Create a plan for the v1.56.3 website repin, transition-enabled local dogfood build, UX tightening, broader experience differentiation, local visual QA, automated verification, and review before any public homepage exposure.

## Intake Summary

- Input shape: `existing_plan`
- Audience: BugDrop maintainers and prospective users evaluating the homepage experiences
- Authority: `requested`
- Proof type: `demo`
- Completion proof: An exact-runtime local walkthrough and automated browser/test evidence show Product Triage using the 500 ms horizontal transition, the three composable experiences remaining distinct and succinct, Classic retaining its existing behavior, reduced motion falling back safely, and the public homepage feature flag remaining disabled.
- Goal oracle: The feature-enabled named-localhost dogfood page loads the authenticated v1.56.3 runtime and passes a repeatable desktop/mobile/keyboard/reduced-motion walkthrough while the explicit false and unset configurations remain Classic-only.
- Likely misfire: Producing attractive new flows while accidentally changing Classic, exposing the chooser publicly, testing a fake or stale runtime, overriding the SDK's immediate default globally, or treating passing unit tests as sufficient visual proof.
- Blind spots considered: exact immutable runtime identity, same-page foreign-runtime conflicts, focus and unmount cleanup, screenshot/capture lifecycle, real-request prevention, reduced-motion behavior, copy density, experience diversity, feature-flag isolation, and PR authority.
- Existing plan facts: exact v1.56.3 target `47a392d1e7b1a8d8adeff1692f6bbbd84696280d`; live widget SHA-256 `338cdb5b19c69dc3429fdcb8f800e3b98a3bdd442fee78563523cd731e2bdf0e`; immediate replacement remains the SDK default; Product Triage is the first opt-in example with `slide-horizontal` at `500ms`; Classic must remain unchanged; the work stays behind the disabled homepage flag; local visual QA precedes any PR or exposure; simplifying the release operator is a separate follow-up.

## Goal Oracle

The oracle for this goal is:

`On the feature-enabled http://bugdrop.localhost dogfood page, the browser receives widget bytes whose SHA-256 is 338cdb5b19c69dc3429fdcb8f800e3b98a3bdd442fee78563523cd731e2bdf0e; Product Triage visibly uses a 500 ms horizontal forward/back transition; Bug Report and Customer Pulse remain coherent, succinct, and materially distinct; reduced motion removes nonessential motion; Classic follows the pre-existing open/capture/submit path; false and unset flags render only Classic; no real external feedback request is made; and the final review finds no high-confidence regression.`

The PM must keep comparing task receipts to this oracle. Planning, discovery, a passing tiny slice, or a clean-looking board is not enough. The goal finishes only when a final Judge/PM audit maps receipts and verification back to this oracle and records `full_outcome_complete: true`.

## Goal Kind

`existing_plan`

## Current Tranche

Complete the largest reversible local website slice: validate the current dogfood branch, repin it to exact v1.56.3, integrate one explicit 500 ms transition example, tighten and diversify the hidden experiences, run exact-runtime local visual and automated QA, and complete a high-confidence review. Do not expose the chooser publicly, merge, deploy, or publish a PR without separate authority.

## Non-Negotiable Constraints

- Preserve the Classic experience's behavior, styling, capture path, submission semantics, and false/unset feature-flag behavior.
- Keep the homepage chooser disabled in production and inaccessible when the flag is false or unset.
- Bind the dogfood integration to exact v1.56.3 bytes and fail closed on wrong or stale runtime identity.
- Keep immediate replacement as the SDK default; only the chosen composable recipe opts into the 500 ms horizontal transition.
- Respect `prefers-reduced-motion` and maintain keyboard, focus-restoration, cleanup, and single-owner guarantees.
- Use named `.localhost` origins for browser work and prevent real GitHub Issue creation or nonlocal feedback submission during QA.
- Treat visual QA as required evidence, not a substitute for automated proof.
- Run the repository's relevant unit, integration, lint, production-build, and browser suites plus PR Review Toolkit before a PR handoff.
- Do not merge, deploy, expose the public homepage experience, or alter the SDK release in this goal.
- Do not fold the easier release-authorization/operator project into this tranche.

## Stop Rule

Stop only when a final audit proves the full original outcome is complete.

Do not stop after planning, discovery, or Judge selection if a safe Worker task can be activated.

Do not stop after a single verified Worker package when the broader owner outcome still has safe local follow-up work. Continue through exact repin, UX integration, visual QA, automated proof, and final review.

If an exact human approval is the only remaining blocker for pushing or opening a PR, preserve the verified local result, record the required approval, and stop without making the external mutation.

## Slice Sizing

Safe means bounded, explicit, verified, and reversible. It does not mean tiny. Keep the exact repin/identity package separate from the UX/transition package when doing so makes rollback and proof clearer; keep same-shape copy and recipe changes in one coherent UX package.

## Board Health

Machine truth lives at `docs/goals/homepage-v1563-dogfood-transition-integration/state.yaml`. If the board looks stale or inconsistent, run the bundled GoalBuddy checker against this goal directory.

## Canonical Board

Machine truth lives at:

`docs/goals/homepage-v1563-dogfood-transition-integration/state.yaml`

## Run Command

```text
Codex: /goal Follow docs/goals/homepage-v1563-dogfood-transition-integration/goal.md.
Claude Code: /goalbuddy Follow docs/goals/homepage-v1563-dogfood-transition-integration/goal.md.
```

## PM Loop

On every execution continuation, read this charter and `state.yaml`, follow the GoalBuddy execution contract, work only on the active task, preserve receipts, compare evidence to the oracle, and continue until final audit or an exact approval-only terminal wait.
