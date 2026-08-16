export interface ResourceEntry {
  slug: "visual-bug-report-template" | "client-website-qa-checklist" | "screenshot-privacy-checklist";
  title: string;
  primaryQuery: string;
  description: string;
  reviewed: string;
  sourceLabel: string;
  sourceUrl: string;
  sources: ReadonlyArray<{ label: string; url: string }>;
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
    sources: [{ label: "BugDrop security documentation", url: "/docs/security" }],
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
    sources: [{ label: "W3C Web Accessibility Initiative Easy Checks", url: "https://www.w3.org/WAI/test-evaluate/preliminary/" }],
    downloadPath: "/resources/client-website-qa-checklist.md",
    schemaType: "ItemList",
  },
  {
    slug: "screenshot-privacy-checklist",
    title: "Screenshot Privacy Checklist",
    primaryQuery: "screenshot privacy checklist",
    description:
      "Use this screenshot privacy checklist before capture, before sharing, and during retention review to reduce accidental exposure of sensitive information.",
    reviewed: "2026-08-16",
    sourceLabel: "OWASP, MDN, GitHub, and BugDrop documentation",
    sourceUrl: "https://owasp.org/APTS/standard/5_Auditability/",
    sources: [
      { label: "OWASP screenshot evidence guidance", url: "https://owasp.org/APTS/standard/5_Auditability/" },
      { label: "MDN getDisplayMedia security guidance", url: "https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia#security" },
      { label: "GitHub attachment access documentation", url: "https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/attaching-files" },
      { label: "BugDrop screenshot masking and storage documentation", url: "/docs/security#screenshot-masking" },
    ],
    downloadPath: "/resources/screenshot-privacy-checklist.md",
    schemaType: "ItemList",
  },
];
