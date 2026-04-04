export interface DocLink {
  slug: string;
  title: string;
}

export const docsNav: DocLink[] = [
  { slug: "", title: "Getting Started" },
  { slug: "installation", title: "Installation" },
  { slug: "configuration", title: "Configuration" },
  { slug: "styling", title: "Styling" },
  { slug: "faq", title: "FAQ" },
];
