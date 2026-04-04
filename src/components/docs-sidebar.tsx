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
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
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
