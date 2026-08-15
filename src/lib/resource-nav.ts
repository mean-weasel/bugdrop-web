export interface ResourceEntry {
  slug: "visual-bug-report-template" | "client-website-qa-checklist";
  title: string;
  primaryQuery: string;
  description: string;
  reviewed: string;
  sourceLabel: string;
  sourceUrl: string;
  downloadPath: string;
  schemaType: "HowTo" | "ItemList";
}

export const resourceNav: ResourceEntry[] = [
  {
    slug: "visual-bug-report-template",
    title: "Visual Bug Report Template",
    primaryQuery: "visual bug report template",
    description:
      "Copy or download a visual bug report template for expected behavior, reproduction steps, environment details, screenshots, privacy review, and triage.",
    reviewed: "2026-08-14",
    sourceLabel: "BugDrop configuration and security documentation",
    sourceUrl: "/docs/security",
    downloadPath: "/resources/visual-bug-report-template.md",
    schemaType: "HowTo",
  },
  {
    slug: "client-website-qa-checklist",
    title: "Client Website QA Checklist",
    primaryQuery: "client website QA checklist",
    description:
      "Print or download a client website QA checklist covering scope, responsive review, content, interactions, accessibility, privacy, and launch handoff.",
    reviewed: "2026-08-14",
    sourceLabel: "W3C Web Accessibility Initiative Easy Checks",
    sourceUrl: "https://www.w3.org/WAI/test-evaluate/preliminary/",
    downloadPath: "/resources/client-website-qa-checklist.md",
    schemaType: "ItemList",
  },
];
