import { expect, test } from "@playwright/test";

const primaryNavLabels = ["Docs", "Use Cases", "Compare", "Sandbox"];
const widgetScriptUrl = "http://localhost:8787/widget.js";
const widgetStub = `
(() => {
  const script = document.currentScript;
  const attrs = script ? Object.fromEntries(Array.from(script.attributes).map((attr) => [attr.name, attr.value])) : {};
  let panel = null;
  let button = null;

  const style = document.createElement("style");
  style.textContent = \`
    .bugdrop-test-button {
      position: fixed;
      right: 18px;
      bottom: 18px;
      z-index: 2147483647;
      border: 0;
      border-radius: 8px;
      padding: 10px 14px;
      color: #fff;
      background: \${attrs["data-color"] || "#2563eb"};
      font: 600 14px/1.2 system-ui, sans-serif;
      box-shadow: 0 14px 32px rgba(15,23,42,0.2);
    }
    .bugdrop-test-panel {
      position: fixed;
      right: 18px;
      bottom: 72px;
      z-index: 2147483647;
      width: min(360px, calc(100vw - 36px));
      border: \${attrs["data-border-width"] || "1"}px solid \${attrs["data-border-color"] || "#dbe3ee"};
      border-radius: \${attrs["data-radius"] || "8"}px;
      padding: 16px;
      color: \${attrs["data-text"] || "#162033"};
      background: \${attrs["data-bg"] || "#ffffff"};
      box-shadow: \${attrs["data-shadow"] || "0 18px 40px rgba(22,32,51,0.09)"};
      font: 14px/1.45 system-ui, sans-serif;
    }
    .bugdrop-test-panel h2 { margin: 0 0 10px; font-size: 18px; }
    .bugdrop-test-panel textarea {
      width: 100%;
      min-height: 96px;
      border: 1px solid #dbe3ee;
      border-radius: 8px;
      padding: 8px;
      font: inherit;
    }
  \`;
  document.head.append(style);

  function render(content) {
    panel?.remove();
    panel = document.createElement("section");
    panel.className = "bugdrop-test-panel";
    panel.setAttribute("role", "dialog");
    panel.innerHTML = content;
    document.body.append(panel);
  }

  window.BugDropPreview = {
    openWelcome() {
      render("<h2>Welcome to Feedback</h2><p>Tell the team what is happening on this page.</p>");
    },
    openForm() {
      render("<h2>Send Feedback</h2><textarea aria-label='Feedback details'></textarea>");
    },
    openSuccess() {
      render("<h2>Preview Complete</h2><p>Your feedback preview is ready.</p>");
    },
    close() {
      panel?.remove();
      panel = null;
    },
  };

  window.BugDrop = {
    open: window.BugDropPreview.openForm,
    close: window.BugDropPreview.close,
    hide() { button?.remove(); },
    show() { if (button && !button.isConnected) document.body.append(button); },
    isOpen: false,
    isButtonVisible: attrs["data-button"] !== "false",
  };

  if (attrs["data-button"] !== "false") {
    button = document.createElement("button");
    button.type = "button";
    button.className = "bugdrop-test-button";
    button.textContent = attrs["data-label"] || "Feedback";
    button.addEventListener("click", window.BugDropPreview.openForm);
    document.body.append(button);
  }
})();
`;

async function expectNoHorizontalOverflow(page: import("@playwright/test").Page) {
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));

  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth);
}

test.describe("sandbox", () => {
  test.beforeEach(async ({ page }) => {
    await page.route(widgetScriptUrl, async (route) => {
      await route.fulfill({
        contentType: "application/javascript",
        body: widgetStub,
      });
    });
  });

  test("iframe preview is self-contained and does not load the widget runtime", async ({
    page,
  }) => {
    const widgetRequests: string[] = [];
    page.on("request", (request) => {
      if (request.url() === widgetScriptUrl) widgetRequests.push(request.url());
    });

    await page.goto("/sandbox");
    await expect(page.frameLocator("#sandbox-preview").getByText("Acme Console")).toBeVisible();

    await page.getByRole("button", { name: "Welcome" }).click();
    await expect(page.frameLocator("#sandbox-preview").getByText("Welcome to Feedback")).toBeVisible();

    expect(widgetRequests).toEqual([]);
  });

  test("loads with the sandbox nav item active and no page errors", async ({ page }) => {
    const consoleMessages: string[] = [];
    const pageErrors: string[] = [];

    page.on("console", (message) => {
      if (message.type() === "error" || message.type() === "warning") {
        consoleMessages.push(message.text());
      }
    });
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto("/sandbox");

    await expect(page).toHaveTitle(/BugDrop Sandbox/);
    await expect(page.getByText("Configure your BugDrop widget")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Configuration" })).toBeVisible();
    await expect(page.getByText("Application error")).toHaveCount(0);

    const activeNavItems = await Promise.all(
      primaryNavLabels.map(async (label) => ({
        label,
        active:
          (await page
            .getByRole("navigation")
            .getByRole("link", { name: label })
            .getAttribute("aria-current")) === "page",
      })),
    );

    expect(activeNavItems.filter((item) => item.active)).toEqual([
      { label: "Sandbox", active: true },
    ]);
    await expect(page.getByRole("link", { name: "Live Demo" })).not.toHaveAttribute(
      "aria-current",
      "page",
    );
    await expectNoHorizontalOverflow(page);
    expect(pageErrors).toEqual([]);
    expect(consoleMessages).toEqual([]);
  });

  test("shows a simplified configure preview install flow", async ({ page }) => {
    await page.goto("/sandbox");

    await expect(page.getByText("Tune settings, preview the widget")).toBeVisible();
    await expect(page.getByRole("button", { name: "Get code" })).toBeVisible();
    await expect(page.getByText("How to use this sandbox")).toHaveCount(0);
    await expect(page.locator("#sandbox-destination").getByText("data-repo")).toBeVisible();
    await expect(page.getByLabel("GitHub issue destination")).toBeVisible();
    await expect(page.getByLabel("Screenshot mode")).toBeVisible();
    await expect(page.getByLabel("Theme")).toBeVisible();
    await expect(page.getByLabel("Dismissible")).not.toBeVisible();
    await expect(
      page.getByText("The example app updates as you change settings on the left"),
    ).toBeVisible();
    await expect(page.getByText("Pick an install option above")).not.toBeVisible();
    await expect(page.locator("#sandbox-output-panel")).toHaveCount(0);
  });

  test("install action opens generated output without taking a full column", async ({ page }) => {
    await page.goto("/sandbox");

    await page.getByRole("button", { name: "Get code" }).click();
    await expect(page.locator("#sandbox-install")).toBeVisible();
    await expect(page.getByRole("dialog", { name: "Get code" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Install script" })).toHaveAttribute("aria-selected", "true");
    await expect(page.locator("#sandbox-output-panel")).toBeVisible();
    await expect(page.getByRole("button", { name: "Copy install script" })).toBeVisible();
  });

  test("install sheet closes with escape, backdrop, and explicit close", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/sandbox");

    const initialOverflow = await page.evaluate(() => document.body.style.overflow);

    await page.getByRole("button", { name: "Get code" }).click();
    await expect(page.getByRole("dialog", { name: "Get code" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Dismiss install output" })).toBeVisible();
    await expect
      .poll(() => page.evaluate(() => document.body.style.overflow))
      .toBe("hidden");

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Get code" })).toBeHidden();
    await expect
      .poll(() => page.evaluate(() => document.body.style.overflow))
      .toBe(initialOverflow);
    await expect(page.getByRole("button", { name: "Get code" })).toBeFocused();

    await page.getByRole("button", { name: "Get code" }).click();
    await page.mouse.click(12, 80);
    await expect(page.getByRole("dialog", { name: "Get code" })).toBeHidden();

    await page.getByRole("button", { name: "Get code" }).click();
    await page.getByRole("button", { name: "Close install output" }).click();
    await expect(page.getByRole("dialog", { name: "Get code" })).toBeHidden();
  });

  test("post-configuration install action exposes generated outputs", async ({ page }) => {
    await page.goto("/sandbox");

    await page.getByRole("button", { name: "Get code" }).click();
    await page.getByRole("tab", { name: "Install script" }).click();
    await expect(page.locator("#sandbox-install")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Get code" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Install script" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(page.locator("#sandbox-output-panel")).toBeVisible();
    await expect(page.getByText("Production checklist")).toBeVisible();
  });

  test("output choices expose distinct copy actions and generated artifacts", async ({ page }) => {
    await page.goto("/sandbox");

    await page.getByRole("button", { name: "Get code" }).click();

    await page.getByRole("tab", { name: "Test on my site" }).click();
    await expect(page.getByRole("tab", { name: "Test on my site" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(page.getByRole("button", { name: "Copy preview snippet" })).toBeVisible();
    await expect(page.locator("#sandbox-output-panel")).toContainText('"data-preview": "true"');
    await expect(page.getByRole("button", { name: "Copy bookmarklet" })).toBeVisible();

    await page.getByRole("tab", { name: "Agent prompt" }).click();
    await expect(page.getByRole("button", { name: "Copy agent prompt" })).toBeVisible();
    await expect(page.getByRole("tabpanel")).toContainText("Install BugDrop in this web app");
    await expect(page.getByRole("tabpanel")).toContainText("Do not include data-preview");

    await page.getByRole("tab", { name: "Install script" }).click();
    await expect(page.getByRole("button", { name: "Copy install script" })).toBeVisible();
    await expect(page.locator("#sandbox-output-panel")).toContainText("<script");
    await expect(page.locator("#sandbox-output-panel")).not.toContainText("data-preview");
  });

  test("previews form and success states without console noise", async ({ page }) => {
    const consoleMessages: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error" || message.type() === "warning") {
        consoleMessages.push(message.text());
      }
    });

    await page.goto("/sandbox");

    const previewFrame = page.frameLocator("#sandbox-preview");

    await page.getByRole("button", { name: "Form" }).click();
    await expect(previewFrame.getByText("Send Feedback")).toBeVisible();
    await expect(page.getByRole("button", { name: "Form" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await page.getByRole("button", { name: "Success" }).click();
    await expect(previewFrame.getByText("Preview Complete")).toBeVisible();
    await expect(
      page.getByText("Success is simulated in preview mode. No GitHub issue is created."),
    ).toBeVisible();

    await page.getByRole("button", { name: "Closed" }).click();
    await expect(previewFrame.getByText("Preview Complete")).toHaveCount(0);
    expect(consoleMessages).toEqual([]);
  });

  test("updates generated output and validates unsafe input", async ({ page }) => {
    await page.goto("/sandbox");

    await page.getByLabel("GitHub issue destination").fill("bad repo");
    await page.getByRole("button", { name: "Get code" }).click();
    await expect(page.getByText("Use GitHub owner/repo format before copying")).toBeVisible();
    await expect(page.getByRole("button", { name: "Fix repo" })).toBeDisabled();
    await page.getByRole("button", { name: "Close install output" }).click();

    await page.getByLabel("GitHub issue destination").fill("mean-weasel/bugdrop");
    await page.getByText("Advanced launcher options").click();
    await page.getByLabel("Dismissible").check();
    await page.getByLabel("Dismiss duration in days").fill("soon");
    await page.getByRole("button", { name: "Get code" }).click();
    await expect(page.getByText("Script output is valid")).toHaveCount(0);
    await expect(page.getByText("Dismiss duration must be a positive whole number")).toBeVisible();
    await expect(page.locator("#sandbox-output-panel")).not.toContainText("data-dismiss-duration");
    await page.getByRole("button", { name: "Close install output" }).click();

    await page.getByLabel("Dismiss duration in days").fill("14");
    await page.getByLabel("Radius px").fill("12");
    await page.getByRole("button", { name: "Get code" }).click();
    await expect(page.getByText("Script output is valid")).toBeVisible();
    await expect(page.locator("#sandbox-output-panel")).toContainText('data-dismiss-duration="14"');
    await expect(page.locator("#sandbox-output-panel")).toContainText('data-radius="12"');
    await expect(page.locator("#sandbox-output-panel")).not.toContainText('data-radius="12px"');
  });

  test("generated script reflects field dependencies, optional omissions, and reset", async ({
    page,
  }) => {
    await page.goto("/sandbox");

    await page.getByLabel("Require email").check();
    await page.getByLabel("Button label").fill("Report issue");
    await page.getByText("Advanced styling and self-hosted options").click();
    await page.getByLabel("Shadow").selectOption("hard");
    await page.getByLabel("Category labels JSON").fill('{"bug":[]}');
    await page.getByRole("button", { name: "Get code" }).click();

    await expect(page.getByLabel("Show email")).toBeChecked();
    await expect(page.getByText("Category labels must be JSON")).toBeVisible();
    await expect(page.locator("#sandbox-output-panel")).toContainText('data-label="Report issue"');
    await expect(page.locator("#sandbox-output-panel")).toContainText('data-shadow="hard"');
    await expect(page.locator("#sandbox-output-panel")).toContainText('data-show-email="true"');
    await expect(page.locator("#sandbox-output-panel")).toContainText('data-require-email="true"');
    await expect(page.locator("#sandbox-output-panel")).not.toContainText("data-category-labels");

    await page.getByRole("button", { name: "Close install output" }).click();
    await page.getByRole("button", { name: "Reset" }).click();
    await expect(page.getByLabel("Button label")).toHaveValue("Feedback");
    await expect(page.getByLabel("Require email")).not.toBeChecked();
    await expect(page.getByLabel("Show email")).not.toBeChecked();
    await expect(page.locator("#sandbox-install")).toBeHidden();
  });

  test("mobile layout puts configuration before preview, keeps install hidden until requested, and avoids horizontal overflow", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/sandbox");
    await expectNoHorizontalOverflow(page);

    const positions = await page.evaluate(() => {
      const preview = document.querySelector("#sandbox-preview-panel")?.getBoundingClientRect();
      const config = document.querySelector("#sandbox-configuration")?.getBoundingClientRect();
      const install = document.querySelector("#sandbox-install")?.getBoundingClientRect();
      return {
        previewTop: preview?.top ?? 0,
        configTop: config?.top ?? 0,
        installDisplay: install ? window.getComputedStyle(document.querySelector("#sandbox-install")!).display : "",
      };
    });

    expect(positions.configTop).toBeLessThan(positions.previewTop);
    expect(positions.installDisplay).toBe("none");
  });

  test("mobile install sheet avoids horizontal overflow while open", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto("/sandbox");
    await page.getByRole("button", { name: "Get code" }).click();

    await expect(page.getByRole("dialog", { name: "Get code" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Copy install script" })).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("output tabs expose selected state and a keyboard-scrollable code panel", async ({ page }) => {
    await page.goto("/sandbox");

    await page.getByRole("button", { name: "Get code" }).click();
    await page.getByRole("tab", { name: "Agent prompt" }).click();
    await expect(page.getByRole("tab", { name: "Agent prompt" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(page.getByRole("tabpanel")).toContainText("Install BugDrop in this web app");

    const codeViewer = page.getByLabel("agent output code");
    await expect(codeViewer).toBeVisible();
    await codeViewer.focus();
    await expect(codeViewer).toBeFocused();
  });
});
