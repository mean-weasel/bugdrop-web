import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import PrivacyPolicy from "@/content/privacy.mdx";
import { pageMetadata, pageSchema } from "@/lib/seo";

const title = "Privacy Policy — BugDrop";
const description =
  "Learn how BugDrop handles feedback data, website analytics, installation information, retention, and social proof permissions.";

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: "/privacy",
  type: "article",
});

export default function PrivacyPage() {
  return (
    <main data-privacy-page className="mx-auto max-w-3xl">
      <JsonLd
        data={pageSchema({
          title,
          description,
          path: "/privacy",
          type: "WebPage",
        })}
      />
      <article>
        <PrivacyPolicy />
      </article>
    </main>
  );
}
