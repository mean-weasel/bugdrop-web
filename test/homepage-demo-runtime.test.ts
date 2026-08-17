import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { homepageFlowRecipeList } from "@/components/landing/homepage-flow-recipes.generated";

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
      showIssueLink: "always",
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
    expect(api.registerFlow).toHaveBeenCalledWith(homepageFlowRecipeList[0].config);
    expect(runtime.registerHomepageFlow(api, "bug-report")).toBe(handle);
    expect(api.registerFlow).toHaveBeenCalledOnce();

    const badApi = {
      ...api,
      registerFlow: vi.fn(() => ({ id: "unexpected", open: vi.fn() })),
    };
    expect(() => runtime.registerHomepageFlow(badApi, "bug-report")).toThrow("returned unexpected");
  });

  it("preserves successful selected handles when another registration fails and retries", () => {
    let productAttempts = 0;
    const api = {
      open: vi.fn(),
      close: vi.fn(),
      registerFlow: vi.fn((config: { id: string }) => {
        if (config.id === "product-triage" && productAttempts++ === 0) {
          throw new Error("one-time registration failure");
        }
        return { id: config.id, open: vi.fn() };
      }),
    };

    const bugReport = runtime.registerHomepageFlow(api, "bug-report");
    expect(() => runtime.registerHomepageFlow(api, "product-triage")).toThrow(
      "one-time registration failure",
    );
    expect(runtime.registerHomepageFlow(api, "bug-report")).toBe(bugReport);
    expect(runtime.registerHomepageFlow(api, "product-triage").id).toBe("product-triage");
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
    expect(flowOpen).toHaveBeenCalledWith(homepageFlowRecipeList[0].openOptions);
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
