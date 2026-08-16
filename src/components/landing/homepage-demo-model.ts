import {
  homepageFlowRecipeList,
  type HomepageFlowRecipeId,
} from "./homepage-flow-recipes.generated";

export type HomepageExperienceId = "classic" | HomepageFlowRecipeId;

export interface HomepageExperience {
  readonly id: HomepageExperienceId;
  readonly label: string;
  readonly description: string;
  readonly launchLabel: string;
}

export interface HomepageDemoState {
  readonly selectedId: HomepageExperienceId;
  readonly activeId: HomepageExperienceId | null;
  readonly menuOpen: boolean;
  readonly runtimeState: "idle" | "loading" | "ready" | "error";
  readonly announcement: string;
}

export type HomepageDemoAction =
  | { readonly type: "open-menu" }
  | { readonly type: "close-menu" }
  | { readonly type: "select"; readonly id: HomepageExperienceId }
  | { readonly type: "launch" }
  | { readonly type: "runtime-loading" }
  | { readonly type: "runtime-ready" }
  | { readonly type: "runtime-error" }
  | { readonly type: "settled" }
  | { readonly type: "clear" }
  | { readonly type: "unmount" };

const classicExperience = Object.freeze({
  id: "classic" as const,
  label: "General Feedback",
  description: "The familiar screenshot-first feedback widget.",
  launchLabel: "Open General Feedback",
});

const flowCopy: Readonly<
  Record<HomepageFlowRecipeId, Pick<HomepageExperience, "description" | "launchLabel">>
> = Object.freeze({
  "bug-report": Object.freeze({
    description: "Capture a reproducible problem with evidence.",
    launchLabel: "Open Bug Report",
  }),
  "product-triage": Object.freeze({
    description: "Route product signals with conditional follow-up.",
    launchLabel: "Open Product Triage",
  }),
  "customer-pulse": Object.freeze({
    description: "Ask a focused customer satisfaction question.",
    launchLabel: "Open Customer Pulse",
  }),
});

export const homepageExperiences: readonly HomepageExperience[] = Object.freeze([
  classicExperience,
  ...homepageFlowRecipeList.map(({ id, label }) =>
    Object.freeze({ id, label, ...flowCopy[id] }),
  ),
]);

export const initialHomepageDemoState: HomepageDemoState = Object.freeze({
  selectedId: "classic",
  activeId: null,
  menuOpen: false,
  runtimeState: "idle",
  announcement: "",
});

const experienceIds = new Set(homepageExperiences.map(({ id }) => id));

function isHomepageExperienceId(value: string): value is HomepageExperienceId {
  return experienceIds.has(value as HomepageExperienceId);
}

function experienceLabel(id: HomepageExperienceId): string {
  return homepageExperiences.find((experience) => experience.id === id)?.label ?? id;
}

export function reduceHomepageDemo(
  state: HomepageDemoState,
  action: HomepageDemoAction,
): HomepageDemoState {
  switch (action.type) {
    case "open-menu":
      return state.activeId === null ? { ...state, menuOpen: true } : state;
    case "close-menu":
      return state.menuOpen ? { ...state, menuOpen: false } : state;
    case "select":
      return isHomepageExperienceId(action.id)
        ? {
            ...state,
            selectedId: action.id,
            menuOpen: false,
            announcement: `Selected ${experienceLabel(action.id)}.`,
          }
        : state;
    case "launch":
      return state.activeId === null
        ? {
            ...state,
            activeId: state.selectedId,
            menuOpen: false,
            announcement: `Opening ${experienceLabel(state.selectedId)}.`,
          }
        : state;
    case "runtime-loading":
      return {
        ...state,
        runtimeState: "loading",
        announcement: "Loading the feedback experience.",
      };
    case "runtime-ready":
      return {
        ...state,
        runtimeState: "ready",
        announcement: "The feedback experience is ready.",
      };
    case "runtime-error":
      return {
        ...state,
        activeId: null,
        menuOpen: false,
        runtimeState: "error",
        announcement: "The feedback experience could not load. Try again.",
      };
    case "settled":
      return {
        ...state,
        activeId: null,
        menuOpen: false,
        announcement: "The feedback experience has closed.",
      };
    case "clear":
      return {
        ...state,
        activeId: null,
        menuOpen: false,
        announcement: "",
      };
    case "unmount":
      return initialHomepageDemoState;
  }
}
