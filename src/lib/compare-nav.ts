export interface CompareLink {
  slug: string;
  title: string;
  description: string;
}

export const compareNav: CompareLink[] = [
  {
    slug: "userback",
    title: "BugDrop vs Userback",
    description:
      "Userback alternative for teams that want open-source screenshot feedback sent directly to GitHub Issues.",
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
      "Free Marker.io alternative for GitHub-native teams that want screenshot bug reports without another dashboard.",
  },
  {
    slug: "bugherd",
    title: "BugDrop vs BugHerd",
    description:
      "Usersnap vs BugHerd research often comes down to hosted feedback suites; BugDrop is the GitHub-native alternative.",
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
