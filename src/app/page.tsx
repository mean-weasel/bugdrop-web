import type { Metadata } from "next";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { HomepageWidget } from "@/components/landing/homepage-widget";
import { DemoVideo } from "@/components/landing/demo-video";
import { QuickStart } from "@/components/landing/quick-start";
import { LandingChapter } from "@/components/landing/landing-chapter";
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
    <main className="-my-16 max-sm:-my-8" data-landing-page>
      <JsonLd data={softwareApplicationSchema()} />
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema()} />
      <LandingChapter id="overview">
        <Hero />
      </LandingChapter>
      <LandingChapter id="demo" labelledBy="demo-heading">
        <DemoVideo />
      </LandingChapter>
      <LandingChapter id="flows" labelledBy="flows-heading">
        <HomepageWidget />
      </LandingChapter>
      <LandingChapter id="get-started" labelledBy="get-started-heading">
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] items-center gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12">
          <HowItWorks />
          <QuickStart />
        </div>
      </LandingChapter>
    </main>
  );
}
