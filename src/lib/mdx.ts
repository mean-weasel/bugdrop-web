import fs from "fs";
import path from "path";

export function getDocSlugs(contentDir: string): string[] {
  const dir = path.join(process.cwd(), "src/content", contentDir);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}
