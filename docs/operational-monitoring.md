# BugDrop operational monitoring

BugDrop's operational monitor runs with the `bugdrop-web` production deployment. It checks the
landing page, hosted widget, production health identity, and the BugDrop GitHub App installation. It
also receives a success-only check-in from the existing real-Issue production heartbeat.

The public surface is `/status`; sanitized JSON is available at `/api/status`. No feedback payload,
screenshot, GitHub Issue body, token, run URL, repository credential, or response body is persisted.

## Runtime architecture

- Vercel Cron invokes `GET /api/monitor/run` every five minutes.
- `CRON_SECRET` authenticates the invocation through its `Authorization` header.
- Each HTTP component needs two consecutive failures to open an incident and two consecutive
  successes to recover. Checks run in parallel with a ten-second timeout.
- Cloudflare D1 stores monitoring state using SQLite semantics. A short global writer lease
  serializes heartbeat and evaluator transitions; each completed transition is committed as one D1
  batch. A durable five-minute UTC window coalesces cron deliveries, while a four-minute evaluator
  lease rejects overlapping work.
- `POST /api/monitor/heartbeat` accepts a bearer-authenticated, success-only heartbeat. The optional
  `X-BugDrop-Heartbeat-Id` is validated, hashed before storage, and makes retries idempotent. The
  receipt and component transition commit atomically.
- Issue delivery becomes degraded seven hours after the last successful E2E proof: four-hour
  frequency plus a three-hour grace period. Successful monitor initialization starts the same
  seven-hour activation grace even if no heartbeat has arrived yet.
- Incident open and recovery alerts enter a transactional outbox. The evaluator retries failed
  deliveries with exponential backoff through either a generic webhook, Resend email, or both.
- Check results and heartbeat receipts are retained for 90 days. Incident and event audit history is
  retained for 365 days; the public page shows the latest 90 days.

Vercel Cron requires a plan that supports five-minute schedules. Vercel does not retry failed cron
invocations, so the next invocation and the persisted evaluator freshness timestamp are part of the
recovery model. Vercel may deliver the same cron more than once. The monitor coalesces calls received
in the same UTC schedule window and rejects overlap; it cannot identify an arbitrarily delayed
delivery that arrives in a later window, which is treated as a fresh availability observation.

## Provisioning

Provision a dedicated Cloudflare D1 database, then configure the values documented in
`monitoring/env.example`. Create a dedicated API token with D1 Read and D1 Write access, restricted
to the BugDrop account. Vercel calls D1's authenticated query API directly; no D1 identifier or token
is exposed to the browser. All values are server-only variables and none use a `NEXT_PUBLIC_` prefix.

Apply the schema from an authorized operator environment:

```bash
CLOUDFLARE_ACCOUNT_ID='...' \
CLOUDFLARE_D1_DATABASE_ID='...' \
CLOUDFLARE_D1_API_TOKEN='...' \
npm run monitoring:migrate
```

Deploy only after the migration succeeds. The application deliberately does not run schema-changing
DDL during normal requests.

Configure at least one alert channel before activation; the evaluator fails closed if neither is
present. For delivery redundancy, production should configure both. A generic HTTPS webhook receives
only the sanitized incident payload. Resend receives a plain-text summary and the public status URL.
A partial Resend configuration is rejected by the evaluator.

## Production heartbeat integration

Store the same random `MONITOR_HEARTBEAT_SECRET` value in Vercel and as a narrowly scoped secret in
the BugDrop repository. After every currently required production-heartbeat outcome succeeds, send:

```bash
curl --fail --silent --show-error --max-time 10 \
  --retry 2 --retry-all-errors \
  --request POST \
  --header "Authorization: Bearer $MONITOR_HEARTBEAT_SECRET" \
  --header "X-BugDrop-Heartbeat-Id: ${GITHUB_RUN_ID}:${GITHUB_RUN_ATTEMPT}" \
  https://bugdrop.dev/api/monitor/heartbeat
```

The secret belongs only in a success-only conclusion step after every authoritative outcome has
passed. Configure that delivery step with GitHub Actions `continue-on-error: true`: heartbeat
transport failure must be logged but must never change the E2E job conclusion. The secret must not
reach Playwright, artifacts, summaries, or shell tracing. Failed workflows do not send a failure
request; the absence of a success check-in is the dead-man signal.

## Activation exercises

Do not exercise production checks by mutating feedback or creating Issues outside the existing
authorized heartbeat.

1. Run the schema migration and deploy with alert delivery temporarily routed to an authorized test
   destination. Confirm the migration reports `Monitoring D1 schema is ready.`
2. Invoke the evaluator with its bearer secret, confirm `status: completed`, and confirm all four
   HTTP components initialize. This successful initialization starts the heartbeat activation grace.
3. Send one authorized heartbeat and confirm Issue delivery changes from Unknown to Operational.
4. Override one target in a preview deployment with a known 404. Vercel Cron does not invoke preview
   deployments, so manually invoke the authenticated evaluator once in each of four distinct
   five-minute UTC windows. Confirm the first failure is suppressed, the second opens one incident,
   and two later successes resolve the same incident. Require `status: completed` for each call.
5. Retry one heartbeat with the same ID and confirm it creates only one receipt.
6. Run overlapping evaluator requests and confirm one returns `already_running`.
7. Make the authorized test alert destination return an error, provoke a preview incident using the
   same distinct-window procedure, restore the destination, and confirm a later evaluator window
   retries the pending outbox delivery successfully.
8. Inspect `/api/status`, D1, logs, and alert content for secrets or response bodies.
9. Confirm `/status` reports Unknown or stale monitoring instead of claiming health when the database
   or evaluator is unavailable.

## Incident and recovery semantics

- **Operational** means the latest checks passed their recovery policy.
- **Degraded** means a dependency or end-to-end verification is impaired.
- **Outage** means a directly customer-facing HTTP surface failed its confirmation policy.
- **Unknown** means a component has not established a successful baseline.

Recovery is automatic only after the configured successful confirmations. A fresh health response
cannot recover Issue delivery; only a successful authenticated E2E heartbeat can do that. Public
incident content is intentionally generic. Error codes and delivery attempts remain in D1;
the authenticated evaluator response and existing GitHub heartbeat retain further diagnostic detail.

## Rollback

1. Disable Vercel Cron to stop new evaluations.
2. Remove alert environment variables to stop new deliveries.
3. Remove the heartbeat call and its repository secret; this does not affect the existing E2E run.
4. Roll back the web deployment. Keep D1 for audit/recovery, or export and delete it under
   Cloudflare's retention process.

Disabling monitoring never changes the Cloudflare Worker, hosted widget, GitHub App, or customer
feedback path.

The storage choice intentionally accepts one correlated failure domain: a broad Cloudflare outage can
make D1 unavailable while the Vercel status route itself is reachable. In that case `/api/status`
returns Unknown rather than stale operational data, and Resend remains the independent alert
destination for incidents committed before D1 became unavailable.
