import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compareNav } from "@/lib/compare-nav";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, pageMetadata, pageSchema } from "@/lib/seo";
import { AcquisitionRelatedLinks } from "@/components/acquisition-related-links";
import { ComparisonShell, ComparisonTable, getComparisonEvidence } from "@/components/comparison/comparison-shell";

export function generateStaticParams() {
  return compareNav.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const comparison = compareNav.find((c) => c.slug === slug);
  if (!comparison) notFound();

  return pageMetadata({
    title: `${comparison.title} — BugDrop`,
    description: comparison.description,
    path: `/compare/${slug}`,
  });
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const comparison = compareNav.find((c) => c.slug === slug);
  if (!comparison) notFound();
  try {
    const Content = (await import(`@/content/compare/${slug}.mdx`)).default;
    const evidence = getComparisonEvidence(slug);
    return (
      <div>
        <JsonLd
          data={breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Compare", path: "/compare" },
            { name: comparison.title, path: `/compare/${slug}` },
          ])}
        />
        <JsonLd
          data={pageSchema({
            title: `${comparison.title} — BugDrop`,
            description: comparison.description,
            path: `/compare/${slug}`,
          })}
        />
        <Link
          href="/compare"
          className="text-accent-cyan hover:underline text-sm mb-6 block"
        >
          &larr; All Comparisons
        </Link>
        <ComparisonShell evidence={evidence}>
          <Content components={{ table: ComparisonTable }} />
        </ComparisonShell>
        <AcquisitionRelatedLinks path={`/compare/${slug}`} />
      </div>
    );
  } catch {
    notFound();
  }
}
