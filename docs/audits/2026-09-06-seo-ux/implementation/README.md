# Local implementation handoff — September 6, 2026

Preview: http://bugdrop.localhost:3000

Integrated branch: `codex/bugdrop-homepage-september`, based on production commit `289d1eda1da02a4cafb459f553b7c8751ed102be`. The original working copy's tracked diff was byte-compared with its pre-work snapshot and is unchanged. Separate documentation, analytics, and SEO worktrees retain their independent commits.

## Changes

- Homepage leads with the outcome, shows an actual locally captured widget form and a clearly labeled example issue, and opens the widget directly from the primary action. Its normal anchor still reaches the demo section without JavaScript. Public/local submission behavior is disclosed beside the action.
- Mobile shows all three feedback choices vertically and uses a compact, accessible floating launcher. Buttons wrap at narrow phone widths. Closing the demo restores focus to its launch control.
- Setup and use-case examples use pinned v1.56.4. Permissions copy explains repository access accurately. Next.js and visual-reporting pages lead with benefits and concrete, explicitly illustrative examples.
- Browser measurement now includes sessions, bounded device/browser context, explicit internal/synthetic flags, and corrected acquisition continuity. No production conversion improvement is claimed.
- Shared MDX table rendering removes structural whitespace emitted by Next's Rust compiler, preventing comparison-page hydration warnings while preserving spaces in cells.

## Attempts to disprove the result

- 246 unit tests pass across 28 files, including outgoing analytics payloads and a regression that compiles the real Userback MDX through Next's Rust compiler.
- Enabled homepage browser suite: 28 passed, 26 conditionally skipped. Desktop/mobile checks cover keyboard launch and focus restoration, duplicate-runtime prevention, local submissions, error/retry behavior, delayed loads, and navigation cleanup. A separate feature-disabled check passed, confirming the hero still opens Classic and reuses its runtime.
- Production build passes. Repository lint exits successfully with 0 errors and 1,305 warnings from existing vendored widget bundles. Final changed-file lint passes without warnings.
- Chrome visual inspection: homepage at 1668px, 390px, and 320px; no document horizontal overflow. Both edited use-case routes inspected at desktop and 390px. The illustrative mobile image loads and fits its content area.
- Before interaction, the homepage contains no video iframe or demo runtime script. The hero image loads eagerly. A Next development warning associates the second, deferred use of that same image with LCP; the actual hero image's eager loading was inspected directly.
- Screenshot review found a stale optimized desktop capture; the corrected asset now has a new URL and was visually checked on desktop and mobile.
- Documentation owner verified all 22 mirrored files against the canonical source commit and passed the sync checks. Analytics owner ran intercepted desktop/mobile journeys; [analytics receipt](../../../measurement/2026-09-06-analytics-evidence.json).

## Release dependencies and remaining questions

This is a local review build, not a deployment. Local analytics keys are unset; demo submissions use the vendored local runtime and local endpoints.

The docs mirror references canonical widget commit `61d938379b03cd7baacfe37e5a7726598833b6a1`, prepared in the sibling `widget-docs` checkout. That source commit is still local: publish/review/land it before releasing the website documentation sync, then refresh the receipt if the upstream SHA changes.

After an eventual release, inspect actual PostHog ingestion and compare only the new measurement version. Historical “Automation” classification remains unresolved. Marketplace clicks do not prove installations; completed installation and first real issue measurement require backend outcome events.

The widget's internal screenshot zoom/redaction controls were not changed in this website package. Physical iOS Safari and post-release SEO/field-performance results remain separate follow-ups.

## Screenshots

- [Desktop homepage](homepage-desktop.png)
- [Mobile homepage](homepage-mobile.png)
- [Mobile feedback chooser](flows-mobile.png)
- [Mobile visual-reporting example](visual-reporting-mobile.png)
