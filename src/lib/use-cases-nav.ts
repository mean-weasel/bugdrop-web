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
];
