import type { Metadata } from "next";
import { WidgetSandbox } from "@/components/sandbox/widget-sandbox";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "BugDrop Sandbox | Configure and Preview the Feedback Widget",
    description:
      "Configure BugDrop's feedback widget, preview styling and screenshot behavior, and generate the script tag for your own app.",
    path: "/sandbox",
  }),
  alternates: {
    canonical: "/sandbox",
  },
};

export default function SandboxPage() {
  return <WidgetSandbox />;
}
