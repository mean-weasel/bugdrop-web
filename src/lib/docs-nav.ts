export interface DocLink {
  slug: string;
  title: string;
  description: string;
  parent?: string;
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
    slug: "custom-flows",
    title: "Custom Flows",
    description:
      "Build a released BugDrop custom flow with forms, screens, branching, evidence, issue formatting, and lifecycle handling.",
  },
  {
    slug: "flow-design",
    title: "Flow Design",
    description: "Compose screens, branching, context, output, evidence, motion, and appearance into a custom journey.",
    parent: "custom-flows",
  },
  {
    slug: "flow-examples",
    title: "Flow Examples",
    description: "Try released flow building blocks, transitions, and styling presets with a pinned local runtime.",
    parent: "custom-flows",
  },
  {
    slug: "flow-reference",
    title: "Flow Reference",
    description:
      "Reference every released custom-flow building block, condition, transition, styling control, evidence mapping, and outcome.",
  },
  {
    slug: "flow-fields-and-screens",
    title: "Fields & Screens",
    description: "Quickly understand every released field and screen, then reference its exact options.",
    parent: "flow-reference",
  },
  {
    slug: "flow-field-guide",
    title: "Field Guide",
    description: "Understand each available field through plain-English guidance, a visual, and a minimal configuration.",
    parent: "flow-fields-and-screens",
  },
  {
    slug: "flow-screen-guide",
    title: "Screen Guide",
    description: "Understand each available screen through plain-English guidance, a visual, and a minimal configuration.",
    parent: "flow-fields-and-screens",
  },
  {
    slug: "flow-fields-and-screens-reference",
    title: "Fields & Screens Reference",
    description: "Reference the exact released properties and values for every field and screen.",
    parent: "flow-fields-and-screens",
  },
  {
    slug: "flow-types",
    title: "Flow Types",
    description: "Reference top-level configuration properties, exported public types, and structural declarations.",
    parent: "flow-reference",
  },
  {
    slug: "flow-branching-and-output",
    title: "Branching & Output",
    description: "Reference conditions, context, issue output, evidence, lifecycle, outcomes, and scope boundaries.",
    parent: "flow-reference",
  },
  {
    slug: "flow-presentation-and-motion",
    title: "Presentation & Motion",
    description: "Reference presentation, appearance, built-in transitions, custom motion, and reduced-motion behavior.",
    parent: "flow-reference",
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
