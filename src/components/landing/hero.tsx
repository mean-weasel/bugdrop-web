import Image from "next/image";
import { ArrowUpRight, Code2, MessageSquare } from "lucide-react";
import {
  GITHUB_ORG_URL,
  GITHUB_REPO_URL,
  MARKETPLACE_URL,
  PRODUCT_HUNT_BADGE_URL,
  PRODUCT_HUNT_URL,
} from "@/lib/links";

export function Hero() {
  return (
    <header className="text-center py-16 pb-24 animate-fade-up max-sm:-mt-6 max-sm:pt-0 max-sm:pb-16">
      <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-light tracking-tight leading-[1.15] mb-6 bg-gradient-to-br from-text-primary to-text-muted bg-clip-text text-transparent max-sm:text-[2.35rem]">
        Free website feedback widget with
        <br />
        <strong className="font-bold bg-gradient-to-br from-accent-warm to-accent-rose bg-clip-text">
          screenshots in 30 seconds
        </strong>
      </h1>
      <p className="text-xl text-text-subtle max-w-[600px] mx-auto mb-10 max-sm:mb-7 max-sm:text-lg">
        Open source bug reporting widget for any website. Drop it in, and user
        feedback becomes GitHub issues — with screenshots, annotations, and
        system info.
      </p>
      <div className="mb-7 flex flex-col items-center gap-3 max-sm:mb-5">
        <p className="text-sm text-accent-cyan">
          Now available on GitHub Marketplace. Open source by{" "}
          <a
            href={GITHUB_ORG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-cyan underline decoration-accent-cyan/40 underline-offset-4 hover:text-text-primary"
          >
            mean-weasel
          </a>
          .
        </p>
        <a
          href={`${PRODUCT_HUNT_URL}?utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-bugdrop-2`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="BugDrop was featured on Product Hunt"
          className="inline-flex transition-transform duration-300 hover:-translate-y-0.5"
        >
          <Image
            src={PRODUCT_HUNT_BADGE_URL}
            alt="BugDrop - In-app feedback that creates GitHub Issues with screenshots | Product Hunt"
            width={250}
            height={54}
            unoptimized
            className="h-[54px] w-[250px]"
          />
        </a>
        <p className="text-sm font-medium text-text-muted">
          #6 Product of the Day · May 9, 2026
        </p>
      </div>
      <div className="flex gap-4 justify-center flex-wrap max-sm:flex-col">
        <a
          href="#try-bugdrop"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-[10px] font-medium text-[0.95rem] bg-accent-cyan text-bg-deep hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(125,207,255,0.24)] transition-all duration-300 max-sm:w-full max-sm:justify-center"
        >
          <MessageSquare className="size-4" aria-hidden="true" />
          Try it on this page
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
          href={GITHUB_REPO_URL}
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
