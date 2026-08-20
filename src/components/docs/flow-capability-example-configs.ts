import { FLOW_CAPABILITIES } from "@/lib/flow-capabilities";

type TransitionKind = (typeof FLOW_CAPABILITIES.transitions.kinds)[number];

export type FlowExampleId = "incident-triage" | "customer-pulse" | "release-readiness";
export type FlowStylePresetId = "product-dark" | "editorial-light" | "compact-console";

type FlowConfig = Readonly<Record<string, unknown>>;

export interface FlowExampleRecipe {
  readonly id: FlowExampleId;
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly path: string;
  readonly config: FlowConfig;
  readonly openOptions?: Readonly<Record<string, unknown>>;
}

export interface FlowStylePreset {
  readonly id: FlowStylePresetId;
  readonly label: string;
  readonly description: string;
  readonly hostClassName: string;
  readonly appearance: {
    readonly theme: (typeof FLOW_CAPABILITIES.appearance.themes)[number];
    readonly accentColor: string;
    readonly density: (typeof FLOW_CAPABILITIES.appearance.densities)[number];
  };
  readonly presentation: {
    readonly size: (typeof FLOW_CAPABILITIES.presentation.sizes)[number];
    readonly columns: (typeof FLOW_CAPABILITIES.presentation.columns)[number];
  };
}

const incidentTriage: FlowExampleRecipe = {
  id: "incident-triage",
  eyebrow: "Six fields · three screens · conditional evidence",
  title: "Incident triage",
  description:
    "Collect a structured report, reveal diagnostics for blocking incidents, and offer local screenshot capture.",
  path: "Welcome → report → conditional diagnostics → screenshot",
  openOptions: {
    context: { surface: "billing", plan: "team" },
    initialAnswers: { "report.summary": "Checkout confirmation is delayed" },
  },
  config: {
    configVersion: 1,
    id: "docs-incident-triage",
    presentation: { kind: "modal", size: "wide", columns: 2 },
    appearance: { theme: "dark", accentColor: "#7dd3fc", density: "comfortable" },
    content: {
      successTitle: "Local example stored",
      successMessage: "This payload stayed inside the local documentation server.",
      cancelLabel: "Close example",
    },
    forms: [
      {
        id: "report",
        title: "Describe the incident",
        description: "A compact intake for product and engineering triage.",
        fields: [
          {
            id: "summary",
            type: "shortText",
            label: "Summary",
            required: true,
            maxLength: 120,
            layout: { span: 2 },
          },
          {
            id: "severity",
            type: "singleChoice",
            label: "Severity",
            required: true,
            display: "cards",
            options: [
              { value: "minor", label: "Minor", description: "Work can continue" },
              { value: "blocking", label: "Blocking", description: "Work has stopped" },
            ],
          },
          {
            id: "confidence",
            type: "rating",
            label: "Reproduction confidence",
            scale: 5,
            icon: "star",
            lowLabel: "Uncertain",
            highLabel: "Certain",
          },
          {
            id: "details",
            type: "longText",
            label: "What happened?",
            rows: 4,
            layout: { span: 2 },
          },
        ],
      },
      {
        id: "evidence",
        title: "Add diagnostic evidence",
        description: "This screen appears only for a blocking incident.",
        fields: [
          { id: "files", type: "attachments", label: "Supporting files", maxFiles: 3 },
          {
            id: "send-logs",
            type: "checkbox",
            label: "Include console logs",
            initialValue: false,
          },
        ],
      },
    ],
    screens: [
      {
        id: "welcome",
        type: "message",
        title: "Triage an incident",
        description: "Explore the complete released component set without creating a GitHub Issue.",
        continueLabel: "Start triage",
      },
      { id: "report-screen", type: "form", form: "report", continueLabel: "Continue" },
      {
        id: "evidence-screen",
        type: "form",
        form: "evidence",
        when: {
          all: [
            { answer: "report.severity", equals: "blocking" },
            { context: "plan", equals: "team" },
          ],
        },
      },
      {
        id: "screenshot",
        type: "screenshot",
        mode: "optional",
        title: "Add visual context",
        description: "Capture is optional in this local example.",
      },
    ],
    issue: {
      classification: "bug",
      title: "{{report.summary}}",
      sections: [
        { heading: "Severity", answer: "report.severity", format: "choice" },
        { heading: "Details", answer: "report.details", omitWhenEmpty: true },
        { heading: "Surface", context: "surface", format: "code" },
      ],
    },
    evidence: { attachments: "evidence.files", sendConsoleLogs: "evidence.send-logs" },
  },
};

const customerPulse: FlowExampleRecipe = {
  id: "customer-pulse",
  eyebrow: "Compact signal · answer branching",
  title: "Customer pulse",
  description: "Pair a numeric signal with an optional follow-up, in a small app-matched modal.",
  path: "Rating → conditional follow-up",
  config: {
    configVersion: 1,
    id: "docs-customer-pulse",
    presentation: { kind: "modal", size: "compact", columns: 1 },
    appearance: { theme: "light", accentColor: "#c2410c", density: "comfortable" },
    forms: [
      {
        id: "pulse",
        title: "How is your workspace feeling?",
        fields: [
          {
            id: "score",
            type: "rating",
            label: "Workspace score",
            scale: 10,
            icon: "number",
            required: true,
          },
        ],
      },
      {
        id: "followup",
        title: "What should we improve?",
        fields: [{ id: "note", type: "longText", label: "One useful change", rows: 3 }],
      },
    ],
    screens: [
      { id: "pulse-screen", type: "form", form: "pulse" },
      {
        id: "followup-screen",
        type: "form",
        form: "followup",
        when: { any: [{ answer: "pulse.score", equals: 1 }, { context: "ask-followup", equals: true }] },
      },
    ],
    issue: {
      classification: "question",
      title: "Workspace pulse: {{pulse.score}}/10",
      sections: [
        { heading: "Score", answer: "pulse.score", format: "text" },
        { heading: "Suggestion", answer: "followup.note", format: "quote", omitWhenEmpty: true },
      ],
    },
  },
};

const releaseReadiness: FlowExampleRecipe = {
  id: "release-readiness",
  eyebrow: "Two-column form · context branch",
  title: "Release readiness",
  description: "A dense operational check that adapts when the host application marks a release as risky.",
  path: "Checklist → conditional risk details → review",
  openOptions: { context: { risk: "high", surface: "release-dashboard" } },
  config: {
    configVersion: 1,
    id: "docs-release-readiness",
    presentation: { kind: "modal", size: "wide", columns: 2 },
    appearance: { theme: "dark", accentColor: "#34d399", density: "compact" },
    forms: [
      {
        id: "release",
        title: "Ship with confidence",
        fields: [
          {
            id: "name",
            type: "shortText",
            label: "Release name",
            required: true,
            layout: { span: 2 },
          },
          { id: "tests", type: "checkbox", label: "Critical tests passed", required: true },
          { id: "rollback", type: "checkbox", label: "Rollback plan checked", required: true },
        ],
      },
      {
        id: "risk",
        title: "Describe the release risk",
        fields: [
          {
            id: "note",
            type: "longText",
            label: "Risk note",
            helpText: "Shown because the host passed risk=high.",
            required: true,
          },
        ],
      },
    ],
    screens: [
      { id: "release-screen", type: "form", form: "release" },
      {
        id: "risk-screen",
        type: "form",
        form: "risk",
        when: { context: "risk", equals: "high" },
      },
      {
        id: "risk-note",
        type: "message",
        title: "High-risk release recorded",
        description: "The host context selected this final review screen.",
        when: { context: "risk", equals: "high" },
      },
    ],
    issue: {
      classification: "feature",
      title: "Release readiness: {{release.name}}",
      sections: [
        { heading: "Risk note", answer: "risk.note", format: "code", omitWhenEmpty: true },
        { heading: "Surface", context: "surface", format: "code" },
      ],
    },
  },
};

export const FLOW_EXAMPLE_RECIPES: readonly FlowExampleRecipe[] = Object.freeze([
  incidentTriage,
  customerPulse,
  releaseReadiness,
]);

export const FLOW_STYLE_PRESETS: readonly FlowStylePreset[] = Object.freeze([
  {
    id: "product-dark",
    label: "Product dark",
    description: "Cool accent, comfortable rhythm, and a wide two-column product surface.",
    hostClassName: "productDark",
    appearance: { theme: "dark", accentColor: "#7dd3fc", density: "comfortable" },
    presentation: { size: "wide", columns: 2 },
  },
  {
    id: "editorial-light",
    label: "Editorial light",
    description: "Warm accent and a focused compact layout for a content-led application.",
    hostClassName: "editorialLight",
    appearance: { theme: "light", accentColor: "#c2410c", density: "comfortable" },
    presentation: { size: "compact", columns: 1 },
  },
  {
    id: "compact-console",
    label: "Compact console",
    description: "Dense spacing and a green signal color for an operational dashboard.",
    hostClassName: "compactConsole",
    appearance: { theme: "dark", accentColor: "#34d399", density: "compact" },
    presentation: { size: "default", columns: 2 },
  },
]);

export const FLOW_TRANSITION_KINDS = FLOW_CAPABILITIES.transitions.kinds;

export function transitionLabel(kind: TransitionKind): string {
  if (kind === "none") return "Immediate";
  if (kind === "custom") return "Custom lift";
  return kind
    .split("-")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

export function transitionConfig(kind: TransitionKind): Readonly<Record<string, unknown>> {
  if (kind === "none") return { kind };
  if (kind === "custom") {
    return {
      kind,
      durationMs: FLOW_CAPABILITIES.transitions.defaultDurationMs.custom,
      easing: "ease-out",
      forward: {
        enterFrom: { opacity: 0, translateY: 18, scale: 0.98 },
        exitTo: { opacity: 0, translateY: -12, scale: 0.99 },
      },
      backward: {
        enterFrom: { opacity: 0, translateY: -12, scale: 0.99 },
        exitTo: { opacity: 0, translateY: 18, scale: 0.98 },
      },
    };
  }
  return { kind, durationMs: FLOW_CAPABILITIES.transitions.defaultDurationMs[kind] };
}

export function buildFlowExampleConfig(
  recipeId: FlowExampleId,
  transitionKind: TransitionKind,
  presetId: FlowStylePresetId,
): FlowConfig {
  const recipe = FLOW_EXAMPLE_RECIPES.find(({ id }) => id === recipeId);
  const preset = FLOW_STYLE_PRESETS.find(({ id }) => id === presetId);
  if (!recipe || !preset) throw new TypeError("Unknown flow example selection");

  return {
    ...recipe.config,
    id: `${recipe.config.id}-${transitionKind}-${presetId}`,
    presentation: {
      ...(recipe.config.presentation as Record<string, unknown>),
      ...preset.presentation,
      kind: "modal",
      screenTransition: transitionConfig(transitionKind),
    },
    appearance: preset.appearance,
  };
}
