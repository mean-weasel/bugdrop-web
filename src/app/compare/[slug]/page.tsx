import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compareNav } from "@/lib/compare-nav";
import { MARKETPLACE_URL } from "@/lib/links";
import Link from "next/link";

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

  return {
    title: `${comparison.title} — BugDrop`,
    description: comparison.description,
    alternates: {
      canonical: `/compare/${slug}`,
    },
  };
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
    return (
      <div>
        <Link
          href="/compare"
          className="text-accent-cyan hover:underline text-sm mb-6 block"
        >
          &larr; All Comparisons
        </Link>
        <Content />
        <div className="mt-12 p-8 bg-gradient-to-br from-accent-warm/10 to-accent-rose/10 border border-accent-warm/20 rounded-2xl text-center">
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            Try BugDrop free
          </h3>
          <p className="text-text-subtle mb-4">
            Add screenshot-powered bug reporting to any site in under a minute.
          </p>
          <a
            href={MARKETPLACE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] font-medium bg-gradient-to-br from-accent-warm to-accent-rose text-bg-deep hover:-translate-y-0.5 transition-all duration-300"
          >
            Install from GitHub Marketplace
          </a>
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
