export interface DocLink {
  slug: string;
  title: string;
}

export const docsNav: DocLink[] = [
  { slug: "", title: "Getting Started" },
  { slug: "installation", title: "Installation" },
  { slug: "configuration", title: "Configuration" },
  { slug: "styling", title: "Styling" },
  { slug: "javascript-api", title: "JavaScript API" },
  { slug: "version-pinning", title: "Version Pinning" },
  { slug: "ci-testing", title: "CI Testing" },
  { slug: "demo", title: "Live Demo" },
  { slug: "security", title: "Security" },
  { slug: "self-hosting", title: "Self-Hosting" },
  { slug: "faq", title: "FAQ" },
];
