# SEO evidence harness

This task deliberately uses a bounded, dependency-free Node crawler. It sends only `GET` requests and never calls IndexNow or any other mutation endpoint.

Build and start the production server, then run both targets in one report:

```bash
npm run build
npm run start -- --hostname 127.0.0.1 --port 3100
npm run seo:evidence -- \
  --target local=http://127.0.0.1:3100 \
  --target live=https://bugdrop.dev \
  --output docs/goals/bugdrop-technical-seo-growth/notes/baseline-evidence.json
```

The report records explicit target identity, robots and sitemap data, redirect chains, status codes, titles, descriptions, H1s, canonicals, robots directives, sitemap membership and `lastmod`, internal links, JSON-LD parseability/types, representative response headers, and named baseline findings. URLs from production canonicals and the sitemap are remapped by path to the requested target, so a local run tests the local production build rather than silently crawling production.

`baseline-evidence.json` is a point-in-time artifact. Regenerate it after a meaningful SEO package and compare `comparison.findingParity` plus route-level evidence.
