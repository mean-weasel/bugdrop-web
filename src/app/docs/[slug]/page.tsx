import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { docsNav } from "@/lib/docs-nav";
import Link from "next/link";

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

  return {
    title: `${doc.title} — BugDrop Docs`,
    alternates: {
      canonical: `/docs/${slug}`,
    },
  };
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const currentIndex = docsNav.findIndex((d) => d.slug === slug);
  if (currentIndex === -1) notFound();

  try {
    const Content = (await import(`@/content/docs/${slug}.mdx`)).default;
    const prev = currentIndex > 0 ? docsNav[currentIndex - 1] : null;
    const next =
      currentIndex < docsNav.length - 1 ? docsNav[currentIndex + 1] : null;
    return (
      <div>
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
