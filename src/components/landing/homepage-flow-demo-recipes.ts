import {
  homepageFlowRecipes as canonicalRecipes,
  type HomepageFlowConfig,
  type HomepageFlowOpenOptions,
} from "./homepage-flow-recipes.generated";

export type HomepageDemoFlowRecipeId =
  | "bug-report"
  | "quick-rating"
  | "feature-request";

export interface HomepageDemoFlowRecipe {
  readonly id: HomepageDemoFlowRecipeId;
  readonly label: string;
  readonly config: HomepageFlowConfig;
  readonly openOptions?: HomepageFlowOpenOptions;
}

type DemoObject = Record<string, unknown>;

const screenTransition = Object.freeze({
  kind: "slide-horizontal",
  durationMs: 500,
});

function deepFreeze<T>(value: T): T {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const child of Object.values(value)) deepFreeze(child);
  return value;
}

function bugReportRecipe(): HomepageDemoFlowRecipe {
  const canonical = canonicalRecipes["bug-report"];
  const config = JSON.parse(JSON.stringify(canonical.config)) as DemoObject;
  const presentation = config.presentation as DemoObject;
  const forms = config.forms as DemoObject[];
  const screens = config.screens as DemoObject[];

  presentation.screenTransition = screenTransition;
  Object.assign(config.content as DemoObject, {
    successTitle: "Bug captured",
    successMessage: "Your evidence is ready for triage.",
    cancelLabel: "Discard",
  });
  Object.assign(forms[0], {
    title: "Reproduce the bug",
    description: "Name the breakage and the shortest path to it.",
  });
  Object.assign(forms[1], { title: "Attach proof" });
  const evidenceFields = forms[1].fields as DemoObject[];
  Object.assign(evidenceFields[1], { layout: { span: 2 } });
  Object.assign(screens[0], {
    title: "Report a bug",
    description: "Reproduce it, attach proof, and capture the page.",
    continueLabel: "Describe bug",
  });
  Object.assign(screens[3], {
    title: "Capture the breakage",
    description: "Show the page at the moment it fails.",
  });

  return deepFreeze({
    id: "bug-report",
    label: canonical.label,
    openOptions: canonical.openOptions,
    config: config as HomepageFlowConfig,
  });
}

const quickRating: HomepageDemoFlowRecipe = deepFreeze({
  id: "quick-rating",
  label: "Quick Rating",
  config: {
    configVersion: 1,
    id: "quick-rating",
    presentation: {
      kind: "modal",
      size: "compact",
      columns: 1,
      screenTransition,
    },
    appearance: { theme: "auto", accentColor: "#7c3aed", density: "comfortable" },
    content: {
      successTitle: "Rating received",
      successMessage: "Thanks for the quick signal.",
      cancelLabel: "Not now",
    },
    forms: [
      {
        id: "rating",
        title: "How was this experience?",
        fields: [
          {
            id: "score",
            type: "rating",
            label: "Overall rating",
            required: true,
            scale: 5,
            icon: "star",
            lowLabel: "Poor",
            highLabel: "Excellent",
          },
        ],
      },
    ],
    screens: [
      { id: "rating-screen", type: "form", form: "rating", continueLabel: "Send rating" },
    ],
    issue: {
      classification: "question",
      title: "Experience rating {{rating.score}}/5",
      sections: [{ heading: "Rating", answer: "rating.score", format: "stars" }],
    },
  },
});

const featureRequest: HomepageDemoFlowRecipe = deepFreeze({
  id: "feature-request",
  label: "Feature Request",
  config: {
    configVersion: 1,
    id: "feature-request",
    presentation: { kind: "modal", size: "wide", columns: 2, screenTransition },
    appearance: { theme: "light", accentColor: "#7c3aed", density: "comfortable" },
    content: {
      successTitle: "Idea shared",
      successMessage: "Your product idea is ready for discovery.",
      cancelLabel: "Discard idea",
    },
    forms: [
      {
        id: "idea",
        title: "Shape the opportunity",
        description: "A little structure makes an idea easier to evaluate.",
        fields: [
          {
            id: "category",
            type: "singleChoice",
            label: "What would this improve?",
            required: true,
            display: "cards",
            options: [
              { value: "workflow", label: "Workflow", description: "Save time or steps" },
              { value: "integration", label: "Integration", description: "Connect another tool" },
              { value: "design", label: "Design", description: "Make the experience clearer" },
            ],
            layout: { span: 2 },
          },
          {
            id: "title",
            type: "shortText",
            label: "Idea in one sentence",
            required: true,
            maxLength: 120,
            layout: { span: 2 },
          },
        ],
      },
      {
        id: "detail",
        title: "Explain the opportunity",
        description: "Add the context that makes this idea useful.",
        fields: [
          {
            id: "detail",
            type: "longText",
            label: "Why would this help?",
            rows: 4,
          },
        ],
      },
      {
        id: "priority",
        title: "Set the priority",
        description: "Choose the impact that best matches this idea.",
        fields: [
          {
            id: "impact",
            type: "singleChoice",
            label: "Potential impact",
            required: true,
            display: "cards",
            options: [
              { value: "nice-to-have", label: "Nice to have", description: "A useful improvement" },
              { value: "important", label: "Important", description: "Meaningfully improves the work" },
              { value: "transformative", label: "Transformative", description: "Changes what is possible" },
            ],
          },
        ],
      },
    ],
    screens: [
      {
        id: "intro",
        type: "message",
        title: "Request a feature",
        description: "Turn a product idea into an actionable signal.",
        continueLabel: "Shape idea",
      },
      { id: "idea-screen", type: "form", form: "idea", continueLabel: "Add context" },
      {
        id: "detail-screen",
        type: "form",
        form: "detail",
        backLabel: "Edit idea",
        continueLabel: "Set priority",
      },
      {
        id: "priority-screen",
        type: "form",
        form: "priority",
        backLabel: "Edit context",
        continueLabel: "Send idea",
      },
    ],
    issue: {
      classification: "feature",
      title: "Feature: {{idea.title}}",
      sections: [
        { heading: "Area", answer: "idea.category", format: "choice" },
        { heading: "Opportunity", answer: "detail.detail", omitWhenEmpty: true },
        { heading: "Potential impact", answer: "priority.impact", format: "choice" },
      ],
    },
  },
});

export const homepageFlowDemoRecipeList: readonly HomepageDemoFlowRecipe[] =
  Object.freeze([bugReportRecipe(), quickRating, featureRequest]);

export const homepageFlowDemoRecipes: Readonly<
  Record<HomepageDemoFlowRecipeId, HomepageDemoFlowRecipe>
> = Object.freeze(
  Object.fromEntries(
    homepageFlowDemoRecipeList.map((recipe) => [recipe.id, recipe]),
  ) as Record<HomepageDemoFlowRecipeId, HomepageDemoFlowRecipe>,
);
