# Sandbox Preview And Local Manifest Plan

Last updated: May 14, 2026

## Context

The BugDrop web sandbox lives in `mean-weasel/bugdrop-web`. Its first job is to help developers understand widget configuration, preview representative widget states, and copy install code for their own applications.

The current sandbox preview depends on a runtime-only API that does not exist in the checked-out main widget repo:

- `bugdrop-web` calls `window.BugDropPreview.openWelcome/openForm/openSuccess` inside the preview iframe.
- `mean-weasel/bugdrop` does not expose `window.BugDropPreview` on `main`.
- The `bugdrop-web` Playwright suite stubs the widget script and creates `window.BugDropPreview`, so tests can pass while the real deployed widget does not support the preview controls.

This plan intentionally narrows scope back to the sandbox problem. It does not redesign widget release distribution, pinned-by-default installs, Cloudflare artifact storage, GitHub release ZIPs, or external-user upgrade automation.

This pass is web-sandbox-only. It may inspect `mean-weasel/bugdrop` to understand public runtime behavior, but it should not require widget runtime changes. If the audit finds a runtime mismatch that cannot be represented honestly in `bugdrop-web`, record it as a follow-up unless explicitly promoted into a separate widget PR.

## Decision

Use a self-contained mock preview in `bugdrop-web`.

The sandbox preview should be an educational representation of the widget, not a hidden runtime harness. It should show welcome, form, success, and closed states reliably without requiring the real widget bundle to expose test-only preview methods.

Generated install outputs must continue to use the current real widget URL from `src/lib/links.ts` for this first pass. Changing default install URLs or pinning semantics is deferred.

The checked widget parser does not currently implement a no-submit `data-preview` runtime mode. Treat `data-preview` as sandbox-owned snippet metadata unless or until `mean-weasel/bugdrop` adds explicit public support for it. Do not promise that an own-site snippet cannot create issues unless the real widget runtime enforces that behavior.

## Goals

- Remove the sandbox dependency on `window.BugDropPreview`.
- Make welcome, form, success, and closed preview states work reliably in `bugdrop-web`.
- Keep generated install code tied to the current `WIDGET_URL`.
- Add a local sandbox manifest for supported `data-*` attributes.
- Refactor generated code helpers around that local manifest.
- Add focused tests so sandbox controls and generated snippets do not drift from the local manifest.
- Compare the sandbox manifest against the real parser in `mean-weasel/bugdrop` before implementation locks in defaults or validation rules.
- Keep lightweight manual cross-repo review guidance for future option changes.

## Non-Goals For This Pass

- Do not change the widget release distribution model.
- Do not introduce Cloudflare R2, GitHub release ZIP distribution, npm/CDN distribution, or new artifact hosting.
- Do not change production install snippets to pinned-by-default.
- Do not add release metadata generation.
- Do not add a canonical manifest to `mean-weasel/bugdrop`.
- Do not change `mean-weasel/bugdrop` runtime behavior as part of this sandbox PR.
- Do not automate update PRs from `bugdrop` to `bugdrop-web`.
- Do not build external-user PR, issue, or upgrade automation.

These are valid future topics, but they should not block fixing the sandbox preview.

## Current Repo Facts To Preserve

- `bugdrop-web/src/lib/links.ts` defines `WIDGET_URL`, currently defaulting to the hosted latest widget.
- `bugdrop-web/src/components/sandbox/widget-sandbox.tsx` generates install, preview, and agent-prompt output from sandbox state.
- `bugdrop-web/tests/e2e/sandbox.spec.ts` currently stubs the widget script and creates `window.BugDropPreview`; this is the blind spot this plan removes.
- `mean-weasel/bugdrop` currently parses widget config inline in `src/widget/index.ts`.
- `mean-weasel/bugdrop` currently supports flat widget URL shapes such as `/widget.js`, `/widget.v1.js`, `/widget.v1.14.js`, and `/widget.v1.14.0.js`.

## Pre-Sandbox Widget Hardening Pulled Forward

Before implementing this `bugdrop-web` sandbox pass, a small `mean-weasel/bugdrop` runtime hardening pass should land first.

That widget pass addresses findings that were primarily runtime concerns, not landing-page concerns:

- Build trigger button label and icon content with DOM APIs instead of raw `innerHTML`, so `data-label` and `data-icon` cannot inject markup.
- Restrict `data-icon` to `http`, `https`, relative URLs, or `none`; reject executable and `data:` URLs.
- Sanitize configurable CSS values before applying them to widget, element-picker, and area-picker styles:
  - colors
  - font family
  - radius
  - border width
  - border color
  - shadow preset
- Validate initial parser values for `data-theme`, `data-position`, `data-dismiss-duration`, `data-screenshot-scale`, and `data-shadow` before they reach runtime behavior.
- Make `data-require-name` imply `data-show-name` and `data-require-email` imply `data-show-email` in the widget runtime, matching the existing docs and sandbox UX expectation.
- Escape modal titles and sanitize public issue links before rendering success UI.
- Add focused sanitizer, picker-style, and theme tests in `mean-weasel/bugdrop`.

After that widget hardening lands, the sandbox manifest should target the hardened parser semantics. Normal `bugdrop-web` CI still must not require a sibling `../bugdrop` checkout; cross-repo comparison remains a manual audit or an optional smoke test.

## Phase 0: Audit Runtime And Docs Before Coding

Before adding the manifest, audit the current option semantics against the real widget parser and docs.

Create a short implementation note or checklist table covering each sandbox-supported option:

- runtime parser behavior in `mean-weasel/bugdrop/src/widget/index.ts`
- current sandbox default and generated output behavior
- current docs behavior in `bugdrop-web/src/content/docs/configuration.mdx`
- final manifest runtime default, sandbox initial value, enum values, validation kind, dependency behavior, and omission behavior
- any known mismatch that should be fixed now or recorded as a follow-up

Specific mismatches to resolve or explicitly record before building the manifest:

- `data-theme` default: the widget parser currently defaults to `auto`; some docs still describe `light`. Fix the docs in this PR.
- `data-welcome`: the widget parser treats this as `once`, `always`, `never`, or legacy `false`; some docs still describe it as welcome message text. Fix the docs in this PR.
- `data-dismiss-duration`: the widget parser treats a number as days; some docs still describe minutes or session behavior. Fix the docs in this PR.
- submitter field dependencies: after the widget hardening pass, the runtime treats `data-require-name` as implying `data-show-name` and `data-require-email` as implying `data-show-email`. Keep generated output explicit if it improves snippet readability, but the docs and manifest may describe this as runtime behavior once the widget change is released.
- `data-shadow`: the widget runtime currently recognizes shadow presets such as `none`, `soft`, and `hard`; the sandbox currently emits a full CSS box-shadow string. For this PR, make the sandbox manifest and generated output match the current runtime enum behavior.
- styling values: after the widget hardening pass, the runtime validates style-oriented values before applying them to CSS. The sandbox mock should still route values through its own escaping/sanitizing path before injecting values into iframe CSS.
- `data-icon`: after the widget hardening pass, the runtime treats this as an `http`/`https`/relative image URL or `none`. Generated output must still escape it safely, and the mock should use the same narrow URL allowlist before rendering it or explicitly mark icon rendering as not previewed.
- `data-category-labels`: the widget parser tolerates unknown/invalid per-key values with warnings, while sandbox generated output may choose stricter omission rules.
- `data-preview`: the widget parser does not currently parse this as a no-submit mode. Keep it out of the production manifest, keep it out of safety guarantees, and either remove no-issue claims from own-site snippets or gate them on verified runtime support.

Expected result: the local manifest is based on the real public runtime semantics, with known docs mismatches fixed in the same PR and any true runtime-behavior changes captured as follow-up work.

## Phase 1: Clarify The Sandbox Contract

Make the sandbox explicitly educational, not a runtime preview API consumer.

- Rename the iframe preview concept internally to something like `MockWidgetPreview`.
- Add concise preview-panel copy that the preview is representative of configured widget states.
- Keep generated install outputs tied to the current real `WIDGET_URL`.
- Remove direct sandbox dependency on `window.BugDropPreview`.
- Keep "Test on my site" output clearly separate from the mock preview.
- Rename or reword "Test on my site" if it keeps loading the real widget without a runtime no-submit mode. The copy must say it injects the real widget for local compatibility testing and must not claim that submissions are disabled unless the runtime implements that guarantee.

Expected result: users understand they are configuring options and seeing representative states, while generated install code remains real.

## Phase 2: Add A Local Sandbox Configuration Manifest

Add a local manifest in `bugdrop-web`, likely:

```text
src/components/sandbox/widget-config-manifest.ts
```

This is a local sandbox manifest, not yet the canonical widget manifest.

The manifest should include every sandbox-supported attribute:

- `data-repo`
- `data-theme`
- `data-position`
- `data-color`
- `data-label`
- `data-icon`
- `data-screenshot`
- `data-welcome`
- `data-show-name`
- `data-require-name`
- `data-show-email`
- `data-require-email`
- `data-button-dismissible`
- `data-dismiss-duration`
- `data-show-restore`
- `data-button`
- `data-screenshot-scale`
- `data-font`
- `data-radius`
- `data-bg`
- `data-text`
- `data-border-width`
- `data-border-color`
- `data-shadow`
- `data-category-labels`

Suggested shape:

```ts
export const widgetConfigManifest = [
  {
    key: "repo",
    attribute: "data-repo",
    required: true,
    type: "string",
    runtimeDefault: "",
    sandboxInitialValue: "mean-weasel/bugdrop-widget-test",
    description: "GitHub owner/repo destination",
    affectsGeneratedCode: true,
    mockEffect: "none",
    mockLimitation: "Destination only affects generated install output.",
  },
  {
    key: "screenshot",
    attribute: "data-screenshot",
    type: "enum",
    values: ["optional", "auto", "required"],
    runtimeDefault: "optional",
    sandboxInitialValue: "optional",
    affectsGeneratedCode: true,
    mockEffect: "copy",
    mockLimitation: "The mock shows screenshot-mode copy and state only; it does not capture screenshots.",
  },
];
```

The manifest should eventually include enough behavior to support tests:

- runtime default value from the real widget parser
- sandbox initial value, when the UI intentionally starts from a demo preset instead of the runtime default
- allowed values
- serializer behavior, such as `always`, `nonRuntimeDefault`, `nonSandboxInitial`, `whenTruthy`, `whenEnabled`, or a per-option custom serializer
- validation kind
- dependencies and transforms, such as generated output adding `showEmail` when `requireEmail` is enabled, if that behavior remains sandbox-side only
- whether the option affects generated code
- per-option mock behavior, such as `visual`, `copy`, `state`, `none`, or `not-previewed`
- optional `mockLimitation` for supported attributes that are only approximated
- optional `notRenderedReason` for supported attributes that do not have visible controls
- whether the attribute is production widget config or sandbox-only behavior

Add one helper-owned serialization contract before implementation starts. Do not let each output path decide independently when to emit defaults, how to coerce booleans, or how dependencies such as `requireEmail -> showEmail` are represented.

Expected result: the sandbox-supported configuration surface is explicit instead of scattered through component state and code generation.

## Phase 3: Refactor Sandbox Code Around The Manifest

Use the manifest as the local source of truth inside `bugdrop-web`.

- Use the manifest to define the attribute map.
- Use the manifest in generated script output.
- Keep `data-preview` out of the production widget manifest. Model it separately as a sandbox-only preview-snippet attribute.
- Do not describe `data-preview` as a public no-submit widget runtime feature unless `mean-weasel/bugdrop` has added and shipped that behavior.
- Keep field rendering manual for now because the UX needs intentional grouping.
- Keep runtime defaults and sandbox initial values separate. Tests should assert both, instead of assuming the demo preset equals runtime defaults.
- Model `data-shadow` according to current runtime behavior.
- Model require/show dependencies according to the chosen Phase 0 decision, and do not imply that the runtime already enforces them.
- Add focused helpers:
  - `buildScriptAttributes(config, manifest)`
  - `buildScriptTag(config, manifest)`
  - `buildPreviewSnippet(config, manifest)`
  - `validateSandboxConfig(config, manifest)`

Do not turn the whole form into a generated manifest UI in this pass. The manifest should reduce drift without forcing a lower-quality control layout.

Expected result: adding or removing an attribute has one obvious place to update.

## Phase 4: Replace Runtime Preview Calls With A Self-Contained Mock

Update `src/components/sandbox/widget-sandbox.tsx` after the local manifest and validation helpers exist.

- Have `buildIframeHtml(config)` render the example app and mock widget UI itself.
- Remove the real widget script from the iframe preview. The iframe must not include `<script src="${WIDGET_URL}">`, must not fetch the hosted widget, and must not depend on a Playwright route stub.
- Drive preview state through iframe messaging or regenerated iframe state:
  - `closed`
  - `welcome`
  - `form`
  - `success`
- Choose and implement one explicit behavior for config changes while a preview state is selected:
  - reset the preview to `closed`, or
  - preserve the selected state and re-render it after iframe reload.
- Apply selected config where it is practical and honest:
  - theme
  - accent color
  - radius
  - background
  - text
  - border color
  - border width
  - shadow preset behavior supported by the runtime
  - font
  - button label
  - position
  - visible contact fields
  - screenshot mode copy/state
- Keep the example app content in the iframe so users see the widget over a realistic page.
- Treat hard-to-preview options as generated-code behavior rather than visual fidelity requirements.
- Keep the own-site widget test snippet separate from the iframe mock. If it still loads the real widget URL, label it as a real-widget compatibility test. Include `data-preview="true"` only as sandbox-owned metadata unless verified runtime support exists, and do not claim that no GitHub issue can be created.

Security and isolation requirements:

- Do not use config-derived strings as raw HTML.
- Pass config into the iframe as typed JSON or explicit generated literals.
- Render config text with DOM text APIs or escaped literals, never `innerHTML` with untrusted values.
- Escape static attributes consistently, including strings that can break script contexts such as `</script>`.
- Route iframe HTML, script literals, attribute values, and mock-applied CSS through dedicated escaping/sanitizing helpers so hostile-value tests exercise the same code paths used by the preview.
- Restrict configurable style values more tightly than generated script output when the mock applies them to CSS:
  - colors must pass an allowlist or `CSS.supports("color", value)`
  - numeric pixel-like values must be parsed as finite non-negative numbers before appending units
  - font values must reject CSS-breaking tokens such as `;`, `<`, `>`, `</style`, and `url(`
  - shadow values must come from the manifest enum unless runtime support is intentionally broadened
  - avoid `url()` support in mock-applied styles unless a narrow allowlist is added
  - fall back to manifest defaults when a value is invalid for the mock
- If the mock renders `data-icon`, sanitize it with a narrow URL allowlist. Otherwise, mark icon rendering as `not-previewed` in the manifest.
- Remove unneeded iframe sandbox permissions if the mock no longer needs them.
- Add hostile-value tests for color, font, shadow, label, icon, `</script>` strings, CSS `url()` strings, and JSON-like fields.

Expected result: the preview works every time from `bugdrop-web`, independent of `mean-weasel/bugdrop` runtime internals.

## Phase 5: Update Tests

Replace the current stub-dependent confidence with tests that match the new architecture.

Helper tests should assert the manifest and generated output behavior. The repo currently has Playwright but no dedicated unit-test script, so choose one of these before implementation:

- add a small unit test runner such as Vitest for pure manifest/helper tests, or
- cover helper behavior through Playwright-visible generated output and exported test fixtures.

Helper test coverage should assert:

- Every generated `data-*` attribute is declared in the manifest.
- Every manifest attribute appears in controls, generated output, or has an explicit `notRenderedReason`.
- Runtime defaults in the manifest match the Phase 0 audit table. Do not make normal `bugdrop-web` CI depend on a sibling `../bugdrop` checkout.
- Sandbox initial config matches the manifest's `sandboxInitialValue` fields.
- Generated output emits or omits default-valued attributes according to manifest rules.
- Invalid numeric/config inputs are omitted or warned consistently.
- Generated production script never includes `data-preview`.
- Generated real-widget test snippets include `data-preview: "true"` only if the UI copy makes clear that it is sandbox metadata, or if the runtime has explicit no-submit support.
- `data-preview` is treated as sandbox-only snippet metadata, not as a production widget manifest attribute.
- Hostile config values do not become executable HTML or unsafe attributes in the preview.
- `data-shadow` generated output is limited to the runtime-supported values.
- Required submitter fields produce the intended generated output for corresponding show-field flags.

Playwright tests should assert:

- The sandbox loads without stubbing or loading `window.BugDropPreview`.
- The iframe mock does not request the hosted widget script.
- Welcome, form, success, and closed states work in the iframe.
- The selected preview-state behavior after config changes is covered.
- Generated install output still uses the current `WIDGET_URL`.
- The preview copy clearly describes the preview as representative.
- The own-site widget test copy does not claim submissions are disabled unless runtime support is verified.
- Desktop and mobile layouts have no horizontal overflow.
- The install sheet remains accessible and keyboard usable.

Required real-widget smoke test:

- Load a real local or hosted widget script on a controlled Playwright fixture page only to verify generated install/test snippets are compatible with public runtime behavior such as `window.BugDrop.open`.
- Do not rely on any non-public `BugDropPreview` API.
- Verify the generated script initializes the public `window.BugDrop` API with no private preview API assumptions.
- Assert that `window.BugDrop.open`, `close`, `hide`, and `show` exist and can open/close the form.
- Do not submit feedback in this smoke test.

Expected result: tests cover the real sandbox behavior instead of proving only the old stub.

## Phase 6: Manual Cross-Repo Drift Checklist

For this first pass, avoid creating a canonical cross-repo manifest. Instead, add a manual checklist to use whenever sandbox-supported widget options change.

Checklist:

- Compare the local sandbox manifest against config parsing in `mean-weasel/bugdrop/src/widget/index.ts`.
- Verify defaults, enum values, omitted defaults, and dependency behavior.
- Verify docs in `bugdrop-web/src/content/docs/configuration.mdx` match sandbox behavior.
- Verify any copy mentioning `data-preview` still matches real runtime support.
- If the main widget changes visible behavior, update the mock preview or add a `mockLimitation` note.
- If the main widget adds an option that should be user-configurable, update:
  - `widget-config-manifest.ts`
  - sandbox controls
  - generated output helpers
  - mock preview if visually relevant
  - tests

Expected result: drift is handled with lightweight guardrails now, without requiring release-system changes.

## Deferred Follow-Up: Canonical Manifest And Release Distribution

The review surfaced real future work, but it is deliberately deferred.

Future questions:

- Should production installs default to exact patch pins, major-channel pins, or latest?
- Should widget artifacts remain served from current Cloudflare Worker assets, move to Cloudflare R2, attach to GitHub Releases, publish to npm/CDN, or use a hybrid?
- Should release metadata include checksums, manifest hash, release notes URL, and migration notes?
- Should `bugdrop` expose a canonical config manifest near the parser?
- Should `bugdrop-web` consume the canonical manifest from a release artifact, package, raw URL, or manual copy?
- What compatibility guarantees can BugDrop make for patch, minor, and major releases?

Do not answer these inside the sandbox implementation PR unless the implementation directly requires it.

## Verification Plan

For the `bugdrop-web` sandbox work:

- `npm run lint`
- `npm run test:e2e -- tests/e2e/sandbox.spec.ts`
- real-widget smoke test using a controlled fixture, a local or hosted widget script, and only the public `window.BugDrop` API
- `npm run build`
- Playwright visual QA:
  - desktop first viewport
  - desktop Get code open
  - mobile first viewport
  - mobile Get code open
  - preview welcome/form/success/closed states

For manual cross-repo review:

- Inspect `mean-weasel/bugdrop/src/widget/index.ts` config parsing before writing the manifest.
- Confirm sandbox manifest attributes match currently supported runtime `data-*` options.
- Confirm normal `bugdrop-web` CI does not require the sibling `../bugdrop` checkout.
- Note any runtime-behavior mismatch as a follow-up before broadening the sandbox controls.

## Execution Order

1. Audit `mean-weasel/bugdrop/src/widget/index.ts`, current sandbox behavior, and docs for each sandbox-supported option.
2. Clarify sandbox copy and remove `BugDropPreview` as a contract.
3. Fix configuration docs for known current mismatches: theme default, welcome behavior, dismiss duration, submitter dependency wording, and shadow values.
4. Add the local sandbox config manifest using the audit results, including separate runtime defaults, sandbox initial values, and explicit serializer behavior.
5. Refactor generated script/widget-test helpers around the local manifest and separate sandbox-only `data-preview` metadata.
6. Replace the iframe runtime preview with a manifest-backed self-contained mock that does not load the real widget script.
7. Update Playwright and helper tests so they no longer rely on the widget stub.
8. Add and run the required real-widget smoke test using only public runtime APIs.
9. Run build, lint, e2e, and visual QA.
10. Record any remaining cross-repo config or docs mismatches as follow-up issues.
