import type { MetadataRoute } from "next";
import { compareNav } from "@/lib/compare-nav";
import { docsNav } from "@/lib/docs-nav";
import { SITE_URL } from "@/lib/seo";
import { useCasesNav } from "@/lib/use-cases-nav";
import { resourceNav } from "@/lib/resource-nav";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL;

  return [
    { url: base },
    { url: `${base}/demo` },
    { url: `${base}/sandbox` },
    { url: `${base}/showcase` },
    { url: `${base}/status` },
    { url: `${base}/docs` },
    ...docsNav
      .filter((doc) => doc.slug !== "")
      .map((doc) => ({
        url: `${base}/docs/${doc.slug}`,
      })),
    { url: `${base}/use-cases` },
    ...useCasesNav.map((useCase) => ({
      url: `${base}/use-cases/${useCase.slug}`,
    })),
    { url: `${base}/compare` },
    ...compareNav.map((comparison) => ({
      url: `${base}/compare/${comparison.slug}`,
    })),
    { url: `${base}/resources` },
    ...resourceNav.map((resource) => ({
      url: `${base}/resources/${resource.slug}`,
    })),
  ];
}
