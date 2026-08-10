# Simplified Composable Feedback Lab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Simplify the unpublished variants lab so visitors immediately understand five feedback building blocks, can try three recipes in one workspace, see a compact local Issue preview, and request a missing block on GitHub.

**Architecture:** Keep the existing recipe and interaction model as the single source for the playable form and Issue preview. Add a small plain-language presentation mapping for primitive names, remove the lab-only appearance/configuration model, simplify the React hierarchy around one fixed demo surface, and delete the obsolete control styles. Core BugDrop runtime code remains unchanged.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, CSS Modules, Vitest 3, Lucide React.

## Global Constraints

- Work only in `/Users/neonwatty/.codex/worktrees/bugdrop-ux-variants-gallery/bugdrop-web` on branch `codex/bugdrop-ux-variants-gallery`.
- Preserve all existing untracked lab and GoalBuddy files and unrelated user changes; do not clean, reset, rebase, or reconcile `origin/main`.
- Show exactly five visible blocks: `Short answer`, `Long answer`, `Rating`, `Single choice`, and `Multiple choice`.
- Keep exactly three recipes and one shared workspace; do not introduce independent gallery cards or a form builder.
- Remove appearance, theme, density, accent, editable-copy, and generated-configuration controls from the page and lab model.
- Keep one compact local GitHub Issue preview; it must remain contract-accurate and must not create an Issue.
- Add `Request one on GitHub` linking to `https://github.com/mean-weasel/bugdrop/issues/new`.
- Preserve explicit submit, validation, deterministic failure/retry/success, answer retention, reset focus, modal focus, native radios/checkboxes, reduced motion, and 390px containment.
- Keep `/labs/variants` unpublished, `noindex, nofollow`, absent from navigation and sitemap, and free of submission-capable network code.
- Do not modify the core BugDrop worktree, install dependencies, push, deploy, publish, or create a real GitHub Issue.

---

## File Map

- `src/components/variants-lab/model.ts`: Retains recipes, answer normalization, interaction state, and Issue compilation; adds the visible primitive-name mapping and removes appearance/config-preview-only APIs.
- `src/components/variants-lab/variants-lab.tsx`: Renders the compact hero, plain-language blocks, recipe selectors, one workspace, compact Issue preview, and missing-block CTA.
- `src/components/variants-lab/variants-lab.module.css`: Owns the simplified visual hierarchy, fixed accessible demo surface, compact preview, CTA, and responsive behavior.
- `test/variants-lab-model.test.ts`: Locks the five visible block names and preserves model/Issue parity tests while removing obsolete configuration/appearance expectations.
- `test/variants-lab-content.test.ts`: Locks the approved hero, removed-control absence, recipe count, and GitHub CTA in the rendered component source.
- `src/app/labs/variants/page.tsx`: Must remain unchanged; its metadata already supplies `noindex, nofollow`.

---

### Task 1: Lock the simplified content and model boundary

**Files:**
- Modify: `src/components/variants-lab/model.ts:1-16, 130-145, 315-355`
- Modify: `test/variants-lab-model.test.ts:1-156`

**Interfaces:**
- Consumes: Existing `PrimitiveId`, `RECIPES`, normalization, interaction, and Issue-draft functions.
- Produces: `PRIMITIVE_COPY: Record<PrimitiveId, { label: string; note: string }>` for the component. Removes `ThemeMode`, `Density`, `EditableCopy`, `Appearance`, `defaultCopy`, `buildVariantConfig`, `variantConfigPreview`, and contrast/accent helpers because the approved page no longer exposes those concerns.

- [ ] **Step 1: Replace obsolete model expectations with a failing plain-language inventory test**

In `test/variants-lab-model.test.ts`, remove imports and tests for `accessibleAccent`, `accentForeground`, `buildVariantConfig`, `contrastRatio`, `defaultCopy`, and `variantConfigPreview`. Import `PRIMITIVE_COPY` and change the first test to:

```ts
it("presents exactly five plain-language blocks across exactly three recipes", () => {
  expect(PRIMITIVE_IDS).toEqual([
    "shortText",
    "longText",
    "rating",
    "singleChoice",
    "multiSelect",
  ]);
  expect(PRIMITIVE_IDS.map((id) => PRIMITIVE_COPY[id].label)).toEqual([
    "Short answer",
    "Long answer",
    "Rating",
    "Single choice",
    "Multiple choice",
  ]);
  expect(RECIPE_IDS).toHaveLength(3);
  const used = new Set(
    RECIPE_IDS.flatMap((id) => RECIPES[id].fields.map((field) => field.type)),
  );
  expect([...used].sort()).toEqual([...PRIMITIVE_IDS].sort());
});
```

Delete the test named `derives generated configuration and Issue output from the selected recipe model` and the parameterized accent-contrast test. Keep every normalization, interaction, title, Markdown, label, and Issue-parity assertion unchanged.

- [ ] **Step 2: Run the focused test and verify the new export is missing**

Run:

```bash
npx vitest run test/variants-lab-model.test.ts
```

Expected: FAIL because `PRIMITIVE_COPY` is not exported from `model.ts`.

- [ ] **Step 3: Add the plain-language mapping and remove obsolete lab-only APIs**

Immediately after `PrimitiveId` in `model.ts`, add:

```ts
export const PRIMITIVE_COPY: Record<
  PrimitiveId,
  { label: string; note: string }
> = {
  shortText: { label: "Short answer", note: "One concise line" },
  longText: { label: "Long answer", note: "Open-ended context" },
  rating: { label: "Rating", note: "A scored response" },
  singleChoice: { label: "Single choice", note: "Choose exactly one" },
  multiSelect: { label: "Multiple choice", note: "Choose several" },
};
```

Delete the complete declarations named `ThemeMode`, `Density`, `EditableCopy`, `Appearance`,
`defaultCopy`, `buildVariantConfig`, `variantConfigPreview`, `Rgb`, `hexToRgb`, `rgbToHex`,
`mixRgb`, `relativeLuminance`, `contrastRatio`, `accessibleAccent`, and `accentForeground`.

Do not change `RECIPES`, `normalizeAnswers`, `compileIssueDraft`, or interaction-state functions.

- [ ] **Step 4: Run focused tests and type-aware lint**

Run:

```bash
npx vitest run test/variants-lab-model.test.ts
npm run lint -- --file src/components/variants-lab/model.ts --file test/variants-lab-model.test.ts
```

Expected: model tests PASS. If this ESLint version rejects `--file`, run `npm run lint` and require PASS instead.

- [ ] **Step 5: Commit the model boundary**

```bash
git add src/components/variants-lab/model.ts test/variants-lab-model.test.ts
git commit -m "refactor: simplify variants lab model"
```

---

### Task 2: Replace the busy page hierarchy with the approved demo

**Files:**
- Create: `test/variants-lab-content.test.ts`
- Modify: `src/components/variants-lab/variants-lab.tsx:1-159`

**Interfaces:**
- Consumes: `PRIMITIVE_IDS`, `PRIMITIVE_COPY`, `RECIPES`, `RECIPE_IDS`, interaction helpers, `compileIssueDraft`, `LAB_DISCLOSURE`, and `FAILURE_MESSAGE` from Task 1.
- Produces: One fixed-surface `VariantsLab` component with exact approved copy, five plain-language blocks, three selectors, a shared playable workspace, compact Issue preview, and GitHub CTA.

- [ ] **Step 1: Add a failing source contract for the approved hierarchy**

Create `test/variants-lab-content.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const component = readFileSync(
  "src/components/variants-lab/variants-lab.tsx",
  "utf8",
);

describe("simplified variants lab content", () => {
  it("uses the approved compact hero and missing-block CTA", () => {
    expect(component).toContain("Composable feedback");
    expect(component).toContain("Build feedback your way.");
    expect(component).toContain(
      "Choose from five building blocks and try a few useful combinations.",
    );
    expect(component).toContain("Missing a building block?");
    expect(component).toContain("Request one on GitHub");
    expect(component).toContain(
      'href="https://github.com/mean-weasel/bugdrop/issues/new"',
    );
  });

  it("removes customization and generated-configuration UI", () => {
    expect(component).not.toContain("Appearance and editable copy");
    expect(component).not.toContain("Generated public configuration");
    expect(component).not.toContain("<details");
    expect(component).not.toContain("<select");
    expect(component).not.toContain('type="color"');
  });

  it("retains one shared preview and the local-only disclosure", () => {
    expect(component.match(/Local GitHub Issue preview/g)).toHaveLength(1);
    expect(component).toContain("LAB_DISCLOSURE");
    expect(component).toContain("PRIMITIVE_COPY");
    expect(component).toContain("RECIPE_IDS.map");
  });
});
```

- [ ] **Step 2: Run the content contract and verify it fails against the busy page**

Run:

```bash
npx vitest run test/variants-lab-content.test.ts
```

Expected: FAIL because the new hero and CTA are absent and the secondary controls remain.

- [ ] **Step 3: Remove appearance/configuration state and imports**

In `variants-lab.tsx`:

- Change React imports to `useMemo`, `useRef`, and `useState` only.
- Add `ArrowUpRight` to the Lucide imports.
- Remove `CSSProperties`, `useEffect`, `accessibleAccent`, `accentForeground`, `defaultCopy`, `Appearance`, `Density`, `EditableCopy`, `ThemeMode`, and `variantConfigPreview` imports.
- Import `PRIMITIVE_COPY` from `model.ts`.
- Delete the local `PRIMITIVE_NOTES` object.
- Delete `copy`, `theme`, `density`, `accent`, and `prefersDark` state.
- Delete the color-scheme effect, `appearance`, `darkSurface`, `renderedAccent`, `surfaceStyle`, and `config`.
- Remove `setCopy(defaultCopy(next))` from `chooseRecipe`.

Use `recipe.content.title`, `recipe.content.description`, and `recipe.content.submitLabel` directly wherever editable copy was previously read.

- [ ] **Step 4: Replace the top-level JSX with the approved four-section structure**

Keep `renderField`, submission, reset, success focus, and dialog mechanics unchanged. Replace the JSX hierarchy with this structure:

```tsx
return (
  <main className={styles.lab}>
    <header className={styles.hero}>
      <span className={styles.labTag}>
        <FlaskConical aria-hidden="true" /> Composable feedback
      </span>
      <h1>Build feedback your way.</h1>
      <p>Choose from five building blocks and try a few useful combinations.</p>
    </header>

    <section className={styles.explorer} aria-labelledby="blocks-heading">
      <header className={styles.sectionHeader}>
        <h2 id="blocks-heading">Start with a building block</h2>
      </header>
      <ul className={styles.primitiveList}>
        {PRIMITIVE_IDS.map((primitive) => (
          <li key={primitive}>
            <strong>{PRIMITIVE_COPY[primitive].label}</strong>
            <span>{PRIMITIVE_COPY[primitive].note}</span>
          </li>
        ))}
      </ul>

      <div className={styles.recipePicker}>
        <span>Try a combination</span>
        <div className={styles.recipeTabs}>
          {RECIPE_IDS.map((id) => (
            <button
              key={id}
              type="button"
              aria-pressed={recipeId === id}
              onClick={() => chooseRecipe(id)}
            >
              <strong>{RECIPES[id].name}</strong>
              <small>
                {RECIPES[id].fields
                  .map((field) => PRIMITIVE_COPY[field.type].label)
                  .join(" + ")}
              </small>
            </button>
          ))}
        </div>
      </div>
    </section>

    <section className={styles.workspace} aria-labelledby="workspace-heading">
      <header className={styles.workspaceHeader}>
        <div>
          <span>Live example</span>
          <h2 id="workspace-heading" ref={workspaceRef} tabIndex={-1}>
            {recipe.name}
          </h2>
        </div>
        <p className={styles.disclosure}>
          <ShieldCheck aria-hidden="true" /> {LAB_DISCLOSURE}
        </p>
      </header>
      <div className={styles.workspaceGrid}>
        <div className={styles.surface}>
          <div className={styles.widget}>
            <p className={styles.eyebrow}>{recipe.eyebrow}</p>
            <h3>{recipe.content.title}</h3>
            <p className={styles.prompt}>{recipe.content.description}</p>
            {recipe.presentation.kind === "modal" ? (
              <button
                ref={modalTriggerRef}
                type="button"
                className={styles.primaryButton}
                onClick={() => dialogRef.current?.showModal()}
              >
                Open feedback recipe
              </button>
            ) : form}
          </div>
        </div>
        <aside className={styles.issuePreview} aria-label="Local GitHub Issue preview">
          <div className={styles.previewHeader}>
            <div>
              <span>Local GitHub Issue</span>
              <strong>Issue preview</strong>
            </div>
            <b>Not created</b>
          </div>
          {issue.ok ? (
            <>
              <h3>{issue.draft.title}</h3>
              <div className={styles.labels}>
                {issue.draft.labels.map((label) => <span key={label}>{label}</span>)}
              </div>
              <pre>{issue.draft.body}</pre>
              <small>Local preview only — nothing was submitted.</small>
            </>
          ) : (
            <div className={styles.previewEmpty}>
              <strong>Complete the required blocks</strong>
              <span>The Issue preview will compile here as you answer.</span>
            </div>
          )}
        </aside>
      </div>
    </section>

    <section className={styles.requestBlock}>
      <div>
        <h2>Missing a building block?</h2>
        <p>Tell us what feedback experience your product needs.</p>
      </div>
      <a href="https://github.com/mean-weasel/bugdrop/issues/new">
        Request one on GitHub <ArrowUpRight aria-hidden="true" />
      </a>
    </section>

    {recipe.presentation.kind === "modal" ? (
      <dialog
        ref={dialogRef}
        className={`${styles.dialog} ${styles.surface}`}
        onClose={() => modalTriggerRef.current?.focus()}
      >
        <header>
          <div>
            <p className={styles.eyebrow}>{recipe.eyebrow}</p>
            <h2>{recipe.content.title}</h2>
          </div>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Close feedback recipe"
            onClick={closeDialog}
          >
            <X aria-hidden="true" />
          </button>
        </header>
        <p className={styles.prompt}>{recipe.content.description}</p>
        {form}
      </dialog>
    ) : null}
  </main>
);
```

The workspace surface in the complete structure above replaces the current dynamic surface. Its
form action must use `recipe.content.submitLabel`:

```tsx
<button type="button" className={styles.primaryButton} onClick={submit}>
  {interaction.status === "failure"
    ? "Retry local preview"
    : recipe.content.submitLabel}
</button>
```

Do not change the `issue.ok` branches shown above or the `Not created` text.

- [ ] **Step 5: Keep the conditional dialog on the same fixed surface**

Render the dialog only for the modal recipe, exactly as today, but use:

```tsx
<dialog
  ref={dialogRef}
  className={`${styles.dialog} ${styles.surface}`}
  onClose={() => modalTriggerRef.current?.focus()}
>
```

The dialog title and description must read from `recipe.content`. Do not alter the close, validation, reset, submit, retry, or success focus handlers.

- [ ] **Step 6: Run the content and model tests**

Run:

```bash
npx vitest run test/variants-lab-content.test.ts test/variants-lab-model.test.ts
```

Expected: both files PASS.

- [ ] **Step 7: Run lint and fix only component-local issues**

Run:

```bash
npm run lint
```

Expected: PASS with no unused imports, state, or dead configuration references.

- [ ] **Step 8: Commit the simplified hierarchy**

```bash
git add src/components/variants-lab/variants-lab.tsx test/variants-lab-content.test.ts
git commit -m "feat: simplify composable feedback lab"
```

---

### Task 3: Reduce visual noise and prove the finished production page

**Files:**
- Modify: `src/components/variants-lab/variants-lab.module.css:1-104`
- Test: `test/variants-lab-content.test.ts`

**Interfaces:**
- Consumes: The Task 2 class names `hero`, `explorer`, `sectionHeader`, `primitiveList`, `recipePicker`, `recipeTabs`, `workspace`, `workspaceHeader`, `disclosure`, `workspaceGrid`, `surface`, `widget`, `issuePreview`, and `requestBlock`.
- Produces: The final compact desktop/mobile hierarchy with fixed accessible colors and no obsolete control selectors.

- [ ] **Step 1: Add a failing obsolete-style source assertion**

Extend `test/variants-lab-content.test.ts`:

```ts
const styles = readFileSync(
  "src/components/variants-lab/variants-lab.module.css",
  "utf8",
);

it("removes obsolete customization styles", () => {
  for (const obsolete of [
    ".secondary",
    ".controls",
    ".configPreview",
    ".themeLight",
    ".themeDark",
    ".themeAuto",
    ".comfortable",
    ".compact",
  ]) {
    expect(styles).not.toContain(obsolete);
  }
  expect(styles).toContain(".requestBlock");
  expect(styles).toContain(".primitiveList");
});
```

- [ ] **Step 2: Run the test and verify obsolete selectors are detected**

Run:

```bash
npx vitest run test/variants-lab-content.test.ts
```

Expected: FAIL because the old control/theme selectors remain and the new CTA selector is absent.

- [ ] **Step 3: Replace the page-level hierarchy styles**

Delete styles for `.safetyNote`, `.primitives`, `.recipes`, `.secondary`, `.controls`, `.configPreview`, `.themeLight`, `.themeDark`, `.themeAuto`, `.comfortable`, and `.compact`.

Use these page-level values as the implementation baseline:

```css
.lab { color: #e9ecff; padding-bottom: 56px; }
.hero { max-width: 720px; padding: 18px 0 10px; }
.hero h1 {
  margin: 18px 0 10px;
  font-size: clamp(2.35rem, 5vw, 4.2rem);
  font-weight: 650;
  letter-spacing: -.05em;
  line-height: 1;
}
.hero > p { margin: 0; color: #a7acc7; font-size: 1rem; line-height: 1.55; }
.explorer, .workspace, .requestBlock { margin-top: 30px; }
.sectionHeader h2, .workspaceHeader h2, .requestBlock h2 {
  margin: 0;
  color: #f4f5ff;
  font-size: 1.35rem;
}
.primitiveList {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
}
.primitiveList li {
  border: 1px solid #393e5d;
  border-radius: 10px;
  background: #202333;
  padding: 12px;
}
.primitiveList strong, .primitiveList span { display: block; }
.primitiveList strong { color: #f0f2ff; font-size: .78rem; }
.primitiveList span { margin-top: 4px; color: #939ab8; font-size: .66rem; }
.recipePicker { margin-top: 18px; }
.recipePicker > span { color: #9bdcff; font-size: .68rem; font-weight: 800; text-transform: uppercase; }
.recipeTabs { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 9px; }
.recipeTabs button {
  min-height: 44px;
  border: 1px solid #414764;
  border-radius: 10px;
  background: #202333;
  padding: 10px 12px;
  color: inherit;
  font: inherit;
  text-align: left;
}
.recipeTabs span { display: none; }
.recipeTabs small { margin-top: 3px; font-family: inherit; font-size: .6rem; }
```

- [ ] **Step 4: Fix the demo surface and compact the Issue preview**

Make `.surface` the single fixed accessible appearance:

```css
.surface {
  --surface: #fff;
  --surface-soft: #f1f5f9;
  --ink: #0f172a;
  --muted: #64748b;
  --border: #d9e0e9;
  --danger: #b91c1c;
  --success: #15803d;
  --lab-accent: #1d4ed8;
  --lab-accent-foreground: #fff;
  --pad: 22px;
  font-family: system-ui, sans-serif;
}
```

Reduce the workspace shell and preview:

```css
.workspaceHeader { display: flex; align-items: end; justify-content: space-between; gap: 18px; }
.workspaceHeader span { color: #9bdcff; font-size: .66rem; font-weight: 800; text-transform: uppercase; }
.disclosure { display: flex; max-width: 360px; align-items: center; gap: 7px; margin: 0; color: #9098b8; font-size: .68rem; }
.disclosure svg { width: 15px; height: 15px; flex: none; }
.workspaceGrid { margin-top: 14px; }
.workspaceGrid > .surface { min-height: 460px; }
.issuePreview { min-height: 280px; padding: 16px; }
.previewEmpty { min-height: 180px; }
.issuePreview pre { max-height: 280px; }
```

Retain all field, action, state, dialog, and focus styles. Remove obsolete selectors from the focus-visible list.

- [ ] **Step 5: Add the missing-block CTA styles and mobile rules**

Add:

```css
.requestBlock {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  border-top: 1px solid #343950;
  padding-top: 24px;
}
.requestBlock p { margin: 5px 0 0; color: #939ab8; font-size: .78rem; }
.requestBlock a {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  gap: 7px;
  border: 1px solid #5a6284;
  border-radius: 9px;
  padding: 10px 13px;
  color: #dce7ff;
  font-size: .74rem;
  font-weight: 780;
  text-decoration: none;
}
.requestBlock a:hover { border-color: #9bdcff; color: #fff; }
.requestBlock a:focus-visible { outline: 3px solid #7dcfff; outline-offset: 3px; }
.requestBlock svg { width: 15px; height: 15px; }
```

Use these responsive rules:

```css
@media (max-width: 900px) {
  .primitiveList { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .workspaceGrid { grid-template-columns: 1fr; }
  .workspaceHeader { align-items: flex-start; flex-direction: column; }
}
@media (max-width: 620px) {
  .hero h1 { font-size: 2.55rem; }
  .primitiveList { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .recipeTabs { display: grid; grid-template-columns: 1fr; }
  .workspaceGrid > .surface { min-height: 0; padding: 10px 6px; }
  .actions, .requestBlock { align-items: stretch; flex-direction: column; }
  .requestBlock a { justify-content: center; }
}
```

Keep the existing `prefers-reduced-motion` rule unchanged.

- [ ] **Step 6: Run targeted tests, lint, full suite, and production build**

Run:

```bash
npx vitest run test/variants-lab-content.test.ts test/variants-lab-model.test.ts
npm run lint
npm test
env -u NEXT_PUBLIC_GA_MEASUREMENT_ID -u NEXT_PUBLIC_POSTHOG_KEY npm run build
git diff --check
```

Expected: all commands PASS.

- [ ] **Step 7: Run route and submission isolation audits**

Run:

```bash
rg -n "index: false" src/app/labs/variants/page.tsx
rg -n "follow: false" src/app/labs/variants/page.tsx
! rg -n "(/labs/variants|labs/variants)" \
  src/app/sitemap.ts src/components/nav.tsx src/components/footer.tsx
! rg -n "fetch[[:space:]]*\(|XMLHttpRequest|sendBeacon|api\.github\.com|/api/feedback|/feedback" \
  src/app/labs/variants/page.tsx \
  src/components/variants-lab/model.ts \
  src/components/variants-lab/variants-lab.tsx
```

Expected: metadata searches find the two directives; both negated searches exit successfully with no matches.

- [ ] **Step 8: Dogfood the analytics-unset production build**

Start the already-built app on an unused local port:

```bash
env -u NEXT_PUBLIC_GA_MEASUREMENT_ID -u NEXT_PUBLIC_POSTHOG_KEY \
  npm run start -- --port 3100
```

Using the in-app browser, verify at desktop width and `390x844`:

1. The first viewport shows `Build feedback your way.` and all five plain-language blocks without appearance/configuration controls.
2. Exactly three recipe selectors replace one shared workspace.
3. Focused bug report exposes native multi-select checkboxes; Product review exposes rating plus multiple choice; Roadmap vote exposes single choice.
4. Selection alone stays local; invalid submit focuses the visible first invalid field; first valid submit shows deterministic failure with answers retained; retry shows success; reset focuses the first visible enabled field.
5. Modal close and Escape return focus to `Open feedback recipe`.
6. The compact preview shows correct configured-order values/labels, stars, Markdown, fallback, and `Not created`.
7. `Request one on GitHub` resolves to `https://github.com/mean-weasel/bugdrop/issues/new` without clicking it.
8. Desktop and mobile have no horizontal overflow; console warnings/errors are empty; interactions create no new submission request.

- [ ] **Step 9: Commit the visual simplification**

```bash
git add \
  src/components/variants-lab/variants-lab.module.css \
  test/variants-lab-content.test.ts
git commit -m "style: focus variants lab on building blocks"
```

---

## Final Review Gate

Before handing off, inspect:

```bash
git status --short
git diff --check
git log -4 --oneline --decorate
```

Try to disprove the change with the strongest realistic failure mode: the page looks simpler but
still communicates technical configuration, or the fixed demo surface regresses the contract and
focus behavior previously proven. Completion requires both the source-absence checks and the full
desktop/mobile interaction walkthrough above.
