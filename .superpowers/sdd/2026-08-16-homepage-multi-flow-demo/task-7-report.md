# Task 7 report — local homepage Flow inspection

## Delivered

- Added the exact `81293491bf9924879465c668a391a5e4aeae912d` local preflight route.
- Added the matching local feedback route, both guarded to development and the
  exact `bugdrop.localhost:3000` origin. The preflight and submission both
  accept only `mean-weasel/bugdrop-widget-test`.
- The feedback route delegates storage and request-size handling to the existing
  process-local inspector helpers. It returns a synthetic private Issue result;
  it has no external service path.
- Added direct tests for successful preflight/submission, every host/origin/
  content-type/repository/environment guard, invalid JSON/object payloads, the
  individual 48 MiB limit, and retrieval from the local inspector store.

## Verification

- `npm test -- --run test/homepage-local-flow-routes.test.ts test/public-flow-lab.test.ts`
  — 14 tests passed.
- `npm test` — 18 files / 150 tests passed.
- `npm run lint` — passed with the pre-existing generated runtime warnings only
  (850 warnings, 0 errors).
- `NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO=true npm run build` — passed; confirms both
  SHA-scoped routes are recognized by the production build.
- `git diff --check` — passed.

Manual browser QA was intentionally not run by this task: the task boundary
prohibits touching the already-running local server. The routes are tested by
direct request invocation only and do not make external requests.
