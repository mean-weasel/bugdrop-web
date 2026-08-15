import Link from "next/link";
import architecture from "@/lib/acquisition-architecture.json";

export function AcquisitionRelatedLinks({ path }: { path: string }) {
  const page = architecture.pages.find((item) => item.path === path);

  if (!page || page.related.length === 0) return null;

  return (
    <aside
      aria-labelledby="related-acquisition-pages"
      className="mt-12 rounded-2xl border border-border bg-bg-surface p-7"
      data-acquisition-related-for={path}
    >
      <h2
        id="related-acquisition-pages"
        className="mb-2 text-xl font-semibold text-text-primary"
      >
        Continue exploring
      </h2>
      <p className="mb-5 text-sm leading-relaxed text-text-subtle">
        Follow the part of the website feedback workflow that matches your next
        decision.
      </p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-4">
        {page.related.map((related) => (
          <Link
            key={related.path}
            href={related.path}
            data-acquisition-related-link={related.path}
            className="rounded-xl border border-border bg-bg-elevated p-4 no-underline transition-colors hover:border-accent-cyan"
          >
            <span className="mb-1 block text-sm font-semibold text-accent-cyan">
              {related.anchor}
            </span>
            <span className="block text-sm leading-relaxed text-text-subtle">
              {related.rationale}
            </span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
