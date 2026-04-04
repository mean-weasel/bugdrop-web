import Link from "next/link";
import { useCasesNav } from "@/lib/use-cases-nav";

export const metadata = {
  title: "Use Cases — BugDrop",
  description: "See how teams use BugDrop.",
};

export default function UseCasesIndex() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-2">Use Cases</h1>
      <p className="text-text-subtle mb-10">
        See how teams use BugDrop to collect feedback and track bugs.
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
