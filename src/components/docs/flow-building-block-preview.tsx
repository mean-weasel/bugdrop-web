export type FlowBuildingBlockPreviewKind =
  | "short-text"
  | "long-text"
  | "rating"
  | "single-choice"
  | "checkbox"
  | "attachments"
  | "message-screen"
  | "form-screen"
  | "screenshot-screen";

export function FlowBuildingBlockPreview({ kind }: { kind: FlowBuildingBlockPreviewKind }) {
  let content: React.ReactNode;

  switch (kind) {
    case "short-text":
      content = <div className="rounded-lg border border-border bg-bg-deep px-3 py-2 text-sm text-text-muted">A short response</div>;
      break;
    case "long-text":
      content = <div className="min-h-20 rounded-lg border border-border bg-bg-deep px-3 py-2 text-sm text-text-muted">A longer response can use multiple lines…</div>;
      break;
    case "rating":
      content = <div className="flex gap-2 text-2xl text-accent-warm"><span>★</span><span>★</span><span>★</span><span className="text-text-muted">★</span><span className="text-text-muted">★</span></div>;
      break;
    case "single-choice":
      content = <div className="grid grid-cols-3 gap-2">{["Option A", "Option B", "Option C"].map((option) => <span className="rounded-lg border border-border px-3 py-2 text-center text-xs text-text-subtle" key={option}>{option}</span>)}</div>;
      break;
    case "checkbox":
      content = <div className="flex items-center gap-3 text-sm text-text-subtle"><span className="flex size-5 items-center justify-center rounded border border-accent-cyan bg-accent-cyan/15 text-accent-cyan">✓</span>I agree</div>;
      break;
    case "attachments":
      content = <div className="rounded-lg border border-dashed border-border px-4 py-5 text-center text-sm text-text-muted">Add supporting files</div>;
      break;
    case "message-screen":
      content = <div className="text-center"><p className="font-medium text-text-primary">A short introduction</p><p className="mt-1 text-sm text-text-muted">Explain what happens next.</p></div>;
      break;
    case "form-screen":
      content = <div className="space-y-2"><div className="h-9 rounded-lg border border-border bg-bg-deep" /><div className="h-16 rounded-lg border border-border bg-bg-deep" /></div>;
      break;
    case "screenshot-screen":
      content = <div className="rounded-lg border border-dashed border-accent-cyan/50 bg-accent-cyan/5 px-4 py-8 text-center text-sm text-accent-cyan">Capture a screenshot</div>;
      break;
  }

  return <div aria-hidden="true" className="mb-4 rounded-xl border border-border bg-bg-surface p-4">{content}</div>;
}
