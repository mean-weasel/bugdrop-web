import type { Metadata } from "next";
import { VariantsLab } from "@/components/variants-lab/variants-lab";

export const metadata: Metadata = {
  title: "BugDrop Composable Feedback Lab",
  description: "An unpublished local lab for composing BugDrop feedback primitives into usable recipes.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function VariantsLabPage() {
  return <VariantsLab />;
}
