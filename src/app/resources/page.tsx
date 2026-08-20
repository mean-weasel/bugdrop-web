import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import architecture from "@/lib/acquisition-architecture.json";
import { resourceNav } from "@/lib/resource-nav";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

const hub = architecture.pages.find((page) => page.path === "/resources")!;

export const metadata: Metadata = pageMetadata({
  title: hub.title,
  description: hub.description,
  path: hub.path,
});

export default function ResourcesPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: hub.title,
    description: hub.description,
    url: absoluteUrl("/resources"),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: resourceNav.length,
      itemListElement: resourceNav.map((resource, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: resource.title,
        url: absoluteUrl(`/resources/${resource.slug}`),
      })),
    },
  };

  return (
    <main data-resource-hub>
      <JsonLd data={schema} />
      <header className="mb-10 border-b border-border pb-8">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-accent-cyan">Portable · free · no account</p>
        <h1>{hub.title}</h1>
        <p className="mt-4 max-w-3xl text-lg text-text-subtle">
          Copy, download, or print practical tools for safer screenshots, clearer visual bug reports, and structured client QA. Use them with or without BugDrop—no account or purchase required.
        </p>
      </header>

      <section aria-labelledby="resource-library">
        <h2 id="resource-library" className="text-2xl font-semibold text-text-primary">Choose a resource</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {resourceNav.map((resource) => (
            <article key={resource.slug} className="flex flex-col rounded-xl border border-border bg-bg-surface p-6">
              <h3 className="text-xl font-semibold text-text-primary">{resource.title}</h3>
              <p className="mt-3 flex-1 text-text-subtle">{resource.description}</p>
              <p className="mt-4 text-sm text-text-muted">Source review: {resource.reviewed}</p>
              <Link
                href={`/resources/${resource.slug}`}
                data-resource-hub-link={`/resources/${resource.slug}`}
                data-analytics-event="resource_hub_asset_click"
                data-analytics-label={resource.slug}
                className="mt-5 inline-flex font-medium text-accent-cyan"
              >
                Open {resource.title.toLowerCase()}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="my-10 rounded-xl border border-accent-cyan/30 bg-accent-cyan/5 p-6" aria-labelledby="resource-workflow">
        <h2 id="resource-workflow" className="text-2xl font-semibold text-text-primary">From checklist to a live report</h2>
        <p className="mt-3 max-w-3xl text-text-subtle">
          Keep these resources in the workflow you already use. If in-page screenshots fit your privacy requirements, try the reporting flow before installing BugDrop.
        </p>
        <Link
          href="/demo"
          data-analytics-event="resource_hub_demo_click"
          data-analytics-label="resources"
          className="mt-5 inline-flex rounded-[10px] border border-accent-cyan px-5 py-3 font-medium text-accent-cyan no-underline"
        >
          Try the reporting demo
        </Link>
      </section>

      <nav className="flex flex-wrap gap-4 border-t border-border pt-6" aria-label="Related guidance">
        <Link href="/use-cases/screenshot-feedback-widget">Review screenshot capture choices</Link>
        <Link href="/use-cases/visual-bug-reporting">Build a visual reporting process</Link>
        <Link href="/use-cases/client-projects">Plan a client review round</Link>
        <Link href="/docs/security">Read BugDrop security documentation</Link>
      </nav>
    </main>
  );
}
