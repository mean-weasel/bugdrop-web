"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GITHUB_REPO_URL } from "@/lib/links";

const primaryNavItems = [
  { href: "/docs", label: "Docs" },
  { href: "/use-cases", label: "Use Cases" },
  { href: "/compare", label: "Compare" },
  { href: "/sandbox", label: "Sandbox" },
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex justify-between items-center px-8 py-6 max-w-[1100px] mx-auto max-md:flex-col max-md:gap-4">
      <Link href="/" className="text-xl font-semibold text-text-primary no-underline flex items-center gap-2">
        BugDrop
      </Link>
      <div className="flex gap-8 items-center max-sm:flex-wrap max-sm:justify-center max-sm:gap-4">
        {primaryNavItems.map((item) => {
          const active = isActivePath(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`rounded-[8px] px-2 py-1 text-sm transition-colors ${
                active
                  ? "bg-accent-cyan/10 text-accent-cyan"
                  : "text-text-subtle hover:text-text-primary"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
        <a
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-text-subtle hover:text-text-primary transition-colors"
        >
          GitHub
        </a>
        <Link
          href="/#try-bugdrop"
          data-analytics-event="nav_live_demo_click"
          data-analytics-label="Live Demo"
          className="inline-flex items-center rounded-[10px] border border-accent-cyan/40 bg-transparent px-3 py-1.5 text-sm font-medium text-accent-cyan transition-all hover:-translate-y-0.5 hover:border-accent-cyan hover:bg-accent-cyan/10"
        >
          Live Demo
        </Link>
      </div>
    </nav>
  );
}
