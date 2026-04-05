import Link from "next/link";
import { compareNav } from "@/lib/compare-nav";

export const metadata = {
  title: "Compare — BugDrop",
  description: "See how BugDrop compares to other feedback tools.",
};

export default function CompareIndex() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-2">Compare</h1>
      <p className="text-text-subtle mb-10">
        See how BugDrop compares to other feedback tools.
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
