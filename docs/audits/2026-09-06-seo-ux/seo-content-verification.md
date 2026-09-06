# SEO landing-page content verification

September 6, 2026. Branch: `codex/bugdrop-seo-september`; baseline: `289d1ed`.

## Change

- Next.js landing page leads with the reporting benefit, a concrete example, and one pinned `widget.v1.56.4.js` App Router setup. Advanced CI details follow reporter checks and link to maintained documentation.
- Visual reporting page defines a visual bug and shows an illustrative mobile checkout overlap, an annotated capture, a useful description, and the information passed to an issue. The illustration and issue summary explicitly identify themselves as synthetic examples.
- URL inventory, query ownership, H1 page names, shared metadata, and shared page templates are unchanged.
- Product details checked against configuration, installation, security, CI, and version-pinning docs. Next.js 16.3's installed script guide was read before editing the example. The normal-script integration retains BugDrop's documented loading contract; it does not imply a limitation of all `next/script` integrations.

## Attempt to disprove the change

The strongest content regression would be an invalid copyable setup, broken MDX, or a missing example asset that prevents the promised evidence from appearing.

- `node scripts/use-case-content-contract.mjs`: pass across all 12 use-case pages, all unique query owners/intros, and 10 existing product-evidence markers.
- Both edited MDX files evaluated through `@mdx-js/mdx` and rendered with React's server renderer: pass. Each contains one H1, the illustrative labels, and the image's explicit dimensions/responsive sizing classes.
- Every rendered local link and image path resolved to a content file, application route, declared acquisition page, or public asset: pass.
- Copyable TSX snippet transpiled with TypeScript diagnostics enabled: no diagnostics. Confirmed one normal script, pinned v1.56.4, and no async/defer attributes.
- `git diff --check`: pass.

These are content and rendering checks, not browser interaction or delivery proof. The parent integration work should inspect both routes on desktop and mobile; no actual feedback was sent and no SEO performance improvement is claimed. The exact widget version is aligned with the documentation workstream, without a runtime upgrade.
