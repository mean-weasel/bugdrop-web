"use client";

import type { MouseEvent, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GITHUB_REPO_URL } from "@/lib/links";

interface ChapterLinkProps {
  readonly id: string;
  readonly children: ReactNode;
}

function ChapterLink({ id, children }: ChapterLinkProps) {
  const pathname = usePathname();

  const followChapter = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      pathname !== "/" ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const chapter = document.getElementById(id);
    if (!chapter) return;
    event.preventDefault();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    chapter.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    window.history.pushState(null, "", `#${id}`);
  };

  return (
    <Link
      href={`/#${id}`}
      onClick={followChapter}
      className="text-sm text-text-subtle no-underline transition-colors hover:text-text-primary max-md:text-xs"
    >
      {children}
    </Link>
  );
}

export function Nav() {
  return (
    <nav className="sticky top-0 z-40 mx-auto flex min-h-[4.5rem] max-w-[1100px] items-center justify-between gap-5 border-b border-border/50 bg-bg-deep/90 px-8 py-3 backdrop-blur-xl max-md:min-h-16 max-md:gap-3 max-md:px-4">
      <Link href="/" className="shrink-0 text-xl font-semibold text-text-primary no-underline max-md:text-base">
        BugDrop
      </Link>
      <div className="flex min-w-0 items-center gap-6 max-md:flex-1 max-md:justify-end max-md:gap-3">
        <ChapterLink id="overview">
          <span className="max-md:hidden">Overview</span>
          <span className="md:hidden">Home</span>
        </ChapterLink>
        <ChapterLink id="demo">
          Demo
        </ChapterLink>
        <ChapterLink id="flows">
          Flows
        </ChapterLink>
        <ChapterLink id="get-started">
          <span className="max-md:hidden">Get Started</span>
          <span className="md:hidden">Start</span>
        </ChapterLink>
        <Link href="/docs" className="text-sm text-text-subtle no-underline transition-colors hover:text-text-primary max-md:text-xs">
          Docs
        </Link>
        <a
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-text-subtle no-underline transition-colors hover:text-text-primary max-lg:hidden"
        >
          GitHub
        </a>
      </div>
    </nav>
  );
}
