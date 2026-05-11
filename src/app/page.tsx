import Script from "next/script";
import type { Metadata } from "next";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { LiveDemoCta } from "@/components/landing/live-demo-cta";
import { DemoVideo } from "@/components/landing/demo-video";
import { Features } from "@/components/landing/features";
import { StylingShowcase } from "@/components/landing/styling-showcase";
import { QuickStart } from "@/components/landing/quick-start";
import { ConfigTable } from "@/components/landing/config-table";
import { TryCallout } from "@/components/landing/try-callout";
import { JsonLd } from "@/components/json-ld";
import {
  GITHUB_ORG_URL,
  GITHUB_PROFILE_URL,
  GITHUB_REPO_URL,
  GITHUB_WEB_REPO_URL,
  MARKETPLACE_URL,
  PRODUCT_HUNT_URL,
  SAMPLE_DEMO_REPO,
  WIDGET_URL,
} from "@/lib/links";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "BugDrop",
  description:
    "Free, open-source website feedback widget that turns user bug reports into GitHub issues with screenshots, annotations, and system info.",
  url: "https://bugdrop.dev",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Organization",
    name: "mean-weasel",
    url: GITHUB_ORG_URL,
  },
  creator: {
    "@type": "Person",
    name: "neonwatty",
    url: GITHUB_PROFILE_URL,
  },
  publisher: {
    "@type": "Organization",
    name: "mean-weasel",
    url: GITHUB_ORG_URL,
  },
  license: "https://opensource.org/licenses/MIT",
  codeRepository: GITHUB_REPO_URL,
  sameAs: [
    MARKETPLACE_URL,
    PRODUCT_HUNT_URL,
    GITHUB_REPO_URL,
    GITHUB_WEB_REPO_URL,
    GITHUB_ORG_URL,
    GITHUB_PROFILE_URL,
  ],
  award: "Product Hunt #6 Product of the Day, May 9, 2026",
  featureList: [
    "Screenshot capture",
    "Annotation tools",
    "Automatic system info",
    "GitHub issue creation",
    "Fully stylable widget",
    "Shadow DOM isolation",
    "Privacy-first design",
  ],
};

export default function Home() {
  return (
    <main>
      <JsonLd data={structuredData} />
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
      <HowItWorks />
      <LiveDemoCta />
      <Features />
      <StylingShowcase />
      <QuickStart />
      <ConfigTable />
      <DemoVideo />
      <TryCallout />
    </main>
  );
}
