import styles from "./hero.module.css";
import Image from "next/image";
import { ArrowDownRight, CircleDot, Paperclip } from "lucide-react";

export function ProductPreview() {
  return (
    <figure className={styles["product-preview"]} aria-label="Example report from the BugDrop widget to a GitHub Issue">
      <div className={styles["preview-caption"]}><span>01 / On your website</span><span>Actual BugDrop widget</span></div>
      <Image
        src="/images/bugdrop-report-example.png"
        alt="BugDrop feedback form with a report about a checkout button cut off on mobile, a description, and optional screenshot capture."
        width={600}
        height={576}
        sizes="(max-width: 767px) 220px, 360px"
        loading="eager"
        className={styles["preview-widget"]}
      />
      <ArrowDownRight className={styles["preview-arrow"]} aria-hidden="true" />
      <div className={styles["preview-issue"]}>
        <div className="mb-3 flex items-center justify-between gap-2 text-[11px] text-text-subtle">
          <span className="font-mono">02 / In GitHub Issues</span>
          <span className="rounded-full border border-border px-2 py-0.5">Example</span>
        </div>
        <p className="text-[15px] font-semibold leading-snug text-text-primary">The checkout button is cut off on mobile</p>
        <div className="mt-3 flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full bg-accent-green/15 px-2 py-1 text-accent-green"><CircleDot size={12} aria-hidden="true" /> Open</span>
          <span className="rounded-full border border-accent-rose/30 px-2 py-0.5 text-accent-rose">bug</span>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-text-subtle">The order total covers the checkout button.<br />Expected: the button stays visible.</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border pt-3 text-[11px] text-accent-cyan">
          <span className="inline-flex items-center gap-1"><Paperclip size={12} aria-hidden="true" /> Screenshot</span>
          <span>/checkout</span><span>390 × 844</span>
        </div>
      </div>
      <figcaption className={styles["preview-footnote"]}>One report. The context your team needs.</figcaption>
    </figure>
  );
}
