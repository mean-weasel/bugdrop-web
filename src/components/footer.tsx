export function Footer() {
  return (
    <footer className="text-center pt-12 border-t border-border">
      <p className="text-text-muted text-sm mb-4">
        Built by{" "}
        <a
          href="https://github.com/mean-weasel"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-cyan no-underline hover:underline"
        >
          mean-weasel
        </a>{" "}
        · MIT License
      </p>
      <p className="text-text-muted text-sm mb-4">
        Works with public and private repositories
      </p>
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
