"use client";

import { MessageSquare } from "lucide-react";

declare global {
  interface Window {
    BugDrop?: {
      open: () => void;
    };
  }
}

export function OpenWidgetButton() {
  const openWidget = () => {
    if (window.BugDrop) {
      window.BugDrop.open();
      return;
    }

    document.addEventListener(
      "bugdrop:ready",
      () => {
        window.BugDrop?.open();
      },
      { once: true },
    );
  };

  return (
    <button
      type="button"
      onClick={openWidget}
      className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-accent-cyan/40 bg-bg-surface px-5 py-3 font-medium text-accent-cyan transition-all hover:-translate-y-0.5 hover:bg-bg-elevated max-sm:w-full"
    >
      <MessageSquare className="size-4" aria-hidden="true" />
      Open page widget
    </button>
  );
}
