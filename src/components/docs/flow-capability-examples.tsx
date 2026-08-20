"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, LoaderCircle, Play, ShieldCheck, Sparkles } from "lucide-react";
import { FLOW_CAPABILITIES } from "@/lib/flow-capabilities";
import {
  buildFlowExampleConfig,
  FLOW_EXAMPLE_RECIPES,
  FLOW_STYLE_PRESETS,
  FLOW_TRANSITION_KINDS,
  transitionLabel,
  type FlowExampleId,
  type FlowStylePresetId,
} from "./flow-capability-example-configs";
import styles from "./flow-capability-examples.module.css";

type TransitionKind = (typeof FLOW_TRANSITION_KINDS)[number];
type FlowOutcome =
  | { status: "submitted"; result: { issueNumber: number } }
  | { status: "closed" | "busy" };

interface OpenedFlow {
  readonly instanceId: string;
  readonly result: Promise<FlowOutcome>;
  close(): void;
}

interface FlowHandle {
  readonly id: string;
  open(options?: Readonly<Record<string, unknown>>): OpenedFlow;
}

interface BugDropApi {
  registerFlow(config: Readonly<Record<string, unknown>>): FlowHandle;
  close?(): void;
}

type DocsFlowWindow = {
  BugDrop?: BugDropApi;
  __bugDropDocsFlowHandles?: WeakMap<BugDropApi, Map<string, FlowHandle>>;
};

const RUNTIME_SRC = `/vendor/bugdrop/${FLOW_CAPABILITIES.targetCommit}/widget.js`;
const LOCAL_REPO = "mean-weasel/bugdrop-widget-test";
const DOCS_SCRIPT_ID = "bugdrop-flow-capability-docs-runtime";
const HOMEPAGE_SCRIPT_ID = "bugdrop-homepage-demo";
const HOMEPAGE_API_BINDING = Symbol.for("bugdrop.homepage-demo.exact-api");
const LOCAL_PREVIEW_ENABLED = process.env.NODE_ENV === "development";

function docsWindow(): DocsFlowWindow {
  return window as unknown as DocsFlowWindow;
}

function handlesForApi(api: BugDropApi) {
  const handlesByApi =
    docsWindow().__bugDropDocsFlowHandles ??
    new WeakMap<BugDropApi, Map<string, FlowHandle>>();
  docsWindow().__bugDropDocsFlowHandles = handlesByApi;

  const handles = handlesByApi.get(api) ?? new Map<string, FlowHandle>();
  handlesByApi.set(api, handles);
  return handles;
}

function forgetHandlesForApi(api: BugDropApi | undefined) {
  if (api) docsWindow().__bugDropDocsFlowHandles?.delete(api);
}

function absoluteRuntimeUrl(value: string) {
  return new URL(value, window.location.href).href;
}

function runtimeScript(id: string) {
  const candidate = document.getElementById(id);
  return candidate instanceof HTMLScriptElement ? candidate : null;
}

function removeDocsFlowHosts() {
  document.querySelectorAll<HTMLElement>('[data-bugdrop-flow^="docs-"]').forEach((host) => {
    host.remove();
  });
}

type SuspendedRuntime = {
  readonly api: BugDropApi;
  readonly script: HTMLScriptElement;
  readonly host: HTMLElement | null;
};

function suspendForDocsRuntime(homepageRuntime: SuspendedRuntime | null) {
  const activeApi = docsWindow().BugDrop;

  homepageRuntime?.api.close?.();
  homepageRuntime?.host?.remove();
  homepageRuntime?.script.remove();
  if (activeApi && activeApi !== homepageRuntime?.api) activeApi.close?.();
  document.querySelectorAll<HTMLElement>("#bugdrop-host").forEach((host) => host.remove());
  delete docsWindow().BugDrop;
  return homepageRuntime;
}

function restoreHomepageRuntime(runtime: SuspendedRuntime | null) {
  if (!runtime) return;
  if (!runtime.script.isConnected) document.body.append(runtime.script);
  if (runtime.host && !runtime.host.isConnected) document.body.append(runtime.host);
  docsWindow().BugDrop = runtime.api;
}

function currentRuntime(script: HTMLScriptElement): SuspendedRuntime | null {
  const api = docsWindow().BugDrop;
  if (!api) return null;
  const hosts = document.querySelectorAll<HTMLElement>("#bugdrop-host");
  return { api, script, host: hosts.item(hosts.length - 1) };
}

function boundHomepageRuntime(): SuspendedRuntime | null {
  const script = runtimeScript(HOMEPAGE_SCRIPT_ID);
  if (!script || absoluteRuntimeUrl(script.src) !== absoluteRuntimeUrl(RUNTIME_SRC)) return null;
  const api = (script as HTMLScriptElement & { [HOMEPAGE_API_BINDING]?: BugDropApi })[
    HOMEPAGE_API_BINDING
  ];
  if (!api || typeof api.registerFlow !== "function") return null;
  const host = document.querySelector<HTMLElement>("#bugdrop-host");
  return { api, script, host };
}

function suspendableHomepageRuntime(
  exactHomepageRuntime: SuspendedRuntime | null,
): SuspendedRuntime | null {
  if (exactHomepageRuntime) return exactHomepageRuntime;

  const script = runtimeScript(HOMEPAGE_SCRIPT_ID);
  if (!script) return null;
  return currentRuntime(script);
}

export function FlowCapabilityExamples() {
  const [recipeId, setRecipeId] = useState<FlowExampleId>("incident-triage");
  const [transitionKind, setTransitionKind] = useState<TransitionKind>("slide-horizontal");
  const [presetId, setPresetId] = useState<FlowStylePresetId>("product-dark");
  const [runtimeState, setRuntimeState] = useState<"loading" | "ready" | "failed" | "local-only">(
    LOCAL_PREVIEW_ENABLED ? "loading" : "local-only",
  );
  const [active, setActive] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [announcement, setAnnouncement] = useState(
    LOCAL_PREVIEW_ENABLED
      ? "Loading pinned BugDrop v1.56.3."
      : "Interactive previews are available in local development.",
  );
  const [storedSubmission, setStoredSubmission] = useState<number | null>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const opened = useRef<OpenedFlow | null>(null);
  const flowHostObserver = useRef<MutationObserver | null>(null);
  const mounted = useRef(true);
  const restoreLauncherFocus = useRef(false);

  const recipe = FLOW_EXAMPLE_RECIPES.find(({ id }) => id === recipeId)!;
  const preset = FLOW_STYLE_PRESETS.find(({ id }) => id === presetId)!;
  const config = useMemo(
    () => buildFlowExampleConfig(recipeId, transitionKind, presetId),
    [presetId, recipeId, transitionKind],
  );

  function runtimeReady() {
    if (!docsWindow().BugDrop?.registerFlow) {
      setRuntimeState("failed");
      setAnnouncement("The pinned BugDrop runtime did not initialize.");
      return;
    }
    setRuntimeState("ready");
    setAnnouncement("Pinned BugDrop v1.56.3 is ready. Choose a recipe, motion, and style.");
  }

  useEffect(() => {
    mounted.current = true;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReducedMotion(query.matches);
    syncPreference();
    query.addEventListener("change", syncPreference);
    return () => {
      mounted.current = false;
      query.removeEventListener("change", syncPreference);
      flowHostObserver.current?.disconnect();
      flowHostObserver.current = null;
      opened.current?.close();
      opened.current = null;
    };
  }, []);

  useEffect(() => {
    if (active || !restoreLauncherFocus.current) return;

    restoreLauncherFocus.current = false;
    launcher.current?.focus();
  }, [active]);

  useEffect(() => {
    if (!LOCAL_PREVIEW_ENABLED) return;

    let cancelled = false;
    let releaseRuntimeOwnership: (() => void) | null = null;
    const scheduleRuntimeReady = () => {
      queueMicrotask(() => {
        if (!cancelled) runtimeReady();
      });
    };

    queueMicrotask(() => {
      if (cancelled) return;

      const exactHomepageRuntime = boundHomepageRuntime();
      const existingApi = docsWindow().BugDrop;
      const canBorrowHomepageRuntime =
        exactHomepageRuntime !== null &&
        existingApi === exactHomepageRuntime.api;

      if (canBorrowHomepageRuntime) {
        releaseRuntimeOwnership = () => {
          opened.current?.close();
          opened.current = null;
          removeDocsFlowHosts();
        };
        scheduleRuntimeReady();
        return;
      }

      const suspendedHomepageRuntime = suspendForDocsRuntime(
        suspendableHomepageRuntime(exactHomepageRuntime),
      );
      const staleDocsScript = runtimeScript(DOCS_SCRIPT_ID);
      staleDocsScript?.remove();
      document.getElementById("bugdrop-host")?.remove();

      const script = document.createElement("script");
      let scriptSettled = false;
      let reclaimedDetachedRuntime = false;
      let homepageRuntimeAfterCancellation: SuspendedRuntime | null = null;
      script.id = DOCS_SCRIPT_ID;
      script.src = RUNTIME_SRC;
      script.async = false;
      script.dataset.repo = LOCAL_REPO;
      script.dataset.button = "false";
      script.dataset.welcome = "never";
      script.dataset.showIssueLink = "never";
      script.dataset.font = "inherit";

      const stopWatchingDetachedRuntime = () => {
        window.removeEventListener("bugdrop:ready", handleRuntimeReady);
        script.removeEventListener("load", handleLoad);
        script.removeEventListener("error", handleError);
      };
      const reclaimDetachedRuntime = () => {
        if (reclaimedDetachedRuntime) return;
        reclaimedDetachedRuntime = true;
        const lateRuntime = currentRuntime(script);
        lateRuntime?.api.close?.();
        lateRuntime?.host?.remove();
        removeDocsFlowHosts();
        script.remove();
        forgetHandlesForApi(lateRuntime?.api);

        const homepageRuntime =
          homepageRuntimeAfterCancellation ??
          boundHomepageRuntime() ??
          suspendedHomepageRuntime;
        if (homepageRuntime) {
          restoreHomepageRuntime(homepageRuntime);
        } else if (!lateRuntime || docsWindow().BugDrop === lateRuntime.api) {
          delete docsWindow().BugDrop;
        }
        stopWatchingDetachedRuntime();
      };
      const handleRuntimeReady = () => {
        if (!cancelled) return;
        const executingScript = document.currentScript;
        if (executingScript === script) {
          reclaimDetachedRuntime();
        } else if (
          executingScript instanceof HTMLScriptElement &&
          executingScript.id === HOMEPAGE_SCRIPT_ID
        ) {
          homepageRuntimeAfterCancellation = currentRuntime(executingScript);
        }
      };
      const handleLoad = () => {
        scriptSettled = true;
        if (cancelled) {
          reclaimDetachedRuntime();
          return;
        }
        stopWatchingDetachedRuntime();
        scheduleRuntimeReady();
      };
      const handleError = () => {
        scriptSettled = true;
        stopWatchingDetachedRuntime();
        if (cancelled) return;
        setRuntimeState("failed");
        setAnnouncement("The checksum-pinned BugDrop runtime could not load.");
      };
      window.addEventListener("bugdrop:ready", handleRuntimeReady);
      script.addEventListener("load", handleLoad, { once: true });
      script.addEventListener("error", handleError, { once: true });
      document.body.append(script);

      releaseRuntimeOwnership = () => {
        if (scriptSettled) stopWatchingDetachedRuntime();
        opened.current?.close();
        opened.current = null;
        const ownedApi = docsWindow().BugDrop;
        ownedApi?.close?.();
        removeDocsFlowHosts();
        document.getElementById("bugdrop-host")?.remove();
        script.remove();
        forgetHandlesForApi(ownedApi);
        delete docsWindow().BugDrop;
        restoreHomepageRuntime(suspendedHomepageRuntime);
      };
    });

    return () => {
      cancelled = true;
      releaseRuntimeOwnership?.();
    };
  }, []);

  async function launch() {
    const runtime = docsWindow().BugDrop;
    if (!LOCAL_PREVIEW_ENABLED || !runtime || active) return;

    const handles = handlesForApi(runtime);
    const key = String(config.id);
    const handle = handles.get(key) ?? runtime.registerFlow(config);
    handles.set(key, handle);

    setActive(true);
    setStoredSubmission(null);
    setAnnouncement(
      `Opened ${recipe.title} with ${transitionLabel(transitionKind)} motion and the ${preset.label} preset.`,
    );
    const instance = handle.open(recipe.openOptions);
    opened.current = instance;
    const outcome = await instance.result;
    if (!mounted.current) return;

    if (outcome.status === "submitted") {
      setStoredSubmission(outcome.result.issueNumber);
      setAnnouncement(`Example payload ${outcome.result.issueNumber} was stored only by the local route.`);
      const hasActiveHost = () =>
        Array.from(document.querySelectorAll<HTMLElement>("[data-bugdrop-instance]")).some(
          (host) => host.dataset.bugdropInstance === instance.instanceId,
        );
      const settleSubmittedInstance = () => {
        flowHostObserver.current?.disconnect();
        flowHostObserver.current = null;
        if (!mounted.current || opened.current !== instance) return;
        instance.close();
        opened.current = null;
        setActive(false);
      };

      if (!hasActiveHost()) {
        settleSubmittedInstance();
      } else {
        const observer = new MutationObserver(() => {
          if (!hasActiveHost()) settleSubmittedInstance();
        });
        flowHostObserver.current = observer;
        observer.observe(document.body, { childList: true, subtree: true });
      }
      return;
    }

    opened.current = null;
    restoreLauncherFocus.current = outcome.status === "closed";
    setActive(false);

    if (outcome.status === "busy") {
      setAnnouncement("Another BugDrop dialog is already open.");
    } else {
      setAnnouncement("Example closed without submitting.");
    }
  }

  return (
    <section
      className={styles.gallery}
      aria-labelledby="flow-examples-heading"
      data-flow-examples
      data-runtime-src={RUNTIME_SRC}
    >
      <header className={styles.header}>
        <div>
          <span className={styles.kicker}>Curated flow gallery</span>
          <h2 id="flow-examples-heading">Compose a released flow</h2>
          <p>
            Pick a useful journey, every released transition choice, and an app-matching preset.
            In local development, the launcher uses the public <code>registerFlow(config)</code> and <code>open(options)</code>
            path from the pinned v1.56.3 runtime.
          </p>
        </div>
        <div className={styles.safety}>
          <ShieldCheck aria-hidden="true" />
          <span>
            {LOCAL_PREVIEW_ENABLED
              ? "Local route only · no GitHub Issue"
              : "Interactive preview available locally"}
          </span>
        </div>
      </header>

      <div className={styles.composer}>
        <fieldset className={styles.group}>
          <legend>1. Choose a flow</legend>
          <div className={styles.recipeGrid}>
            {FLOW_EXAMPLE_RECIPES.map((candidate) => (
              <button
                key={candidate.id}
                type="button"
                aria-pressed={candidate.id === recipeId}
                className={candidate.id === recipeId ? styles.selected : undefined}
                onClick={() => setRecipeId(candidate.id)}
                disabled={active}
              >
                <span>{candidate.eyebrow}</span>
                <strong>{candidate.title}</strong>
                <small>{candidate.description}</small>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className={styles.group}>
          <legend>2. Choose screen motion</legend>
          <div className={styles.choiceRow} data-transition-selector>
            {FLOW_TRANSITION_KINDS.map((kind) => (
              <button
                key={kind}
                type="button"
                aria-pressed={kind === transitionKind}
                className={kind === transitionKind ? styles.selected : undefined}
                onClick={() => setTransitionKind(kind)}
                disabled={active}
                data-transition-kind={kind}
              >
                {transitionLabel(kind)}
              </button>
            ))}
          </div>
          <p className={styles.motionNote} data-reduced-motion={String(reducedMotion)}>
            {reducedMotion ? (
              <><Check aria-hidden="true" /> Reduced motion is on: BugDrop replaces every screen immediately.</>
            ) : (
              <>Forward and Back use the selected direction-aware motion. System reduced-motion preference always replaces it immediately.</>
            )}
          </p>
        </fieldset>

        <fieldset className={styles.group}>
          <legend>3. Match the host application</legend>
          <div className={styles.presetGrid} data-style-presets>
            {FLOW_STYLE_PRESETS.map((candidate) => (
              <button
                key={candidate.id}
                type="button"
                aria-pressed={candidate.id === presetId}
                className={`${styles.preset} ${styles[candidate.hostClassName]} ${candidate.id === presetId ? styles.selected : ""}`}
                onClick={() => setPresetId(candidate.id)}
                disabled={active}
              >
                <span className={styles.mockNav}><i /><i /><i /></span>
                <strong>{candidate.label}</strong>
                <small>{candidate.description}</small>
                <span className={styles.presetContract}>
                  {candidate.appearance.theme} · {candidate.appearance.density} · {candidate.presentation.size}
                </span>
              </button>
            ))}
          </div>
          <p className={styles.boundary}>
            Presets use only <code>appearance</code>, <code>presentation</code>, and field spans.
            Host CSS styles these preview cards, not BugDrop&apos;s Shadow DOM.
          </p>
        </fieldset>
      </div>

      <div className={`${styles.launchPanel} ${styles[preset.hostClassName]}`}>
        <div>
          <span className={styles.launchEyebrow}><Sparkles aria-hidden="true" /> Ready to preview</span>
          <h3>{recipe.title}</h3>
          <p>{recipe.path}</p>
          <p className={styles.selectionSummary}>
            {transitionLabel(transitionKind)} · {preset.label} · {preset.presentation.columns} column{preset.presentation.columns === 1 ? "" : "s"}
          </p>
        </div>
        <button
          ref={launcher}
          type="button"
          className={styles.launch}
          disabled={!LOCAL_PREVIEW_ENABLED || runtimeState !== "ready" || active}
          onClick={() => void launch()}
        >
          {runtimeState === "loading" || active ? <LoaderCircle aria-hidden="true" /> : <Play aria-hidden="true" />}
          {active
            ? "Example open"
            : runtimeState === "failed"
              ? "Runtime unavailable"
              : runtimeState === "local-only"
                ? "Local preview only"
                : "Launch live example"}
        </button>
      </div>

      {storedSubmission !== null ? (
        <a className={styles.localResult} href={`/labs/variants/submissions/${storedSubmission}`} target="_blank" rel="noreferrer">
          Inspect local payload #{storedSubmission}
        </a>
      ) : null}
      <p className={styles.status} role="status" aria-live="polite">{announcement}</p>
      <p className={styles.provenance}>
        Runtime <code>{FLOW_CAPABILITIES.release}</code> · commit <code>{FLOW_CAPABILITIES.targetCommit.slice(0, 12)}</code> · {LOCAL_PREVIEW_ENABLED ? "local feedback route" : "configuration preview"}
      </p>
    </section>
  );
}
