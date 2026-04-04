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
];
