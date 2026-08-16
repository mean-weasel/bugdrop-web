import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { expect, it } from "vitest";

import {
  HOMEPAGE_BUGDROP_RUNTIME,
  HOMEPAGE_FLOW_RECIPE_SOURCE,
  homepageFlowRecipeList,
} from "@/components/landing/homepage-flow-recipes.generated";

it("pins exactly three canonical SDK recipes", async () => {
  const source = await readFile(HOMEPAGE_FLOW_RECIPE_SOURCE.localPath);

  expect(source.byteLength).toBe(HOMEPAGE_FLOW_RECIPE_SOURCE.byteLength);
  expect(createHash("sha256").update(source).digest("hex")).toBe(
    HOMEPAGE_FLOW_RECIPE_SOURCE.sha256,
  );
  expect(homepageFlowRecipeList.map(({ id }) => id)).toEqual([
    "bug-report",
    "product-triage",
    "customer-pulse",
  ]);
});

it("pins the exact released BugDrop runtime used for local homepage testing", async () => {
  const runtime = await readFile(HOMEPAGE_BUGDROP_RUNTIME.localPath);

  expect(HOMEPAGE_BUGDROP_RUNTIME.release).toBe("v1.56.2");
  expect(HOMEPAGE_BUGDROP_RUNTIME.targetSha).toBe(
    "81293491bf9924879465c668a391a5e4aeae912d",
  );
  expect(runtime.byteLength).toBe(HOMEPAGE_BUGDROP_RUNTIME.byteLength);
  expect(createHash("sha256").update(runtime).digest("hex")).toBe(
    HOMEPAGE_BUGDROP_RUNTIME.sha256,
  );
});
