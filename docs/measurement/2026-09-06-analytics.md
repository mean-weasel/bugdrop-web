# Browser measurement changes — September 6, 2026

Baseline: successful production commit `289d1ed`. This change retains the small browser capture transport and Google's intent-triggered loading. It does not introduce replay, autocapture, identification, new analytics vendors, or an SDK dependency.

## What changes

- Anonymous visitor IDs survive multiple events when local storage is blocked by falling back to document memory. Available local storage retains the existing valid anonymous UUID.
- Every PostHog event includes a UUIDv7 `$session_id`, shared through local storage across documents/tabs. Active events renew a 30-minute inactivity window; sessions end at 24 hours. Passive web-vital events do not extend the activity timestamp. `$window_id` identifies the current document and remains stable through client navigation; full reloads start a new document ID.
- Browser family, OS family, device family, and current viewport width/height are bounded context. The user-agent string is inspected locally and never sent. Device detection is an approximation; iPads using desktop user agents are recognized through their touch capability. Unknown browser families remain `Unknown`.
- Local hosts and a deliberate local storage flag mark internal traffic. `navigator.webdriver` or recognizable headless/crawler user agents mark synthetic traffic. Neither field proves a visit is human. The default traffic type is `unclassified`, and both boolean flags are retained when a visit is both internal and synthetic.
- Explicit email/social/organic/paid campaign mediums take precedence over referrers. Unrecognized explicit mediums become `campaign`; term-only metadata preserves recognized search/social referrers. `fbclid` alone no longer implies paid search because it also appears on unpaid Facebook links. Raw campaign values are never retained or sent.
- First-touch storage is read through a whitelist and falls back to memory. Unknown stored properties cannot be spread into outgoing telemetry. First touch remains the first observed visit in this browser's available storage. Existing `landing_page`/`acquisition_channel` remain event-page attributes, not session-entry attributes; use `$session_id` with the first observed pageview when evaluating a session's entry.
- Duplicate effect execution on the same navigation cannot double-count pageviews during local Strict Mode. Navigating away and returning is still a new pageview.
- Beacon failures fall back to fetch. Rejected telemetry requests are absorbed instead of creating unhandled errors in the user's page.

PostHog documents the [30-minute/24-hour session boundaries and UUIDv7 requirements](https://posthog.com/docs/data/sessions). The collector continues using its [capture API](https://posthog.com/docs/api/capture), and labels itself `analytics_collector = bugdrop-browser`; it does not impersonate the PostHog SDK.

## Filters and interpretation

Use `analytics_context_version = 2026-09-06` to restrict browser/session comparisons to the new context model. Use `event_model_version = 2026-09-06` for the corrected channel rules. Do not mix missing historical fields into a desktop/mobile denominator or backfill guesses.

For staff testing on production, set `localStorage.setItem("bugdrop_analytics_internal", "true")` in that browser before navigating. Remove the item when testing ends. This deliberately labels events; it does not prevent transmission. Local development should normally keep analytics keys unset. Automated tests use dummy keys and intercept all analytics destinations.

Exclude `is_internal = true` and `is_synthetic = true` for a best-effort external audience analysis, but describe the remainder as unclassified external traffic. Automation detection is incomplete and spoofable. Storage restrictions lose continuity across full reloads; simultaneous first visits in separate tabs can race to initialize local storage. Session activity only observes instrumented events, not arbitrary mouse movement.

## What is not established

The earlier production audit reported all grouped pageviews as PostHog `Automation` while browser/agent fields were missing. The old code confirms missing browser/session properties, but this does not establish the reason for PostHog's classification. No historical data or project filters were changed. After release, inspect actual ingested events and the project's classification settings/query against controlled internal browser visits, retaining the new explicit flags as independent evidence. Do not declare historical traffic bots or discard it wholesale.

Marketplace button events still mean a click, not completed installation. Verified GitHub installation, successful issue creation, and the first real issue for an installation need events at the actual GitHub App/backend success boundaries. This site's marketing collector cannot establish those outcomes. Join such events through intentionally passed anonymous IDs only after reviewing the backend privacy contract; do not send feedback bodies, screenshots, console logs, repository names, or installation IDs merely to measure conversion. Demo success must remain distinct from customer adoption.

## Validation

`test/analytics-capture.test.ts` exercises actual serialized beacon payloads with dummy keys. It verifies restricted storage, session continuity and expiry, passive vitals, document changes, malformed storage, browser/mobile/tablet detection, campaign precedence, synthetic/internal flags, and failed transport. These are local collection assertions, not proof of production ingestion.

The existing `scripts/analytics-journey-audit.mjs` now also asserts session/browser/device/viewport context and includes an iPhone-emulated use-case journey. All PostHog, Google Tag Manager and Google Analytics traffic is intercepted. It checks one pageview per navigation, no GA loading before intent, counted click/copy events, privacy with sensitive fixture values, bounded external navigation, and preserved client navigation. Mobile emulation runs in Chromium; it is not a test on physical iOS Safari.

The first local audit disproved two assumptions: development effects produced duplicate pageviews, and term-only campaign metadata lost organic attribution after the initial precedence edit. Both were corrected before the passing rerun. See `2026-09-06-analytics-evidence.json` for the final compact receipt.
