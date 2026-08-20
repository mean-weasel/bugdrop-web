import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { homepageFlowDemoRecipeList } from "@/components/landing/homepage-flow-demo-recipes";
import {
  CLASSIC_WIDGET_URL,
  HOMEPAGE_DOGFOOD_RUNTIME_PATH,
  HOMEPAGE_SHOWCASE_WIDGET_URL,
  WIDGET_ORIGIN,
  isLocalHomepageDogfoodRuntime,
  resolveWidgetUrl,
} from "@/lib/links";

type Runtime = typeof import("@/components/landing/homepage-demo-runtime");

class FakeScript extends EventTarget {
  id = "";
  src = "";
  async = true;
  readonly dataset: Record<string, string> = {};
  removed = false;

  remove() {
    this.removed = true;
  }
}

class FakeDocument extends EventTarget {
  readonly scripts: FakeScript[] = [];
  readonly body = {
    append: (script: FakeScript) => {
      this.scripts.push(script);
    },
  };

  createElement(tagName: string) {
    if (tagName !== "script") throw new Error(`Unexpected element: ${tagName}`);
    return new FakeScript();
  }

  getElementById(id: string) {
    return this.scripts.find((script) => script.id === id && !script.removed) ?? null;
  }
}

function installBrowser() {
  const document = new FakeDocument();
  const runtimeWindow: { BugDrop?: unknown; fetch?: typeof fetch } = {};
  Object.assign(globalThis, { document, window: runtimeWindow, HTMLScriptElement: FakeScript });
  return { document, runtimeWindow };
}

describe("homepage demo runtime", () => {
  let runtime: Runtime;

  beforeEach(async () => {
    vi.resetModules();
    runtime = await import("@/components/landing/homepage-demo-runtime");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete (globalThis as { document?: unknown }).document;
    delete (globalThis as { window?: unknown }).window;
    delete (globalThis as { HTMLScriptElement?: unknown }).HTMLScriptElement;
  });

  it("accepts only the two exact local dogfood runtime spellings", () => {
    expect(isLocalHomepageDogfoodRuntime(HOMEPAGE_DOGFOOD_RUNTIME_PATH)).toBe(true);
    expect(isLocalHomepageDogfoodRuntime(
      `http://bugdrop.localhost:3000${HOMEPAGE_DOGFOOD_RUNTIME_PATH}`,
    )).toBe(true);
    expect(isLocalHomepageDogfoodRuntime(
      `http://BUGDROP.LOCALHOST:3000${HOMEPAGE_DOGFOOD_RUNTIME_PATH}`,
    )).toBe(true);
    expect(isLocalHomepageDogfoodRuntime(
      `http://BuGdRoP.LoCaLhOsT:3000${HOMEPAGE_DOGFOOD_RUNTIME_PATH}`,
    )).toBe(true);

    const publicRuntimeUrls = [
      ` ${HOMEPAGE_DOGFOOD_RUNTIME_PATH}`,
      `${HOMEPAGE_DOGFOOD_RUNTIME_PATH} `,
      ` http://bugdrop.localhost:3000${HOMEPAGE_DOGFOOD_RUNTIME_PATH}`,
      `http://bugdrop.localhost:3000${HOMEPAGE_DOGFOOD_RUNTIME_PATH} `,
      `HTTP://bugdrop.localhost:3000${HOMEPAGE_DOGFOOD_RUNTIME_PATH}`,
      `Http://bugdrop.localhost:3000${HOMEPAGE_DOGFOOD_RUNTIME_PATH}`,
      `http://bugdrop.localhost:03000${HOMEPAGE_DOGFOOD_RUNTIME_PATH}`,
      `http://bugdrop.localhost:3000/vendor/bugdrop/./47a392d1e7b1a8d8adeff1692f6bbbd84696280d/widget.js`,
      `http://bugdrop.localhost:3000/vendor/bugdrop/47a392d1e7b1a8d8adeff1692f6bbbd84696280d/../47a392d1e7b1a8d8adeff1692f6bbbd84696280d/widget.js`,
      `http:\\bugdrop.localhost:3000${HOMEPAGE_DOGFOOD_RUNTIME_PATH}`,
      `http://bugdrop.localhost:3000\\vendor\\bugdrop\\47a392d1e7b1a8d8adeff1692f6bbbd84696280d\\widget.js`,
      `http://bugdrop%2elocalhost:3000${HOMEPAGE_DOGFOOD_RUNTIME_PATH}`,
      `http://%62ugdrop.localhost:3000${HOMEPAGE_DOGFOOD_RUNTIME_PATH}`,
      `https://bugdrop.localhost:3000${HOMEPAGE_DOGFOOD_RUNTIME_PATH}`,
      `http://bugdrop.localhost:3001${HOMEPAGE_DOGFOOD_RUNTIME_PATH}`,
      "http://bugdrop.localhost:3000/widget.js",
      `http://bugdrop.localhost:3000${HOMEPAGE_DOGFOOD_RUNTIME_PATH}?preview=true`,
      `http://bugdrop.localhost:3000${HOMEPAGE_DOGFOOD_RUNTIME_PATH}#preview`,
      `http://user@bugdrop.localhost:3000${HOMEPAGE_DOGFOOD_RUNTIME_PATH}`,
      `http://user:secret@bugdrop.localhost:3000${HOMEPAGE_DOGFOOD_RUNTIME_PATH}`,
      `https://bugdrop.neonwatty.workers.dev${HOMEPAGE_DOGFOOD_RUNTIME_PATH}`,
      "https://bugdrop.neonwatty.workers.dev/widget.js",
      `${HOMEPAGE_DOGFOOD_RUNTIME_PATH}?preview=true`,
      `${HOMEPAGE_DOGFOOD_RUNTIME_PATH}#preview`,
      "",
      "http://",
      "http://bugdrop.localhost:3000",
      "not a URL",
    ];

    for (const widgetUrl of publicRuntimeUrls) {
      expect(isLocalHomepageDogfoodRuntime(widgetUrl), widgetUrl).toBe(false);
    }
  });

  it("fails enabled showcase runtime selection closed while preserving Classic defaults", () => {
    const localAbsolute =
      `http://BUGDROP.LOCALHOST:3000${HOMEPAGE_DOGFOOD_RUNTIME_PATH}`;

    expect(resolveWidgetUrl(undefined, undefined)).toBe(CLASSIC_WIDGET_URL);
    expect(resolveWidgetUrl("false", undefined)).toBe(CLASSIC_WIDGET_URL);
    expect(resolveWidgetUrl(undefined, "https://example.com/custom-widget.js"))
      .toBe("https://example.com/custom-widget.js");
    expect(resolveWidgetUrl("false", "https://example.com/custom-widget.js"))
      .toBe("https://example.com/custom-widget.js");

    expect(resolveWidgetUrl("true", HOMEPAGE_SHOWCASE_WIDGET_URL))
      .toBe(HOMEPAGE_SHOWCASE_WIDGET_URL);
    expect(resolveWidgetUrl("true", HOMEPAGE_DOGFOOD_RUNTIME_PATH))
      .toBe(HOMEPAGE_DOGFOOD_RUNTIME_PATH);
    expect(resolveWidgetUrl("true", localAbsolute)).toBe(localAbsolute);

    const unsupported = [
      undefined,
      "",
      CLASSIC_WIDGET_URL,
      `${WIDGET_ORIGIN}/widget.v1.56.2.js`,
      `${HOMEPAGE_SHOWCASE_WIDGET_URL}?cache=mutable`,
      `http://bugdrop.localhost:3000/vendor/bugdrop/./47a392d1e7b1a8d8adeff1692f6bbbd84696280d/widget.js`,
      `https://bugdrop.localhost:3000${HOMEPAGE_DOGFOOD_RUNTIME_PATH}`,
      "javascript:alert(1)",
    ];

    for (const candidate of unsupported) {
      expect(() => resolveWidgetUrl("true", candidate), candidate).toThrow(
        "Enabled homepage showcase requires the exact v1.56.3 public runtime or an approved local fixture",
      );
    }
  });

  it("preserves the Classic configuration while suppressing the SDK trigger", () => {
    expect(runtime.homepageRuntimeAttributes()).toMatchObject({
      repo: "mean-weasel/bugdrop-widget-test",
      button: "false",
      theme: "dark",
      color: "#7dcfff",
      bg: "#24283b",
      text: "#c0caf5",
      radius: "10",
      font: "inherit",
      showIssueLink: "public",
    });
  });

  it("deduplicates concurrent loads and resolves only after the complete API is present", async () => {
    const { document, runtimeWindow } = installBrowser();
    const first = runtime.loadHomepageBugDrop();
    const second = runtime.loadHomepageBugDrop();

    expect(first).toBe(second);
    expect(document.scripts).toHaveLength(1);
    expect(document.scripts[0]).toMatchObject({
      id: "bugdrop-homepage-demo",
      async: false,
      dataset: expect.objectContaining(runtime.homepageRuntimeAttributes()),
    });

    const api = {
      open: vi.fn(),
      close: vi.fn(),
      registerFlow: vi.fn(),
    };
    runtimeWindow.BugDrop = api;
    document.scripts[0].dispatchEvent(new Event("load"));

    await expect(first).resolves.toBe(api);
  });

  it("keeps using the exact pinned API after another runtime overwrites the window global", async () => {
    const { document, runtimeWindow } = installBrowser();
    const pending = runtime.loadHomepageBugDrop();
    const exactApi = {
      open: vi.fn(),
      close: vi.fn(),
      registerFlow: vi.fn(),
    };
    runtimeWindow.BugDrop = exactApi;
    document.scripts[0].dispatchEvent(new Event("load"));
    await expect(pending).resolves.toBe(exactApi);

    runtimeWindow.BugDrop = {
      open: vi.fn(),
      close: vi.fn(),
      registerFlow: vi.fn(),
    };

    await expect(runtime.loadHomepageBugDrop()).resolves.toBe(exactApi);
  });

  it("keeps a pending exact load from resolving a foreign cross-route API", async () => {
    const { document, runtimeWindow } = installBrowser();
    const first = runtime.loadHomepageBugDrop();
    const foreignApi = {
      open: vi.fn(),
      close: vi.fn(),
      registerFlow: vi.fn(),
    };
    runtimeWindow.BugDrop = foreignApi;

    const second = runtime.loadHomepageBugDrop();
    expect(second).toBe(first);
    expect(runtimeWindow.BugDrop).toBeUndefined();

    let settled = false;
    void second.finally(() => {
      settled = true;
    });
    await Promise.resolve();
    expect(settled).toBe(false);
    expect(foreignApi.open).not.toHaveBeenCalled();
    expect(foreignApi.registerFlow).not.toHaveBeenCalled();

    const exactApi = {
      open: vi.fn(),
      close: vi.fn(),
      registerFlow: vi.fn(),
    };
    runtimeWindow.BugDrop = exactApi;
    document.scripts[0].dispatchEvent(new Event("load"));

    await expect(first).resolves.toBe(exactApi);
    await expect(second).resolves.toBe(exactApi);
    await expect(runtime.loadHomepageBugDrop()).resolves.toBe(exactApi);
  });

  it("cleans up a partial API and lets a later intent retry", async () => {
    const { document, runtimeWindow } = installBrowser();
    const first = runtime.loadHomepageBugDrop();
    const failedScript = document.scripts[0];
    runtimeWindow.BugDrop = { open: vi.fn(), close: vi.fn() };
    failedScript.dispatchEvent(new Event("load"));

    await expect(first).rejects.toThrow("did not initialize");
    expect(failedScript.removed).toBe(true);

    const second = runtime.loadHomepageBugDrop();
    expect(document.scripts).toHaveLength(2);
    const api = { open: vi.fn(), close: vi.fn(), registerFlow: vi.fn() };
    runtimeWindow.BugDrop = api;
    document.scripts[1].dispatchEvent(new Event("load"));

    await expect(second).resolves.toBe(api);
  });

  it("removes a failed script after a network error", async () => {
    const { document } = installBrowser();
    const pending = runtime.loadHomepageBugDrop();
    const script = document.scripts[0];
    script.dispatchEvent(new Event("error"));

    await expect(pending).rejects.toThrow("did not initialize");
    expect(script.removed).toBe(true);
  });

  it("fails closed when another page left a foreign BugDrop runtime behind", async () => {
    const { document, runtimeWindow } = installBrowser();
    runtimeWindow.BugDrop = {
      open: vi.fn(),
      close: vi.fn(),
      registerFlow: vi.fn(),
    };

    await expect(runtime.loadHomepageBugDrop()).rejects.toThrow("different BugDrop runtime");
    expect(document.scripts).toHaveLength(0);

    await expect(runtime.loadHomepageBugDrop()).rejects.toThrow("different BugDrop runtime");
  });

  it("registers a selected canonical flow once and validates its returned ID", () => {
    const api = {
      open: vi.fn(),
      close: vi.fn(),
      registerFlow: vi.fn((config: { id: string }) => ({
        id: config.id,
        open: vi.fn(),
      })),
    };

    const handle = runtime.registerHomepageFlow(api, "bug-report");
    expect(api.registerFlow).toHaveBeenCalledOnce();
    expect(api.registerFlow).toHaveBeenCalledWith(homepageFlowDemoRecipeList[0].config);
    expect(runtime.registerHomepageFlow(api, "bug-report")).toBe(handle);
    expect(api.registerFlow).toHaveBeenCalledOnce();

    const badApi = {
      ...api,
      registerFlow: vi.fn(() => ({ id: "unexpected", open: vi.fn() })),
    };
    expect(() => runtime.registerHomepageFlow(badApi, "bug-report")).toThrow("returned unexpected");
  });

  it("preserves successful selected handles when another registration fails and retries", () => {
    let featureAttempts = 0;
    const api = {
      open: vi.fn(),
      close: vi.fn(),
      registerFlow: vi.fn((config: { id: string }) => {
        if (config.id === "feature-request" && featureAttempts++ === 0) {
          throw new Error("one-time registration failure");
        }
        return { id: config.id, open: vi.fn() };
      }),
    };

    const bugReport = runtime.registerHomepageFlow(api, "bug-report");
    expect(() => runtime.registerHomepageFlow(api, "feature-request")).toThrow(
      "one-time registration failure",
    );
    expect(runtime.registerHomepageFlow(api, "bug-report")).toBe(bugReport);
    expect(runtime.registerHomepageFlow(api, "feature-request").id).toBe("feature-request");
    expect(api.registerFlow).toHaveBeenCalledTimes(3);
  });

  it("opens Classic without a Flow and exposes separate cleanup for Classic and Flow", async () => {
    const flowOpen = vi.fn(() => ({
      instanceId: "flow-instance",
      close: vi.fn(),
      result: Promise.resolve({ status: "closed" as const }),
    }));
    const api = {
      open: vi.fn(),
      close: vi.fn(),
      registerFlow: vi.fn((config: { id: string }) => ({ id: config.id, open: flowOpen })),
    };
    const handle = runtime.registerHomepageFlow(api, "bug-report");

    const classic = runtime.openHomepageExperience(api, undefined, "classic");
    expect(api.open).toHaveBeenCalledOnce();
    expect(flowOpen).not.toHaveBeenCalled();
    expect(classic).not.toHaveProperty("result");
    classic.close();
    expect(api.close).toHaveBeenCalledOnce();

    const flow = runtime.openHomepageExperience(api, handle, "bug-report");
    expect(flowOpen).toHaveBeenCalledWith(homepageFlowDemoRecipeList[0].openOptions);
    if (flow.id === "classic") throw new Error("Expected the Bug Report Flow session.");
    await expect(flow.result).resolves.toEqual({ status: "closed" });
    flow.close();
    expect(flowOpen.mock.results[0].value.close).toHaveBeenCalledOnce();
  });

  it("keeps a cancelled Classic preflight from resuming after navigation", async () => {
    const { runtimeWindow } = installBrowser();
    let releaseCheck!: (response: Response) => void;
    const check = new Promise<Response>((resolve) => {
      releaseCheck = resolve;
    });
    runtimeWindow.fetch = vi.fn(() => check);
    const lateOpen = vi.fn();
    const api = {
      open: vi.fn(() => {
        void runtimeWindow.fetch?.(
          "/vendor/bugdrop/exact/api/check/mean-weasel/bugdrop-widget-test",
        ).then(lateOpen);
      }),
      close: vi.fn(),
      registerFlow: vi.fn(),
    };

    const classic = runtime.openHomepageExperience(api, undefined, "classic");
    classic.close();
    releaseCheck(new Response('{"installed":true}', { status: 200 }));
    await Promise.resolve();
    await Promise.resolve();

    expect(api.close).toHaveBeenCalledOnce();
    expect(lateOpen).not.toHaveBeenCalled();
  });
});
