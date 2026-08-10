export const PRIMITIVE_IDS = [
  "shortText",
  "longText",
  "rating",
  "singleChoice",
  "multiSelect",
] as const;

export type PrimitiveId = (typeof PRIMITIVE_IDS)[number];
export const PRIMITIVE_COPY: Record<
  PrimitiveId,
  { label: string; note: string }
> = {
  shortText: { label: "Short answer", note: "One concise line" },
  longText: { label: "Long answer", note: "Open-ended context" },
  rating: { label: "Rating", note: "A scored response" },
  singleChoice: { label: "Single choice", note: "Choose exactly one" },
  multiSelect: { label: "Multiple choice", note: "Choose several" },
};
export const RECIPE_IDS = [
  "bugReport",
  "productReview",
  "roadmapVote",
  "featurePriorities",
] as const;
export type RecipeId = (typeof RECIPE_IDS)[number];
export type LabStatus = "idle" | "failure" | "success";
export type AnswerValue = string | number | string[];
export type Answers = Record<string, AnswerValue>;

type Option = { value: string; label: string; description?: string };
type BaseField = { id: string; label: string; required?: boolean; description?: string };
export type RecipeField =
  | (BaseField & { type: "shortText"; placeholder?: string; maxLength?: number })
  | (BaseField & { type: "longText"; placeholder?: string; maxLength?: number })
  | (BaseField & { type: "rating"; scale: number; lowLabel?: string; highLabel?: string })
  | (BaseField & { type: "singleChoice"; display: "radio" | "cards"; options: readonly Option[] })
  | (BaseField & { type: "multiSelect"; display: "checkboxes" | "cards"; options: readonly Option[] });

export type IssueFormat = "text" | "quote" | "code" | "stars" | "choice";
export type IssueSection = {
  heading: string;
  field: string;
  format: IssueFormat;
  omitWhenEmpty?: boolean;
};

export type Recipe = {
  id: RecipeId;
  name: string;
  summary: string;
  eyebrow: string;
  presentation: { kind: "inline" } | { kind: "modal"; size: "compact" };
  content: {
    title: string;
    description: string;
    submitLabel: string;
    successTitle: string;
    successMessage: string;
  };
  fields: readonly RecipeField[];
  issue: {
    classification: "bug" | "feature" | "feedback";
    title: string;
    sections: readonly IssueSection[];
  };
};

const areas = [
  { value: "dashboard", label: "Dashboard" },
  { value: "notifications", label: "Notifications" },
  { value: "integrations", label: "Integrations" },
] as const;

export const RECIPES: Record<RecipeId, Recipe> = {
  bugReport: {
    id: "bugReport",
    name: "Focused bug report",
    summary: "A concise report plus the affected product areas.",
    eyebrow: "Recipe 01 · Bug report",
    presentation: { kind: "modal", size: "compact" },
    content: {
      title: "What went wrong?",
      description: "Give the team enough context to reproduce the problem.",
      submitLabel: "Preview bug report",
      successTitle: "Bug report ready",
      successMessage: "The local Issue draft is ready for review.",
    },
    fields: [
      { id: "summary", type: "shortText", label: "Summary", required: true, placeholder: "A short description", maxLength: 120 },
      { id: "details", type: "longText", label: "What happened?", placeholder: "Steps, expected result, and actual result", maxLength: 1000 },
      { id: "areas", type: "multiSelect", label: "Affected areas", required: true, display: "checkboxes", options: areas },
    ],
    issue: {
      classification: "bug",
      title: "Bug: {{summary}} · {{areas}}",
      sections: [
        { heading: " Summary ", field: "summary", format: "text" },
        { heading: "Affected areas", field: "areas", format: "choice" },
        { heading: "Details", field: "details", format: "text", omitWhenEmpty: true },
      ],
    },
  },
  productReview: {
    id: "productReview",
    name: "Product review",
    summary: "A score with optional written context.",
    eyebrow: "Recipe 02 · Review",
    presentation: { kind: "inline" },
    content: {
      title: "How was your setup experience?",
      description: "Rate the flow and add context if useful.",
      submitLabel: "Preview review",
      successTitle: "Review ready",
      successMessage: "The local Issue draft is ready for review.",
    },
    fields: [
      { id: "rating", type: "rating", label: "Experience rating", required: true, scale: 5, lowLabel: "Rough", highLabel: "Excellent" },
      { id: "context", type: "longText", label: "Additional context", placeholder: "What worked—or didn’t?", maxLength: 1000 },
      { id: "signals", type: "multiSelect", label: "What shaped your rating?", display: "checkboxes", options: [
        { value: "speed", label: "Speed" },
        { value: "clarity", label: "Clarity" },
        { value: "reliability", label: "Reliability" },
      ] },
    ],
    issue: {
      classification: "feedback",
      title: "Setup review: {{rating}}",
      sections: [
        { heading: "Rating", field: "rating", format: "stars" },
        { heading: "Context", field: "context", format: "quote" },
        { heading: "Signals", field: "signals", format: "choice", omitWhenEmpty: true },
      ],
    },
  },
  roadmapVote: {
    id: "roadmapVote",
    name: "Roadmap vote",
    summary: "One priority choice with optional team context.",
    eyebrow: "Recipe 03 · Vote",
    presentation: { kind: "inline" },
    content: {
      title: "What should we improve next?",
      description: "Choose the update that would help your team most.",
      submitLabel: "Preview vote",
      successTitle: "Vote ready",
      successMessage: "The local Issue draft is ready for review.",
    },
    fields: [
      {
        id: "priority",
        type: "singleChoice",
        label: "Priority",
        required: true,
        display: "radio",
        options: [
          { value: "faster-setup", label: "Faster setup" },
          { value: "better-docs", label: "Better documentation" },
          { value: "more-integrations", label: "More integrations" },
        ],
      },
      { id: "team", type: "shortText", label: "Team context", placeholder: "Optional team or workflow" },
    ],
    issue: {
      classification: "feature",
      title: "Roadmap vote: {{priority}}",
      sections: [
        { heading: "Priority", field: "priority", format: "choice" },
        { heading: "Team context", field: "team", format: "text" },
      ],
    },
  },
  featurePriorities: {
    id: "featurePriorities",
    name: "Feature priorities",
    summary: "Choose several improvements for the next release.",
    eyebrow: "Recipe 04 · Priorities",
    presentation: { kind: "inline" },
    content: {
      title: "What should we improve together?",
      description: "Choose every area that would make the biggest difference.",
      submitLabel: "Preview priorities",
      successTitle: "Priorities ready",
      successMessage: "The local Issue draft is ready for review.",
    },
    fields: [{
      id: "priorities",
      type: "multiSelect",
      label: "Improvement areas",
      required: true,
      display: "checkboxes",
      options: [
        { value: "performance", label: "Performance" },
        { value: "documentation", label: "Documentation" },
        { value: "integrations", label: "Integrations" },
        { value: "notifications", label: "Notifications" },
      ],
    }],
    issue: {
      classification: "feature",
      title: "Feature priorities: {{priorities}}",
      sections: [
        { heading: "Priorities", field: "priorities", format: "choice" },
      ],
    },
  },
};

export const LAB_DISCLOSURE = "Local simulation — no feedback is sent and no GitHub Issue is created.";
export const FAILURE_MESSAGE = "Nothing was sent. Your answers are still here.";

export function emptyAnswers(recipeId: RecipeId): Answers {
  return Object.fromEntries(RECIPES[recipeId].fields.map((field) => [
    field.id,
    field.type === "rating" ? 0 : field.type === "multiSelect" ? [] : "",
  ]));
}

export type ValidationResult = { ok: true; answers: Answers } | { ok: false; field: string; message: string };

export function normalizeAnswers(recipeId: RecipeId, input: Record<string, unknown>): ValidationResult {
  const normalized: Answers = {};
  for (const field of RECIPES[recipeId].fields) {
    const raw = input[field.id];
    if (field.type === "multiSelect") {
      const value = raw === undefined || raw === null || raw === "" ? [] : raw;
      if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
        return { ok: false, field: field.id, message: `${field.label} must be an array.` };
      }
      if (new Set(value).size !== value.length) {
        return { ok: false, field: field.id, message: `${field.label} contains a duplicate selection.` };
      }
      const allowed = new Set(field.options.map((option) => option.value));
      if (value.some((item) => !allowed.has(item))) {
        return { ok: false, field: field.id, message: `${field.label} contains an unknown option.` };
      }
      const selected = new Set(value);
      normalized[field.id] = field.options.filter((option) => selected.has(option.value)).map((option) => option.value);
      if (field.required && (normalized[field.id] as string[]).length === 0) {
        return { ok: false, field: field.id, message: `Choose at least one ${field.label.toLowerCase()}.` };
      }
      continue;
    }
    if (field.type === "rating") {
      const value = raw === undefined || raw === null || raw === "" ? 0 : raw;
      if (typeof value !== "number" || !Number.isInteger(value) || value < 0 || value > field.scale) {
        return { ok: false, field: field.id, message: `${field.label} is invalid.` };
      }
      if (field.required && value === 0) return { ok: false, field: field.id, message: `${field.label} is required.` };
      normalized[field.id] = value;
      continue;
    }
    if (typeof raw !== "string" && raw !== undefined && raw !== null) {
      return { ok: false, field: field.id, message: `${field.label} must be text.` };
    }
    if (
      (field.type === "shortText" || field.type === "longText") &&
      field.maxLength !== undefined &&
      typeof raw === "string" &&
      raw.length > field.maxLength
    ) {
      return {
        ok: false,
        field: field.id,
        message: `${field.label} must be ${field.maxLength} characters or fewer.`,
      };
    }
    const value = typeof raw === "string" ? raw.trim() : "";
    if (field.type === "singleChoice" && value && !field.options.some((option) => option.value === value)) {
      return { ok: false, field: field.id, message: `${field.label} contains an unknown option.` };
    }
    if (field.required && !value) return { ok: false, field: field.id, message: `${field.label} is required.` };
    normalized[field.id] = value;
  }
  return { ok: true, answers: normalized };
}

function stableValue(field: RecipeField, value: AnswerValue | undefined, labels: boolean) {
  if (field.type === "multiSelect") {
    const selected = new Set(Array.isArray(value) ? value : []);
    return field.options.filter((option) => selected.has(option.value)).map((option) => labels ? option.label : option.value).join(", ");
  }
  if (field.type === "singleChoice" && labels) {
    return field.options.find((option) => option.value === value)?.label ?? "";
  }
  return value === undefined || value === 0 ? "" : String(value);
}

export function collapseTitle(value: string) {
  return value.replace(/\s+/g, " ").trim().slice(0, 256).trim();
}

export function defaultLabels(classification: Recipe["issue"]["classification"]) {
  const labels = classification === "bug" ? ["bug"] : classification === "feature" ? ["enhancement"] : [];
  return [...labels, "bugdrop"];
}

function normalizeMultilineText(value: string) {
  let normalized = "";
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code === 0x0d) {
      normalized += "\n";
      if (value.charCodeAt(index + 1) === 0x0a) index += 1;
    } else if ((code < 0x20 && code !== 0x09 && code !== 0x0a) || code === 0x7f) {
      normalized += " ";
    } else {
      normalized += value[index];
    }
  }
  return normalized;
}

function escapeMarkdown(value: string) {
  const markdownCharacters = new Set(["\\", "`", "*", "_", "{", "}", "[", "]", "<", ">", "#", "|"]);
  return Array.from(value, (character) => markdownCharacters.has(character) ? `\\${character}` : character).join("");
}

function formatFencedBlock(value: string) {
  const runs = value.match(/`+/g);
  const length = Math.max(3, runs ? Math.max(...runs.map((run) => run.length)) + 1 : 3);
  const fence = "`".repeat(length);
  return `${fence}\n${value}\n${fence}`;
}

export function formatIssueSection(value: string, format: "text" | "quote" | "code") {
  const normalized = normalizeMultilineText(value);
  if (format === "code") return formatFencedBlock(normalized);
  const escaped = escapeMarkdown(normalized);
  return format === "quote" ? escaped.split("\n").map((line) => `> ${line}`).join("\n") : escaped;
}

export function compileIssueDraft(recipeId: RecipeId, rawAnswers: Record<string, unknown>) {
  const recipe = RECIPES[recipeId];
  const result = normalizeAnswers(recipeId, rawAnswers);
  if (!result.ok) return result;
  const answers = result.answers;
  const title = collapseTitle(recipe.issue.title.replace(/{{\s*([^{}]+?)\s*}}/g, (_, id: string) => {
    const field = recipe.fields.find((candidate) => candidate.id === id);
    return field ? stableValue(field, answers[id], false) : "";
  }));
  const sections = recipe.issue.sections.flatMap((section) => {
    const field = recipe.fields.find((candidate) => candidate.id === section.field);
    if (!field) return [];
    const empty = stableValue(field, answers[field.id], false) === "";
    if (empty && section.omitWhenEmpty) return [];
    const display = empty
      ? "Not provided."
      : section.format === "stars"
        ? `${"★".repeat(answers[field.id] as number)}${"☆".repeat((field as Extract<RecipeField, { type: "rating" }>).scale - (answers[field.id] as number))} (${answers[field.id]}/${(field as Extract<RecipeField, { type: "rating" }>).scale})`
        : stableValue(field, answers[field.id], section.format === "choice");
    const workerFormat: "text" | "quote" | "code" = section.format === "quote" || section.format === "code" ? section.format : "text";
    return [{ heading: section.heading.trim(), field: field.id, format: workerFormat, value: display }];
  });
  return {
    ok: true as const,
    draft: {
      title,
      labels: defaultLabels(recipe.issue.classification),
      sections,
      body: sections.map((section) => `## ${escapeMarkdown(section.heading)}\n\n${formatIssueSection(section.value, section.format)}`).join("\n\n"),
    },
    answers,
  };
}

export type InteractionState = { answers: Answers; status: LabStatus; attempted: boolean };
export function initialInteractionState(recipeId: RecipeId): InteractionState {
  return { answers: emptyAnswers(recipeId), status: "idle", attempted: false };
}
export function selectAnswer(state: InteractionState, field: string, value: AnswerValue): InteractionState {
  return { ...state, answers: { ...state.answers, [field]: value }, status: "idle" };
}
export function submitInteraction(recipeId: RecipeId, state: InteractionState): InteractionState | Extract<ValidationResult, { ok: false }> {
  const validation = normalizeAnswers(recipeId, state.answers);
  if (!validation.ok) return validation;
  return state.attempted
    ? { answers: validation.answers, status: "success", attempted: true }
    : { answers: validation.answers, status: "failure", attempted: true };
}
export function resetInteractionState(recipeId: RecipeId) { return initialInteractionState(recipeId); }
