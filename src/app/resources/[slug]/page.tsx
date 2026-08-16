import type { Metadata } from "next";
import type { InputHTMLAttributes } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { ResourceActions } from "@/components/resources/resource-actions";
import { pageMetadata, absoluteUrl } from "@/lib/seo";
import { resourceNav } from "@/lib/resource-nav";
import { portableResourceText } from "@/lib/resources/portable-text";

export function generateStaticParams() {
  return resourceNav.map(({ slug }) => ({ slug }));
}

function ResourceChecklistMarker(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} aria-hidden="true" tabIndex={-1} />;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const resource = resourceNav.find((item) => item.slug === slug);
  if (!resource) notFound();
  return pageMetadata({ title: `${resource.title} — BugDrop Resources`, description: resource.description, path: `/resources/${slug}`, type: "article" });
}

export default async function ResourcePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resource = resourceNav.find((item) => item.slug === slug);
  if (!resource) notFound();
  const Content = (await import(`@/content/resources/${slug}.mdx`)).default;
  const copyText = portableResourceText[resource.slug];
  const secondary = resource.slug === "client-website-qa-checklist"
    ? { href: "/sandbox", event: "resource_sandbox_click", label: "Inspect the reporting sandbox" }
    : resource.slug === "screenshot-privacy-checklist"
      ? { href: "/demo", event: "privacy_checklist_demo_click", label: "Practice a privacy-reviewed report" }
      : { href: "/demo", event: "resource_demo_click", label: "Try visual reporting in the demo" };
  const related = resource.slug === "visual-bug-report-template"
    ? [
        ["/resources", "Browse all website feedback resources"],
        ["/use-cases/visual-bug-reporting", "Plan visual bug reporting"],
        ["/use-cases/screenshot-feedback-widget", "Capture screenshot feedback"],
        ["/resources/client-website-qa-checklist", "Run the client website QA checklist"],
      ]
    : resource.slug === "client-website-qa-checklist"
      ? [
        ["/resources", "Browse all website feedback resources"],
        ["/use-cases/client-projects", "Plan client review"],
        ["/use-cases/vercel-preview-feedback", "Collect feedback on Vercel previews"],
        ["/resources/visual-bug-report-template", "Write a visual bug report"],
      ]
      : [
        ["/resources", "Browse all website feedback resources"],
        ["/use-cases/screenshot-feedback-widget", "Choose a screenshot capture path"],
        ["/docs/security", "Review BugDrop masking limits"],
        ["/resources/visual-bug-report-template", "Write a privacy-reviewed visual report"],
      ];

  const schema = resource.schemaType === "HowTo"
    ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: resource.title,
        description: resource.description,
        url: absoluteUrl(`/resources/${slug}`),
        step: ["Describe expected and actual behavior", "Record reproduction steps and environment", "Attach privacy-reviewed visual evidence", "Assign triage context"].map((text, index) => ({ "@type": "HowToStep", position: index + 1, text })),
      }
    : {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: resource.title,
        description: resource.description,
        url: absoluteUrl(`/resources/${slug}`),
        numberOfItems: 4,
        itemListElement: (resource.slug === "screenshot-privacy-checklist"
          ? ["Prepare the capture surface", "Inspect the final image", "Verify the destination", "Store and retire deliberately"]
          : ["Review contract", "Responsive and visual QA", "Content and interaction QA", "Privacy and handoff"]
        ).map((name, index) => ({ "@type": "ListItem", position: index + 1, name })),
      };

  return (
    <main data-resource-page={slug}>
      <JsonLd data={schema} />
      <article>
        <Content components={{ input: ResourceChecklistMarker }} />
      </article>
      <ResourceActions
        downloadPath={resource.downloadPath}
        copyText={copyText}
        analyticsLabel={resource.slug}
        printLabel={resource.slug === "visual-bug-report-template" ? "Print template" : "Print checklist"}
      />
      <section className="my-6 rounded-xl border border-accent-cyan/30 bg-accent-cyan/5 p-5" data-resource-secondary-conversion={resource.slug}>
        <h2 className="text-xl font-semibold text-text-primary">Validate the workflow</h2>
        <p className="mt-2 text-text-subtle">Keep the asset portable, then inspect how in-page reporting fits the workflow.</p>
        <Link
          href={secondary.href}
          data-analytics-event={secondary.event}
          data-analytics-label={resource.slug}
          className="mt-4 inline-flex rounded-[10px] border border-accent-cyan px-5 py-3 font-medium text-accent-cyan no-underline"
        >
          {secondary.label}
        </Link>
      </section>
      <noscript>
        <p className="my-6 rounded-xl border border-border p-4 text-text-subtle">
          JavaScript is off. The complete asset remains above; select the text to copy, use the Markdown download, or use your browser&apos;s print command.
        </p>
      </noscript>
      <aside className="mt-8 rounded-xl border border-border bg-bg-surface p-5 text-sm text-text-subtle" data-resource-provenance>
        <p>Sources reviewed {resource.reviewed}: {resource.sourceLabel}.</p>
        <ul className="mt-2 list-disc pl-5">
          {resource.sources.map((source) => <li key={source.url}><a href={source.url}>{source.label}</a></li>)}
        </ul>
        <p className="mt-2">Adapt this asset to your risk model; it is a review aid, not a completeness or compliance guarantee.</p>
      </aside>
      <nav className="mt-10 flex flex-wrap gap-4 border-t border-border pt-6">
        {related.map(([href, label]) => (
          <Link data-resource-related-link={href} href={href} key={href}>{label}</Link>
        ))}
        <Link data-resource-related-link href="/docs/security">Review screenshot privacy</Link>
      </nav>
    </main>
  );
}
