import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://bugdrop.dev";

  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/docs`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/docs/installation`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/docs/configuration`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/docs/styling`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/docs/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/use-cases`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/use-cases/open-source`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/use-cases/internal-tools`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/use-cases/client-projects`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/compare`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/compare/userback`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/compare/canny`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/compare/sentry-user-feedback`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];
}
