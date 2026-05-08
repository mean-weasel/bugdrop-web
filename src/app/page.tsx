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
import { MARKETPLACE_URL } from "@/lib/links";

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
