import architecture from "@/lib/acquisition-architecture.json";

export interface CompareLink {
  slug: string;
  title: string;
  description: string;
  group: string;
  primaryQuery: string;
}

export const compareNav: CompareLink[] = architecture.pages
  .filter((page) => page.kind === "compare")
  .map((page) => ({
    slug: page.path.replace("/compare/", ""),
    title: page.title,
    description: page.description,
    group: page.group ?? "Other comparisons",
    primaryQuery: page.primaryQuery,
  }));
