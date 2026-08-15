# Reconstructed SEO audit disposition matrix

Status: reconstructed on 2026-08-14 from the approved program, T001 evidence, repository state, and production observations. This is **not** a lossless transcription of the original audit because that line-item artifact has not been attached. Attach and reconcile the original audit before claiming complete audit coverage.

Disposition terms: `confirmed` means the baseline harness can reproduce the issue; `planned` means the approved roadmap includes it but stronger evidence or a later decision gate is required; `evidence unavailable` preserves a dependency without blocking safe local work.

| ID | Reconstructed finding | Baseline disposition | Harness evidence / planned proof | Owning phase |
| --- | --- | --- | --- | --- |
| SEO-001 | Production/source identity must be explicit | confirmed | Dual target labels, origins, loopback identity, resolved homepage, server/request IDs | Phase 0 |
| SEO-002 | All sitemap entries share one synthetic `lastmod` | confirmed | `synthetic-sitemap-lastmod` plus every sitemap entry | Phase 2 |
| SEO-003 | `/docs/installation` links to broken `/security` | confirmed | `broken-installation-security-link` and crawl link source/target/status | Phase 1 |
| SEO-004 | `/docs/getting-started` is linked but omitted from sitemap and inherits unsuitable metadata/canonical behavior | confirmed | `getting-started-index-contract` route evidence | Phase 2 |
| SEO-005 | `/sandbox` is indexable/canonicalized but omitted from sitemap | confirmed | `indexable-sandbox-omitted-from-sitemap` | Phase 2 |
| SEO-006 | Utility route membership (`/status`, `/showcase`, labs) needs an intentional policy | planned | Sitemap, robots, canonical, status, and link evidence per route | Phase 2 |
| SEO-007 | Installation uses the worker URL while use cases use `bugdrop.dev/widget.js`; loading guidance conflicts | confirmed | `installation-widget-contract-drift`, `public-widget-url-returns-error`, and route content signals | Phase 1 |
| SEO-008 | Sentry comparison contains a stale exclusively/error-triggered feedback characterization | confirmed | `stale-sentry-feedback-claim`; official current source review remains required | Phase 1/4 |
| SEO-009 | Representative responses lack several security headers | confirmed | `representative-security-headers-missing` with per-route header values | Phase 2 |
| SEO-010 | JSON-LD is parseable, but schema types and visible-content/date alignment require review | planned | Every crawled route reports JSON-LD count, validity, and types; later content audit proves alignment | Phase 2 |
| SEO-011 | Titles/descriptions/H1/canonicals/robots need full regression coverage | confirmed as coverage gap | Route-level harness fields and later policy assertions | Phase 2 |
| SEO-012 | Overlapping acquisition pages may cannibalize queries | planned; destructive action prohibited | Search Console query/page evidence, then T005 ownership decision; reversible differentiation if unavailable | Phase 3 |
| SEO-013 | Contextual internal authority and orphan/redirect-chain safety need improvement | planned | Full crawl links, broken targets, redirects, sitemap membership, and approved ownership map | Phase 3 |
| SEO-014 | Existing comparison pages need current official sources, balance, verification dates, setup/migration, and conversion paths | planned | Source ledger plus rendered content checks for all approved comparisons | Phase 4 |
| SEO-015 | New comparison, integration, and reusable educational coverage must have distinct supported intent | planned | Query ownership, official technical sources, tested instructions, internal links, and conversion path | Phase 5 |
| SEO-016 | Eager YouTube/Product Hunt/third-party assets and unused JavaScript may impair performance | planned | Repeated production-mode Lighthouse baseline and post-change runs | Phase 6 |
| SEO-017 | Verified contrast, keyboard, mobile, and accessibility defects must be resolved | planned | Accessibility audit, contrast evidence, keyboard/mobile inspection | Phase 6 |
| SEO-018 | Organic attribution and CTA/Marketplace/GitHub journey events require end-to-end proof | planned | Observed non-sensitive event payloads and reporting access | Phase 7 |
| SEO-019 | Web-owned installation success proxy is not yet established | planned | Strongest repository-owned proxy; cross-repository work remains an explicit follow-up | Phase 7 |
| SEO-020 | Search Console query/page, indexing, and sitemap evidence is unavailable | evidence unavailable | Obtain export/access or preserve an unavailable-evidence receipt before T005 decisions | Phase 0/3/7 |
| SEO-021 | Deployment authority, exact alias target, required check, and rollback need candidate-specific proof | planned | Pre-deployment gate, protected-main check, Vercel alias/rollback evidence, live post-deploy crawl | Phase 8 |
| SEO-022 | Original audit line-item artifact is unavailable | evidence unavailable | Attach original audit and reconcile every line to this matrix; do not claim lossless coverage before then | Phase 0/8 |

## Guardrails

- Search Console absence does not block safe local fixes, but no destructive merge or redirect is justified from keyword similarity alone.
- Competitor and product claims require current primary/official sources and a visible verification date where appropriate.
- IndexNow is outside this harness and must not run during baseline collection.
- Final completion requires the original audit reconciliation or an explicit externally blocked disposition accepted at the final gate.
