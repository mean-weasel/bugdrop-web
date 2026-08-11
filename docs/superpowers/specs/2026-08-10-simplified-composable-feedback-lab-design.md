# Simplified Composable Feedback Lab Design

## Goal

Make the unpublished variants lab explain BugDrop's composable UX in seconds. Visitors should
immediately understand that BugDrop supplies a small set of feedback building blocks, see a few
useful combinations, try them locally, and request a missing block through GitHub.

The page is a focused product demonstration, not a general-purpose configuration tool.

## Success Criteria

- The hero and primitive inventory communicate the building-block model without scrolling through
  setup controls or implementation details.
- The page presents exactly five plain-language blocks: Short answer, Long answer, Rating, Single
  choice, and Multiple choice.
- Visitors can switch among exactly three recipes and use each one in a single shared workspace.
- A compact local GitHub Issue preview explains the result without competing with the form.
- A final CTA lets visitors request a missing building block in `mean-weasel/bugdrop`.
- The existing local-only, accessible, responsive interaction lifecycle remains intact.

## Information Architecture

The page should contain four concise sections, in this order:

1. Compact hero
2. Building blocks and recipe selectors
3. Shared playable workspace with compact Issue preview
4. Missing-block GitHub CTA

Remove the current secondary-controls section entirely. The page will no longer expose appearance,
editable copy, or generated public configuration.

## Hero

Use a short hero with no competing explanation layers:

- Eyebrow: `Composable feedback`
- H1: `Build feedback your way.`
- Supporting line: `Choose from five building blocks and try a few useful combinations.`
- Keep one quiet local-simulation disclosure near the playable workspace rather than a prominent
  hero callout.

## Building Blocks

Show five compact blocks using customer-facing names. Omit implementation identifiers from the
visible page; they remain documented here only to lock the mapping:

| Visible name | Core field type | Meaning |
| --- | --- | --- |
| Short answer | `shortText` | One concise line |
| Long answer | `longText` | Open-ended context |
| Rating | `rating` | A scored response |
| Single choice | `singleChoice` | Choose exactly one option |
| Multiple choice | `multiSelect` | Choose several options |

These blocks are an inventory, not draggable builder controls. They explain the available pieces
without implying that the lab is a form-builder product.

## Recipes And Shared Workspace

Retain exactly three compact recipe selectors:

- Focused bug report
- Product review
- Roadmap vote

Each selector should list its constituent blocks in plain language. Selecting a recipe replaces the
contents of one shared workspace; it must not create independent gallery cards.

Preserve the current behavior:

- Explicit submit only; selecting or answering never submits.
- Required-field validation and visible invalid-control focus.
- Deterministic local failure, answer-preserving retry, and local success.
- Reset returns to the recipe's initial state and first visible field.
- The modal recipe retains focus containment and trigger focus return.
- Native radio and checkbox semantics remain intact.

## Compact GitHub Issue Preview

Keep one Issue preview adjacent to the active form on desktop and directly beneath it on mobile.
Reduce its visual weight so the form remains primary.

The preview continues to mirror the real BugDrop contract, including configured ordering, stable
title values, display labels, rating stars, Markdown sections, fallback values, and classification
labels. It must continue to say that no Issue was created and perform no network submission.

## Missing-Block CTA

End the page with a small, direct CTA:

- Heading: `Missing a building block?`
- Supporting copy: `Tell us what feedback experience your product needs.`
- Action: `Request one on GitHub`
- Destination: `https://github.com/mean-weasel/bugdrop/issues/new`

The link opens GitHub's issue composer. The lab itself does not collect or transmit the request.

## Visual Direction

- Reduce section labels, explanatory copy, borders, nested panels, and competing badges.
- Use whitespace and type hierarchy instead of additional containers wherever possible.
- Keep the five blocks scannable at a glance and the recipes visibly subordinate to them.
- Make the shared form the strongest interactive element.
- Keep the Issue preview visibly secondary but legible.
- Preserve clean containment at desktop and 390px mobile widths.

## Non-Goals

- No appearance, theme, density, accent, or editable-copy controls.
- No generated public configuration display.
- No drag-and-drop or general-purpose form builder.
- No real GitHub Issue creation from the lab.
- No authenticated repository selection or submission history.
- No publication, navigation, or sitemap promotion in this change.

## Testing And Proof

Before considering the simplification complete:

- Assert the visible inventory is exactly the five approved plain-language blocks.
- Assert exactly three recipes still cover every core field type.
- Assert the removed secondary controls and generated configuration are absent.
- Assert the missing-block CTA has the approved copy and GitHub destination.
- Preserve model parity tests for normalization and Issue output.
- Run lint, the full web test suite, and an analytics-unset production build.
- Dogfood the production build at desktop and 390px mobile widths.
- Verify all recipes, validation, failure/retry/success, reset, modal focus, and Issue preview.
- Verify no console errors, horizontal overflow, submission requests, navigation/sitemap exposure, or
  loss of `noindex, nofollow`.

## Implementation Boundary

The expected implementation remains inside the existing variants-lab page, component, model,
stylesheet, and model test. Core behavior is already complete and should not change for this visual
and information-hierarchy simplification.
