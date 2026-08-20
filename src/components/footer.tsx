import Link from "next/link";
import { DEMO_PATH, GITHUB_ORG_URL, GITHUB_PROFILE_URL, GITHUB_REPO_URL, PRODUCT_HUNT_URL } from "@/lib/links";

type FooterLink = { label: string; href: string; external?: boolean };

const footerGroups: Array<{ title: string; links: FooterLink[] }> = [
  { title: "Explore", links: [
    { label: "Interactive demo", href: DEMO_PATH },
    { label: "Use cases", href: "/use-cases" },
    { label: "Compare tools", href: "/compare" },
    { label: "Resources", href: "/resources" },
  ] },
  { title: "Developers", links: [
    { label: "Documentation", href: "/docs" },
    { label: "Installation", href: "/docs/installation" },
    { label: "Configuration", href: "/docs/configuration" },
    { label: "GitHub", href: GITHUB_REPO_URL, external: true },
  ] },
  { title: "Trust", links: [
    { label: "Security", href: "/docs/security" },
    { label: "Self-hosting", href: "/docs/self-hosting" },
    { label: "Service status", href: "/status" },
    { label: "MIT license", href: `${GITHUB_REPO_URL}/blob/main/LICENSE`, external: true },
  ] },
];

function FooterNavLink({ link }: { link: FooterLink }) {
  const className = "text-sm text-text-muted no-underline transition-colors hover:text-accent-cyan";
  return link.external ? (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
      {link.label}<span className="sr-only"> (opens in a new tab)</span>
    </a>
  ) : <Link href={link.href} className={className}>{link.label}</Link>;
}

export function Footer() {
  return (
    <footer data-site-footer className="mt-20 border-t border-border/80 pt-12 max-sm:mt-14 max-sm:pt-9">
      <div className="grid grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))] gap-x-10 gap-y-10 max-lg:grid-cols-2">
        <div className="max-w-sm max-lg:col-span-2">
          <Link href="/" className="inline-flex items-center text-lg font-semibold text-text-primary no-underline">BugDrop</Link>
          <p className="mt-3 text-sm leading-6 text-text-muted">
            Open-source website feedback that turns screenshots, annotations, and browser context into actionable GitHub Issues.
          </p>
          <a href={PRODUCT_HUNT_URL} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-text-subtle no-underline transition-colors hover:text-accent-warm">
            Featured on Product Hunt <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
        {footerGroups.map((group) => (
          <nav key={group.title} aria-label={`${group.title} links`}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-text-subtle">{group.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {group.links.map((link) => <li key={link.label}><FooterNavLink link={link} /></li>)}
            </ul>
          </nav>
        ))}
      </div>
      <div className="mt-12 flex items-center justify-between gap-5 border-t border-border/70 py-6 text-xs text-text-muted max-sm:flex-col max-sm:items-start">
        <p>
          Open source under the MIT License · Built by{" "}
          <a href={GITHUB_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="text-text-subtle no-underline transition-colors hover:text-accent-cyan">neonwatty</a>{" "}
          and{" "}
          <a href={GITHUB_ORG_URL} target="_blank" rel="noopener noreferrer" className="text-text-subtle no-underline transition-colors hover:text-accent-cyan">mean-weasel</a>
        </p>
        <a href="https://neonwatty.com" target="_blank" rel="noopener noreferrer" className="text-text-subtle no-underline transition-colors hover:text-accent-cyan">
          More independent software <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </footer>
  );
}
