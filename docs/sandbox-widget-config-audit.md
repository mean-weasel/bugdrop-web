# Sandbox Widget Config Audit

Last updated: May 15, 2026

This checklist compares the sandbox-supported attributes in `bugdrop-web` with the hardened parser in `mean-weasel/bugdrop/src/widget/index.ts`. Normal `bugdrop-web` CI must not require a sibling `../bugdrop` checkout; this file records the manual cross-repo read.

| Attribute | Widget parser behavior | Sandbox behavior |
| --- | --- | --- |
| `data-repo` | Required `owner/repo`; invalid values log an error and skip init. | Required for copy; invalid values block copy. |
| `data-theme` | `auto`, `light`, `dark`; invalid values warn and fall back to `auto`. | Manifest runtime default is `auto`; sandbox starts in `light` for a stable demo. |
| `data-position` | `bottom-right` or `bottom-left`; invalid values fall back to `bottom-right`. | Enum control. |
| `data-color` | Sanitized CSS color before applying. | Generated as entered by color input; mock applies CSS color fallback if invalid. |
| `data-label` | Text label, rendered with DOM text APIs after widget hardening. | Generated and rendered as text in the mock. |
| `data-icon` | `http`, `https`, relative URL, or `none`; unsafe URLs rejected. | Generated as entered; icon rendering is not previewed in this pass. |
| `data-screenshot` | `optional`, `auto`, or `required`; invalid values warn and fall back to `optional`. | Enum control; mock changes copy/state only. |
| `data-welcome` | `once`, `always`, `never`, plus legacy `false` as `never`; default `once`. | Enum control; sandbox starts at `always` so the welcome state is easy to inspect. |
| `data-show-name` / `data-require-name` | `requireName` implies `showName`. | UI mirrors the dependency and generated output remains explicit. |
| `data-show-email` / `data-require-email` | `requireEmail` implies `showEmail`. | UI mirrors the dependency and generated output remains explicit. |
| `data-button-dismissible` | `true` enables dismissal. | Boolean control. |
| `data-dismiss-duration` | Positive whole number of days; invalid values warn and are omitted. | Positive whole number of days; invalid values warn and are omitted. |
| `data-show-restore` | Defaults to true unless explicitly `false`. | Omitted when true; emits `false` when disabled. |
| `data-button` | Defaults to true unless explicitly `false`. | Omitted when true; emits `false` for API-only mode. |
| `data-screenshot-scale` | Non-negative number; default capture scale is `2`. | Omitted when set to `2`; invalid values warn and are omitted. |
| `data-font` | Sanitized font family; `inherit` is supported. | Generated as entered; mock rejects CSS-breaking tokens before applying. |
| `data-radius` | Non-negative pixel value, with optional `px`. | Numeric control emits a number; mock applies pixels. |
| `data-bg` / `data-text` / `data-border-color` | Sanitized CSS colors. | Color inputs or text values are generated; mock applies CSS color fallback if invalid. |
| `data-border-width` | Non-negative pixel value, with optional `px`. | Numeric control emits a number; mock applies pixels. |
| `data-shadow` | Preset enum: `soft`, `hard`, or `none`; invalid values warn and are omitted. | Enum control; generated output is limited to non-default presets. |
| `data-category-labels` | JSON object; unknown keys and invalid values warn and are ignored. Server still validates. | Stricter sandbox validation omits invalid JSON or empty arrays before generating output. |
| `data-preview` | Not parsed as a no-submit runtime mode. | Kept out of production output. Own-site snippets may include it only as sandbox metadata and copy must not promise no issue creation. |

Follow-up if needed: make `data-icon` visually previewable only after adding the same narrow URL allowlist to the mock rendering path.
