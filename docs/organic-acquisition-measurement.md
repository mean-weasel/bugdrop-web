# Organic acquisition measurement

Last reviewed: 2026-08-14

## Event contract

The web app sends one logical event to each configured analytics destination. GA4 and PostHog are separate sinks for the same event, not two conversions in one system. A single delegated click listener reads `data-analytics-event` and `data-analytics-label`; do not add another click listener around an already marked control. Clipboard proxies use `data-analytics-success-event` instead and dispatch only after the browser confirms the write. A control must never carry both marker types.

Every page view and marked interaction includes only:

- pathname-level `page_path`, `landing_page`, and `$current_url` values with query strings and fragments removed;
- enumerated current and first-touch acquisition channels;
- enumerated referrer type and a recognized search-engine name, never a full referrer or arbitrary hostname;
- boolean campaign and paid-click presence plus an enumerated medium category, never raw UTM or click-ID values;
- a controlled event label and a query-free destination;
- the first-touch timestamp and anonymous analytics distinct ID required to preserve attribution.

Do not add form values, repository names entered in the sandbox, report text, email addresses, screenshot data, raw search terms, raw campaign names, secrets, or full URLs to this contract.

Representative funnel events are:

| Stage | Events |
| --- | --- |
| Landing | GA4 `page_view`; PostHog `$pageview`; `acquisition_channel=organic_search` and a recognized `search_engine` prove an organic landing |
| Evaluation | `compare_demo_click`, `compare_installation_click`, `use_case_demo_click`, `use_case_installation_click` |
| Product exploration | `sandbox_preview_open_click`, resource copy/download/print events, and resource demo/sandbox events |
| Installation intent | `use_case_marketplace_click`, `outbound_marketplace_click` |
| Strongest web-owned installation proxy | `installation_proxy_script_copy` after the browser confirms that the configured production script was written to the clipboard |

`installation_proxy_script_copy` is a high-intent proxy, not proof that BugDrop was installed or that a GitHub App installation succeeded. Reports and dashboards must keep “proxy” in its name and label.

## External install-success follow-up

The authoritative signal is the GitHub App `installation` webhook with action `created`, received by the product-owned backend. That system is outside this web repository and no authorized cross-system join exists here. The GitHub App/backend owner should expose an aggregate `github_app_installation_created` conversion count, with no repository name, user login, email, access token, webhook body, or installation ID sent to web analytics. If a future attribution join is approved, it needs a separately reviewed short-lived opaque correlation token and retention policy. Until then, compare aggregate successful installs with web proxy trends; do not claim session-level attribution or installation success from web events.

## Weekly Search Console and conversion review

Run this review every Monday for the trailing 28 days against the preceding 28 days. Record the export date, property, timezone, filters, and analyst in the acquisition review log.

1. Export Search Console Performance data by query and page, plus Indexing and Sitemaps summaries. Preserve the unmodified exports outside the repository according to the team retention policy.
2. Group pages using `src/lib/acquisition-architecture.json`. Compare clicks, impressions, CTR, and average position for home, use-case, comparison, and resource owners. Flag a material query mapped to multiple owners; do not merge or redirect pages from similarity alone.
3. In analytics, filter first-touch or current `acquisition_channel=organic_search`. Report unique landing sessions and the number of evaluation, product-exploration, marketplace-intent, and `installation_proxy_script_copy` events by landing pathname.
4. Check funnel integrity: one landing page view per journey, no duplicate named CTA event in a sink, and no raw query/referrer data in sampled payload properties. Investigate route or release changes before interpreting a discontinuity as demand.
5. Compare the web proxy trend with the backend owner’s aggregate successful-install count when available. Keep the two series separate and label the web series “production script copied—not confirmed installed.”
6. Create follow-ups for indexing loss, sustained CTR decline, ownership overlap, broken event coverage, or a widening proxy-to-install gap. Include the evidence window and owner; avoid publishing a causal claim from one week of data.

Monthly, re-run the local analytics journey audit, review event inventory changes, sample privacy-safe payloads, and confirm the external install-success follow-up owner and status. Search Console access is not currently evidenced in this repository, so the first live review must attach an access/export receipt rather than treating this procedure as completed production analysis.
