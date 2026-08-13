export const LAB_CONTEXT_SENTINEL = "public-flow-lab-private-context";

export const DEFAULT_SHAPED_FLOW_CONFIG = {
  configVersion: 1,
  id: "lab-default-shaped-flow",
  presentation: { kind: "modal" },
  forms: [
    {
      id: "details",
      title: "Tell us what happened",
      fields: [
        { id: "summary", type: "shortText", label: "Title", required: true },
        { id: "description", type: "longText", label: "Description" },
        { id: "attachments", type: "attachments", label: "Attachments" },
        { id: "send-logs", type: "checkbox", label: "Include console logs" },
        { id: "name", type: "shortText", label: "Name" },
        { id: "email", type: "shortText", label: "Email" },
      ],
    },
  ],
  screens: [
    {
      id: "welcome",
      type: "message",
      title: "Share feedback",
      when: { context: "lab_context", equals: LAB_CONTEXT_SENTINEL },
    },
    { id: "details-screen", type: "form", form: "details" },
    { id: "screenshot", type: "screenshot", mode: "optional" },
  ],
  issue: {
    classification: "bug",
    title: "{{details.summary}}",
    sections: [
      {
        heading: "Description",
        answer: "details.description",
        omitWhenEmpty: true,
      },
    ],
  },
  evidence: {
    attachments: "details.attachments",
    sendConsoleLogs: "details.send-logs",
    submitter: { name: "details.name", email: "details.email" },
  },
} as const;

const NEEDS_TRIAGE_EVIDENCE = {
  any: [
    { answer: "triage.kind", equals: "bug" },
    { answer: "triage.rating", equals: 1 },
  ],
} as const;

export const PRODUCT_TRIAGE_FLOW_CONFIG = {
  configVersion: 1,
  id: "lab-product-triage-flow",
  presentation: { kind: "modal" },
  forms: [
    {
      id: "triage",
      title: "Classify your feedback",
      fields: [
        {
          id: "kind",
          type: "singleChoice",
          label: "Type",
          required: true,
          options: [
            { value: "bug", label: "Bug" },
            { value: "idea", label: "Idea" },
          ],
        },
        { id: "rating", type: "rating", label: "Experience", required: true },
        { id: "summary", type: "shortText", label: "Summary", required: true },
      ],
    },
    {
      id: "detail",
      title: "Add diagnostic detail",
      fields: [{ id: "steps", type: "longText", label: "Steps to reproduce" }],
    },
  ],
  screens: [
    {
      id: "intro",
      type: "message",
      title: "Help us prioritize",
      when: { context: "lab_context", equals: LAB_CONTEXT_SENTINEL },
    },
    { id: "triage-screen", type: "form", form: "triage" },
    { id: "detail-screen", type: "form", form: "detail", when: NEEDS_TRIAGE_EVIDENCE },
    {
      id: "screenshot",
      type: "screenshot",
      mode: "optional",
      when: NEEDS_TRIAGE_EVIDENCE,
    },
  ],
  issue: {
    classification: "bug",
    title: "{{triage.summary}}",
    sections: [
      { heading: "Type", answer: "triage.kind", format: "choice" },
      { heading: "Experience", answer: "triage.rating", format: "stars" },
      { heading: "Steps", answer: "detail.steps", omitWhenEmpty: true },
    ],
  },
} as const;
