# Homepage multi-flow demo operations

## Current release posture

`NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO_ENABLED` defaults to off. With the flag unset or
`false`, the landing page keeps the existing Classic feedback demo and its
established lazy-loading behavior and mutable
`https://bugdrop.neonwatty.workers.dev/widget.js` default. When the flag is
`true`, `NEXT_PUBLIC_BUGDROP_WIDGET_URL` is mandatory and must be exactly the
public v1.56.4 URL or one of the strict local fixtures documented below. Missing,
mutable, wrong-version, normalized aliases, and unsafe values fail the build.
Enable the flag only through the website environment configuration after the
release prerequisites below are complete.

The demo is built from pinned, reviewable inputs:

- Flow recipe source commit: `a100e69976ce0a5912df8f07af1b2e53029663b2`
  (`8,537` bytes; SHA-256
  `ca205013c47e14cb37cc6f763439922a448d5d06c569940a8b08fc4364b0372d`).
- Widget runtime: BugDrop `v1.56.4`, target
  `2f2918d0dea6d56e28d527540750258f673893f7`
  (`239,931` bytes; SHA-256
  `c26934dee9c853e4b51b5ce1c36e43e8037418eb7869fedf12d84f4d889d6a02`).
- Runtime URL used by the browser gate:
  `/vendor/bugdrop/2f2918d0dea6d56e28d527540750258f673893f7/widget.js`.
- Exact public runtime URL:
  `https://bugdrop.neonwatty.workers.dev/widget.v1.56.4.js`.

The nightly homepage-demo Issue cleanup is enabled and live at workflow commit
`deff0f5d6de993133f6cd91afe7cad305649c77e`. Its first scheduled production run
completed successfully with zero eligible, authorized, closed, labeled, or
failed Issues. Keep the cleanup enabled while the public demo is enabled, and
treat workflow drift, failure, partial mutation, overlap, or a safety-cap result
as an immediate stop condition for further canaries.

## Pre-enable verification

The merge-queue browser lane runs the exact homepage spec on both desktop and
mobile Chromium against the localhost candidate and a mocked public feedback
result. It does not exercise a deployed preview, use a token or canary selector,
or carry any real Issue mutation input. The actual local route is covered
separately and must return a private result with no GitHub action or
Issue-created message.

Before requesting production enablement, complete and record the following:

- Confirm the provenance above still matches the vendored recipe and runtime.
- Run the enabled homepage experience suite locally. Separately run and record
  the same walkthrough on the deployed preview before enablement. Both must
  cover Classic plus Bug Report, Quick Rating, and Feature Request; the localhost
  candidate lane is not deployed-preview evidence.
- On both desktop and a mobile viewport, visually inspect the direct floating
  Feedback launcher, the “Design your flow” section, distinct icons and
  descriptions, all four experiences, keyboard activation, Escape, focus restoration, loading/error
  retry behavior, reduced motion, and absence of horizontal overflow or console
  errors. On mobile, confirm the floating launcher yields while the in-page
  customization section is visible and returns when the section leaves the viewport.
- Confirm the Classic-only path remains unchanged with the feature flag off.
- Confirm the cleanup prerequisite has passed its required review, merge,
  dry-run, live proof, and scheduled observation.

## Exact-runtime local hidden-dogfood QA

Run local QA only from the website worktree at the named origin
`http://bugdrop.localhost:3000`. Keep the dogfood hidden and bind it to the
approved v1.56.4 runtime for the enabled walkthrough:

```sh
NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO_ENABLED=true \
NEXT_PUBLIC_BUGDROP_WIDGET_URL=/vendor/bugdrop/2f2918d0dea6d56e28d527540750258f673893f7/widget.js \
npx playwright test e2e/homepage-flow-demo.spec.ts \
  --project=desktop-chromium --project=mobile-chromium --retries=0
```

The only approved local spellings are the exact root-relative URL above and
`http://bugdrop.localhost:3000` followed by that exact path; hostname case is
the sole allowed lexical variation in the absolute form. Before an enabled
build, verify the selected runtime bytes. For the public runtime:

```sh
runtime_file=$(mktemp)
curl --fail --silent --show-error \
  https://bugdrop.neonwatty.workers.dev/widget.v1.56.4.js \
  --output "$runtime_file"
wc -c "$runtime_file"
shasum -a 256 "$runtime_file"
rm "$runtime_file"
```

The result must be exactly `239931` bytes and SHA-256
`c26934dee9c853e4b51b5ce1c36e43e8037418eb7869fedf12d84f4d889d6a02`.
Then set `NEXT_PUBLIC_BUGDROP_WIDGET_URL` to the exact URL whose bytes were
checked. Do not use mutable `widget.js` with the enabled showcase.

Before accepting the browser evidence, hash the bytes served at that exact
root-relative widget URL. They must be `239,931` bytes with SHA-256
`c26934dee9c853e4b51b5ce1c36e43e8037418eb7869fedf12d84f4d889d6a02`.
Record desktop and mobile observations for the direct launcher, customization section, Classic, Bug Report,
Quick Rating, and Feature Request. The walkthrough must
also cover keyboard selection, focus containment and restoration, 500ms
forward/back motion, reduced-motion bypass, conditional-answer pruning,
capture teardown, and horizontal overflow. Confirm that Bug Report keeps its
canonical attachment contract while attachments and logs span the form and
name/email pair on desktop (stacking on mobile). Confirm Feature Request uses
separate idea, context, and priority screens with Nice to have, Important, and
Transformative cards.

Run both Classic isolation controls separately:

```sh
env -u NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO_ENABLED \
  -u NEXT_PUBLIC_BUGDROP_WIDGET_URL \
  npx playwright test e2e/homepage-flow-demo.spec.ts \
  --project=desktop-chromium \
  --grep 'Classic-only launcher when the feature flag is unset' --retries=0

NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO_ENABLED=false \
  env -u NEXT_PUBLIC_BUGDROP_WIDGET_URL \
  npx playwright test e2e/homepage-flow-demo.spec.ts \
  --project=desktop-chromium \
  --grep 'Classic-only launcher when the feature flag is unset' --retries=0
```

All feedback/check calls must remain inside the local intercepted harness.
Block and record any feedback-like request with the wrong path, method, or
origin, and block all other HTTP(S) origins. The acceptance ledger must show
the exact local runtime hash and size, zero unauthorized request attempts, and
zero real Issues created. Stop immediately if any of those conditions fails.

## Separately authorized production canary

A production canary is not part of normal CI, local testing, preview testing,
or feature-flag enablement. It requires separate owner authorization for one
deliberate Issue per experience: Classic, Bug Report, Quick Rating, Feature
Request.

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
