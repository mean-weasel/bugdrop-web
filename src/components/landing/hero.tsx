import { ArrowUpRight, Code2, PlayCircle } from "lucide-react";
import { DEMO_PATH, MARKETPLACE_URL } from "@/lib/links";

export function Hero() {
  return (
    <header className="text-center py-16 pb-24 animate-fade-up">
      <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-light tracking-tight leading-[1.15] mb-6 bg-gradient-to-br from-text-primary to-text-muted bg-clip-text text-transparent">
        Free website feedback widget with
        <br />
        <strong className="font-bold bg-gradient-to-br from-accent-warm to-accent-rose bg-clip-text">
          screenshots in 30 seconds
        </strong>
      </h1>
      <p className="text-xl text-text-subtle max-w-[600px] mx-auto mb-10">
        Open source bug reporting widget for any website. Drop it in, and user
        feedback becomes GitHub issues — with screenshots, annotations, and
        system info.
      </p>
      <p className="text-sm text-accent-cyan mb-6">
        Now available on GitHub Marketplace
      </p>
      <div className="flex gap-4 justify-center flex-wrap max-sm:flex-col">
        <a
          href={DEMO_PATH}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-[10px] font-medium text-[0.95rem] bg-accent-cyan text-bg-deep hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(125,207,255,0.24)] transition-all duration-300 max-sm:w-full max-sm:justify-center"
        >
          <PlayCircle className="size-4" aria-hidden="true" />
          Open Sample App Demo
        </a>
        <a
          href={MARKETPLACE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-[10px] font-medium text-[0.95rem] bg-gradient-to-br from-accent-warm to-accent-rose text-bg-deep hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(255,158,100,0.3)] transition-all duration-300 max-sm:w-full max-sm:justify-center"
        >
          <ArrowUpRight className="size-4" aria-hidden="true" />
          Install from GitHub Marketplace
        </a>
        <a
          href="https://github.com/mean-weasel/bugdrop"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-[10px] font-medium text-[0.95rem] bg-bg-surface text-text-primary border border-border hover:bg-bg-elevated hover:-translate-y-0.5 transition-all duration-300 max-sm:w-full max-sm:justify-center"
        >
          <Code2 className="size-4" aria-hidden="true" />
          View on GitHub
        </a>
      </div>
    </header>
  );
}
