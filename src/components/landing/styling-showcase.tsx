import { SectionHeading } from "./section-heading";

interface ThemePreview {
  label: string;
  containerStyle: React.CSSProperties;
  buttonStyle: React.CSSProperties;
  formStyle: React.CSSProperties;
  headerStyle: React.CSSProperties;
  inputStyle: React.CSSProperties;
  submitStyle: React.CSSProperties;
  buttonText: string;
}

const themes: ThemePreview[] = [
  {
    label: "Dark / Enterprise",
    containerStyle: { background: "#0c1f2e", border: "1px solid #1a3a4a" },
    buttonStyle: { background: "#f59e0b", color: "#0f172a", fontFamily: "'Source Sans 3', system-ui, sans-serif", fontWeight: 600, boxShadow: "0 4px 12px rgba(245,158,11,0.3)" },
    formStyle: { background: "#0a1929", border: "1px solid #1a3a4a", fontFamily: "'Source Sans 3', system-ui, sans-serif" },
    headerStyle: { color: "#e2e8f0" },
    inputStyle: { background: "#0c1f2e", border: "1px solid #1a3a4a", color: "#64748b" },
    submitStyle: { background: "#f59e0b", color: "#0f172a" },
    buttonText: "🐛 Feedback",
  },
  {
    label: "Elegant / Serif",
    containerStyle: { background: "#fafafa", border: "1px solid #e5e5e5" },
    buttonStyle: { background: "#c5a55a", color: "#fff", fontFamily: "Georgia, serif", fontWeight: 600, boxShadow: "0 4px 12px rgba(197,165,90,0.3)" },
    formStyle: { background: "#fff", border: "1px solid #e5e5e5", fontFamily: "Georgia, serif" },
    headerStyle: { color: "#1a1a1a" },
    inputStyle: { background: "#fafafa", border: "1px solid #e5e5e5", color: "#999" },
    submitStyle: { background: "#c5a55a", color: "#fff" },
    buttonText: "🐛 Feedback",
  },
  {
    label: "Bold / Brutalist",
    containerStyle: { background: "#fffef0", border: "4px solid #1a1a1a", borderRadius: "0", boxShadow: "6px 6px 0 #1a1a1a" },
    buttonStyle: { background: "#e53935", color: "#fffef0", fontWeight: 700, border: "4px solid #1a1a1a", borderRadius: "0", boxShadow: "4px 4px 0 #1a1a1a" },
    formStyle: { background: "#fffef0", border: "4px solid #1a1a1a", borderRadius: "0" },
    headerStyle: { color: "#1a1a1a", fontWeight: 700 },
    inputStyle: { background: "#fffef0", border: "4px solid #1a1a1a", borderRadius: "0", color: "#888" },
    submitStyle: { background: "#e53935", color: "#fffef0", borderRadius: "0", border: "4px solid #1a1a1a" },
    buttonText: "Feedback",
  },
  {
    label: "Minimal / Clean",
    containerStyle: { background: "#fff", border: "1px solid #e5e7eb" },
    buttonStyle: { background: "#111", color: "#fff", fontFamily: "system-ui, sans-serif", fontWeight: 500 },
    formStyle: { background: "#fff", border: "1px solid #e5e7eb", fontFamily: "system-ui, sans-serif" },
    headerStyle: { color: "#111" },
    inputStyle: { background: "#f9fafb", border: "1px solid #e5e7eb", color: "#9ca3af" },
    submitStyle: { background: "#111", color: "#fff", borderRadius: "8px" },
    buttonText: "?",
  },
];

export function StylingShowcase() {
  return (
    <section className="mb-20 animate-fade-up" style={{ animationDelay: "0.35s" }}>
      <SectionHeading>Styled to Match Your App</SectionHeading>
      <p className="text-center text-text-subtle mb-10 text-[0.95rem]">
        One widget, any design system. Customize fonts, colors, borders, and shadows with{" "}
        <code className="bg-bg-elevated px-1.5 py-0.5 rounded font-mono text-xs">data-*</code>{" "}
        attributes.
      </p>
      <div className="flex gap-6 justify-center flex-wrap">
        {themes.map((theme) => (
          <div key={theme.label} className="rounded-2xl p-6 pb-7 w-[220px] flex flex-col items-center gap-3" style={theme.containerStyle}>
            <span className="text-[0.7rem] uppercase tracking-[0.1em]" style={{ color: "#999" }}>{theme.label}</span>
            <div className="inline-flex items-center gap-2 h-10 px-3.5 rounded-[20px] text-[13px]" style={theme.buttonStyle}>{theme.buttonText}</div>
            <div className="rounded-[10px] w-full p-3" style={theme.formStyle}>
              <div className="text-xs font-semibold mb-1.5" style={theme.headerStyle}>Send Feedback</div>
              <div className="rounded-md p-1.5 px-2 text-[11px] mb-1.5" style={theme.inputStyle}>Brief description...</div>
              <div className="flex justify-end">
                <div className="px-3 py-1 rounded-md text-[11px] font-semibold" style={theme.submitStyle}>Submit</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
