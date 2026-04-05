import { SectionHeading } from "./section-heading";

export function DemoVideo() {
  return (
    <section className="mb-20">
      <SectionHeading>See It In Action</SectionHeading>
      <div className="bg-bg-surface border border-border rounded-3xl p-12 text-center max-w-[500px] mx-auto max-md:p-8">
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
          <a href="https://bugdrop-widget-test.vercel.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 rounded-[10px] font-medium bg-gradient-to-br from-accent-warm to-accent-rose text-bg-deep hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(255,158,100,0.3)] transition-all duration-300">
            Try Live Demo →
          </a>
          <p className="text-text-muted text-sm">See BugDrop running on a real app</p>
        </div>
      </div>
    </section>
  );
}
