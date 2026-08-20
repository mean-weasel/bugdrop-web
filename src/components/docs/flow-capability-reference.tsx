import { FLOW_CAPABILITIES } from "@/lib/flow-capabilities";

type PropertyContract = {
  readonly required: readonly string[];
  readonly optional: readonly string[];
};

function Tokens({ values }: { values: readonly (string | number)[] }) {
  return (
    <span className="inline-flex flex-wrap gap-1.5">
      {values.map((value) => (
        <code
          className="rounded bg-bg-elevated px-1.5 py-0.5 font-mono text-xs text-accent-cyan"
          key={value}
        >
          {String(value)}
        </code>
      ))}
    </span>
  );
}

function Properties({ contract }: { contract: PropertyContract }) {
  return (
    <div className="space-y-1">
      <div>
        <span className="mr-2 text-xs font-medium uppercase tracking-wide text-text-muted">
          Required
        </span>
        {contract.required.length > 0 ? (
          <Tokens values={contract.required} />
        ) : (
          "None"
        )}
      </div>
      <div>
        <span className="mr-2 text-xs font-medium uppercase tracking-wide text-text-muted">
          Optional
        </span>
        {contract.optional.length > 0 ? (
          <Tokens values={contract.optional} />
        ) : (
          "None"
        )}
      </div>
    </div>
  );
}

function PublicType({ declaration }: { declaration: string }) {
  return (
    <code className="whitespace-pre-wrap break-all font-mono text-xs text-accent-cyan">
      {declaration}
    </code>
  );
}

const UNEXPORTED_STRUCTURAL_HELPERS = new Set(["BaseScreen", "BaseField"]);

function DeclarationKind({ name }: { name: string }) {
  if (UNEXPORTED_STRUCTURAL_HELPERS.has(name)) {
    return (
      <span className="mb-1 block text-xs font-medium">
        Unexported structural helper
      </span>
    );
  }
  if (name === "BugDropPublicAPI.registerFlow") {
    return (
      <span className="mb-1 block text-xs font-medium">
        Exported public API member
      </span>
    );
  }
  return (
    <span className="mb-1 block text-xs font-medium">Exported public type</span>
  );
}

function ReferenceTable({
  caption,
  rows,
}: {
  caption: string;
  rows: readonly (readonly [string, React.ReactNode])[];
}) {
  return (
    <div className="mb-6 overflow-x-auto" tabIndex={0}>
      <table className="w-full border-collapse overflow-hidden rounded-xl border border-border bg-bg-surface">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            <th className="bg-bg-elevated p-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
              Capability
            </th>
            <th className="bg-bg-elevated p-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
              Released contract
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label}>
              <th className="border-t border-border p-3 text-left align-top text-sm font-medium text-text-primary">
                {label}
              </th>
              <td className="border-t border-border p-3 text-sm text-text-subtle">
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export type FlowCapabilityReferenceSection =
  | "all"
  | "types"
  | "fields-and-screens"
  | "branching-and-output"
  | "presentation-and-motion";

export function FlowCapabilityReference({
  section = "all",
}: {
  section?: FlowCapabilityReferenceSection;
} = {}) {
  const capability = FLOW_CAPABILITIES;
  const showTypes = section === "all" || section === "types";
  const showFieldsAndScreens =
    section === "all" || section === "fields-and-screens";
  const showBranching = section === "all" || section === "branching-and-output";
  const showPresentation =
    section === "all" || section === "presentation-and-motion";

  return (
    <div
      data-flow-capability-reference
      data-version-key={capability.versionKey}
    >
      <aside className="mb-8 rounded-xl border border-border bg-bg-surface p-4 text-sm text-text-subtle">
        <p className="mb-2 font-medium text-text-primary">
          Released contract: {capability.release}
        </p>
        <p className="mb-1 font-mono text-xs break-all">
          Commit {capability.targetCommit}
        </p>
        <p className="font-mono text-xs break-all">
          Runtime SHA-256 {capability.runtime.sha256}
        </p>
      </aside>

      {showTypes && (
        <>
          <h2
            id="configuration-contract"
            className="mt-8 mb-3 text-2xl font-semibold text-text-primary"
          >
            Configuration contract
          </h2>
          <ReferenceTable
            caption="Top-level flow configuration"
            rows={[
              [
                "configVersion",
                <Tokens
                  key="config-version"
                  values={capability.configVersion}
                />,
              ],
              [
                "FlowConfig properties",
                <Properties
                  key="config-properties"
                  contract={capability.configProperties}
                />,
              ],
              [
                "FlowForm properties",
                <Properties
                  key="form-properties"
                  contract={capability.forms.properties}
                />,
              ],
            ]}
          />
          <p className="mb-3 text-sm text-text-subtle">
            Exported public types are labeled separately from the unexported
            structural helpers that their complete declarations extend.
          </p>
          <ReferenceTable
            caption="Canonical public value types"
            rows={Object.entries(capability.publicContract).map(
              ([name, declaration]) => [
                name,
                <div key={name}>
                  <DeclarationKind name={name} />
                  <PublicType declaration={declaration} />
                </div>,
              ],
            )}
          />
        </>
      )}

      {showFieldsAndScreens && (
        <>
          <h2
            id="fields-and-screens"
            className="mt-8 mb-3 text-2xl font-semibold text-text-primary"
          >
            {section === "fields-and-screens"
              ? "Field and screen properties"
              : "Fields and screens"}
          </h2>
          <p className="mb-4 text-text-subtle">
            Fields live in reusable forms. Screens arrange messages, forms, and
            screenshot capture into the user journey.
          </p>
          <ReferenceTable
            caption="Released fields"
            rows={Object.entries(capability.fields.byType).map(
              ([type, contract]) => [
                `field.type=${type}`,
                <Properties key={type} contract={contract} />,
              ],
            )}
          />
          <ReferenceTable
            caption="Released field option values"
            rows={[
              [
                "layout.span",
                <Tokens
                  key="layout-span"
                  values={capability.fields.layoutSpans}
                />,
              ],
              [
                "rating.scale",
                <Tokens
                  key="rating-scale"
                  values={capability.fields.ratingScales}
                />,
              ],
              [
                "rating.icon",
                <Tokens
                  key="rating-icon"
                  values={capability.fields.ratingIcons}
                />,
              ],
              [
                "singleChoice.display",
                <Tokens
                  key="choice-display"
                  values={capability.fields.singleChoiceDisplays}
                />,
              ],
              [
                "singleChoice option",
                <Properties
                  key="option-shape"
                  contract={capability.fields.optionShape}
                />,
              ],
            ]}
          />
          <ReferenceTable
            caption="Released field limits and defaults"
            rows={[
              [
                "minLength",
                `${capability.fields.constraints.text.minLength.minimum}–${capability.fields.constraints.text.minLength.maximum}; default ${capability.fields.constraints.text.minLength.default}`,
              ],
              [
                "maxLength",
                `${capability.fields.constraints.text.maxLength.minimum}–${capability.fields.constraints.text.maxLength.maximum}; defaults: shortText ${capability.fields.constraints.text.maxLength.defaults.shortText}, longText ${capability.fields.constraints.text.maxLength.defaults.longText}`,
              ],
              [
                "longText.rows",
                `${capability.fields.constraints.text.longTextRows.minimum}–${capability.fields.constraints.text.longTextRows.maximum}`,
              ],
              [
                "singleChoice.options",
                `${capability.fields.constraints.singleChoiceOptions.minimum}–${capability.fields.constraints.singleChoiceOptions.maximum}`,
              ],
              [
                "attachments.maxFiles",
                `${capability.fields.constraints.attachments.maxFiles.minimum}–${capability.fields.constraints.attachments.maxFiles.maximum}; default ${capability.fields.constraints.attachments.maxFiles.default}`,
              ],
              [
                "attachments.maxFileSize",
                `${capability.fields.constraints.attachments.maxFileSizeBytes.minimum}–${capability.fields.constraints.attachments.maxFileSizeBytes.maximum} bytes; default ${capability.fields.constraints.attachments.maxFileSizeBytes.default} bytes`,
              ],
              [
                "attachments.accept entries",
                `${capability.fields.constraints.attachments.acceptCount.minimum}–${capability.fields.constraints.attachments.acceptCount.maximum}`,
              ],
              [
                "attachments.accept values",
                <Tokens
                  key="attachment-mime-types"
                  values={
                    capability.fields.constraints.attachments.acceptedMimeTypes
                  }
                />,
              ],
            ]}
          />
          <ReferenceTable
            caption="Released screens"
            rows={Object.entries(capability.screens.byType).map(
              ([type, contract]) => [
                `screen.type=${type}`,
                <Properties key={type} contract={contract} />,
              ],
            )}
          />
          <ReferenceTable
            caption="Released screen option values"
            rows={[
              [
                "screenshot.mode",
                <Tokens
                  key="screenshot-mode"
                  values={capability.screens.screenshotModes}
                />,
              ],
            ]}
          />
        </>
      )}

      {showBranching && (
        <>
          <h2
            id="branching"
            className="mt-8 mb-3 text-2xl font-semibold text-text-primary"
          >
            Branching and context
          </h2>
          <p className="mb-4 text-text-subtle">
            A screen&apos;s optional <code>when</code> condition can compare an
            answer or opening context. Conditions compose recursively with the
            released logical branches below.
          </p>
          <ReferenceTable
            caption="Released condition branches"
            rows={Object.entries(capability.conditions.branches).map(
              ([branch, contract]) => [
                branch,
                <Properties key={branch} contract={contract} />,
              ],
            )}
          />
          <ReferenceTable
            caption="Condition and context values"
            rows={[
              [
                "equals scalar types",
                <Tokens
                  key="scalar-types"
                  values={capability.conditions.scalarTypes}
                />,
              ],
              [
                "context value types",
                <Tokens
                  key="context-types"
                  values={capability.conditions.contextValueTypes}
                />,
              ],
              [
                "recursive branches",
                <Tokens
                  key="recursive-branches"
                  values={capability.conditions.recursiveBranches}
                />,
              ],
            ]}
          />
        </>
      )}

      {showPresentation && (
        <>
          <h2
            id="presentation-and-appearance"
            className="mt-8 mb-3 text-2xl font-semibold text-text-primary"
          >
            Presentation and appearance
          </h2>
          <ReferenceTable
            caption="Released presentation and appearance controls"
            rows={[
              [
                "presentation properties",
                <Properties
                  key="presentation-properties"
                  contract={capability.presentation.properties}
                />,
              ],
              [
                "presentation.kind",
                <Tokens
                  key="presentation-kind"
                  values={capability.presentation.kinds}
                />,
              ],
              [
                "presentation.size",
                <Tokens
                  key="presentation-size"
                  values={capability.presentation.sizes}
                />,
              ],
              [
                "presentation.columns",
                <Tokens
                  key="presentation-columns"
                  values={capability.presentation.columns}
                />,
              ],
              [
                "appearance properties",
                <Properties
                  key="appearance-properties"
                  contract={capability.appearance.properties}
                />,
              ],
              [
                "appearance.theme",
                <Tokens
                  key="appearance-theme"
                  values={capability.appearance.themes}
                />,
              ],
              [
                "appearance.density",
                <Tokens
                  key="appearance-density"
                  values={capability.appearance.densities}
                />,
              ],
              [
                "content properties",
                <Properties
                  key="content-properties"
                  contract={capability.content.properties}
                />,
              ],
            ]}
          />

          <h2
            id="screen-transitions"
            className="mt-8 mb-3 text-2xl font-semibold text-text-primary"
          >
            Screen transitions
          </h2>
          <ReferenceTable
            caption="Released screen transition controls"
            rows={[
              [
                "kind",
                <Tokens
                  key="transition-kind"
                  values={capability.transitions.kinds}
                />,
              ],
              [
                "built-in kind",
                <Tokens
                  key="built-in-kind"
                  values={capability.transitions.builtInKinds}
                />,
              ],
              [
                "easing",
                <Tokens
                  key="transition-easing"
                  values={capability.transitions.easings}
                />,
              ],
              [
                "direction",
                <Tokens
                  key="transition-direction"
                  values={capability.transitions.directions}
                />,
              ],
              [
                "custom motion",
                <Properties
                  key="custom-motion"
                  contract={capability.transitions.motionProperties}
                />,
              ],
              [
                "custom frame",
                <Properties
                  key="custom-frame"
                  contract={capability.transitions.frameProperties}
                />,
              ],
              [
                "immediate replacement",
                <Tokens
                  key="immediate-when"
                  values={capability.transitions.immediateWhen}
                />,
              ],
            ]}
          />
          <ReferenceTable
            caption="Required screen transition branches"
            rows={Object.entries(capability.transitions.branches).map(
              ([branch, contract]) => [
                branch,
                <Properties key={branch} contract={contract} />,
              ],
            )}
          />
          <ReferenceTable
            caption="Transition duration defaults"
            rows={Object.entries(capability.transitions.defaultDurationMs).map(
              ([kind, duration]) => [
                `${kind} default`,
                <code key={kind}>{duration}ms</code>,
              ],
            )}
          />
          <p className="mb-4 text-text-subtle">
            <code>durationMs</code> must be an integer from{" "}
            {capability.transitions.durationMs.minimum} to{" "}
            {capability.transitions.durationMs.maximum} milliseconds. Custom
            motion defaults to{" "}
            <code>{capability.transitions.customEasingDefault}</code> easing. On
            Back navigation, the configured backward motion is used; built-in
            slides also follow navigation direction. Reduced-motion preference
            replaces screen motion immediately.
          </p>
          <ReferenceTable
            caption="Custom transition frame bounds"
            rows={Object.entries(capability.transitions.frameBounds).map(
              ([property, bounds]) => [
                property,
                <span key={property}>
                  {bounds.minimum} to {bounds.maximum}; default{" "}
                  {
                    capability.transitions.frameDefaults[
                      property as keyof typeof capability.transitions.frameDefaults
                    ]
                  }
                </span>,
              ],
            )}
          />
        </>
      )}

      {showBranching && (
        <>
          <h2
            id="issue-and-evidence"
            className="mt-8 mb-3 text-2xl font-semibold text-text-primary"
          >
            Issue output and evidence
          </h2>
          <ReferenceTable
            caption="Released issue and evidence controls"
            rows={[
              [
                "issue properties",
                <Properties
                  key="issue-properties"
                  contract={capability.issue.properties}
                />,
              ],
              [
                "issue.classification",
                <Tokens
                  key="issue-classification"
                  values={capability.issue.classifications}
                />,
              ],
              [
                "answer section",
                <Properties
                  key="answer-section"
                  contract={capability.issue.sections.answer.properties}
                />,
              ],
              [
                "answer format",
                <Tokens
                  key="answer-format"
                  values={capability.issue.sections.answer.formats}
                />,
              ],
              [
                "context section",
                <Properties
                  key="context-section"
                  contract={capability.issue.sections.context.properties}
                />,
              ],
              [
                "context format",
                <Tokens
                  key="context-format"
                  values={capability.issue.sections.context.formats}
                />,
              ],
              [
                "evidence properties",
                <Properties
                  key="evidence-properties"
                  contract={capability.evidence.properties}
                />,
              ],
              [
                "submitter mapping",
                <Properties
                  key="submitter-properties"
                  contract={capability.evidence.submitterProperties}
                />,
              ],
            ]}
          />

          <h2
            id="lifecycle"
            className="mt-8 mb-3 text-2xl font-semibold text-text-primary"
          >
            Registration and lifecycle
          </h2>
          <ReferenceTable
            caption="Released registration and lifecycle contract"
            rows={[
              [
                "registration",
                <code key="registration">
                  {capability.registration.method}(config:{" "}
                  {capability.registration.parameterType}) →{" "}
                  {capability.registration.returnType}
                </code>,
              ],
              [
                "FlowHandle",
                <Properties
                  key="handle-properties"
                  contract={capability.lifecycle.handleProperties}
                />,
              ],
              [
                "open options",
                <Properties
                  key="open-options"
                  contract={capability.lifecycle.openOptionProperties}
                />,
              ],
              [
                "OpenedFlow",
                <Properties
                  key="opened-properties"
                  contract={capability.lifecycle.openedProperties}
                />,
              ],
              [
                "submission result",
                <Properties
                  key="result-properties"
                  contract={capability.lifecycle.submissionResultProperties}
                />,
              ],
              ...Object.entries(capability.lifecycle.outcomeBranches).map(
                ([status, contract]) =>
                  [
                    `outcome.status=${status}`,
                    <Properties key={status} contract={contract} />,
                  ] as const,
              ),
            ]}
          />

          <h2
            id="scope-boundaries"
            className="mt-8 mb-3 text-2xl font-semibold text-text-primary"
          >
            Scope boundaries
          </h2>
          <p className="mb-4 text-text-subtle">
            These values belong to a different public contract or are not
            released Flow capabilities. They are listed here to prevent
            accidental cross-over.
          </p>
          <ReferenceTable
            caption="Capabilities excluded from the released Flow contract"
            rows={[
              [
                "Variant-only",
                <Tokens
                  key="variant-only"
                  values={capability.exclusions.variantOnly}
                />,
              ],
              [
                "Unreleased",
                <Tokens
                  key="unreleased"
                  values={capability.exclusions.unreleased}
                />,
              ],
            ]}
          />
        </>
      )}
    </div>
  );
}
