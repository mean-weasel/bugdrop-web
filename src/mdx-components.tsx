import type { MDXComponents } from "mdx/types";
import { Children, isValidElement, type ReactNode } from "react";

function headingText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(headingText).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return headingText(node.props.children);
  return "";
}

export function mdxHeadingId(children: ReactNode): string {
  return headingText(children)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// MDX emits formatting newlines between table elements. React treats those as
// invalid text children; remove them only at structural boundaries, not in cells.
function tableChildren(children: ReactNode): ReactNode {
  return Children.toArray(children).filter(
    (child) => typeof child !== "string" || child.trim() !== "",
  );
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children, id }) => <h1 id={id ?? mdxHeadingId(children)} className="text-3xl font-bold text-text-primary mb-4">{children}</h1>,
    h2: ({ children, id }) => <h2 id={id ?? mdxHeadingId(children)} className="text-2xl font-semibold text-text-primary mt-8 mb-3">{children}</h2>,
    h3: ({ children, id }) => <h3 id={id ?? mdxHeadingId(children)} className="text-xl font-semibold text-text-primary mt-6 mb-2">{children}</h3>,
    p: ({ children }) => <p className="text-text-subtle mb-4 leading-relaxed">{children}</p>,
    a: ({ href, children }) => <a href={href} className="text-accent-cyan hover:underline">{children}</a>,
    code: ({ children }) => <code className="font-mono text-sm bg-bg-elevated px-1.5 py-0.5 rounded text-accent-cyan">{children}</code>,
    pre: ({ children }) => <pre className="font-mono text-sm bg-bg-deep border border-border rounded-lg p-4 overflow-x-auto mb-4 [&>code]:rounded-none [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-text-subtle" tabIndex={0}>{children}</pre>,
    ul: ({ children }) => <ul className="list-disc list-inside text-text-subtle mb-4 space-y-1">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside text-text-subtle mb-4 space-y-1">{children}</ol>,
    table: ({ children }) => <div className="overflow-x-auto mb-4" tabIndex={0}><table className="w-full border-collapse bg-bg-surface rounded-xl overflow-hidden border border-border">{tableChildren(children)}</table></div>,
    thead: ({ children, ...props }) => <thead {...props}>{tableChildren(children)}</thead>,
    tbody: ({ children, ...props }) => <tbody {...props}>{tableChildren(children)}</tbody>,
    tfoot: ({ children, ...props }) => <tfoot {...props}>{tableChildren(children)}</tfoot>,
    tr: ({ children, ...props }) => <tr {...props}>{tableChildren(children)}</tr>,
    th: ({ children }) => <th className="bg-bg-elevated text-xs font-semibold tracking-wider uppercase text-text-muted p-3 text-left">{children}</th>,
    td: ({ children }) => <td className="p-3 text-sm text-text-subtle border-t border-border">{children}</td>,
    ...components,
  };
}
