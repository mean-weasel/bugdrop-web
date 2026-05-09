"use client";

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
      className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-cyan px-5 py-3 font-semibold text-bg-deep shadow-[0_12px_32px_rgba(125,207,255,0.28)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(125,207,255,0.36)] max-sm:w-full max-sm:rounded-[10px]"
    >
      <span aria-hidden="true">🐛</span>
      Feedback
    </button>
  );
}
