import Link from "next/link";
import type { Metadata } from "next";
import { useCasesNav } from "@/lib/use-cases-nav";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, pageMetadata, pageSchema } from "@/lib/seo";
import architecture from "@/lib/acquisition-architecture.json";

const hub = architecture.pages.find((page) => page.path === "/use-cases")!;
const description = hub.description;
const groups = [...new Set(useCasesNav.map((item) => item.group))];

export const metadata: Metadata = pageMetadata({
  title: hub.title,
  description,
  path: "/use-cases",
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
        data={pageSchema({
          title: hub.title,
          description,
          path: "/use-cases",
          type: "CollectionPage",
        })}
      />
      <h1 className="text-3xl font-bold text-text-primary mb-2">
        Website Feedback Use Cases
      </h1>
      <p className="text-text-subtle mb-10">
        Choose the user job first: collect website feedback, improve visual bug
        reports, support a specific audience, or structure client review.
      </p>
      <div className="space-y-10">
        {groups.map((group) => (
          <section key={group}>
            <h2 className="mb-4 text-xl font-semibold text-text-primary">{group}</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
              {useCasesNav.filter((uc) => uc.group === group).map((uc) => (
                <Link
                  key={uc.slug}
                  href={`/use-cases/${uc.slug}`}
                  data-acquisition-hub-link={`/use-cases/${uc.slug}`}
                  data-analytics-event="use_case_index_click"
                  data-analytics-label={uc.title}
                  className="bg-bg-surface border border-border rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:border-accent-warm hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] no-underline"
                >
                  <span className="text-3xl mb-4 block">{uc.icon}</span>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">{uc.title}</h3>
                  <p className="text-sm text-text-subtle leading-relaxed">{uc.description}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
