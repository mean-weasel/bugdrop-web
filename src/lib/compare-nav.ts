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
];
