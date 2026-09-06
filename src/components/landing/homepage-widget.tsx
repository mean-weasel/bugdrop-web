"use client";

import { useEffect, useEffectEvent, useReducer, useRef, useState } from "react";
import Link from "next/link";
import { HomepageDemoLauncher, homepageExperienceLabel } from "./homepage-demo-launcher";
import {
  homepageExperiences,
  homepageFlowExperiences,
  initialHomepageDemoState,
  reduceHomepageDemo,
  type HomepageExperienceId,
} from "./homepage-demo-model";
import {
  loadHomepageBugDrop,
  openHomepageExperience,
  registerHomepageFlow,
  type HomepageActiveExperience,
} from "./homepage-demo-runtime";
import {
  BUILDING_BLOCKS_PATH,
  isLocalHomepageDogfoodRuntime,
  SAMPLE_DEMO_REPO,
  WIDGET_URL,
} from "@/lib/links";

declare global {
  interface Window {
    BugDrop?: {
      open: () => void;
    };
  }
}

const SCRIPT_ID = "bugdrop-homepage-demo";
const IS_LOCAL_DOGFOOD_RUNTIME = isLocalHomepageDogfoodRuntime();
const WELCOME =
  "This is the BugDrop landing page demo. Send a test report to see what your users would experience.";

type LoadState = "idle" | "loading" | "ready" | "error";

function useHeroDemoLaunch(onLaunch: (trigger: HTMLAnchorElement) => void) {
  const handleLaunch = useEffectEvent(onLaunch);
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const trigger = event.target instanceof Element
        ? event.target.closest<HTMLAnchorElement>("[data-homepage-hero-activate]")
        : null;
      if (!trigger) return;
      event.preventDefault();
      handleLaunch(trigger);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);
}

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

export function ClassicHomepageWidget() {
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

  useHeroDemoLaunch(() => openDemo());

  return (
    <section
      className="rounded-3xl border border-accent-cyan/25 bg-accent-cyan/10 px-8 py-8 max-sm:px-5 max-sm:py-6"
      aria-labelledby="flows-heading"
    >
      <div className="flex items-center justify-between gap-6 max-md:flex-col max-md:items-start">
        <div>
          <p className="mb-2 text-sm font-medium text-accent-cyan">Try it on this page</p>
          <h2 id="flows-heading" className="text-2xl font-semibold text-text-primary">
            Try the Classic feedback flow.
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

function waitForClassicClose(api: object, onClose: () => void): () => void {
  const maybeApi = api as { isOpen?: () => boolean };
  if (typeof maybeApi.isOpen !== "function") return () => undefined;

  let disposed = false;
  const checkForClose = () => {
    if (disposed || maybeApi.isOpen?.()) return;
    disposed = true;
    window.clearInterval(interval);
    onClose();
  };
  const interval = window.setInterval(checkForClose, 150);
  queueMicrotask(checkForClose);
  return () => {
    disposed = true;
    window.clearInterval(interval);
  };
}

function waitForFlowClose(flowId: string, onClose: () => void): () => void {
  const selector = `[data-bugdrop-flow="${CSS.escape(flowId)}"]`;
  let disposed = false;
  const observer = new MutationObserver(() => {
    if (disposed || document.querySelector(selector)) return;
    disposed = true;
    observer.disconnect();
    onClose();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  queueMicrotask(() => {
    if (!disposed && !document.querySelector(selector)) {
      disposed = true;
      observer.disconnect();
      onClose();
    }
  });
  return () => {
    disposed = true;
    observer.disconnect();
  };
}

function FlowHomepageWidget() {
  const [state, dispatch] = useReducer(reduceHomepageDemo, initialHomepageDemoState);
  const activeExperience = useRef<HomepageActiveExperience | null>(null);
  const activeLaunchRef = useRef<HTMLElement | null>(null);
  const launchInFlight = useRef(false);
  const classicCloseCleanup = useRef<(() => void) | null>(null);
  const flowCloseCleanup = useRef<(() => void) | null>(null);
  const restoreFocusPending = useRef(false);
  const mounted = useRef(false);
  const launchGeneration = useRef(0);

  const settle = (generation: number) => {
    if (!mounted.current || generation !== launchGeneration.current) return;
    classicCloseCleanup.current?.();
    classicCloseCleanup.current = null;
    flowCloseCleanup.current?.();
    flowCloseCleanup.current = null;
    activeExperience.current = null;
    launchInFlight.current = false;
    restoreFocusPending.current = true;
    dispatch({ type: "settled" });
  };

  const launch = async (id: HomepageExperienceId, initiator: HTMLElement | null) => {
    if (launchInFlight.current || activeExperience.current) return;
    const generation = ++launchGeneration.current;
    const isCurrent = () => mounted.current && generation === launchGeneration.current;
    launchInFlight.current = true;
    initiator?.setAttribute("aria-busy", "true");
    activeLaunchRef.current = initiator;
    if (id !== "classic") dispatch({ type: "select", id });
    dispatch({ type: "launch", id });
    dispatch({ type: "runtime-loading" });

    try {
      const api = await loadHomepageBugDrop();
      if (!isCurrent()) return;
      const handle = id === "classic" ? undefined : registerHomepageFlow(api, id);
      if (!isCurrent()) return;
      const experience = openHomepageExperience(
        api,
        handle,
        id,
      );
      if (!isCurrent()) {
        experience.close();
        return;
      }
      activeExperience.current = experience;
      dispatch({ type: "runtime-ready" });

      if (experience.id === "classic") {
        classicCloseCleanup.current = waitForClassicClose(api, () => settle(generation));
      } else {
        const waitForClosedHost = () => {
          if (!isCurrent()) return;
          flowCloseCleanup.current?.();
          flowCloseCleanup.current = waitForFlowClose(experience.id, () => settle(generation));
        };
        void experience.result.then(waitForClosedHost, waitForClosedHost);
      }
    } catch {
      if (!isCurrent()) return;
      activeExperience.current = null;
      launchInFlight.current = false;
      dispatch({ type: "runtime-error" });
      document.getElementById("flows")?.scrollIntoView({ block: "start", behavior: "instant" });
    } finally {
      initiator?.removeAttribute("aria-busy");
    }
  };

  useHeroDemoLaunch((trigger) => void launch("classic", trigger));

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      launchGeneration.current += 1;
      classicCloseCleanup.current?.();
      flowCloseCleanup.current?.();
      activeExperience.current?.close();
      activeExperience.current = null;
      launchInFlight.current = false;
    };
  }, []);

  useEffect(() => {
    if (!restoreFocusPending.current || state.activeId !== null) return;
    restoreFocusPending.current = false;
    activeLaunchRef.current?.focus();
  }, [state.activeId]);

  const selected = homepageExperiences.find(({ id }) => id === state.selectedId)!;
  const launchDisabled = state.runtimeState === "loading" || state.activeId !== null;

  return (
    <>
      <HomepageDemoLauncher
        disabled={launchDisabled}
        onLaunch={(trigger) => void launch("classic", trigger)}
      />
      <section
        className="rounded-3xl border border-accent-cyan/25 bg-accent-cyan/10 px-8 py-8 max-sm:px-5 max-sm:py-4"
        aria-labelledby="flows-heading"
      >
        <div className="max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent-cyan">Design your flows</p>
          <h2 id="flows-heading" className="text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-tight text-text-primary">
            One widget for every feedback moment.
          </h2>
          <p className="mt-2 text-text-subtle">
            Place and customize BugDrop wherever and whenever you need feedback throughout your app.
          </p>
          <p className="mt-3 text-sm text-text-subtle">
            Try a bug report, a quick rating, or a feature request. Each flow sends the right details to GitHub.
          </p>
        </div>
        <fieldset className="mt-7 grid w-full min-w-0 grid-cols-1 gap-3 max-sm:mt-4 md:grid-cols-3" aria-label="Feedback experience">
          <legend className="sr-only">Feedback experience</legend>
          {homepageFlowExperiences.map((experience) => (
            <label
              key={experience.id}
              className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-bg-surface/80 p-4 text-text-primary has-[:checked]:border-accent-cyan has-[:checked]:bg-accent-cyan/10"
            >
              <input
                type="radio"
                name="homepage-feedback-experience"
                value={experience.id}
                checked={state.selectedId === experience.id}
                disabled={launchDisabled}
                aria-label={homepageExperienceLabel(experience)}
                aria-describedby={`homepage-experience-${experience.id}-description`}
                onChange={() => dispatch({ type: "select", id: experience.id })}
                className="mt-1 size-4 shrink-0 accent-accent-cyan"
              />
              <span aria-hidden="true" className="text-xl leading-6">
                {experience.icon}
              </span>
              <span className="min-w-0">
                <span className="block font-medium">{homepageExperienceLabel(experience)}</span>
                <span
                  id={`homepage-experience-${experience.id}-description`}
                  className="mt-1 block text-sm leading-5 text-text-subtle"
                >
                  {experience.description}
                </span>
              </span>
            </label>
          ))}
        </fieldset>
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            disabled={launchDisabled}
            onClick={(event) => void launch(state.selectedId, event.currentTarget)}
            data-homepage-widget-activate
            aria-describedby="homepage-widget-status"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-accent-cyan px-5 py-3 font-semibold text-bg-deep shadow-[0_12px_32px_rgba(125,207,255,0.28)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(125,207,255,0.36)] disabled:cursor-wait disabled:opacity-75 max-sm:w-full max-sm:rounded-[10px] motion-reduce:transform-none motion-reduce:transition-none"
          >
            <span aria-hidden="true">{selected.icon}</span>
            {state.runtimeState === "loading" ? "Loading Feedback…" : selected.launchLabel}
          </button>
        </div>
        <p className="mt-5 text-sm text-text-subtle">
          {IS_LOCAL_DOGFOOD_RUNTIME
            ? "Local dogfood submissions stay in this development process; they do not create a public GitHub Issue. Please do not include sensitive information."
            : "Demo submissions create a real public GitHub Issue in our test repository. Please do not include sensitive information."}
        </p>
        <Link href={BUILDING_BLOCKS_PATH} className="mt-3 inline-flex text-sm font-medium text-accent-cyan underline-offset-4 hover:underline">
          Explore the building blocks
        </Link>
        {state.runtimeState === "error" && (
          <p className="mt-3 text-sm text-red-300" role="alert">
            The feedback experience could not load. Your selection is still saved; try again.
          </p>
        )}
        <span id="homepage-widget-status" className="sr-only" aria-live="polite">
          {state.announcement}
        </span>
      </section>
    </>
  );
}

export function HomepageWidget() {
  return process.env.NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO_ENABLED === "true" ? (
    <FlowHomepageWidget />
  ) : (
    <ClassicHomepageWidget />
  );
}
