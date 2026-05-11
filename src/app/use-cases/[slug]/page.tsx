import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { useCasesNav } from "@/lib/use-cases-nav";
import { MARKETPLACE_URL } from "@/lib/links";
import Link from "next/link";

export function generateStaticParams() {
  return useCasesNav.map((uc) => ({ slug: uc.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const useCase = useCasesNav.find((uc) => uc.slug === slug);
  if (!useCase) notFound();

  return {
    title: `${useCase.title} — BugDrop Use Cases`,
    description: useCase.description,
    alternates: {
      canonical: `/use-cases/${slug}`,
    },
  };
}

export default async function UseCasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const useCase = useCasesNav.find((uc) => uc.slug === slug);
  if (!useCase) notFound();
  try {
    const Content = (await import(`@/content/use-cases/${slug}.mdx`)).default;
    return (
      <div>
        <Link
          href="/use-cases"
          className="text-accent-cyan hover:underline text-sm mb-6 block"
        >
          ← All Use Cases
        </Link>
        <Content />
        <div className="mt-12 p-8 bg-gradient-to-br from-accent-warm/10 to-accent-rose/10 border border-accent-warm/20 rounded-2xl text-center">
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            Ready to get started?
          </h3>
          <p className="text-text-subtle mb-4">
            Add BugDrop to your project in under a minute.
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
