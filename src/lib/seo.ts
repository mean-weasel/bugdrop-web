import type { Metadata } from "next";
import {
  DEMO_URL,
  GITHUB_ORG_URL,
  GITHUB_PROFILE_URL,
  GITHUB_REPO_URL,
  GITHUB_WEB_REPO_URL,
  MARKETPLACE_URL,
  PRODUCT_HUNT_URL,
} from "@/lib/links";

export const SITE_URL = "https://bugdrop.dev";
export const SITE_NAME = "BugDrop";
export const SITE_UPDATED = "2026-05-11";

export const homeDescription =
  "Free, open source website feedback widget by mean-weasel. Users report bugs with screenshots and annotations — issues are created in GitHub automatically. One script tag, zero config.";

export function absoluteUrl(path = "/") {
  if (path.startsWith("https://")) return path;
  return `${SITE_URL}${path === "/" ? "" : path}`;
}

export function pageMetadata({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "mean-weasel",
    url: GITHUB_ORG_URL,
    founder: {
      "@type": "Person",
      name: "neonwatty",
      url: GITHUB_PROFILE_URL,
    },
    sameAs: [GITHUB_ORG_URL, GITHUB_REPO_URL, GITHUB_WEB_REPO_URL],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: homeDescription,
    publisher: {
      "@type": "Organization",
      name: "mean-weasel",
      url: GITHUB_ORG_URL,
    },
  };
}

export function softwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    description:
      "Free, open-source website feedback widget that turns user bug reports into GitHub issues with screenshots, annotations, redaction, and system info.",
    url: SITE_URL,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: "mean-weasel",
      url: GITHUB_ORG_URL,
    },
    creator: {
      "@type": "Person",
      name: "neonwatty",
      url: GITHUB_PROFILE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "mean-weasel",
      url: GITHUB_ORG_URL,
    },
    license: "https://opensource.org/licenses/MIT",
    codeRepository: GITHUB_REPO_URL,
    sameAs: [
      MARKETPLACE_URL,
      PRODUCT_HUNT_URL,
      GITHUB_REPO_URL,
      GITHUB_WEB_REPO_URL,
      GITHUB_ORG_URL,
      GITHUB_PROFILE_URL,
    ],
    award: "Product Hunt #6 Product of the Day, May 9, 2026",
    featureList: [
      "Screenshot capture",
      "Annotation tools",
      "Screenshot redaction",
      "Developer-configured privacy masking",
      "Automatic password and credit-card field masking",
      "Automatic system info",
      "GitHub issue creation",
      "Fully stylable widget",
      "Shadow DOM isolation",
      "Privacy-first design",
    ],
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function articleSchema({
  title,
  description,
  path,
  type = "Article",
}: {
  title: string;
  description: string;
  path: string;
  type?: "Article" | "TechArticle";
}) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    headline: title,
    description,
    url: absoluteUrl(path),
    datePublished: SITE_UPDATED,
    dateModified: SITE_UPDATED,
    author: {
      "@type": "Organization",
      name: "mean-weasel",
      url: GITHUB_ORG_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "mean-weasel",
      url: GITHUB_ORG_URL,
    },
    about: {
      "@type": "SoftwareApplication",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is BugDrop?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "BugDrop is a lightweight, open-source bug reporting widget that creates GitHub Issues from website feedback with screenshots and system information.",
        },
      },
      {
        "@type": "Question",
        name: "Is BugDrop free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. BugDrop is free and open source under the MIT License, with no paid tiers or usage limits beyond rate limiting.",
        },
      },
      {
        "@type": "Question",
        name: "Does BugDrop require user accounts?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Reporters can submit feedback from your website without creating a BugDrop or GitHub account.",
        },
      },
      {
        "@type": "Question",
        name: "How does BugDrop handle screenshots?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "BugDrop captures screenshots in the user's browser, lets reporters annotate and redact them when configured, and stores submitted images in your GitHub repository.",
        },
      },
      {
        "@type": "Question",
        name: "Can I self-host BugDrop?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. BugDrop can be self-hosted with your own Cloudflare Worker and GitHub App when you need full infrastructure control.",
        },
      },
    ],
  };
}

export function videoSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: "BugDrop demo video",
    description:
      "Watch BugDrop collect website feedback with a screenshot and create a GitHub Issue.",
    thumbnailUrl: "https://img.youtube.com/vi/VkLvP1xmRzo/hqdefault.jpg",
    uploadDate: SITE_UPDATED,
    embedUrl: "https://www.youtube.com/embed/VkLvP1xmRzo",
    contentUrl: DEMO_URL,
  };
}
