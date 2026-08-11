# Multiple-choice Recipe and Cumulative Rating Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a fourth Feature priorities recipe centered on Multiple choice and make Product review fill every star through the selected rating.

**Architecture:** Extend the existing recipe registry so the shared workspace, validation lifecycle, and Issue compiler automatically support the new example. Keep cumulative star state inside the existing Rating renderer, expose it to the CSS module with a `data-filled` attribute, and preserve native radio semantics.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS Modules, Vitest

## Global Constraints

- Keep the five building blocks unchanged and add `Feature priorities` as a fourth recipe.
- Keep one shared workspace and one local GitHub Issue preview.
- Preserve the local-only disclosure, explicit submit, deterministic failure/retry/success, answer retention, reset and focus behavior, noindex isolation, and zero-submission behavior.
- Do not add appearance controls, editable copy, generated configuration, a public styling API, dependencies, routes, storage, network calls, or backend changes.
- Selecting 4 fills stars 1 through 4 while retaining five native radios, their accessible names, and the `Rough`/`Excellent` scale description.
- Do not edit or stage the two pre-existing untracked `docs/goals/` directories.

---

### Task 1: Register and compile the Feature priorities recipe

**Files:**
- Modify: `src/components/variants-lab/model.ts`
- Test: `test/variants-lab-model.test.ts`

**Interfaces:**
- Consumes: `Recipe`, `RecipeId`, `RECIPES`, `RECIPE_IDS`, `emptyAnswers`, `normalizeAnswers`, and `compileIssueDraft`.
- Produces: `RecipeId` value `featurePriorities` and `RECIPES.featurePriorities`, available to the existing picker and workspace through `RECIPE_IDS`.

- [ ] **Step 1: Update the inventory test to require four recipes**

Replace the recipe-count assertion with:

```ts
expect(RECIPE_IDS).toEqual([
  "bugReport",
  "productReview",
  "roadmapVote",
  "featurePriorities",
]);
```

Keep the assertion that the union of recipe field types equals the five `PRIMITIVE_IDS`.

- [ ] **Step 2: Add failing validation and Issue-draft coverage**

Add:

```ts
it("validates and compiles the multiple-choice Feature priorities recipe", () => {
  expect(emptyAnswers("featurePriorities")).toEqual({ priorities: [] });
  expect(normalizeAnswers("featurePriorities", { priorities: [] })).toEqual({
    ok: false,
    field: "priorities",
    message: "Choose at least one improvement areas.",
  });

  const result = compileIssueDraft("featurePriorities", {
    priorities: ["integrations", "performance"],
  });
  expect(result).toMatchObject({
    ok: true,
    draft: {
      title: "Feature priorities: performance, integrations",
      labels: ["enhancement", "bugdrop"],
      sections: [{
        heading: "Priorities",
        format: "text",
        value: "Performance, Integrations",
      }],
    },
  });
});
```

- [ ] **Step 3: Verify the test fails for the missing recipe**

Run `npx vitest run test/variants-lab-model.test.ts`.

Expected: FAIL because `featurePriorities` is absent from `RecipeId`, `RECIPE_IDS`, and `RECIPES`.

- [ ] **Step 4: Extend the recipe registry**

Change the registry to:

```ts
export const RECIPE_IDS = [
  "bugReport",
  "productReview",
  "roadmapVote",
  "featurePriorities",
] as const;
```

Add this `RECIPES` entry after `roadmapVote`:

```ts
featurePriorities: {
  id: "featurePriorities",
  name: "Feature priorities",
  summary: "Choose several improvements for the next release.",
  eyebrow: "Recipe 04 · Priorities",
  presentation: { kind: "inline" },
  content: {
    title: "What should we improve together?",
    description: "Choose every area that would make the biggest difference.",
    submitLabel: "Preview priorities",
    successTitle: "Priorities ready",
    successMessage: "The local Issue draft is ready for review.",
  },
  fields: [{
    id: "priorities",
    type: "multiSelect",
    label: "Improvement areas",
    required: true,
    display: "checkboxes",
    options: [
      { value: "performance", label: "Performance" },
      { value: "documentation", label: "Documentation" },
      { value: "integrations", label: "Integrations" },
      { value: "notifications", label: "Notifications" },
    ],
  }],
  issue: {
    classification: "feature",
    title: "Feature priorities: {{priorities}}",
    sections: [
      { heading: "Priorities", field: "priorities", format: "choice" },
    ],
  },
},
```

Do not add picker-specific JSX. The existing `RECIPE_IDS.map` and `PRIMITIVE_COPY[field.type].label` path must render `Feature priorities` and `Multiple choice` from the model.

- [ ] **Step 5: Run focused and full tests**

Run:

```bash
npx vitest run test/variants-lab-model.test.ts
npm test
```

Expected: both PASS and the full suite includes the new test.

- [ ] **Step 6: Commit Task 1**

```bash
git add src/components/variants-lab/model.ts test/variants-lab-model.test.ts
git commit -m "feat: add feature priorities recipe"
```

---

### Task 2: Render cumulative rating stars and verify the lab

**Files:**
- Modify: `src/components/variants-lab/variants-lab.tsx`
- Modify: `src/components/variants-lab/variants-lab.module.css`
- Test: `test/variants-lab-content.test.ts`

**Interfaces:**
- Consumes: numeric Rating answers, existing radio inputs, `--lab-accent`, `--muted`, and `featurePriorities` from Task 1.
- Produces: `data-filled="true"` on each Rating label whose value is at most the selected answer; no new exported API.

- [ ] **Step 1: Add a failing source-contract test**

Add:

```ts
it("derives the fourth picker and cumulative rating state", () => {
  expect(component).toContain("RECIPE_IDS.map");
  expect(component).toContain("PRIMITIVE_COPY[field.type].label");
  expect(component).toContain("const selectedRating");
  expect(component).toContain("data-filled={value <= selectedRating}");
  expect(styles).toContain('.rating label[data-filled="true"] span');
  expect(styles).not.toContain(
    ".rating input:checked + span { color: var(--lab-accent); }",
  );
});
```

- [ ] **Step 2: Verify the content test fails**

Run `npx vitest run test/variants-lab-content.test.ts`.

Expected: FAIL because the renderer lacks `selectedRating`/`data-filled` and CSS still colors only the checked star.

- [ ] **Step 3: Derive filled state in the Rating renderer**

At the start of the `field.type === "rating"` branch, add:

```ts
const selectedRating =
  typeof interaction.answers[field.id] === "number"
    ? interaction.answers[field.id]
    : 0;
```

Change each existing star label to:

```tsx
<label key={value} data-filled={value <= selectedRating}>
```

Do not otherwise change the radio input, fieldset description, endpoint labels, validation message, or first-radio focus ref.

- [ ] **Step 4: Replace selected-only star color CSS**

Retain the muted default:

```css
.rating span { color: var(--muted); font-size: 1.65rem; }
```

Remove the two existing `.rating input:checked + span` rules and their sibling reset rule. Add:

```css
.rating label[data-filled="true"] span { color: var(--lab-accent); }
```

Do not reverse DOM or visual order; keyboard traversal must remain 1 through 5.

- [ ] **Step 5: Run focused checks**

Run:

```bash
npx vitest run test/variants-lab-content.test.ts test/variants-lab-model.test.ts
npm run lint
npx tsc --noEmit
```

Expected: tests, lint, and typecheck PASS.

- [ ] **Step 6: Run the full suite and production build**

Run:

```bash
npm test
env -u NEXT_PUBLIC_ANALYTICS_SCRIPT_URL -u NEXT_PUBLIC_ANALYTICS_WEBSITE_ID npm run build
git diff --check
```

Expected: full suite and build PASS; `git diff --check` prints nothing.

- [ ] **Step 7: Dogfood production mode at desktop and 390×844**

Start the freshly built app on port 3100 and verify:

1. `Try a combination` contains exactly four controls; the fourth reads `Feature priorities` / `Multiple choice`.
2. Feature priorities shows one required group ordered Performance, Documentation, Integrations, Notifications.
3. Selecting Integrations then Performance compiles title `Feature priorities: performance, integrations` and section value `Performance, Integrations`.
4. First preview shows `Nothing was sent. Your answers are still here.` with answers retained; retry reaches `Priorities ready`, retains and disables answers, and focuses success.
5. Reset clears selections and returns focus to Performance.
6. Product review rating 4 shows exactly four accent stars and one muted star; its Issue output remains `★★★★☆ (4/5)`.
7. Radios remain named `1 of 5` through `5 of 5` and retain `Rough`/`Excellent` endpoints.
8. At 390×844 there is no horizontal overflow, all recipe controls are readable, and the workspace/preview stack cleanly.
9. No console warning or feedback/GitHub Issue request occurs.

- [ ] **Step 8: Commit Task 2**

```bash
git add src/components/variants-lab/variants-lab.tsx src/components/variants-lab/variants-lab.module.css test/variants-lab-content.test.ts
git commit -m "feat: fill cumulative rating stars"
```

---

## Final review

Request a whole-change review against the pre-plan commit. The reviewer must try to disprove stable multiple-choice ordering, required-empty validation, exact Issue output, cumulative star count after changing ratings, native radio semantics, local-only isolation, and mobile overflow. Address load-bearing findings before presenting branch integration options.
