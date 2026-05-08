import Script from "next/script";
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
import { MARKETPLACE_URL, SAMPLE_DEMO_REPO, WIDGET_URL } from "@/lib/links";

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
    url: "https://github.com/mean-weasel",
  },
  license: "https://opensource.org/licenses/MIT",
  codeRepository: "https://github.com/mean-weasel/bugdrop",
  sameAs: [MARKETPLACE_URL],
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
        data-label="Feedback"
        data-welcome="This is the BugDrop landing page demo. Send a test report to see what your users would experience."
        data-button-dismissible="true"
        data-dismiss-duration="60"
        data-show-restore="true"
      />
      <Hero />
      <HowItWorks />
      <LiveDemoCta />
      <DemoVideo />
      <Features />
      <StylingShowcase />
      <QuickStart />
      <ConfigTable />
      <TryCallout />
    </main>
  );
}
