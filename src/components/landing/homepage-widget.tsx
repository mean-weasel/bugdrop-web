"use client";

import { useState } from "react";
import { SAMPLE_DEMO_REPO, WIDGET_URL } from "@/lib/links";

declare global {
  interface Window {
    BugDrop?: {
      open: () => void;
    };
  }
}

const SCRIPT_ID = "bugdrop-homepage-demo";
const WELCOME =
  "This is the BugDrop landing page demo. Send a test report to see what your users would experience.";

type LoadState = "idle" | "loading" | "ready" | "error";

function configureScript(script: HTMLScriptElement) {
  script.id = SCRIPT_ID;
  script.src = WIDGET_URL;
  script.async = false;
  script.dataset.repo = SAMPLE_DEMO_REPO;
  script.dataset.theme = "dark";
  script.dataset.position = "bottom-right";
  script.dataset.color = "#7dcfff";
  script.dataset.bg = "#24283b";
  script.dataset.text = "#c0caf5";
  script.dataset.borderColor = "#7dcfff";
  script.dataset.borderWidth = "1";
  script.dataset.radius = "10";
  script.dataset.shadow = "soft";
  script.dataset.font = "inherit";
  script.dataset.label = "Feedback";
  script.dataset.welcome = WELCOME;
}

export function HomepageWidget() {
  const [loadState, setLoadState] = useState<LoadState>("idle");

  const openDemo = () => {
    if (window.BugDrop) {
      window.BugDrop.open();
      setLoadState("ready");
      return;
    }

    setLoadState("loading");
    let opened = false;
    const openWhenReady = () => {
      if (opened || !window.BugDrop) return;
      opened = true;
      setLoadState("ready");
      window.BugDrop.open();
    };
    document.addEventListener("bugdrop:ready", openWhenReady, { once: true });

    const existing = document.getElementById(SCRIPT_ID);
    if (existing instanceof HTMLScriptElement) {
      existing.addEventListener("load", openWhenReady, { once: true });
      return;
    }

    const script = document.createElement("script");
    configureScript(script);
    script.addEventListener("load", openWhenReady, { once: true });
    script.addEventListener(
      "error",
      () => {
        document.removeEventListener("bugdrop:ready", openWhenReady);
        script.remove();
        setLoadState("error");
      },
      { once: true },
    );
    document.body.append(script);
  };

  return (
    <section
      id="try-bugdrop"
      className="mb-20 rounded-2xl border border-accent-cyan/25 bg-accent-cyan/10 px-8 py-7"
    >
      <div className="flex items-center justify-between gap-6 max-md:flex-col max-md:items-start">
        <div>
          <p className="mb-2 text-sm font-medium text-accent-cyan">Try it on this page</p>
          <h2 className="text-2xl font-semibold text-text-primary">
            This landing page is running BugDrop.
          </h2>
          <p className="mt-2 max-w-[620px] text-text-subtle">
            Open the Feedback demo to load BugDrop, send a test report, and see the
            experience your users would get.
          </p>
        </div>
        <div className="flex shrink-0 gap-3 max-sm:w-full max-sm:flex-col">
          <button
            type="button"
            onClick={openDemo}
            disabled={loadState === "loading"}
            data-homepage-widget-activate
            aria-describedby="homepage-widget-status"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-cyan px-5 py-3 font-semibold text-bg-deep shadow-[0_12px_32px_rgba(125,207,255,0.28)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(125,207,255,0.36)] disabled:cursor-wait disabled:opacity-75 max-sm:w-full max-sm:rounded-[10px]"
          >
            <span aria-hidden="true">🐛</span>
            {loadState === "loading" ? "Loading Feedback…" : "Open Feedback demo"}
          </button>
          <span id="homepage-widget-status" className="sr-only" aria-live="polite">
            {loadState === "loading" && "Loading the BugDrop feedback demo."}
            {loadState === "ready" && "The BugDrop feedback demo is ready."}
            {loadState === "error" && "The feedback demo could not load. Try again."}
          </span>
        </div>
      </div>
    </section>
  );
}
