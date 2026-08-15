import architecture from "@/lib/acquisition-architecture.json";

export interface UseCaseLink {
  slug: string;
  title: string;
  description: string;
  icon: string;
  group: string;
  primaryQuery: string;
}

export const useCasesNav: UseCaseLink[] = architecture.pages
  .filter((page) => page.kind === "use-case")
  .map((page) => ({
    slug: page.path.replace("/use-cases/", ""),
    title: page.title,
    description: page.description,
    icon: page.icon ?? "",
    group: page.group ?? "Other workflows",
    primaryQuery: page.primaryQuery,
  }));
