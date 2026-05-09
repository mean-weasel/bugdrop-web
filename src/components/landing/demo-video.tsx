import { SectionHeading } from "./section-heading";

export function DemoVideo() {
  return (
    <section className="mb-20">
      <SectionHeading>See It In Action</SectionHeading>
      <div className="bg-bg-surface border border-border rounded-3xl p-12 text-center max-w-[640px] mx-auto max-md:p-8">
        <p className="mx-auto mb-8 max-w-[460px] text-text-subtle">
          Watch the report flow from feedback form to GitHub issue.
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
      </div>
    </section>
  );
}
