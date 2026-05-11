import Link from "next/link";
import type { Metadata } from "next";
import { compareNav } from "@/lib/compare-nav";
import { JsonLd } from "@/components/json-ld";
import { articleSchema, breadcrumbSchema, pageMetadata } from "@/lib/seo";

const description =
  "Compare BugDrop with Userback, Canny, Sentry User Feedback, Marker.io, BugHerd, Usersnap, and other website feedback tools.";

export const metadata: Metadata = pageMetadata({
  title: "Compare BugDrop",
  description,
  path: "/compare",
  type: "article",
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
        data={articleSchema({
          title: "Compare BugDrop",
          description,
          path: "/compare",
        })}
      />
      <h1 className="text-3xl font-bold text-text-primary mb-2">Compare</h1>
      <p className="text-text-subtle mb-10">
        Compare BugDrop with visual feedback, roadmap, and customer feedback
        tools to choose the right workflow for GitHub-native bug reports.
      </p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
        {compareNav.map((c) => (
          <Link
            key={c.slug}
            href={`/compare/${c.slug}`}
            className="bg-bg-surface border border-border rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:border-accent-warm hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] no-underline"
          >
            <h2 className="text-lg font-semibold text-text-primary mb-2">{c.title}</h2>
            <p className="text-sm text-text-subtle leading-relaxed">{c.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
