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
- PostgreSQL transactions serialize each component transition. A durable five-minute UTC window
  deduplicates cron deliveries, while a four-minute lease rejects overlapping work.
- `POST /api/monitor/heartbeat` accepts a bearer-authenticated, success-only heartbeat. The optional
  `X-BugDrop-Heartbeat-Id` is validated, hashed before storage, and makes retries idempotent. The
  receipt and component transition commit atomically.
- Issue delivery becomes degraded seven hours after the last successful E2E proof: four-hour
  frequency plus a three-hour grace period. The first deployment gets the same seven-hour activation
  grace even if no heartbeat ever arrives.
- Incident open and recovery alerts enter a transactional outbox. The evaluator retries failed
  deliveries with exponential backoff through either a generic webhook, Resend email, or both.
- Check results and heartbeat receipts are retained for 90 days. Incident and event audit history is
  retained for 365 days; the public page shows the latest 90 days.

Vercel Cron requires a plan that supports five-minute schedules. Vercel does not retry failed cron
invocations, so the next invocation and the persisted evaluator freshness timestamp are part of the
recovery model. Vercel may deliver the same cron more than once; each UTC schedule window can be
evaluated only once, so a delayed duplicate cannot increment a confirmation policy twice.

## Provisioning

Provision a PostgreSQL database reachable by the production Vercel deployment, then configure the
values documented in `monitoring/env.example`. Secrets must be server-only variables; none use a
`NEXT_PUBLIC_` prefix.

Apply the schema from an authorized operator environment:

```bash
DATABASE_URL='postgresql://...' npm run monitoring:migrate
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
   destination.
2. Invoke the evaluator with its bearer secret and confirm all four HTTP components initialize.
3. Send one authorized heartbeat and confirm Issue delivery changes from Unknown to Operational.
4. Override one target in a preview deployment with a known 404. Confirm the first failure is
   suppressed, the second opens one incident, and two successes resolve the same incident.
5. Retry one heartbeat with the same ID and confirm it creates only one receipt.
6. Run overlapping evaluator requests and confirm one returns `already_running`.
7. Make the authorized test alert destination return an error, provoke a preview incident, restore
   the destination, and confirm the pending outbox delivery is retried successfully.
8. Inspect `/api/status`, the database, logs, and alert content for secrets or response bodies.
9. Confirm `/status` reports Unknown or stale monitoring instead of claiming health when the database
   or evaluator is unavailable.

## Incident and recovery semantics

- **Operational** means the latest checks passed their recovery policy.
- **Degraded** means a dependency or end-to-end verification is impaired.
- **Outage** means a directly customer-facing HTTP surface failed its confirmation policy.
- **Unknown** means a component has not established a successful baseline.

Recovery is automatic only after the configured successful confirmations. A fresh health response
cannot recover Issue delivery; only a successful authenticated E2E heartbeat can do that. Public
incident content is intentionally generic. Error codes and delivery attempts remain in PostgreSQL;
the authenticated evaluator response and existing GitHub heartbeat retain further diagnostic detail.

## Rollback

1. Disable Vercel Cron to stop new evaluations.
2. Remove alert environment variables to stop new deliveries.
3. Remove the heartbeat call and its repository secret; this does not affect the existing E2E run.
4. Roll back the web deployment. Keep the database for audit/recovery, or archive and delete it under
   the database provider's retention process.

Disabling monitoring never changes the Cloudflare Worker, hosted widget, GitHub App, or customer
feedback path.
