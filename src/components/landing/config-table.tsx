import { SectionHeading } from "./section-heading";

interface ConfigRow { attribute: string; values: string; defaultVal: string; }

const coreConfig: ConfigRow[] = [
  { attribute: "data-repo", values: "owner/repo", defaultVal: "required" },
  { attribute: "data-theme", values: "light, dark, auto", defaultVal: "auto" },
  { attribute: "data-position", values: "bottom-right, bottom-left", defaultVal: "bottom-right" },
  { attribute: "data-welcome", values: "once, always, false/never", defaultVal: "once" },
  { attribute: "data-color", values: "Hex color (e.g. #FF6B35)", defaultVal: "#14b8a6" },
  { attribute: "data-button-dismissible", values: "true, false", defaultVal: "false" },
  { attribute: "data-button", values: "true, false", defaultVal: "true" },
  { attribute: "data-label", values: 'Any string (e.g. "?", "Report Issue")', defaultVal: "Feedback" },
];

const stylingConfig: ConfigRow[] = [
  { attribute: "data-font", values: "inherit, or font-family string", defaultVal: "Space Grotesk" },
  { attribute: "data-radius", values: "Pixels (e.g. 0, 8, 16)", defaultVal: "6" },
  { attribute: "data-bg", values: "CSS color (e.g. #fffef0)", defaultVal: "theme default" },
  { attribute: "data-text", values: "CSS color (e.g. #1a1a1a)", defaultVal: "theme default" },
  { attribute: "data-border-width", values: "Pixels (e.g. 4)", defaultVal: "1" },
  { attribute: "data-border-color", values: "CSS color", defaultVal: "theme default" },
  { attribute: "data-shadow", values: "soft, hard, none", defaultVal: "soft" },
];

function Table({ rows }: { rows: ConfigRow[] }) {
  return (
    <table className="w-full border-collapse bg-bg-surface rounded-2xl overflow-hidden border border-border">
      <thead>
        <tr>
          <th className="bg-bg-elevated text-xs font-semibold tracking-wider uppercase text-text-muted p-4 text-left">Attribute</th>
          <th className="bg-bg-elevated text-xs font-semibold tracking-wider uppercase text-text-muted p-4 text-left">Values</th>
          <th className="bg-bg-elevated text-xs font-semibold tracking-wider uppercase text-text-muted p-4 text-left">Default</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.attribute} className="border-b border-border last:border-b-0">
            <td className="p-4 text-sm text-text-subtle"><code className="font-mono text-[0.85em] bg-bg-deep px-2 py-0.5 rounded text-accent-cyan">{row.attribute}</code></td>
            <td className="p-4 text-sm text-text-subtle">{row.values}</td>
            <td className="p-4 text-sm text-text-subtle">{row.defaultVal}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function ConfigTable() {
  return (
    <section className="mb-20">
      <SectionHeading>Configuration</SectionHeading>
      <Table rows={coreConfig} />
      <h3 className="mt-8 mb-3 text-lg text-text-primary">Styling</h3>
      <Table rows={stylingConfig} />
      <p className="text-text-muted text-sm mt-4">
        See the{" "}
        <a href="https://github.com/mean-weasel/bugdrop#readme" target="_blank" rel="noopener noreferrer" className="text-accent-cyan no-underline hover:underline">full documentation</a>{" "}
        for all options including JavaScript API, submitter info collection, CI testing, and version pinning.
      </p>
    </section>
  );
}
