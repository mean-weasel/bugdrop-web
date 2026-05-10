import {
  GITHUB_ORG_URL,
  GITHUB_PROFILE_URL,
  GITHUB_REPO_URL,
  GITHUB_WEB_REPO_URL,
  PRODUCT_HUNT_URL,
} from "@/lib/links";

const repoLinks = [
  { label: "API", href: GITHUB_REPO_URL },
  { label: "Landing Page", href: GITHUB_WEB_REPO_URL },
  { label: "Sample App Demo", href: "https://github.com/mean-weasel/bugdrop-widget-test" },
  { label: "Product Hunt", href: PRODUCT_HUNT_URL },
];

export function Footer() {
  return (
    <footer className="text-center pt-12 border-t border-border">
      <p className="text-text-muted text-sm mb-4">
        Built by{" "}
        <a
          href={GITHUB_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-cyan no-underline hover:underline"
        >
          neonwatty
        </a>{" "}
        /{" "}
        <a
          href={GITHUB_ORG_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-cyan no-underline hover:underline"
        >
          mean-weasel
        </a>{" "}
        · MIT License
      </p>
      <div className="flex justify-center gap-4 mt-4 flex-wrap">
        {repoLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[0.7rem] font-medium tracking-wider uppercase text-text-muted hover:text-accent-cyan bg-bg-surface px-3 py-1.5 rounded border border-border no-underline transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>
      <div className="flex justify-center gap-4 mt-4 flex-wrap">
        {["TypeScript", "Cloudflare Workers", "Shadow DOM"].map((badge) => (
          <span
            key={badge}
            className="text-[0.7rem] font-medium tracking-wider uppercase text-text-muted bg-bg-surface px-3 py-1.5 rounded border border-border"
          >
            {badge}
          </span>
        ))}
      </div>
    </footer>
  );
}
