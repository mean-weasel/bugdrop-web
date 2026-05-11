import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { docsNav } from "@/lib/docs-nav";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import {
  articleSchema,
  breadcrumbSchema,
  faqSchema,
  pageMetadata,
  videoSchema,
} from "@/lib/seo";

export function generateStaticParams() {
  return docsNav
    .filter((doc) => doc.slug !== "")
    .map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = docsNav.find((d) => d.slug === slug);
  if (!doc) notFound();

  return pageMetadata({
    title: `${doc.title} — BugDrop Docs`,
    description: doc.description,
    path: `/docs/${slug}`,
    type: "article",
  });
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const currentIndex = docsNav.findIndex((d) => d.slug === slug);
  if (currentIndex === -1) notFound();
  const doc = docsNav[currentIndex];

  try {
    const Content = (await import(`@/content/docs/${slug}.mdx`)).default;
    const prev = currentIndex > 0 ? docsNav[currentIndex - 1] : null;
    const next =
      currentIndex < docsNav.length - 1 ? docsNav[currentIndex + 1] : null;
    return (
      <div>
        <JsonLd
          data={breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Docs", path: "/docs" },
            { name: doc.title, path: `/docs/${slug}` },
          ])}
        />
        <JsonLd
          data={articleSchema({
            title: `${doc.title} — BugDrop Docs`,
            description: doc.description,
            path: `/docs/${slug}`,
            type: "TechArticle",
          })}
        />
        {slug === "faq" ? <JsonLd data={faqSchema()} /> : null}
        {slug === "demo" ? <JsonLd data={videoSchema()} /> : null}
        <Content />
        <nav className="flex justify-between mt-12 pt-6 border-t border-border">
          {prev ? (
            <Link
              href={prev.slug ? `/docs/${prev.slug}` : "/docs"}
              className="text-accent-cyan hover:underline text-sm"
            >
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/docs/${next.slug}`}
              className="text-accent-cyan hover:underline text-sm"
            >
              {next.title} →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>
    );
  } catch {
    notFound();
  }
}
