# BugDrop Showcase Social Proof

## Objective

Implement the BugDrop social-proof loop: a canonical `/showcase` page in `bugdrop-web`, a subtle
homepage CTA, seeded first-party app examples, a submission/pinned issue flow in
`mean-weasel/bugdrop`, and deploy-ready handoff guidance for the GitHub Marketplace/App listing.

## Original Request

> Great - and we can list our own apps first where we are using them: bleepthat.sh,
> deckchecker.app, and seatify.app
>
> great - shall we create goalbuddy prep board for this implementation? and does this include a
> pinned issue in the bugdrop repo as well?

## Intake Summary

- Input shape: `existing_plan`
- Audience: prospective BugDrop installers, existing installers who might opt into social proof,
  and the BugDrop maintainer.
- Authority: `approved`
- Proof type: `demo`
- Completion proof: local and source inspection proves `/showcase` exists, the homepage links to it,
  the seeded first-party apps are listed honestly, a pinned submission issue exists in
  `mean-weasel/bugdrop`, and the repo/build/browser checks pass.
- Goal oracle: a local browser walkthrough of `bugdrop-web` showing `/showcase` and the homepage CTA,
  plus GitHub evidence that the submission issue exists and is pinned or an explicit blocked receipt
  if GitHub pinning is unavailable.
- Likely misfire: building only a marketing page while skipping the pinned issue/submission loop, or
  using copy that implies external customer adoption before opt-in submissions exist.
- Blind spots considered:
  - The current `bugdrop-web` worktree already has unrelated unstaged edits and must not have them
    overwritten.
  - The canonical page belongs in `bugdrop-web`; the `bugdrop` repo and Marketplace/App listing are
    feeders into that page.
  - GitHub issue pinning may require repo permissions or a CLI/API path that needs verification.
  - The seed apps are first-party examples, not external customer proof.
- Existing plan facts:
  - Design spec: `docs/superpowers/specs/2026-07-03-bugdrop-showcase-design.md`.
  - Seed apps: `https://bleepthat.sh`, `https://deckchecker.app`, and `https://seatify.app`.
  - Preferred path: `/showcase`.
  - Required supporting artifact: pinned GitHub issue in `mean-weasel/bugdrop`.

## Goal Oracle

The oracle for this goal is:

`A local browser walkthrough and repository/GitHub inspection prove the BugDrop site has a truthful
/showcase page seeded with the three first-party apps, the homepage has an understated CTA to it,
the submission flow points to a pinned issue in mean-weasel/bugdrop, and the relevant lint/build
checks pass without overwriting unrelated local edits.`

The PM must keep comparing task receipts to this oracle. Planning, discovery, a pretty page, or a
created GitHub issue alone is not enough. The goal finishes only when a final Judge/PM audit maps
receipts and verification back to this oracle and records `full_outcome_complete: true`.

## Goal Kind

`existing_plan`

## Current Tranche

Complete the first shippable social-proof loop:

- `/showcase` in `bugdrop-web`;
- homepage CTA in `bugdrop-web`;
- seeded first-party app examples for Bleep That Sh*t!, DeckChecker, and Seatify;
- pinned GitHub issue in `mean-weasel/bugdrop` for opt-in submissions;
- README or handoff copy where appropriate;
- Marketplace/App listing update instructions after the page URL exists.

## Non-Negotiable Constraints

- Do not imply external customers until external opt-in submissions exist.
- Do not publish GitHub App install metadata automatically.
- Do not overwrite unrelated local changes in `bugdrop-web` (`AGENTS.md`, `CLAUDE.md`,
  `src/components/analytics.tsx`) or unrelated local changes in `bugdrop`.
- Do not generate or scrape seed-app brand assets unless approved assets already exist locally.
- Keep the homepage CTA understated and out of the hero.
- Treat the pinned issue as part of the owner outcome, not an optional follow-up.
- Marketplace/App listing edits may require manual operator action; record exact copy and URL if
  direct editing is unavailable.

## Stop Rule

Stop only when a final audit proves the full original outcome is complete.

Do not stop after planning, discovery, or Judge selection if a safe Worker/PM task can be activated.
Do not call the tranche complete if `/showcase` exists but the pinned issue/submission loop is
missing or unverified.

## Slice Sizing

Safe means bounded, explicit, verified, and reversible. It does not mean tiny.

The preferred implementation slice should create the complete local web experience in one coherent
Worker task after Scout/Judge validation. The GitHub issue/pinning task may be a separate PM task
because it touches an external artifact and provides the URL needed by the page.

## Board Health

The PM owns board health. If the board looks stale, misleading, offline, or inconsistent, run:

```bash
node /Users/neonwatty/.codex/plugins/cache/goalbuddy/goalbuddy/0.3.9/skills/goalbuddy/scripts/check-goal-state.mjs docs/goals/bugdrop-showcase-social-proof
```

Repair only GoalBuddy control files unless an active Worker or PM task explicitly allows product or
GitHub artifact changes.

## Canonical Board

Machine truth lives at:

`docs/goals/bugdrop-showcase-social-proof/state.yaml`

If this charter and `state.yaml` disagree, `state.yaml` wins for task status, active task,
receipts, verification freshness, and completion truth.

## Run Command

```text
/goal Follow docs/goals/bugdrop-showcase-social-proof/goal.md.
```

## PM Loop

On every `/goal` continuation:

1. Read this charter.
2. Read `state.yaml`.
3. Run the bundled GoalBuddy update checker when available and mention a newer version without
   blocking.
4. Work only on the active board task.
5. Preserve unrelated worktree changes.
6. Write a compact task receipt.
7. Update the board.
8. Continue to the next safe task until the oracle is satisfied.
9. Finish only with a Judge/PM audit receipt that maps receipts and verification back to the
   original user outcome and records `full_outcome_complete: true`.
