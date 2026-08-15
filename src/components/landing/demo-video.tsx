"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { SectionHeading } from "./section-heading";

export function DemoVideo() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section className="mb-20">
      <SectionHeading>See It In Action</SectionHeading>
      <div className="bg-bg-surface border border-border rounded-3xl p-12 text-center max-w-[640px] mx-auto max-md:p-8">
        <p className="mx-auto mb-8 max-w-[460px] text-text-subtle">
          Watch the report flow from feedback form to GitHub issue.
        </p>
        <div
          className="relative mx-auto mb-5 aspect-[9/16] max-h-[400px] max-w-[225px] overflow-hidden rounded-xl bg-bg-deep"
          data-video-embed-state={showVideo ? "loaded" : "deferred"}
        >
          {showVideo ? (
            <iframe
              src="https://www.youtube-nocookie.com/embed/VkLvP1xmRzo?autoplay=1&rel=0"
              title="BugDrop demo: feedback form to GitHub issue"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="block size-full border-none"
            />
          ) : (
            <button
              type="button"
              onClick={() => setShowVideo(true)}
              data-video-consent
              data-analytics-event="demo_video_load"
              data-analytics-label="Load BugDrop demo video"
              className="group relative flex size-full min-h-44 cursor-pointer flex-col items-center justify-center overflow-hidden border-0 bg-[radial-gradient(circle_at_35%_20%,rgba(125,207,255,0.24),transparent_36%),linear-gradient(145deg,#24283b,#1a1b26)] px-5 text-text-primary focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-accent-cyan"
              aria-label="Load the BugDrop demo video from YouTube"
            >
              <span className="absolute inset-x-5 top-8 rounded-lg border border-border bg-bg-surface/90 p-3 text-left text-xs text-text-subtle shadow-xl" aria-hidden="true">
                Feedback captured
                <span className="mt-2 block h-2 w-4/5 rounded bg-accent-cyan/35" />
                <span className="mt-2 block h-2 w-3/5 rounded bg-accent-warm/30" />
              </span>
              <span className="relative mt-24 flex size-16 items-center justify-center rounded-full border border-accent-cyan/50 bg-accent-cyan text-bg-deep shadow-[0_12px_35px_rgba(125,207,255,0.25)] transition-transform group-hover:scale-105" aria-hidden="true">
                <Play className="ml-1 size-7 fill-current" />
              </span>
              <span className="relative mt-4 text-sm font-semibold">Play 53-second demo</span>
              <span className="relative mt-1 text-xs text-text-subtle">Loads YouTube only after activation</span>
            </button>
          )}
        </div>
        <a
          href="https://www.youtube.com/watch?v=VkLvP1xmRzo"
          target="_blank"
          rel="noopener noreferrer"
          data-analytics-event="demo_video_youtube_click"
          data-analytics-label="Watch BugDrop demo on YouTube"
          className="text-sm text-accent-cyan underline decoration-accent-cyan/40 underline-offset-4 hover:text-text-primary"
        >
          Watch directly on YouTube
        </a>
      </div>
    </section>
  );
}
