import Link from "next/link";
import { GITHUB_REPO_URL } from "@/lib/links";

export function Nav() {
  return (
    <nav className="flex justify-between items-center px-8 py-6 max-w-[1100px] mx-auto max-md:flex-col max-md:gap-4">
      <Link href="/" className="text-xl font-semibold text-text-primary no-underline flex items-center gap-2">
        BugDrop
      </Link>
      <div className="flex gap-8 items-center max-sm:flex-wrap max-sm:justify-center max-sm:gap-4">
        <Link href="/docs" className="text-sm text-text-subtle hover:text-text-primary transition-colors">
          Docs
        </Link>
        <Link href="/use-cases" className="text-sm text-text-subtle hover:text-text-primary transition-colors">
          Use Cases
        </Link>
        <Link href="/status" className="text-sm text-text-subtle hover:text-text-primary transition-colors">
          Status
        </Link>
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
          data-analytics-event="nav_design_flow_click"
          data-analytics-label="Design your flow"
          className="inline-flex items-center rounded-[10px] border border-accent-cyan/40 bg-accent-cyan/10 px-3 py-1.5 text-sm font-medium text-accent-cyan transition-all hover:-translate-y-0.5 hover:border-accent-cyan hover:bg-accent-cyan/15"
        >
          Design your flow
        </Link>
      </div>
    </nav>
  );
}
