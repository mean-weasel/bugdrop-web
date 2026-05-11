export interface CompareLink {
  slug: string;
  title: string;
  description: string;
}

export const compareNav: CompareLink[] = [
  {
    slug: "userback",
    title: "BugDrop vs Userback",
    description: "Open-source GitHub-native alternative to Userback's visual feedback platform.",
  },
  {
    slug: "canny",
    title: "BugDrop vs Canny",
    description: "Lightweight bug reporting vs feature request management — different tools for different needs.",
  },
  {
    slug: "sentry-user-feedback",
    title: "BugDrop vs Sentry User Feedback",
    description: "Screenshot-first bug reports vs error monitoring feedback — complementary tools.",
  },
  {
    slug: "marker-io",
    title: "BugDrop vs Marker.io",
    description:
      "Open-source GitHub Issues feedback widget vs a paid visual bug reporting platform for teams.",
  },
  {
    slug: "bugherd",
    title: "BugDrop vs BugHerd",
    description:
      "GitHub-native screenshot feedback for developers vs a hosted website annotation and task board.",
  },
  {
    slug: "usersnap",
    title: "BugDrop vs Usersnap",
    description:
      "Free open-source website bug reports to GitHub Issues vs a paid customer feedback suite.",
  },
  {
    slug: "open-source-feedback-tools",
    title: "Open-Source Feedback Tools",
    description:
      "How BugDrop fits among open-source and self-hostable tools for collecting website feedback.",
  },
];
