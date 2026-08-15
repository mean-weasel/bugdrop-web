/* eslint-disable @next/next/no-sync-scripts -- BugDrop reads configuration from the executing script; its official contract forbids async/defer. */
import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { LiveDemoCta } from "@/components/landing/live-demo-cta";
import { DemoVideo } from "@/components/landing/demo-video";
import { Features } from "@/components/landing/features";
import { QuickStart } from "@/components/landing/quick-start";
import { ShowcaseCta } from "@/components/landing/showcase-cta";
import { TryCallout } from "@/components/landing/try-callout";
import { KeywordPositioning } from "@/components/landing/keyword-positioning";
import { JsonLd } from "@/components/json-ld";
import {
  organizationSchema,
  pageMetadata,
  softwareApplicationSchema,
  websiteSchema,
} from "@/lib/seo";
import {
  SAMPLE_DEMO_REPO,
  WIDGET_URL,
} from "@/lib/links";
import architecture from "@/lib/acquisition-architecture.json";

const home = architecture.pages.find((page) => page.path === "/")!;

export const metadata: Metadata = {
  ...pageMetadata({
    title: home.title,
    description: home.description,
    path: "/",
  }),
  keywords: [
    "website feedback widget",
    "GitHub Issues feedback widget",
    "visual bug reporting tool",
    "bug reporting widget",
    "open source feedback widget",
    "screenshot feedback widget",
    "Userback alternative",
    "Marker.io alternative",
    "BugHerd alternative",
    "Usersnap alternative",
    "Sentry User Feedback alternative",
    "Canny alternative for bug reports",
  ],
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <main>
      <JsonLd data={softwareApplicationSchema()} />
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema()} />
      <script
        src={WIDGET_URL}
        data-repo={SAMPLE_DEMO_REPO}
        data-theme="dark"
        data-position="bottom-right"
        data-color="#7dcfff"
        data-bg="#24283b"
        data-text="#c0caf5"
        data-border-color="#7dcfff"
        data-border-width="1"
        data-radius="10"
        data-shadow="soft"
        data-font="inherit"
        data-label="Feedback"
        data-welcome="This is the BugDrop landing page demo. Send a test report to see what your users would experience."
      />
      <Hero />
      <DemoVideo />
      <LiveDemoCta />
      <HowItWorks />
      <Features />
      <KeywordPositioning />
      <ShowcaseCta />
      <QuickStart />
      <section className="mx-auto max-w-5xl px-6 py-16" aria-labelledby="portable-resources">
        <h2 id="portable-resources" className="text-3xl font-bold text-text-primary">Portable review resources</h2>
        <p className="mt-3 max-w-2xl text-text-subtle">Use these assets without installing BugDrop. Copy, download, or print them for the reporting and QA workflow you already have.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Link href="/resources/visual-bug-report-template" className="rounded-xl border border-border bg-bg-surface p-5 no-underline hover:border-accent-cyan">
            <strong className="text-text-primary">Visual bug report template</strong>
            <span className="mt-2 block text-text-subtle">Structure expected behavior, steps, environment, evidence, privacy, and triage.</span>
          </Link>
          <Link href="/resources/client-website-qa-checklist" className="rounded-xl border border-border bg-bg-surface p-5 no-underline hover:border-accent-cyan">
            <strong className="text-text-primary">Client website QA checklist</strong>
            <span className="mt-2 block text-text-subtle">Run a bounded responsive, content, accessibility, privacy, and handoff review.</span>
          </Link>
        </div>
      </section>
      <TryCallout />
    </main>
  );
}
