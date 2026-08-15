import { widgetScriptTag } from "@/lib/links";

type WidgetInstallSnippetProps = {
  repo?: string;
  attributes?: Record<string, string>;
};

export function WidgetInstallSnippet({
  repo = "owner/repo",
  attributes = {},
}: WidgetInstallSnippetProps) {
  return (
    <pre className="font-mono text-sm bg-bg-deep border border-border rounded-lg p-4 overflow-x-auto mb-4">
      <code>{widgetScriptTag(repo, attributes)}</code>
    </pre>
  );
}
