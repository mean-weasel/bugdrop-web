import type { MetadataRoute } from "next";
import { compareNav } from "@/lib/compare-nav";
import { docsNav } from "@/lib/docs-nav";
import { SITE_UPDATED, SITE_URL } from "@/lib/seo";
import { useCasesNav } from "@/lib/use-cases-nav";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL;
  const lastModified = new Date(SITE_UPDATED);

  return [
    { url: base, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/demo`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/docs`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    ...docsNav
      .filter((doc) => doc.slug !== "")
      .map((doc) => ({
        url: `${base}/docs/${doc.slug}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: ["installation", "security", "configuration"].includes(doc.slug)
          ? 0.8
          : doc.slug === "faq"
            ? 0.6
            : 0.7,
      })),
    { url: `${base}/use-cases`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    ...useCasesNav.map((useCase) => ({
      url: `${base}/use-cases/${useCase.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: ["github-issues-feedback", "visual-bug-reporting", "nextjs-feedback-widget"].includes(
        useCase.slug,
      )
        ? 0.8
        : 0.6,
    })),
    { url: `${base}/compare`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    ...compareNav.map((comparison) => ({
      url: `${base}/compare/${comparison.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  ];
}
