import {
  homepageFlowRecipeList,
  homepageFlowRecipes,
  type HomepageFlowOpenOptions,
  type HomepageFlowRecipeId,
} from "./homepage-flow-recipes.generated";
import type { HomepageExperienceId } from "./homepage-demo-model";
import { SAMPLE_DEMO_REPO, WIDGET_URL } from "@/lib/links";

const SCRIPT_ID = "bugdrop-homepage-demo";
const API_BINDING = Symbol.for("bugdrop.homepage-demo.exact-api");
const WELCOME =
  "This is the BugDrop landing page demo. Send a test report to see what your users would experience.";

export interface HomepageOpenedFlow {
  readonly instanceId: string;
  close(): void;
  readonly result: Promise<
    | { status: "submitted"; result: { issueNumber: number; issueUrl: string } }
    | { status: "closed" | "busy" }
  >;
}

export interface HomepageFlowHandle {
  readonly id: string;
  open(options?: {
    context?: Record<string, string | number | boolean>;
  }): HomepageOpenedFlow;
}

export interface HomepageBugDropApi {
  open(): void;
  close(): void;
  registerFlow(config: unknown): HomepageFlowHandle;
}

export type HomepageActiveExperience =
  | {
      readonly id: "classic";
      close(): void;
    }
  | {
      readonly id: HomepageFlowRecipeId;
      close(): void;
      readonly result: HomepageOpenedFlow["result"];
    };

let homepageLoadPromise: Promise<HomepageBugDropApi> | undefined;
let homepageExactApi: HomepageBugDropApi | undefined;
const flowHandleCache = new WeakMap<
  HomepageBugDropApi,
  Map<HomepageFlowRecipeId, HomepageFlowHandle>
>();

export function homepageRuntimeAttributes(): Readonly<Record<string, string>> {
  return Object.freeze({
    repo: SAMPLE_DEMO_REPO,
    button: "false",
    theme: "dark",
    position: "bottom-right",
    color: "#7dcfff",
    bg: "#24283b",
    text: "#c0caf5",
    borderColor: "#7dcfff",
    borderWidth: "1",
    radius: "10",
    shadow: "soft",
    font: "inherit",
    label: "Feedback",
    welcome: WELCOME,
    showIssueLink: "always",
  });
}

function homepageApiFromWindow(): HomepageBugDropApi | undefined {
  if (typeof window === "undefined") return undefined;
  const candidate = (window as Window & { BugDrop?: unknown }).BugDrop;
  if (
    !candidate ||
    typeof candidate !== "object" ||
    typeof (candidate as HomepageBugDropApi).open !== "function" ||
    typeof (candidate as HomepageBugDropApi).close !== "function" ||
    typeof (candidate as HomepageBugDropApi).registerFlow !== "function"
  ) {
    return undefined;
  }
  return candidate as HomepageBugDropApi;
}

function hasBugDropGlobal(): boolean {
  return typeof window !== "undefined" &&
    (window as Window & { BugDrop?: unknown }).BugDrop !== undefined;
}

function homepageScriptFromDocument(): HTMLScriptElement | undefined {
  if (typeof document === "undefined") return undefined;
  const candidate = document.getElementById(SCRIPT_ID);
  return candidate instanceof HTMLScriptElement ? candidate : undefined;
}

type HomepageScript = HTMLScriptElement & {
  [API_BINDING]?: HomepageBugDropApi;
};

function boundHomepageApi(script: HTMLScriptElement): HomepageBugDropApi | undefined {
  return (script as HomepageScript)[API_BINDING];
}

function bindHomepageApi(script: HTMLScriptElement, api: HomepageBugDropApi) {
  (script as HomepageScript)[API_BINDING] = api;
  homepageExactApi = api;
}

function absoluteRuntimeUrl(value: string): string {
  const base = typeof window !== "undefined" && window.location?.href
    ? window.location.href
    : "http://bugdrop.localhost:3000/";
  return new URL(value, base).href;
}

function isExactHomepageScript(script: HTMLScriptElement): boolean {
  if (absoluteRuntimeUrl(script.src) !== absoluteRuntimeUrl(WIDGET_URL)) return false;
  return Object.entries(homepageRuntimeAttributes()).every(
    ([name, value]) => script.dataset[name] === value,
  );
}

function foreignRuntimeError(): Error {
  return new Error(
    "A different BugDrop runtime is already active. Reload this page to try the homepage demo.",
  );
}

function configureHomepageScript(script: HTMLScriptElement) {
  script.id = SCRIPT_ID;
  script.src = WIDGET_URL;
  script.async = false;
  for (const [name, value] of Object.entries(homepageRuntimeAttributes())) {
    script.dataset[name] = value;
  }
}

export function loadHomepageBugDrop(): Promise<HomepageBugDropApi> {
  if (typeof document === "undefined") {
    return Promise.reject(new Error("The homepage BugDrop runtime requires a browser."));
  }

  const existing = homepageScriptFromDocument();
  if (existing && isExactHomepageScript(existing)) {
    const boundApi = homepageExactApi ?? boundHomepageApi(existing);
    if (boundApi) {
      homepageExactApi = boundApi;
      return Promise.resolve(boundApi);
    }
  }
  const readyApi = homepageApiFromWindow();
  if (readyApi) {
    return existing && isExactHomepageScript(existing)
      ? Promise.resolve(readyApi)
      : Promise.reject(foreignRuntimeError());
  }
  if (hasBugDropGlobal() && (!existing || !isExactHomepageScript(existing))) {
    return Promise.reject(foreignRuntimeError());
  }
  if (existing && !isExactHomepageScript(existing)) {
    return Promise.reject(foreignRuntimeError());
  }
  if (homepageLoadPromise) return homepageLoadPromise;

  homepageLoadPromise = new Promise<HomepageBugDropApi>((resolve, reject) => {
    const script = existing ?? document.createElement("script");
    let settled = false;

    const cleanupListeners = () => {
      script.removeEventListener("load", resolveWhenReady);
      script.removeEventListener("error", rejectLoad);
    };

    const rejectLoad = () => {
      if (settled) return;
      settled = true;
      cleanupListeners();
      if (!homepageApiFromWindow() && hasBugDropGlobal()) {
        delete (window as Window & { BugDrop?: unknown }).BugDrop;
      }
      script.remove();
      homepageLoadPromise = undefined;
      reject(new Error("The homepage BugDrop runtime did not initialize."));
    };

    const resolveWhenReady = () => {
      if (settled) return;
      const api = homepageApiFromWindow();
      if (!api) {
        rejectLoad();
        return;
      }
      settled = true;
      cleanupListeners();
      bindHomepageApi(script, api);
      resolve(api);
    };

    script.addEventListener("load", resolveWhenReady, { once: true });
    script.addEventListener("error", rejectLoad, { once: true });

    if (!existing) {
      configureHomepageScript(script);
      document.body.append(script);
    }
  });

  return homepageLoadPromise;
}

function isHomepageCheckRequest(input: RequestInfo | URL): boolean {
  const value = input instanceof Request ? input.url : String(input);
  try {
    const url = new URL(value, window.location?.href ?? "http://bugdrop.localhost:3000/");
    return url.pathname.endsWith(`/api/check/${SAMPLE_DEMO_REPO}`);
  } catch {
    return false;
  }
}

function openCancellableClassic(api: HomepageBugDropApi): HomepageActiveExperience {
  if (typeof window === "undefined" || typeof window.fetch !== "function") {
    api.open();
    return Object.freeze({ id: "classic" as const, close: () => api.close() });
  }

  let cancelled = false;
  const originalFetch = window.fetch;
  let intercepting = true;
  const restoreFetch = () => {
    if (!intercepting) return;
    intercepting = false;
    if (window.fetch === guardedFetch) window.fetch = originalFetch;
  };
  const guardedFetch: typeof window.fetch = (input, init) => {
    if (!isHomepageCheckRequest(input)) return originalFetch.call(window, input, init);
    restoreFetch();
    const request = originalFetch.call(window, input, init);
    return new Promise<Response>((resolve, reject) => {
      void request.then(
        (response) => {
          if (!cancelled) resolve(response);
        },
        (error: unknown) => {
          if (!cancelled) reject(error);
        },
      );
    });
  };

  window.fetch = guardedFetch;
  try {
    api.open();
  } catch (error) {
    restoreFetch();
    throw error;
  }

  return Object.freeze({
    id: "classic" as const,
    close: () => {
      cancelled = true;
      api.close();
    },
  });
}

export function registerHomepageFlow(
  api: HomepageBugDropApi,
  id: HomepageFlowRecipeId,
): HomepageFlowHandle {
  let handles = flowHandleCache.get(api);
  if (!handles) {
    handles = new Map();
    flowHandleCache.set(api, handles);
  }
  const cached = handles.get(id);
  if (cached) return cached;

  const recipe = homepageFlowRecipeList.find((candidate) => candidate.id === id);
  if (!recipe) throw new Error(`Unknown homepage Flow recipe: ${id}`);
  const handle = api.registerFlow(recipe.config);
  if (handle.id !== recipe.id) {
    throw new Error(`BugDrop returned unexpected Flow handle ID: ${handle.id}`);
  }
  handles.set(id, handle);
  return handle;
}

export function openHomepageExperience(
  api: HomepageBugDropApi,
  handle: HomepageFlowHandle | undefined,
  id: HomepageExperienceId,
): HomepageActiveExperience {
  if (id === "classic") {
    return openCancellableClassic(api);
  }

  if (!handle || handle.id !== id) {
    throw new Error(`Missing homepage Flow handle: ${id}`);
  }
  const opened = handle.open(
    homepageFlowRecipes[id].openOptions as HomepageFlowOpenOptions | undefined,
  );
  return Object.freeze({
    id,
    result: opened.result,
    close: () => opened.close(),
  });
}
