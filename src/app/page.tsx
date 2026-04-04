import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { DemoVideo } from "@/components/landing/demo-video";
import { Features } from "@/components/landing/features";
import { StylingShowcase } from "@/components/landing/styling-showcase";
import { QuickStart } from "@/components/landing/quick-start";
import { ConfigTable } from "@/components/landing/config-table";
import { TryCallout } from "@/components/landing/try-callout";

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <DemoVideo />
      <Features />
      <StylingShowcase />
      <QuickStart />
      <ConfigTable />
      <TryCallout />
    </main>
  );
}
