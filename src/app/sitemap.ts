import type { MetadataRoute } from "next";
import { compareNav } from "@/lib/compare-nav";
import { docsNav } from "@/lib/docs-nav";
import { useCasesNav } from "@/lib/use-cases-nav";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://bugdrop.dev";
  const lastModified = new Date();

  return [
    { url: base, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/docs`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    ...docsNav
      .filter((doc) => doc.slug !== "")
      .map((doc) => ({
        url: `${base}/docs/${doc.slug}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: doc.slug === "faq" ? 0.6 : 0.7,
      })),
    { url: `${base}/use-cases`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    ...useCasesNav.map((useCase) => ({
      url: `${base}/use-cases/${useCase.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    { url: `${base}/compare`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    ...compareNav.map((comparison) => ({
      url: `${base}/compare/${comparison.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
