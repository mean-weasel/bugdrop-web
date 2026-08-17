# Homepage multi-flow demo operations

## Current release posture

`NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO_ENABLED` defaults to off. With the flag unset or
`false`, the landing page keeps the existing Classic feedback demo and its
established lazy-loading behavior. Enable the flag only through the website
environment configuration after the release prerequisites below are complete.

The demo is built from pinned, reviewable inputs:

- Flow recipe source commit: `a100e69976ce0a5912df8f07af1b2e53029663b2`
  (`8,537` bytes; SHA-256
  `ca205013c47e14cb37cc6f763439922a448d5d06c569940a8b08fc4364b0372d`).
- Widget runtime: BugDrop `v1.56.2`, target
  `81293491bf9924879465c668a391a5e4aeae912d`
  (`229,988` bytes; SHA-256
  `a0b85b64c85ab324364ac967207030202c998445ffca644be4b312c4c94ffc2f`).
- Runtime URL used by the browser gate:
  `/vendor/bugdrop/81293491bf9924879465c668a391a5e4aeae912d/widget.js`.

The nightly homepage-demo Issue cleanup is currently **not production-ready or
live**. Production enablement is blocked until that cleanup is corrected,
independently reviewed, merged, dry-run and live proven, and its scheduled
observation has passed. Do not enable the feature flag or run a real canary
before that prerequisite is explicitly satisfied.

## Pre-enable verification

The merge-queue browser lane runs the exact homepage spec on both desktop and
mobile Chromium against a local mocked feedback endpoint. It does not use a
token, a canary selector, or any real Issue mutation input.

Before requesting production enablement, complete and record the following:

- Confirm the provenance above still matches the vendored recipe and runtime.
- Run the enabled homepage experience suite locally and on the preview
  deployment; it must cover Classic plus Bug Report, Product Triage, and
  Customer Pulse.
- On both desktop and a mobile viewport, visually inspect the launcher, menu,
  selected-state synchronization, all four flows, keyboard traversal, Escape,
  focus restoration, loading/error retry behavior, reduced motion, and absence
  of horizontal overflow or console errors.
- Confirm the Classic-only path remains unchanged with the feature flag off.
- Confirm the cleanup prerequisite has passed its required review, merge,
  dry-run, live proof, and scheduled observation.

## Separately authorized production canary

A production canary is not part of normal CI, local testing, preview testing,
or feature-flag enablement. It requires separate owner authorization for one
deliberate Issue per experience: Classic, Bug Report, Product Triage, and
Customer Pulse.

For every resulting Issue, verify that it is public and is created only in
`mean-weasel/bugdrop-widget-test`. It must carry the `bugdrop` label (plus any
experience classification label), and its body must include the exact cleanup
marker `| **Page** | https://bugdrop.dev/ |`. Verify the expected title,
structured answers, attachments or screenshot behavior, success link, and
Issue URL before recording the evidence. Never include sensitive information.
The cleanup workflow must be live and proven before these Issues are created.

## Rollback

If a production issue is found after enablement, disable only
`NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO_ENABLED` in the website environment and
redeploy the website. This immediately returns the landing page to the
independent Classic-only experience. Do not change the pinned widget, recipes,
or cleanup workflow as an incident workaround without separate review and
authorization.
