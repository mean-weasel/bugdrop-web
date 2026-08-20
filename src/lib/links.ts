export const MARKETPLACE_URL =
  "https://github.com/marketplace/bugdrop-in-app-feedback-to-github-issues";

export const PRODUCT_HUNT_URL = "https://www.producthunt.com/products/bugdrop-2";

export const GITHUB_ORG_URL = "https://github.com/mean-weasel";

export const MEAN_WEASEL_PROJECT_URL = "https://mean-weasel.com/projects/bugdrop";

export const GITHUB_PROFILE_URL = "https://github.com/neonwatty";

export const GITHUB_REPO_URL = "https://github.com/mean-weasel/bugdrop";

export const GITHUB_WEB_REPO_URL = "https://github.com/mean-weasel/bugdrop-web";

export const SHOWCASE_PATH = "/showcase";

export const SHOWCASE_URL = "https://bugdrop.dev/showcase";

export const SHOWCASE_SUBMISSION_ISSUE_URL =
  "https://github.com/mean-weasel/bugdrop/issues/241";

export const DEMO_PATH = "/demo";

export const DEMO_URL = "https://bugdrop-widget-test.vercel.app";

export const BUILDING_BLOCKS_PATH = "/labs/variants";

export const WIDGET_ORIGIN = "https://bugdrop.neonwatty.workers.dev";

export const CLASSIC_WIDGET_URL = `${WIDGET_ORIGIN}/widget.js`;

export const HOMEPAGE_SHOWCASE_WIDGET_URL =
  `${WIDGET_ORIGIN}/widget.v1.56.3.js`;

export const HOMEPAGE_DOGFOOD_RUNTIME_PATH =
  "/vendor/bugdrop/47a392d1e7b1a8d8adeff1692f6bbbd84696280d/widget.js";

const LOCAL_HOMEPAGE_SCHEME = "http://";
const LOCAL_HOMEPAGE_HOST = "bugdrop.localhost:3000";

export function isLocalHomepageDogfoodRuntime(widgetUrl = WIDGET_URL) {
  if (widgetUrl === HOMEPAGE_DOGFOOD_RUNTIME_PATH) return true;

  if (
    !widgetUrl.startsWith(LOCAL_HOMEPAGE_SCHEME) ||
    !widgetUrl.endsWith(HOMEPAGE_DOGFOOD_RUNTIME_PATH)
  ) return false;

  const host = widgetUrl.slice(
    LOCAL_HOMEPAGE_SCHEME.length,
    -HOMEPAGE_DOGFOOD_RUNTIME_PATH.length,
  );
  return host.toLowerCase() === LOCAL_HOMEPAGE_HOST;
}

export function resolveWidgetUrl(
  showcaseFlag = process.env.NEXT_PUBLIC_HOMEPAGE_FLOW_DEMO_ENABLED,
  configuredUrl = process.env.NEXT_PUBLIC_BUGDROP_WIDGET_URL,
) {
  if (showcaseFlag !== "true") {
    return configuredUrl ?? CLASSIC_WIDGET_URL;
  }

  if (
    configuredUrl === HOMEPAGE_SHOWCASE_WIDGET_URL ||
    (configuredUrl !== undefined && isLocalHomepageDogfoodRuntime(configuredUrl))
  ) {
    return configuredUrl;
  }

  throw new TypeError(
    "Enabled homepage showcase requires the exact v1.56.3 public runtime or an approved local fixture",
  );
}

export const WIDGET_URL = resolveWidgetUrl();

export function widgetScriptTag(repo = "owner/repo", attributes: Record<string, string> = {}) {
  const lines = ["<script", `  src="${WIDGET_URL}"`, `  data-repo="${repo}"`];

  for (const [name, value] of Object.entries(attributes)) {
    lines.push(`  ${name}="${value}"`);
  }

  lines.push("></script>");
  return lines.join("\n");
}

export const SAMPLE_DEMO_REPO = "mean-weasel/bugdrop-widget-test";
