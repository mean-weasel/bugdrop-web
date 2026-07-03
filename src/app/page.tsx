import Script from "next/script";
import type { Metadata } from "next";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { LiveDemoCta } from "@/components/landing/live-demo-cta";
import { DemoVideo } from "@/components/landing/demo-video";
import { Features } from "@/components/landing/features";
import { QuickStart } from "@/components/landing/quick-start";
import { ShowcaseCta } from "@/components/landing/showcase-cta";
import { TryCallout } from "@/components/landing/try-callout";
import { JsonLd } from "@/components/json-ld";
import {
  homeDescription,
  organizationSchema,
  pageMetadata,
  softwareApplicationSchema,
  websiteSchema,
} from "@/lib/seo";
import {
  SAMPLE_DEMO_REPO,
  WIDGET_URL,
} from "@/lib/links";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Free Website Feedback Widget for GitHub Issues | BugDrop",
    description: homeDescription,
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
      <Script
        src={WIDGET_URL}
        strategy="afterInteractive"
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
      <ShowcaseCta />
      <QuickStart />
      <TryCallout />
    </main>
  );
}
