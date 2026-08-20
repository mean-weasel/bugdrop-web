# Living Flow Capability Documentation

## Objective

Make bugdrop.dev a trustworthy, current guide to the default feedback flow and the released custom-flow SDK surface by adding authoritative component, motion, styling, and API documentation with curated live examples and automated drift protection.

## Original Request

Plan how to keep the website up to date on the components users can use to create flows, the available animations, and how the widget can be styled to match an app. Preserve the default feedback flow as the primary starting point and add documentation plus live examples rather than a full visual flow builder.

## Intake Summary

- Input shape: `specific`
- Audience: Developers evaluating or implementing BugDrop, plus product visitors exploring customization.
- Authority: `requested`
- Proof type: `demo`
- Completion proof: A local, exact-runtime documentation walkthrough exposes the complete released v1.56.3 flow inventory, runnable component/motion/styling examples, updated API navigation, and CI checks that fail on capability drift; focused unit, build, accessibility, and desktop/mobile browser gates pass.
- Goal oracle: Compare a canonical website capability manifest to the exact authenticated SDK public types, then exercise every documented component, transition family, and styling control through the public docs and local browser examples.
- Likely misfire: Produce attractive prose or a lab-only gallery that is incomplete, advertises unreleased controls such as multi-select, over-emphasizes “legacy Classic,” or drifts from the SDK after the next release.
- Blind spots considered: Default-flow continuity; distinction between Flow and Variant capabilities; public versus lab-only components; reduced motion; styling boundaries imposed by Shadow DOM; version provenance; responsive and accessible interactive examples; no real Issue creation during local or CI proof.
- Existing plan facts: Keep the current default feedback documentation as the primary entry point; add docs plus curated live examples; document released fields, screens, conditions, layouts, evidence, motion, styling, `registerFlow`, handles, inputs, and outcomes; enforce inventory synchronization in CI; do not build a full visual editor in this tranche.

## Goal Oracle

The oracle for this goal is:

`Against the exact authenticated v1.56.3 public types, a machine-checked capability inventory has no missing or extra field, screen, condition, presentation, transition, easing, appearance, evidence, or outcome discriminator; bugdrop.dev locally presents that inventory through navigable documentation and curated working examples at desktop and mobile sizes, with reduced-motion and accessibility proof, while the default feedback flow remains the primary starting point and no external Issue is created.`

The PM must keep comparing task receipts to this oracle. Planning, discovery, a passing tiny slice, or a clean-looking board is not enough. The goal finishes only when a final Judge/PM audit maps receipts and verification back to this oracle and records `full_outcome_complete: true`.

## Goal Kind

`specific`

## Current Tranche

Complete the public information architecture, canonical capability source, reference documentation, curated live examples, API and styling updates, and automated drift/browser proof needed to document the currently released flow system. This tranche does not include new SDK components, a no-code flow builder, public homepage enablement, production deployment, or release work.

## Non-Negotiable Constraints

- Treat the existing simple feedback experience as the current default flow, not as a deprecated or heavily emphasized legacy product.
- Preserve useful existing installation, configuration, styling, API, and default-flow documentation.
- Document only capabilities proved by the exact authenticated released SDK; do not advertise exploratory lab-only controls such as multi-select.
- Distinguish Flow capabilities from Variant-only presentation such as inline mounting when the released contracts differ.
- Cover current fields, screens, branching, layout, evidence, issue formatting, lifecycle, and result contracts.
- Cover immediate replacement, all released built-in transitions, custom declarative transitions, duration/easing/direction, and reduced-motion behavior.
- Explain how default-flow script styling and per-flow appearance/presentation controls help BugDrop match an app, without implying arbitrary CSS injection through the Shadow DOM.
- Use one canonical versioned capability inventory to drive or verify documentation and examples; CI must detect SDK/docs drift.
- Examples must use the exact pinned runtime, remain local/non-mutating in ordinary development and CI, and never create a real GitHub Issue.
- Verify responsive layout, keyboard behavior, accessible names, focus restoration, and reduced-motion fallback.
- Preserve all pre-existing dirty-worktree changes and existing goal records; do not revert or rewrite unrelated work.
- Do not push, open a PR, merge, release, deploy, enable the public homepage feature, or mutate production without separate owner authority.
- Use a named `.localhost` origin for local servers.

## Stop Rule

Stop only when a final audit proves the full original outcome is complete.

Do not stop after planning, discovery, or Judge selection if a safe Worker task can be activated.

Do not stop after a single verified Worker package when the broader owner outcome still has safe local follow-up work. Advance the board to the next highest-leverage safe Worker package and continue unless a phase, risk, rejected-verification, ambiguity, or final-completion review is due.

## Slice Sizing

Safe means bounded, explicit, verified, and reversible. It does not mean tiny. Prefer coherent vertical slices: capability truth and drift protection; public documentation and examples; then browser/CI hardening and final review.

## Canonical Board

Machine truth lives at:

`docs/goals/flow-capability-documentation/state.yaml`

If this charter and `state.yaml` disagree, `state.yaml` wins for task status, active task, receipts, verification freshness, and completion truth.

## Run Command

```text
Codex: /goal Follow docs/goals/flow-capability-documentation/goal.md.
Claude Code: /goalbuddy Follow docs/goals/flow-capability-documentation/goal.md.
```

## PM Loop

On every `/goal` continuation:

1. Read this charter and the GoalBuddy execution contract.
2. Read `state.yaml`; work only on its active task.
3. Preserve the current dirty worktree and establish exact ownership before edits.
4. Keep the authenticated released SDK types as source truth.
5. Record a compact receipt and advance to the largest safe useful slice.
6. Review at phase, risk, rejected-verification, ambiguity, and final-completion boundaries.
7. Before ending, run GoalBuddy's stop checker; complete only with oracle-mapped final proof.
