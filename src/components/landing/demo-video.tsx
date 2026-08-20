"use client";

import { useState } from "react";
import { Play } from "lucide-react";

export function DemoVideo() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="grid items-center gap-6 md:grid-cols-[minmax(0,0.72fr)_minmax(340px,1.28fr)] md:gap-10 lg:gap-12">
      <div className="max-w-[620px]">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent-cyan">
          The Classic experience
        </p>
        <h2 id="demo-heading" className="text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-tight text-text-primary">
          See exactly what your users see.
        </h2>
        <p className="mt-4 text-lg leading-8 text-text-subtle max-sm:text-base max-sm:leading-6">
          Watch an example flow in action.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-bg-surface/80 p-4 max-sm:p-3">
        <div
          className="relative aspect-[9/16] h-[min(75svh,690px)] max-h-[690px] w-auto overflow-hidden rounded-2xl bg-bg-deep shadow-[0_24px_60px_rgba(0,0,0,0.35)] max-sm:h-[min(49svh,420px)] max-sm:rounded-xl"
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
              <span className="relative mt-24 flex size-16 items-center justify-center rounded-full border border-accent-cyan/50 bg-accent-cyan text-bg-deep shadow-[0_12px_35px_rgba(125,207,255,0.25)] transition-transform group-hover:scale-105 max-sm:size-12" aria-hidden="true">
                <Play className="ml-1 size-7 fill-current" />
              </span>
              <span className="relative mt-4 text-sm font-semibold">Play example walkthrough</span>
              <span className="relative mt-1 text-xs text-text-subtle">Loads YouTube after activation</span>
            </button>
          )}
        </div>
        <a
          href="https://www.youtube.com/watch?v=VkLvP1xmRzo"
          target="_blank"
          rel="noopener noreferrer"
          data-analytics-event="demo_video_youtube_click"
          data-analytics-label="Watch BugDrop demo on YouTube"
          className="mt-2 text-xs text-text-subtle underline decoration-border underline-offset-4 hover:text-text-primary"
        >
          Watch on YouTube
        </a>
      </div>
    </div>
  );
}
