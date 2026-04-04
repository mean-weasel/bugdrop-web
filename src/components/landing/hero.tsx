export function Hero() {
  return (
    <header className="text-center py-16 pb-24 animate-fade-up">
      <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-light tracking-tight leading-[1.15] mb-6 bg-gradient-to-br from-text-primary to-text-muted bg-clip-text text-transparent">
        Collect bug reports with
        <br />
        <strong className="font-bold bg-gradient-to-br from-accent-warm to-accent-rose bg-clip-text">
          screenshots in 30 seconds
        </strong>
      </h1>
      <p className="text-xl text-text-subtle max-w-[600px] mx-auto mb-10">
        Drop-in feedback widget that turns user reports into GitHub issues.
        Screenshots, annotations, system info — all automatic.
      </p>
      <div className="flex gap-4 justify-center flex-wrap max-sm:flex-col">
        <a
          href="https://github.com/apps/neonwatty-bugdrop/installations/new"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-[10px] font-medium text-[0.95rem] bg-gradient-to-br from-accent-warm to-accent-rose text-bg-deep hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(255,158,100,0.3)] transition-all duration-300 max-sm:w-full max-sm:justify-center"
        >
          Install GitHub App
        </a>
        <a
          href="https://github.com/mean-weasel/bugdrop"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-[10px] font-medium text-[0.95rem] bg-bg-surface text-text-primary border border-border hover:bg-bg-elevated hover:-translate-y-0.5 transition-all duration-300 max-sm:w-full max-sm:justify-center"
        >
          View on GitHub
        </a>
      </div>
    </header>
  );
}
