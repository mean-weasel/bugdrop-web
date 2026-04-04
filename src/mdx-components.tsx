import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => <h1 className="text-3xl font-bold text-text-primary mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-semibold text-text-primary mt-8 mb-3">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-semibold text-text-primary mt-6 mb-2">{children}</h3>,
    p: ({ children }) => <p className="text-text-subtle mb-4 leading-relaxed">{children}</p>,
    a: ({ href, children }) => <a href={href} className="text-accent-cyan hover:underline">{children}</a>,
    code: ({ children }) => <code className="font-mono text-sm bg-bg-elevated px-1.5 py-0.5 rounded text-accent-cyan">{children}</code>,
    pre: ({ children }) => <pre className="font-mono text-sm bg-bg-deep border border-border rounded-lg p-4 overflow-x-auto mb-4">{children}</pre>,
    ul: ({ children }) => <ul className="list-disc list-inside text-text-subtle mb-4 space-y-1">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside text-text-subtle mb-4 space-y-1">{children}</ol>,
    table: ({ children }) => <div className="overflow-x-auto mb-4"><table className="w-full border-collapse bg-bg-surface rounded-xl overflow-hidden border border-border">{children}</table></div>,
    th: ({ children }) => <th className="bg-bg-elevated text-xs font-semibold tracking-wider uppercase text-text-muted p-3 text-left">{children}</th>,
    td: ({ children }) => <td className="p-3 text-sm text-text-subtle border-t border-border">{children}</td>,
    ...components,
  };
}
