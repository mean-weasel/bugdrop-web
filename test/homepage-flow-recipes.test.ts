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
      "public/vendor/bugdrop/2f2918d0dea6d56e28d527540750258f673893f7/PROVENANCE.json",
      "utf8",
    ),
  );

  expect(HOMEPAGE_BUGDROP_RUNTIME.release).toBe("v1.56.4");
  expect(HOMEPAGE_BUGDROP_RUNTIME.targetSha).toBe(
    "2f2918d0dea6d56e28d527540750258f673893f7",
  );
  expect(HOMEPAGE_BUGDROP_RUNTIME.byteLength).toBe(239931);
  expect(HOMEPAGE_BUGDROP_RUNTIME.sha256).toBe(
    "c26934dee9c853e4b51b5ce1c36e43e8037418eb7869fedf12d84f4d889d6a02",
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
      "https://github.com/mean-weasel/bugdrop/releases/download/v1.56.4/widget.v1.56.4.js",
    byteLength: HOMEPAGE_BUGDROP_RUNTIME.byteLength,
    sha256: HOMEPAGE_BUGDROP_RUNTIME.sha256,
  });
});
