import {
  homepageFlowRecipeList,
  homepageFlowRecipes,
  type HomepageFlowOpenOptions,
  type HomepageFlowRecipeId,
} from "./homepage-flow-recipes.generated";
import type { HomepageExperienceId } from "./homepage-demo-model";
import { SAMPLE_DEMO_REPO, WIDGET_URL } from "@/lib/links";

const SCRIPT_ID = "bugdrop-homepage-demo";
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

export type HomepageFlowHandles = Readonly<Record<HomepageFlowRecipeId, HomepageFlowHandle>>;

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
const flowHandleCache = new WeakMap<HomepageBugDropApi, HomepageFlowHandles>();

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

function configureHomepageScript(script: HTMLScriptElement) {
  script.id = SCRIPT_ID;
  script.src = WIDGET_URL;
  script.async = false;
  for (const [name, value] of Object.entries(homepageRuntimeAttributes())) {
    script.dataset[name] = value;
  }
}

export function loadHomepageBugDrop(): Promise<HomepageBugDropApi> {
  const readyApi = homepageApiFromWindow();
  if (readyApi) return Promise.resolve(readyApi);
  if (homepageLoadPromise) return homepageLoadPromise;
  if (typeof document === "undefined") {
    return Promise.reject(new Error("The homepage BugDrop runtime requires a browser."));
  }

  homepageLoadPromise = new Promise<HomepageBugDropApi>((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID);
    const script = existing instanceof HTMLScriptElement
      ? existing
      : document.createElement("script");
    let settled = false;

    const cleanupListeners = () => {
      script.removeEventListener("load", resolveWhenReady);
      script.removeEventListener("error", rejectLoad);
      document.removeEventListener("bugdrop:ready", resolveWhenReady);
    };

    const rejectLoad = () => {
      if (settled) return;
      settled = true;
      cleanupListeners();
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
      resolve(api);
    };

    script.addEventListener("load", resolveWhenReady, { once: true });
    script.addEventListener("error", rejectLoad, { once: true });
    document.addEventListener("bugdrop:ready", resolveWhenReady, { once: true });

    if (!existing) {
      configureHomepageScript(script);
      document.body.append(script);
    }
  });

  return homepageLoadPromise;
}

export function registerHomepageFlows(api: HomepageBugDropApi): HomepageFlowHandles {
  const cached = flowHandleCache.get(api);
  if (cached) return cached;

  const handles = {} as Record<HomepageFlowRecipeId, HomepageFlowHandle>;
  for (const recipe of homepageFlowRecipeList) {
    const handle = api.registerFlow(recipe.config);
    if (handle.id !== recipe.id) {
      throw new Error(`BugDrop returned unexpected Flow handle ID: ${handle.id}`);
    }
    handles[recipe.id] = handle;
  }

  const frozenHandles = Object.freeze(handles);
  flowHandleCache.set(api, frozenHandles);
  return frozenHandles;
}

export function openHomepageExperience(
  api: HomepageBugDropApi,
  handles: HomepageFlowHandles,
  id: HomepageExperienceId,
): HomepageActiveExperience {
  if (id === "classic") {
    api.open();
    return Object.freeze({ id, close: () => api.close() });
  }

  const opened = handles[id].open(
    homepageFlowRecipes[id].openOptions as HomepageFlowOpenOptions | undefined,
  );
  return Object.freeze({
    id,
    result: opened.result,
    close: () => opened.close(),
  });
}
