# Multiple-choice recipe and cumulative rating design

## Goal

Make the composable feedback lab demonstrate Multiple choice as a first-class recipe and make the Rating block visually communicate the selected score by filling every star through the chosen value.

## Scope

This is a focused extension of the simplified local-only lab at `/labs/variants`.

- Add one fourth recipe named **Feature priorities** to **Try a combination**.
- Keep the five existing building blocks unchanged.
- Keep the single shared playable workspace and single local GitHub Issue preview.
- Update the Product review rating so selecting 4 fills stars 1 through 4.
- Preserve the existing local-only disclosure, explicit submit lifecycle, deterministic failure/retry/success states, answer retention, reset behavior, focus behavior, noindex isolation, and zero-submission behavior.
- Do not add appearance controls, editable copy, generated configuration, or a public styling API.

## Feature priorities recipe

The recipe is an inline example centered on a single required Multiple choice field.

- Name: `Feature priorities`
- Picker summary: `Choose several improvements for the next release.`
- Eyebrow: `Recipe 04 · Priorities`
- Title: `What should we improve together?`
- Description: `Choose every area that would make the biggest difference.`
- Field label: `Improvement areas`
- Options, in stable display and output order:
  1. Performance
  2. Documentation
  3. Integrations
  4. Notifications
- Submit label: `Preview priorities`
- Success title: `Priorities ready`
- Success message: `The local Issue draft is ready for review.`

At least one option is required. Selecting options never submits. The first explicit preview attempt uses the existing deterministic failure state, and retry produces the existing success state without clearing answers.

The local Issue draft uses feature classification, the title template `Feature priorities: {{priorities}}`, and one `Priorities` section containing the configured option labels. Its labels remain the standard feature labels: `enhancement` and `bugdrop`.

## Cumulative rating display

The Product review retains five native radio inputs and the existing `Rough` and `Excellent` endpoint labels. Each rendered star receives a component-owned filled state when its numeric value is less than or equal to the selected rating. CSS colors filled stars with the existing accent token and leaves later stars muted.

For example, selecting 4 produces four accent-colored stars followed by one muted star. Changing the selection recomputes the filled range. This is visual state only: native radio semantics, keyboard behavior, accessible names, validation, and Issue output remain unchanged.

## Styling boundary

The lab continues to use shared surface variables for its internal theme and dedicated classes for individual field types. The cumulative star treatment belongs to the Rating renderer and its CSS module. The new recipe reuses the existing Multiple choice renderer and does not introduce recipe-specific styling.

This preserves the current product message: building blocks are composable and internally styleable, while this page demonstrates UX possibilities rather than serving as a public theme configurator.

## Model and component changes

- Extend `RECIPE_IDS` and `RecipeId` with `featurePriorities`.
- Add the recipe to `RECIPES` using the existing `multiSelect` field model and Issue compiler.
- Continue deriving picker labels from recipe fields, so the fourth picker reads `Multiple choice` without separate display data.
- Derive each rating star's filled state from `interaction.answers[field.id]` in the existing Rating renderer.
- Add one small CSS selector for filled rating stars and remove the selected-star-only rule it replaces.

No new component, route, storage, network call, or backend contract is required.

## Verification

Automated coverage must prove:

- There are still exactly five building blocks and now exactly four recipes.
- `featurePriorities` starts with an empty array, rejects an empty required selection, normalizes selections to configured order, and compiles the expected feature Issue draft.
- The picker continues to derive `Multiple choice` from the recipe field.
- The Rating renderer marks every star through the selected value as filled and does not change its native radio labels or endpoint association.
- Existing content-removal, local-only, accessibility, and lifecycle tests remain green.

The production-mode browser walkthrough must cover desktop and 390px widths, select several Feature priorities, verify failure/retry/success and Issue preview output, select a four-star Product review, and visually confirm four filled stars with no console or layout regression.
