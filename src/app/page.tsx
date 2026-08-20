import type { Metadata } from "next";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { HomepageWidget } from "@/components/landing/homepage-widget";
import { DemoVideo } from "@/components/landing/demo-video";
import { Features } from "@/components/landing/features";
import { QuickStart } from "@/components/landing/quick-start";
import { ShowcaseCta } from "@/components/landing/showcase-cta";
import { TryCallout } from "@/components/landing/try-callout";
import { JsonLd } from "@/components/json-ld";
import {
  organizationSchema,
  pageMetadata,
  softwareApplicationSchema,
  websiteSchema,
} from "@/lib/seo";
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
      <Hero />
      <DemoVideo />
      <HomepageWidget />
      <HowItWorks />
      <Features />
      <ShowcaseCta />
      <QuickStart />
      <TryCallout />
    </main>
  );
}
