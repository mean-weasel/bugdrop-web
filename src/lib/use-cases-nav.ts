export interface UseCaseLink {
  slug: string;
  title: string;
  description: string;
  icon: string;
}

export const useCasesNav: UseCaseLink[] = [
  {
    slug: "open-source",
    title: "Open Source Projects",
    description:
      "Collect bug reports and feature requests from your community without leaving GitHub.",
    icon: "🌐",
  },
  {
    slug: "internal-tools",
    title: "Internal Tools",
    description:
      "Get feedback from your team on internal dashboards, admin panels, and developer tools.",
    icon: "🔧",
  },
  {
    slug: "client-projects",
    title: "Client Projects",
    description:
      "Let clients report issues with screenshots during development — no GitHub account needed.",
    icon: "🤝",
  },
  {
    slug: "github-issues-feedback",
    title: "GitHub Issues Feedback",
    description:
      "Collect website feedback as structured GitHub Issues with screenshots, labels, browser info, and page URLs.",
    icon: "📋",
  },
  {
    slug: "website-feedback-widget",
    title: "Website Feedback Widget",
    description:
      "Install a website feedback widget that captures screenshots, page context, and user notes as GitHub Issues.",
    icon: "💬",
  },
  {
    slug: "free-website-feedback-widget",
    title: "Free Website Feedback Widget",
    description:
      "Use a free feedback widget for public sites, docs, SaaS apps, and internal tools without adding another inbox.",
    icon: "Free",
  },
  {
    slug: "screenshot-feedback-widget",
    title: "Screenshot Feedback Widget",
    description:
      "Add a screenshot feedback widget for annotated visual bug reports with browser metadata and page URLs.",
    icon: "📸",
  },
  {
    slug: "visual-bug-reporting",
    title: "Visual Bug Reporting",
    description:
      "Capture visual bugs with annotated screenshots so developers can see the exact broken UI state.",
    icon: "🖼️",
  },
  {
    slug: "nextjs-feedback-widget",
    title: "Next.js Feedback Widget",
    description:
      "Add BugDrop to a Next.js site with one script tag and send user feedback directly to GitHub Issues.",
    icon: "▲",
  },
  {
    slug: "open-source-feedback-widget",
    title: "Open-Source Feedback Widget",
    description:
      "Choose an open-source feedback widget that can be inspected, self-hosted, and adapted to your GitHub workflow.",
    icon: "OSS",
  },
  {
    slug: "client-website-feedback-tool",
    title: "Client Website Feedback Tool",
    description:
      "Give clients a simple way to report website issues with screenshots during review, QA, and launch prep.",
    icon: "QA",
  },
];
