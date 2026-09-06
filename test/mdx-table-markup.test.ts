import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { loadBindings } from "next/dist/build/swc";
import ts from "typescript";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { useMDXComponents } from "@/mdx-components";

async function renderMdx(source: string) {
  // Match experimental.mdxRs in next.config.ts: the Rust compiler emits
  // structural newlines that the JS MDX compiler does not emit.
  const bindings = await loadBindings();
  const compiled = await bindings.mdx.compile(source, {
    parse: { constructs: { gfmTable: true } },
  });
  const { outputText } = ts.transpileModule(compiled, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  });
  const exports: { default?: React.ComponentType<{ components: ReturnType<typeof useMDXComponents> }> } = {};
  new Function("require", "exports", outputText)(createRequire(import.meta.url), exports);
  const Content = exports.default!;
  function RenderContent() {
    return createElement(Content, { components: useMDXComponents({}) });
  }
  return renderToStaticMarkup(createElement(RenderContent));
}

describe("MDX table markup", () => {
  it("renders the real Userback comparison without structural whitespace nodes", async () => {
    const source = await readFile(new URL("../src/content/compare/userback.mdx", import.meta.url), "utf8");
    const html = await renderMdx(source);
    const table = html.match(/<table\b[\s\S]*?<\/table>/)?.[0];
    expect(table).toBeDefined();
    expect(table).not.toMatch(/<(?:table|thead|tbody|tfoot|tr)\b[^>]*>\s+</);
    expect(table).not.toMatch(/<\/(?:thead|tbody|tfoot|tr|th|td)>\s+</);
    expect(table?.match(/<tr>/g)).toHaveLength(6);
    expect(table?.match(/<th\b/g)).toHaveLength(3);
    expect(table?.match(/<td\b/g)).toHaveLength(15);
    expect(table).toContain("Primary destination");
    expect(table).toContain('href="#source-userback-features"');
  });

  it("preserves meaningful spaces inside cells and the scroll wrapper", async () => {
    const html = await renderMdx("| Label |\n| --- |\n| Before **bold** after |\n");
    expect(html).toContain("Before <strong>bold</strong> after");
    expect(html).toContain('class="overflow-x-auto mb-4" tabindex="0"');
  });
});
