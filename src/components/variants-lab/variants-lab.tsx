"use client";

import { useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Check,
  FlaskConical,
  RotateCcw,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  compileIssueDraft,
  FAILURE_MESSAGE,
  initialInteractionState,
  LAB_DISCLOSURE,
  PRIMITIVE_COPY,
  PRIMITIVE_IDS,
  RECIPES,
  RECIPE_IDS,
  resetInteractionState,
  selectAnswer,
  submitInteraction,
  type AnswerValue,
  type InteractionState,
  type RecipeField,
  type RecipeId,
} from "./model";
import styles from "./variants-lab.module.css";
import { PublicFlowLab } from "./public-flow-lab";

export function VariantsLab() {
  const [recipeId, setRecipeId] = useState<RecipeId>("bugReport");
  const [interaction, setInteraction] = useState<InteractionState>(() =>
    initialInteractionState("bugReport"),
  );
  const [validationField, setValidationField] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const modalTriggerRef = useRef<HTMLButtonElement>(null);
  const workspaceRef = useRef<HTMLHeadingElement>(null);
  const fieldRefs = useRef<Record<string, HTMLElement | null>>({});
  const successRef = useRef<HTMLDivElement>(null);
  const recipe = RECIPES[recipeId];
  const issue = useMemo(
    () => compileIssueDraft(recipeId, interaction.answers),
    [recipeId, interaction.answers],
  );

  function chooseRecipe(next: RecipeId) {
    if (next === recipeId) return;
    dialogRef.current?.close();
    setRecipeId(next);
    setInteraction(initialInteractionState(next));
    setValidationField(null);
    requestAnimationFrame(() => workspaceRef.current?.focus());
  }

  function update(field: string, value: AnswerValue) {
    setInteraction((current) => selectAnswer(current, field, value));
    setValidationField(null);
  }

  function submit() {
    const next = submitInteraction(recipeId, interaction);
    if (!("status" in next)) {
      setValidationField(next.field);
      fieldRefs.current[next.field]?.focus();
      return;
    }
    setValidationField(null);
    setInteraction(next);
    if (next.status === "success") {
      requestAnimationFrame(() => successRef.current?.focus());
    }
  }

  function reset() {
    setInteraction(resetInteractionState(recipeId));
    setValidationField(null);
    requestAnimationFrame(() =>
      fieldRefs.current[recipe.fields[0].id]?.focus(),
    );
  }

  function closeDialog() {
    dialogRef.current?.close();
    modalTriggerRef.current?.focus();
  }

  function renderField(field: RecipeField) {
    const invalid = validationField === field.id;
    const disabled = interaction.status === "success";
    const errorId = `${recipeId}-${field.id}-error`;
    if (field.type === "shortText" || field.type === "longText") {
      const shared = {
        ref: (element: HTMLInputElement | HTMLTextAreaElement | null) => {
          fieldRefs.current[field.id] = element;
        },
        value: String(interaction.answers[field.id] ?? ""),
        placeholder: field.placeholder,
        maxLength: field.maxLength,
        disabled,
        "aria-invalid": invalid || undefined,
        "aria-describedby": invalid ? errorId : undefined,
        onChange: (
          event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        ) => update(field.id, event.target.value),
      };
      return (
        <label className={styles.textField} key={field.id}>
          <span>
            {field.label}
            {field.required ? <b>Required</b> : null}
          </span>
          {field.type === "longText" ? (
            <textarea {...shared} />
          ) : (
            <input {...shared} />
          )}
          {invalid ? (
            <em id={errorId}>
              Complete {field.label.toLowerCase()} before submitting.
            </em>
          ) : null}
        </label>
      );
    }
    if (field.type === "rating") {
      const selectedRating: number =
        typeof interaction.answers[field.id] === "number"
          ? (interaction.answers[field.id] as number)
          : 0;
      const ratingScaleId = `${recipeId}-${field.id}-scale`;
      return (
        <fieldset
          className={styles.fieldset}
          key={field.id}
          aria-invalid={invalid || undefined}
          aria-describedby={`${ratingScaleId}${invalid ? ` ${errorId}` : ""}`}
        >
          <legend>
            {field.label}
            {field.required ? <b>Required</b> : null}
          </legend>
          <div className={styles.rating}>
            {Array.from({ length: field.scale }, (_, index) => index + 1).map(
              (value) => (
                <label key={value} data-filled={value <= selectedRating}>
                  <input
                    ref={(element) => {
                      if (value === 1) fieldRefs.current[field.id] = element;
                    }}
                    type="radio"
                    name={`${recipeId}-${field.id}`}
                    aria-label={`${value} of ${field.scale}`}
                    checked={interaction.answers[field.id] === value}
                    disabled={disabled}
                    onChange={() => update(field.id, value)}
                  />
                  <span aria-hidden="true">★</span>
                  <i>{value}</i>
                </label>
              ),
            )}
          </div>
          <div id={ratingScaleId} className={styles.ratingScale}>
            <span>{field.lowLabel}</span>
            <span>{field.highLabel}</span>
          </div>
          {invalid ? (
            <em id={errorId}>Choose a rating before submitting.</em>
          ) : null}
        </fieldset>
      );
    }
    if (field.type === "singleChoice") {
      return (
        <fieldset
          className={styles.fieldset}
          key={field.id}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? errorId : undefined}
        >
          <legend>
            {field.label}
            {field.required ? <b>Required</b> : null}
          </legend>
          <div className={styles.choiceList}>
            {field.options.map((option, index) => (
              <label key={option.value}>
                <input
                  ref={(element) => {
                    if (index === 0) fieldRefs.current[field.id] = element;
                  }}
                  type="radio"
                  name={`${recipeId}-${field.id}`}
                  value={option.value}
                  checked={interaction.answers[field.id] === option.value}
                  disabled={disabled}
                  onChange={() => update(field.id, option.value)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
          {invalid ? (
            <em id={errorId}>Choose one option before submitting.</em>
          ) : null}
        </fieldset>
      );
    }
    const selected = Array.isArray(interaction.answers[field.id])
      ? (interaction.answers[field.id] as string[])
      : [];
    return (
      <fieldset
        className={styles.fieldset}
        key={field.id}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? errorId : undefined}
      >
        <legend>
          {field.label}
          {field.required ? <b>Required</b> : null}
        </legend>
        <div className={styles.choiceList}>
          {field.options.map((option, index) => (
            <label key={option.value}>
              <input
                ref={(element) => {
                  if (index === 0) fieldRefs.current[field.id] = element;
                }}
                type="checkbox"
                value={option.value}
                checked={selected.includes(option.value)}
                disabled={disabled}
                onChange={(event) =>
                  update(
                    field.id,
                    event.target.checked
                      ? [...selected, option.value]
                      : selected.filter((value) => value !== option.value),
                  )
                }
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        {invalid ? (
          <em id={errorId}>Choose at least one option before submitting.</em>
        ) : null}
      </fieldset>
    );
  }

  const form = (
    <div className={styles.formBody}>
      {recipe.fields.map(renderField)}
      {interaction.status === "failure" ? (
        <div className={styles.failure} role="alert">
          <strong>{FAILURE_MESSAGE}</strong>
          <span>Retry the explicit submit to preview success.</span>
        </div>
      ) : null}
      {interaction.status === "success" ? (
        <div
          ref={successRef}
          className={styles.success}
          role="status"
          tabIndex={-1}
        >
          <Check aria-hidden="true" />
          <div>
            <strong>{recipe.content.successTitle}</strong>
            <span>{recipe.content.successMessage}</span>
          </div>
        </div>
      ) : null}
      <div className={styles.actions}>
        {interaction.status !== "success" ? (
          <button
            type="button"
            className={styles.primaryButton}
            onClick={submit}
          >
            {interaction.status === "failure"
              ? "Retry local preview"
              : recipe.content.submitLabel}
          </button>
        ) : null}
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={reset}
        >
          <RotateCcw aria-hidden="true" /> Reset recipe
        </button>
      </div>
    </div>
  );

  return (
    <main className={styles.lab}>
      <header className={styles.hero}>
        <span className={styles.labTag}>
          <FlaskConical aria-hidden="true" /> Composable feedback
        </span>
        <h1>Build feedback your way.</h1>
        <p>
          Choose from five building blocks and try a few useful combinations.
        </p>
      </header>

      <section className={styles.explorer} aria-labelledby="blocks-heading">
        <header className={styles.sectionHeader}>
          <h2 id="blocks-heading">Start with a building block</h2>
        </header>
        <ul className={styles.primitiveList}>
          {PRIMITIVE_IDS.map((primitive) => (
            <li key={primitive}>
              <strong>{PRIMITIVE_COPY[primitive].label}</strong>
              <span>{PRIMITIVE_COPY[primitive].note}</span>
            </li>
          ))}
        </ul>
        <div className={styles.recipePicker}>
          <span>Try a combination</span>
          <div className={styles.recipeTabs}>
            {RECIPE_IDS.map((id) => (
              <button
                key={id}
                type="button"
                aria-pressed={recipeId === id}
                onClick={() => chooseRecipe(id)}
              >
                <strong>{RECIPES[id].name}</strong>
                <small>
                  {RECIPES[id].fields
                    .map((field) => PRIMITIVE_COPY[field.type].label)
                    .join(" + ")}
                </small>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.workspace} aria-labelledby="workspace-heading">
        <header className={styles.workspaceHeader}>
          <div>
            <span>Live example</span>
            <h2 id="workspace-heading" ref={workspaceRef} tabIndex={-1}>
              {recipe.name}
            </h2>
          </div>
          <p className={styles.disclosure}>
            <ShieldCheck aria-hidden="true" /> {LAB_DISCLOSURE}
          </p>
        </header>
        <div className={styles.workspaceGrid}>
          <div className={styles.surface}>
            <div className={styles.widget}>
              <p className={styles.eyebrow}>{recipe.eyebrow}</p>
              <h3>{recipe.content.title}</h3>
              <p className={styles.prompt}>{recipe.content.description}</p>
              {recipe.presentation.kind === "modal" ? (
                <button
                  ref={modalTriggerRef}
                  type="button"
                  className={styles.primaryButton}
                  onClick={() => dialogRef.current?.showModal()}
                >
                  Open feedback recipe
                </button>
              ) : (
                form
              )}
            </div>
          </div>
          <aside
            className={styles.issuePreview}
            aria-label="Local GitHub Issue preview"
          >
            <div className={styles.previewHeader}>
              <div>
                <span>Local GitHub Issue</span>
                <strong>Issue preview</strong>
              </div>
              <b>Not created</b>
            </div>
            {issue.ok ? (
              <>
                <h3>{issue.draft.title}</h3>
                <div className={styles.labels}>
                  {issue.draft.labels.map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </div>
                <pre>{issue.draft.body}</pre>
                <small>Local preview only — nothing was submitted.</small>
              </>
            ) : (
              <div className={styles.previewEmpty}>
                <strong>Complete the required blocks</strong>
                <span>The Issue preview will compile here as you answer.</span>
              </div>
            )}
          </aside>
        </div>
      </section>

      {process.env.NODE_ENV === "development" ? <PublicFlowLab /> : null}

      <section className={styles.requestBlock}>
        <div>
          <h2>Missing a building block?</h2>
          <p>Tell us what feedback experience your product needs.</p>
        </div>
        <a href="https://github.com/mean-weasel/bugdrop/issues/new">
          Request one on GitHub <ArrowUpRight aria-hidden="true" />
        </a>
      </section>

      {recipe.presentation.kind === "modal" ? (
        <dialog
          ref={dialogRef}
          className={`${styles.dialog} ${styles.surface}`}
          aria-labelledby={`${recipeId}-dialog-title`}
          onClose={() => modalTriggerRef.current?.focus()}
        >
          <header>
            <div>
              <p className={styles.eyebrow}>{recipe.eyebrow}</p>
              <h2 id={`${recipeId}-dialog-title`}>{recipe.content.title}</h2>
            </div>
            <button
              type="button"
              className={styles.iconButton}
              aria-label="Close feedback recipe"
              onClick={closeDialog}
            >
              <X aria-hidden="true" />
            </button>
          </header>
          <p className={styles.prompt}>{recipe.content.description}</p>
          {form}
        </dialog>
      ) : null}
    </main>
  );
}
