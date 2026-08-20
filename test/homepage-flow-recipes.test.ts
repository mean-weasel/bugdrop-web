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
  const provenance = JSON.parse(
    await readFile(
      "public/vendor/bugdrop/47a392d1e7b1a8d8adeff1692f6bbbd84696280d/PROVENANCE.json",
      "utf8",
    ),
  );

  expect(HOMEPAGE_BUGDROP_RUNTIME.release).toBe("v1.56.3");
  expect(HOMEPAGE_BUGDROP_RUNTIME.targetSha).toBe(
    "47a392d1e7b1a8d8adeff1692f6bbbd84696280d",
  );
  expect(HOMEPAGE_BUGDROP_RUNTIME.byteLength).toBe(238591);
  expect(HOMEPAGE_BUGDROP_RUNTIME.sha256).toBe(
    "338cdb5b19c69dc3429fdcb8f800e3b98a3bdd442fee78563523cd731e2bdf0e",
  );
  expect(runtime.byteLength).toBe(HOMEPAGE_BUGDROP_RUNTIME.byteLength);
  expect(createHash("sha256").update(runtime).digest("hex")).toBe(
    HOMEPAGE_BUGDROP_RUNTIME.sha256,
  );
  expect(provenance).toEqual({
    kind: "released-bugdrop-runtime",
    sourceRepository: "mean-weasel/bugdrop",
    release: HOMEPAGE_BUGDROP_RUNTIME.release,
    targetCommit: HOMEPAGE_BUGDROP_RUNTIME.targetSha,
    downloadUrl:
      "https://github.com/mean-weasel/bugdrop/releases/download/v1.56.3/widget.v1.56.3.js",
    byteLength: HOMEPAGE_BUGDROP_RUNTIME.byteLength,
    sha256: HOMEPAGE_BUGDROP_RUNTIME.sha256,
  });
});
