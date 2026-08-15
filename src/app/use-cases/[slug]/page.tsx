import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { useCasesNav } from "@/lib/use-cases-nav";
import { MARKETPLACE_URL } from "@/lib/links";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, pageMetadata, pageSchema } from "@/lib/seo";
import { AcquisitionRelatedLinks } from "@/components/acquisition-related-links";

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

  return pageMetadata({
    title: `${useCase.title} — BugDrop Use Cases`,
    description: useCase.description,
    path: `/use-cases/${slug}`,
  });
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
        <JsonLd
          data={breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Use Cases", path: "/use-cases" },
            { name: useCase.title, path: `/use-cases/${slug}` },
          ])}
        />
        <JsonLd
          data={pageSchema({
            title: `${useCase.title} — BugDrop Use Cases`,
            description: useCase.description,
            path: `/use-cases/${slug}`,
          })}
        />
        <Link
          href="/use-cases"
          className="text-accent-cyan hover:underline text-sm mb-6 block"
        >
          ← All Use Cases
        </Link>
        <article data-use-case-page={slug}>
          <Content />
        </article>
        <AcquisitionRelatedLinks path={`/use-cases/${slug}`} />
        <section
          data-use-case-conversion={slug}
          className="mt-12 p-6 sm:p-8 bg-gradient-to-br from-accent-warm/10 to-accent-rose/10 border border-accent-warm/20 rounded-2xl text-center"
        >
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Validate this workflow before rollout
          </h2>
          <p className="text-text-subtle mb-4">
            Try a report, review the installation and privacy contract, then add
            BugDrop to a low-risk page.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/demo"
              data-analytics-event="use_case_demo_click"
              data-analytics-label={useCase.title}
              className="inline-flex items-center justify-center px-5 py-3 rounded-[10px] font-medium bg-gradient-to-br from-accent-warm to-accent-rose text-bg-deep no-underline hover:-translate-y-0.5 transition-all duration-300"
            >
              Try the reporting flow
            </Link>
            <Link
              href="/docs/installation"
              data-analytics-event="use_case_installation_click"
              data-analytics-label={useCase.title}
              className="inline-flex items-center justify-center px-5 py-3 rounded-[10px] font-medium border border-border bg-bg-surface text-text-primary no-underline hover:border-accent-cyan"
            >
              Review installation
            </Link>
            <a
              href={MARKETPLACE_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-analytics-event="use_case_marketplace_click"
              data-analytics-label={useCase.title}
              className="inline-flex items-center justify-center px-5 py-3 rounded-[10px] font-medium border border-border bg-bg-surface text-text-primary no-underline hover:border-accent-cyan"
            >
              Install from GitHub Marketplace
            </a>
          </div>
        </section>
      </div>
    );
  } catch {
    notFound();
  }
}
