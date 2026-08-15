import { notFound } from "next/navigation";
import Link from "next/link";
import { VercelPreviewBugDrop } from "@/components/integrations/vercel-preview-bugdrop";
import { SAMPLE_DEMO_REPO } from "@/lib/links";

const modes = ["preview", "production"] as const;
const PINNED_WIDGET_URL =
  "/vendor/bugdrop/b307db46d895ae141f34befbc8cfcd107b155bc9/widget.js";

export function generateStaticParams() {
  return modes.map((mode) => ({ mode }));
}

export default async function IntegrationProofPage({
  params,
}: {
  params: Promise<{ mode: string }>;
}) {
  const { mode } = await params;
  if (!modes.includes(mode as (typeof modes)[number])) notFound();

  return (
    <main className="mx-auto max-w-3xl px-5 py-16" data-integration-proof={mode}>
      <h1 className="text-4xl font-bold text-text-primary">Integration proof: {mode}</h1>
      <p className="mt-4 text-text-subtle">
        This noindex lab renders the same environment gate documented for Vercel previews.
      </p>
      <Link className="mt-6 inline-block text-accent-cyan" href={`/labs/integration-proof/${mode === "preview" ? "production" : "preview"}`}>
        Check {mode === "preview" ? "production" : "preview"} mode
      </Link>
      <VercelPreviewBugDrop
        repo={SAMPLE_DEMO_REPO}
        environment={mode}
        scriptUrl={PINNED_WIDGET_URL}
      />
    </main>
  );
}
