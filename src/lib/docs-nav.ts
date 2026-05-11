export interface DocLink {
  slug: string;
  title: string;
  description: string;
}

export const docsNav: DocLink[] = [
  {
    slug: "",
    title: "Getting Started",
    description:
      "Learn how BugDrop turns website feedback into GitHub Issues with screenshots, annotations, system info, and privacy controls.",
  },
  {
    slug: "installation",
    title: "Installation",
    description:
      "Install BugDrop with the GitHub App and one script tag to collect website feedback directly in GitHub Issues.",
  },
  {
    slug: "configuration",
    title: "Configuration",
    description:
      "Configure BugDrop data attributes for screenshots, submitter fields, labels, button behavior, privacy, and widget copy.",
  },
  {
    slug: "styling",
    title: "Styling",
    description:
      "Customize the BugDrop feedback widget with themes, colors, fonts, borders, shadows, and design-system friendly styles.",
  },
  {
    slug: "javascript-api",
    title: "JavaScript API",
    description:
      "Use the BugDrop JavaScript API to open, close, hide, and show the feedback widget from your own application UI.",
  },
  {
    slug: "version-pinning",
    title: "Version Pinning",
    description:
      "Pin BugDrop widget versions in production so updates are predictable across major, minor, and patch releases.",
  },
  {
    slug: "ci-testing",
    title: "CI Testing",
    description:
      "Test BugDrop in CI with Playwright checks for widget loading, Shadow DOM rendering, configuration, and accessibility.",
  },
  {
    slug: "demo",
    title: "Sample App Demo",
    description:
      "Try the BugDrop sample app demo to test screenshot capture, annotations, redaction, and GitHub issue creation.",
  },
  {
    slug: "security",
    title: "Security",
    description:
      "Review BugDrop permissions, screenshot storage, data handling, privacy controls, rate limiting, and self-hosting options.",
  },
  {
    slug: "self-hosting",
    title: "Self-Hosting",
    description:
      "Self-host BugDrop on your own Cloudflare Worker and GitHub App when your team needs full infrastructure control.",
  },
  {
    slug: "faq",
    title: "FAQ",
    description:
      "Answers to common BugDrop questions about pricing, GitHub permissions, screenshots, privacy, setup, and browser support.",
  },
];
