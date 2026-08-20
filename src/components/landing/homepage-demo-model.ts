import {
  homepageFlowDemoRecipeList,
  type HomepageDemoFlowRecipeId,
} from "./homepage-flow-demo-recipes";

export type HomepageExperienceId = "classic" | HomepageDemoFlowRecipeId;

export interface HomepageExperience {
  readonly id: HomepageExperienceId;
  readonly label: string;
  readonly icon: string;
  readonly description: string;
  readonly launchLabel: string;
}

export interface HomepageDemoState {
  readonly selectedId: HomepageExperienceId;
  readonly activeId: HomepageExperienceId | null;
  readonly runtimeState: "idle" | "loading" | "ready" | "error";
  readonly announcement: string;
}

export type HomepageDemoAction =
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
  icon: "💬",
  description: "The familiar screenshot-first feedback widget.",
  launchLabel: "Open General Feedback",
});

const flowCopy: Readonly<
  Record<
    HomepageDemoFlowRecipeId,
    Pick<HomepageExperience, "icon" | "description" | "launchLabel">
  >
> = Object.freeze({
  "bug-report": Object.freeze({
    icon: "🐛",
    description: "Reproduce a bug and attach proof.",
    launchLabel: "Open Bug Report",
  }),
  "quick-rating": Object.freeze({
    icon: "⭐",
    description: "Share a 1–5 star rating in one step.",
    launchLabel: "Open Quick Rating",
  }),
  "feature-request": Object.freeze({
    icon: "💡",
    description: "Shape and prioritize a product idea.",
    launchLabel: "Open Feature Request",
  }),
});

export const homepageExperiences: readonly HomepageExperience[] = Object.freeze([
  classicExperience,
  ...homepageFlowDemoRecipeList.map(({ id, label }) =>
    Object.freeze({ id, label, ...flowCopy[id] }),
  ),
]);

export const initialHomepageDemoState: HomepageDemoState = Object.freeze({
  selectedId: "classic",
  activeId: null,
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
    case "select":
      return isHomepageExperienceId(action.id)
        ? {
            ...state,
            selectedId: action.id,
            announcement: `Selected ${experienceLabel(action.id)}.`,
          }
        : state;
    case "launch":
      return state.activeId === null
        ? {
            ...state,
            activeId: state.selectedId,
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
        runtimeState: "error",
        announcement: "The feedback experience could not load. Try again.",
      };
    case "settled":
      return {
        ...state,
        activeId: null,
        announcement: "The feedback experience has closed.",
      };
    case "clear":
      return {
        ...state,
        activeId: null,
        announcement: "",
      };
    case "unmount":
      return initialHomepageDemoState;
  }
}
