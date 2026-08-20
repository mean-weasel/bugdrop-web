"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsNav } from "@/lib/docs-nav";

export function DocsSidebar() {
  const pathname = usePathname();
  return (
    <nav className="w-56 shrink-0 max-lg:w-full max-lg:mb-8">
      <ul className="space-y-1">
        {docsNav.map((doc) => {
          const href = doc.slug ? `/docs/${doc.slug}` : "/docs";
          const isActive = pathname === href;
          return (
            <li key={doc.slug}>
              <Link
                href={href}
                className={`block rounded-lg py-2 text-sm transition-colors ${doc.parent ? "ml-3 border-l border-border pl-4 pr-3" : "px-3"} ${
                  isActive
                    ? "bg-bg-surface text-accent-warm font-medium"
                    : "text-text-subtle hover:text-text-primary hover:bg-bg-surface/50"
                }`}
              >
                {doc.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
