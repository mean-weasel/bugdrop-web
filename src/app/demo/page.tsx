import type { Metadata } from "next";
import { ArrowUpRight, CirclePlay, Code2, MessageSquare } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { DEMO_URL, GITHUB_REPO_URL, MARKETPLACE_URL } from "@/lib/links";
import { breadcrumbSchema, pageMetadata, videoSchema } from "@/lib/seo";

const description =
  "Try the BugDrop demo to test a website feedback widget that captures screenshots, annotations, redaction, system info, and GitHub Issues.";

export const metadata: Metadata = pageMetadata({
  title: "BugDrop Demo",
  description,
  path: "/demo",
});

export default function DemoPage() {
  return (
    <main>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Demo", path: "/demo" },
        ])}
      />
      <JsonLd data={videoSchema()} />
      <section className="mb-12">
        <p className="mb-3 text-sm font-medium text-accent-cyan">Live demo</p>
        <h1 className="mb-5 text-4xl font-semibold leading-tight text-text-primary max-sm:text-3xl">
          Try BugDrop on a sample app
        </h1>
        <p className="max-w-[720px] text-lg leading-relaxed text-text-subtle">
          The BugDrop demo shows the full website feedback flow: open the widget,
          capture a screenshot, annotate the problem, redact sensitive regions,
          and submit a GitHub Issue with browser and page context.
        </p>
      </section>

      <div className="mb-14 grid gap-4 md:grid-cols-3">
        <a
          href={DEMO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-accent-cyan px-5 py-3 font-medium text-bg-deep transition-all hover:-translate-y-0.5"
        >
          <ArrowUpRight className="size-4" aria-hidden="true" />
          Open Live Demo
        </a>
        <a
          href={MARKETPLACE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-bg-surface px-5 py-3 font-medium text-text-primary transition-all hover:-translate-y-0.5"
        >
          <MessageSquare className="size-4" aria-hidden="true" />
          Install BugDrop
        </a>
        <a
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-border px-5 py-3 font-medium text-text-primary transition-all hover:-translate-y-0.5 hover:bg-bg-surface"
        >
          <Code2 className="size-4" aria-hidden="true" />
          View Source
        </a>
      </div>

      <section className="mb-16 grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="mb-3 text-2xl font-semibold text-text-primary">
            What to test
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-text-subtle">
            <li>Open the feedback widget from the floating button.</li>
            <li>Attach a screenshot and mark up the broken UI state.</li>
            <li>Cover private screenshot regions before submitting.</li>
            <li>Confirm the report includes URL, browser, viewport, and OS data.</li>
            <li>Review the GitHub Issue format your team would receive.</li>
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-2xl font-semibold text-text-primary">
            Why it matters
          </h2>
          <p className="text-text-subtle">
            BugDrop is built for teams that already work in GitHub Issues. The
            demo makes the workflow concrete: reporters do not need accounts,
            developers get visual context, and sensitive page data can be masked
            before the screenshot lands in your repository.
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-6 flex items-center gap-3 text-2xl font-semibold text-text-primary">
          <CirclePlay className="size-6 text-accent-cyan" aria-hidden="true" />
          Watch the flow
        </h2>
        <div className="max-w-[640px] overflow-hidden rounded-xl border border-border bg-black">
          <iframe
            src="https://www.youtube.com/embed/VkLvP1xmRzo"
            title="BugDrop Demo Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="block aspect-[9/16] max-h-[520px] w-full border-none"
          />
        </div>
      </section>
    </main>
  );
}
