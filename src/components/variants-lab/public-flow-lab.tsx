"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, CheckCircle2, LoaderCircle, ShieldCheck } from "lucide-react";
import {
  DEFAULT_SHAPED_FLOW_CONFIG,
  LAB_CONTEXT_SENTINEL,
  PRODUCT_TRIAGE_FLOW_CONFIG,
} from "./public-flow-configs";
import styles from "./public-flow-lab.module.css";

type FlowOutcome =
  | { status: "submitted"; result: { issueNumber: number; issueUrl: string } }
  | { status: "closed" | "busy" };

interface FlowHandle {
  open(options?: { context?: Record<string, string> }): {
    result: Promise<FlowOutcome>;
  };
}

interface LabHandles {
  defaultShaped: FlowHandle;
  productTriage: FlowHandle;
}

declare global {
  interface Window {
    __bugDropPublicFlowLabHandles?: LabHandles;
  }
}

type PublicFlowWindow = Window & {
  BugDrop?: { registerFlow(config: unknown): FlowHandle };
};

function publicFlowWindow() {
  return window as unknown as PublicFlowWindow;
}

const RUNTIME_SRC =
  "/vendor/bugdrop/32ee17fbbf3f1dce617ac06042c25c5707dd8d94/widget.js";

export function PublicFlowLab() {
  const [runtimeState, setRuntimeState] = useState<"loading" | "ready" | "failed">("loading");
  const [activeFlow, setActiveFlow] = useState<keyof LabHandles | null>(null);
  const [latest, setLatest] = useState<Partial<Record<keyof LabHandles, number>>>({});
  const [announcement, setAnnouncement] = useState("Loading the pinned BugDrop runtime.");
  const defaultShapedLauncher = useRef<HTMLButtonElement>(null);
  const productTriageLauncher = useRef<HTMLButtonElement>(null);
  const focusAfterClose = useRef<keyof LabHandles | null>(null);

  useEffect(() => {
    if (activeFlow !== null || focusAfterClose.current === null) return;

    const closedFlow = focusAfterClose.current;
    focusAfterClose.current = null;
    const frame = requestAnimationFrame(() => {
      const launcher =
        closedFlow === "defaultShaped"
          ? defaultShapedLauncher.current
          : productTriageLauncher.current;
      launcher?.focus();
    });

    return () => cancelAnimationFrame(frame);
  }, [activeFlow]);

  function registerFlows() {
    const runtimeWindow = publicFlowWindow();
    if (!runtimeWindow.BugDrop) {
      setRuntimeState("failed");
      setAnnouncement("The pinned BugDrop runtime did not initialize.");
      return;
    }

    if (!runtimeWindow.__bugDropPublicFlowLabHandles) {
      const defaultShaped = runtimeWindow.BugDrop.registerFlow(DEFAULT_SHAPED_FLOW_CONFIG);
      const productTriage = runtimeWindow.BugDrop.registerFlow(PRODUCT_TRIAGE_FLOW_CONFIG);
      runtimeWindow.__bugDropPublicFlowLabHandles = { defaultShaped, productTriage };
    }

    setRuntimeState("ready");
    setAnnouncement("Pinned BugDrop runtime ready. Choose either public flow.");
  }

  async function launch(kind: keyof LabHandles) {
    const handles = publicFlowWindow().__bugDropPublicFlowLabHandles;
    if (!handles || activeFlow) return;

    setActiveFlow(kind);
    setAnnouncement(`Opened the ${kind === "defaultShaped" ? "default-shaped" : "product-triage"} flow.`);
    const opened = handles[kind].open({ context: { lab_context: LAB_CONTEXT_SENTINEL } });
    const outcome = await opened.result;

    if (outcome.status === "submitted") {
      const id = outcome.result.issueNumber;
      setLatest((current) => ({ ...current, [kind]: id }));
      setAnnouncement(`Submission ${id} is stored only in the local inspector.`);
    } else {
      if (outcome.status === "closed") focusAfterClose.current = kind;
      setAnnouncement(outcome.status === "busy" ? "Another BugDrop dialog is already open." : "Flow closed without submitting.");
    }

    setActiveFlow(null);
  }

  return (
    <section className={styles.runtimeLab} aria-labelledby="public-runtime-heading">
      <Script
        id="bugdrop-public-flow-runtime"
        src={RUNTIME_SRC}
        strategy="afterInteractive"
        data-repo="mean-weasel/bugdrop-widget-test"
        data-button="false"
        data-welcome="never"
        data-show-issue-link="never"
        data-font="inherit"
        onReady={registerFlows}
        onError={() => {
          setRuntimeState("failed");
          setAnnouncement("The checksum-pinned BugDrop runtime could not load.");
        }}
      />

      <header className={styles.header}>
        <div>
          <span className={styles.kicker}>Pinned public runtime</span>
          <h2 id="public-runtime-heading">Run the real FlowConfig examples</h2>
          <p>
            These launch through the vendored public <code>registerFlow</code> API. Submissions stay
            in this development process and open in a raw-payload inspector.
          </p>
        </div>
        <p className={styles.safety}>
          <ShieldCheck aria-hidden="true" /> No GitHub Issue or external request
        </p>
      </header>

      <div className={styles.cards}>
        <article>
          <span>Message → details → screenshot</span>
          <h3>Default-shaped feedback</h3>
          <p>Exercise the familiar BugDrop journey through a registered public flow.</p>
          <button
            ref={defaultShapedLauncher}
            type="button"
            disabled={runtimeState !== "ready" || activeFlow !== null}
            onClick={() => void launch("defaultShaped")}
          >
            {activeFlow === "defaultShaped" ? <LoaderCircle aria-hidden="true" /> : null}
            Run default-shaped flow
          </button>
          {latest.defaultShaped ? (
            <a href={`/labs/variants/submissions/${latest.defaultShaped}`} target="_blank" rel="noreferrer">
              <CheckCircle2 aria-hidden="true" /> Inspect stored payload #{latest.defaultShaped}
              <ArrowUpRight aria-hidden="true" />
            </a>
          ) : null}
        </article>

        <article>
          <span>Conditional forms and evidence</span>
          <h3>Product triage</h3>
          <p>Watch diagnostic detail appear for a bug or low rating, then clear when hidden.</p>
          <button
            ref={productTriageLauncher}
            type="button"
            disabled={runtimeState !== "ready" || activeFlow !== null}
            onClick={() => void launch("productTriage")}
          >
            {activeFlow === "productTriage" ? <LoaderCircle aria-hidden="true" /> : null}
            Run product-triage flow
          </button>
          {latest.productTriage ? (
            <a href={`/labs/variants/submissions/${latest.productTriage}`} target="_blank" rel="noreferrer">
              <CheckCircle2 aria-hidden="true" /> Inspect stored payload #{latest.productTriage}
              <ArrowUpRight aria-hidden="true" />
            </a>
          ) : null}
        </article>
      </div>

      <p className={styles.status} role="status" aria-live="polite">
        {runtimeState === "loading" ? <LoaderCircle aria-hidden="true" /> : null}
        {announcement}
      </p>
    </section>
  );
}
