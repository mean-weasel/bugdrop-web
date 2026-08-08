import { monitoringTargets } from "./config";
import type { Observation } from "./types";

const USER_AGENT = "BugDrop-Operational-Monitor/1.0 (+https://bugdrop.dev/status)";

type CheckSpec = {
  componentId: string;
  url: string;
  validate: (response: Response) => Promise<string | null>;
};

export async function runHttpChecks(now = new Date()): Promise<Array<{
  componentId: string;
  observation: Observation;
}>> {
  const targets = monitoringTargets();
  const specs: CheckSpec[] = [
    {
      componentId: "landing_page",
      url: targets.landingUrl,
      validate: async (response) => validateTextResponse(response, "BugDrop", 512),
    },
    {
      componentId: "widget_delivery",
      url: targets.widgetUrl,
      validate: validateWidget,
    },
    {
      componentId: "feedback_api",
      url: targets.healthUrl,
      validate: validateHealth,
    },
    {
      componentId: "github_integration",
      url: targets.githubCheckUrl,
      validate: validateGithubIntegration,
    },
  ];

  return Promise.all(specs.map((spec) => runCheck(spec, now)));
}

async function runCheck(
  spec: CheckSpec,
  checkedAt: Date,
): Promise<{ componentId: string; observation: Observation }> {
  const startedAt = performance.now();
  try {
    const response = await fetch(spec.url, {
      cache: "no-store",
      headers: { "user-agent": USER_AGENT },
      redirect: "follow",
      signal: AbortSignal.timeout(10_000),
    });
    const errorCode = await spec.validate(response);
    return {
      componentId: spec.componentId,
      observation: {
        ok: errorCode === null,
        checkedAt,
        latencyMs: Math.round(performance.now() - startedAt),
        errorCode,
      },
    };
  } catch (error) {
    return {
      componentId: spec.componentId,
      observation: {
        ok: false,
        checkedAt,
        latencyMs: Math.round(performance.now() - startedAt),
        errorCode: classifyFetchError(error),
      },
    };
  }
}

async function validateTextResponse(
  response: Response,
  marker: string,
  minimumBytes: number,
): Promise<string | null> {
  if (!response.ok) return `http_${response.status}`;
  const body = await response.text();
  if (new TextEncoder().encode(body).byteLength < minimumBytes) return "body_too_small";
  return body.includes(marker) ? null : "marker_missing";
}

async function validateWidget(response: Response): Promise<string | null> {
  if (!response.ok) return `http_${response.status}`;
  const contentType = response.headers.get("content-type")?.toLowerCase() || "";
  if (!contentType.includes("javascript")) return "unexpected_content_type";
  const body = await response.text();
  return new TextEncoder().encode(body).byteLength >= 1024 ? null : "body_too_small";
}

async function validateHealth(response: Response): Promise<string | null> {
  if (!response.ok) return `http_${response.status}`;
  try {
    const body = (await response.json()) as Record<string, unknown>;
    if (body.status !== "ok") return "health_not_ok";
    if (body.environment !== "production") return "wrong_environment";
    if (typeof body.buildSha !== "string" || !/^[a-f0-9]{40}$/.test(body.buildSha)) {
      return "invalid_build_identity";
    }
    return null;
  } catch {
    return "invalid_json";
  }
}

async function validateGithubIntegration(response: Response): Promise<string | null> {
  if (!response.ok) return `http_${response.status}`;
  try {
    const body = (await response.json()) as Record<string, unknown>;
    return body.installed === true && body.repo === "mean-weasel/bugdrop-widget-test"
      ? null
      : "github_app_unavailable";
  } catch {
    return "invalid_json";
  }
}

function classifyFetchError(error: unknown): string {
  if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) {
    return "timeout";
  }
  return "network_error";
}

export const checkValidators = {
  validateGithubIntegration,
  validateHealth,
  validateTextResponse,
  validateWidget,
};
