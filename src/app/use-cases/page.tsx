import Link from "next/link";
import type { Metadata } from "next";
import { useCasesNav } from "@/lib/use-cases-nav";
import { JsonLd } from "@/components/json-ld";
import { articleSchema, breadcrumbSchema, pageMetadata } from "@/lib/seo";

const description =
  "Use cases for BugDrop, from open-source projects and internal tools to visual bug reporting, client review, and GitHub Issues feedback.";

export const metadata: Metadata = pageMetadata({
  title: "BugDrop Use Cases",
  description,
  path: "/use-cases",
  type: "article",
});

export default function UseCasesIndex() {
  return (
    <div>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Use Cases", path: "/use-cases" },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: "BugDrop Use Cases",
          description,
          path: "/use-cases",
        })}
      />
      <h1 className="text-3xl font-bold text-text-primary mb-2">Use Cases</h1>
      <p className="text-text-subtle mb-10">
        See how teams use BugDrop for open-source projects, internal tools,
        client review, visual bug reporting, Next.js sites, and GitHub Issues
        feedback.
      </p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
        {useCasesNav.map((uc) => (
          <Link
            key={uc.slug}
            href={`/use-cases/${uc.slug}`}
            className="bg-bg-surface border border-border rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:border-accent-warm hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] no-underline"
          >
            <span className="text-3xl mb-4 block">{uc.icon}</span>
            <h2 className="text-lg font-semibold text-text-primary mb-2">{uc.title}</h2>
            <p className="text-sm text-text-subtle leading-relaxed">{uc.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
