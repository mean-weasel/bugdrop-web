import Link from "next/link";
import type { Metadata } from "next";
import { PlayCircle } from "lucide-react";
import { DEMO_PATH } from "@/lib/links";
import { JsonLd } from "@/components/json-ld";
import { articleSchema, breadcrumbSchema, pageMetadata } from "@/lib/seo";

const description =
  "Documentation for installing, configuring, styling, testing, securing, and self-hosting the BugDrop website feedback widget.";

export const metadata: Metadata = pageMetadata({
  title: "BugDrop Docs",
  description,
  path: "/docs",
  type: "article",
});

export default function DocsIndex() {
  return (
    <div>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Docs", path: "/docs" },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: "BugDrop Docs",
          description,
          path: "/docs",
          type: "TechArticle",
        })}
      />
      <h1 className="text-3xl font-bold text-text-primary mb-4">Getting Started</h1>
      <p className="text-text-subtle mb-6 leading-relaxed">
        BugDrop is an open-source feedback widget that turns user bug reports into GitHub issues.
        Screenshots, annotations, and system info — all captured automatically.
      </p>
      <div className="mb-8 flex flex-wrap gap-3">
        <a
          href={DEMO_PATH}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-[10px] bg-accent-cyan px-4 py-2 text-sm font-medium text-bg-deep transition-all hover:-translate-y-0.5"
        >
          <PlayCircle className="size-4" aria-hidden="true" />
          Open Sample App Demo
        </a>
        <Link
          href="/docs/installation"
          className="inline-flex items-center rounded-[10px] border border-border bg-bg-surface px-4 py-2 text-sm font-medium text-text-primary transition-all hover:-translate-y-0.5 hover:bg-bg-elevated"
        >
          Install BugDrop
        </Link>
      </div>
      <h2 className="text-xl font-semibold text-text-primary mt-8 mb-3">Quick Overview</h2>
      <ol className="list-decimal list-inside text-text-subtle space-y-2 mb-6">
        <li>
          <Link href="/docs/installation" className="text-accent-cyan hover:underline">
            Install the GitHub App
          </Link>{" "}
          on your repository
        </li>
        <li>Add a single script tag to your website</li>
        <li>Users can now submit feedback that becomes GitHub issues</li>
      </ol>
      <p className="text-text-subtle">
        Ready to go?{" "}
        <Link href="/docs/installation" className="text-accent-cyan hover:underline">
          Start with installation →
        </Link>
      </p>
    </div>
  );
}
