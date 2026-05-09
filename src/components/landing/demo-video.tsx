import Link from "next/link";
import { ExternalLink, PlayCircle } from "lucide-react";
import { DEMO_PATH } from "@/lib/links";
import { SectionHeading } from "./section-heading";

export function DemoVideo() {
  return (
    <section className="mb-20">
      <SectionHeading>See It In Action</SectionHeading>
      <div className="bg-bg-surface border border-border rounded-3xl p-12 text-center max-w-[640px] mx-auto max-md:p-8">
        <p className="mx-auto mb-8 max-w-[460px] text-text-subtle">
          Watch the report flow, then try a second example in a realistic product page.
        </p>
        <div className="relative rounded-xl overflow-hidden bg-black mb-8">
          <iframe
            src="https://www.youtube.com/embed/VkLvP1xmRzo"
            title="BugDrop Demo Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="w-full aspect-[9/16] max-h-[400px] border-none block"
          />
        </div>
        <div className="flex flex-col gap-4 items-center">
          <div className="flex gap-3 max-sm:w-full max-sm:flex-col">
            <a href={DEMO_PATH} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-[10px] font-medium bg-gradient-to-br from-accent-warm to-accent-rose text-bg-deep hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(255,158,100,0.3)] transition-all duration-300 max-sm:w-full">
              <PlayCircle className="size-4" aria-hidden="true" />
              Open Sample App Demo
            </a>
            <Link href="/docs/demo" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-[10px] font-medium bg-bg-deep text-text-primary border border-border hover:bg-bg-elevated hover:-translate-y-0.5 transition-all duration-300 max-sm:w-full">
              Sample demo details
              <ExternalLink className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <p className="text-text-muted text-sm">
            The sample app opens a separate test site with BugDrop installed.
          </p>
        </div>
      </div>
    </section>
  );
}
