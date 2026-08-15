import Link from "next/link";
import type { Metadata } from "next";
import { compareNav } from "@/lib/compare-nav";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, pageMetadata, pageSchema } from "@/lib/seo";
import architecture from "@/lib/acquisition-architecture.json";

const hub = architecture.pages.find((page) => page.path === "/compare")!;
const description = hub.description;
const groups = [...new Set(compareNav.map((item) => item.group))];

export const metadata: Metadata = pageMetadata({
  title: hub.title,
  description,
  path: "/compare",
});

export default function CompareIndex() {
  return (
    <div>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Compare", path: "/compare" },
        ])}
      />
      <JsonLd
        data={pageSchema({
          title: hub.title,
          description,
          path: "/compare",
          type: "CollectionPage",
        })}
      />
      <h1 className="text-3xl font-bold text-text-primary mb-2">
        Website Feedback Tool Comparisons
      </h1>
      <p className="text-text-subtle mb-10">
        Compare by user job: visual website review, product feedback and
        observability, or control through open-source tooling.
      </p>
      <div className="space-y-10">
        {groups.map((group) => (
          <section key={group}>
            <h2 className="mb-4 text-xl font-semibold text-text-primary">{group}</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
              {compareNav.filter((item) => item.group === group).map((item) => (
                <Link
                  key={item.slug}
                  href={`/compare/${item.slug}`}
                  data-acquisition-hub-link={`/compare/${item.slug}`}
                  data-analytics-event="compare_index_click"
                  data-analytics-label={item.title}
                  className="bg-bg-surface border border-border rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:border-accent-warm hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] no-underline"
                >
                  <h3 className="text-lg font-semibold text-text-primary mb-2">{item.title}</h3>
                  <p className="text-sm text-text-subtle leading-relaxed">{item.description}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
