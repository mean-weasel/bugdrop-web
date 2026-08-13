# BugDrop operational monitoring

BugDrop's operational monitor runs with the `bugdrop-web` production deployment. It checks the
landing page, hosted widget, production health identity, and the BugDrop GitHub App installation. It
currently receives legacy success check-ins from the real-Issue production heartbeat. The receiver
also supports explicit v1 outcomes, but sender activation is a separate, later release step.

The public surface is `/status`; sanitized JSON is available at `/api/status`. No feedback payload,
screenshot, GitHub Issue body, token, run URL, repository credential, or response body is persisted.
The status page is a static shell that reads the shared `/api/status` response. Vercel caches a
successful snapshot for 60 seconds with mandatory synchronous revalidation and rejects query-string
variants, so ordinary page traffic does not become Cloudflare administrative API traffic.

## Runtime architecture

- Vercel Cron invokes `GET /api/monitor/run` every five minutes.
- `CRON_SECRET` authenticates the invocation through its `Authorization` header.
- Each HTTP component needs two consecutive failures to open an incident and two consecutive
  successes to recover. Checks run in parallel with a ten-second timeout.
- Cloudflare D1 stores monitoring state using SQLite semantics. A two-minute global writer lease is
  renewed and ownership-checked immediately before each transition batch, serializing heartbeat and
  evaluator writes. Each completed transition is committed as one D1 batch. A durable five-minute
  UTC reservation coalesces cron deliveries and rejects overlapping work.
- `POST /api/monitor/heartbeat` retains authenticated empty-body legacy success and accepts JSON v1
  outcomes. JSON requires `X-BugDrop-Heartbeat-Id`; exact ID/payload replays are idempotent and
  conflicting reuse returns HTTP 409. Only hashed identifiers and normalized fields persist. The
  production sender remains on the legacy protocol until receiver compatibility is proven.
- Issue delivery uses an eleven-hour dead-man threshold. Exactly eleven hours remains fresh and the
  first later instant is stale. Successful initialization starts the same activation grace.
- Incident open and recovery alerts enter a transactional outbox. The evaluator retries failed
  deliveries with exponential backoff through either a generic webhook, Resend email, or both.
- Check results, daily component rollups, and heartbeat receipts are retained for 90 days. Incident
  and event audit history is retained for 365 days; the public incident feed shows the latest 90
  days.

## Public status history

The status page shows one UTC-day bar per component for the current day and the preceding 29 days.
Daily severity follows the confirmed public component state: a suppressed first failure does not
create an outage bar, while any confirmed incident keeps the affected day degraded or in outage.
The displayed check uptime is the successful-check percentage calculated only from recorded
monitoring samples, never from days before monitoring began or from days where monitoring data is
missing. It retains the status page's existing uptime definition and is separate from the confirmed
daily severity shown by each bar.

Retained checks from before the daily-rollup deployment are labeled **Historical checks**. They
contribute to check uptime, and incident audit history still marks confirmed degraded/outage days,
but non-incident backfilled days do not claim an exact state-machine status that the retained data
cannot prove.

Days before the persisted `monitoring_started` timestamp are labeled **Before monitoring**. A day
after that timestamp with no trustworthy samples is labeled **Monitoring gap** rather than being
counted as healthy or unhealthy. Hovering, focusing, or tapping a day reveals its check summary;
affected days link to the corresponding entry in the incident history.

Vercel Cron requires a plan that supports five-minute schedules. Vercel does not retry failed cron
invocations, so the next invocation and the persisted evaluator freshness timestamp are part of the
recovery model. Vercel may deliver the same cron more than once. The monitor coalesces calls received
in the same UTC schedule window and rejects overlap; it cannot identify an arbitrarily delayed
delivery that arrives in a later window, which is treated as a fresh availability observation.
Once a run commits any component observation, later alert or cleanup failure does not reopen that UTC
window; this preserves the distinct-window confirmation policy. A failure before the first committed
observation releases the reservation so the same window can retry.

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

Before this migration, temporarily pause both observation writers: disable the Vercel monitoring
cron and pause the BugDrop production-heartbeat workflow. No evaluator or heartbeat request may
reach the old deployment between migration completion and the new deployment becoming active,
because the old writer does not populate daily rollups.

Deploy only after the migration succeeds. This release adds the daily-rollup table used by both new
observation writes and `/api/status`, so the additive migration must reach production D1 before the
application deployment. It backfills the retained history snapshot once and is safe to run again. The
backfill labels retained samples as Historical checks, uses incident history for confirmed
degraded/outage days, and preserves raw check success for the uptime percentage. The application
deliberately does not run schema-changing DDL during normal requests. Re-enable the cron and
production heartbeat only after the new deployment is serving production traffic.

Configure at least one alert channel before activation; the evaluator fails closed if neither is
present. For delivery redundancy, production should configure both. A generic HTTPS webhook receives
only the sanitized incident payload. Resend receives a plain-text summary and the public status URL.
A partial Resend configuration is rejected by the evaluator.

## Production heartbeat integration

Store the same random `MONITOR_HEARTBEAT_SECRET` value in Vercel and as a narrowly scoped secret in
the BugDrop repository. Legacy empty-body success remains accepted and is the currently deployed
sender behavior. After the receiver migration and deployment are compatibility-proven, a separately
reviewed sender change may post exactly
`schemaVersion`, `outcome`, `reasonCode`, and ISO `observedAt` as JSON. Verified uses
`issue_verified`; confirmed failure uses `issue_absent`, `issue_duplicate`, or
`issue_contract_invalid`; inconclusive uses `github_network`, `github_5xx`, `github_rate_limited`,
`github_auth_failed`, `setup_failed`, `identity_failed`, `venue_failed`, `browser_inconclusive`,
`cleanup_failed`, `sweep_failed`, `artifact_failed`, `incident_failed`, or `classification_failed`.

Verified advances proof and recovers. Confirmed failure degrades immediately without advancing
proof. Inconclusive remains neutral without changing raw state or resolving incidents. Confirmed
failure remains authoritative until newer verification. The following is the later sender contract;
do not activate it as part of the receiver release:

```bash
curl --fail --silent --show-error --max-time 10 \
  --retry 2 --retry-all-errors \
  --request POST \
  --header "Authorization: Bearer $MONITOR_HEARTBEAT_SECRET" \
  --header "X-BugDrop-Heartbeat-Id: ${GITHUB_RUN_ID}:${GITHUB_RUN_ATTEMPT}" \
  --header "Content-Type: application/json" \
  --data "$NORMALIZED_HEARTBEAT_OUTCOME" \
  https://bugdrop.dev/api/monitor/heartbeat
```

The secret belongs only in the isolated outcome-delivery conclusion step. Configure that delivery
step with GitHub Actions `continue-on-error: true`: heartbeat transport failure must be logged but
must never change the E2E job conclusion. The secret must not reach Playwright, artifacts, summaries,
or shell tracing. Until the later sender change is reviewed and activated, failed workflows send no
request and absence of the legacy success check-in remains the dead-man signal.

## Activation exercises

Do not exercise production checks by mutating feedback or creating Issues outside the existing
authorized heartbeat.

1. Pause the Vercel monitoring cron and the BugDrop production-heartbeat workflow. Confirm no
   evaluator or heartbeat request is in flight.
2. Run the schema migration before deploying the status-history code, with alert delivery
   temporarily routed to an authorized test destination. Confirm the migration reports
   `Monitoring D1 schema is ready.`, then confirm a second migration run does not duplicate daily
   rollup counts.
3. Deploy the status-history code, then re-enable the cron and production-heartbeat workflow.
4. Invoke the evaluator with its bearer secret, confirm `status: completed`, and confirm all four
   HTTP components initialize. This successful initialization starts the heartbeat activation grace.
5. Send one authorized heartbeat and confirm Issue delivery changes from Unknown to Operational.
6. Override one target in a preview deployment with a known 404. Vercel Cron does not invoke preview
   deployments, so manually invoke the authenticated evaluator once in each of four distinct
   five-minute UTC windows. Confirm the first failure is suppressed, the second opens one incident,
   and two later successes resolve the same incident. Require `status: completed` for each call.
7. Retry one heartbeat with the same ID and confirm it creates only one receipt.
8. Run overlapping evaluator requests and confirm one returns `already_running`.
9. Make the authorized test alert destination return an error, provoke a preview incident using the
   same distinct-window procedure, restore the destination, and confirm a later evaluator window
   retries the pending outbox delivery successfully.
10. Inspect `/api/status`, D1, logs, and alert content for secrets or response bodies.
11. Confirm `/status` shows exactly 30 UTC days per component, labels pre-activation days as Before
   monitoring, labels an intentionally missing post-activation day as Monitoring gap, and links an
   affected day to its incident.
12. Confirm `/status` reports Unknown or stale monitoring instead of claiming health when the
    database or evaluator is unavailable.

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
can serve the most recent successful snapshot only for its remaining 60-second freshness lifetime;
the next revalidation returns Unknown rather than using stale-while-revalidate. Resend is a separate
delivery provider, but it is not independent of D1: every queued alert must be claimed from the D1
outbox before it can be sent. If D1 becomes unavailable after an incident commits but before its
alert is claimed, the alert remains pending and is delivered only after D1 recovers.
