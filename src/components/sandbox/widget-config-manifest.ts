export type SandboxConfig = {
  repo: string;
  theme: "auto" | "light" | "dark";
  position: "bottom-right" | "bottom-left";
  color: string;
  label: string;
  icon: string;
  screenshot: "optional" | "auto" | "required";
  welcome: "once" | "always" | "never";
  showName: boolean;
  requireName: boolean;
  showEmail: boolean;
  requireEmail: boolean;
  buttonDismissible: boolean;
  dismissDuration: string;
  showRestore: boolean;
  showButton: boolean;
  screenshotScale: string;
  font: string;
  radius: string;
  bg: string;
  text: string;
  borderWidth: string;
  borderColor: string;
  shadow: "none" | "soft" | "hard";
  categoryLabels: string;
};

export type ValidationMessage = {
  key: string;
  level: "error" | "warning";
  message: string;
};

type ManifestEntry = {
  key: keyof SandboxConfig;
  attribute: string;
  runtimeDefault: string | boolean;
  sandboxInitialValue: string | boolean;
  production: boolean;
  notRenderedReason?: string;
};

export const widgetConfigManifest = [
  {
    key: "repo",
    attribute: "data-repo",
    runtimeDefault: "",
    sandboxInitialValue: "mean-weasel/bugdrop-widget-test",
    production: true,
  },
  {
    key: "theme",
    attribute: "data-theme",
    runtimeDefault: "auto",
    sandboxInitialValue: "light",
    production: true,
  },
  {
    key: "position",
    attribute: "data-position",
    runtimeDefault: "bottom-right",
    sandboxInitialValue: "bottom-right",
    production: true,
  },
  {
    key: "color",
    attribute: "data-color",
    runtimeDefault: "",
    sandboxInitialValue: "#2563eb",
    production: true,
  },
  {
    key: "label",
    attribute: "data-label",
    runtimeDefault: "Feedback",
    sandboxInitialValue: "Feedback",
    production: true,
  },
  {
    key: "icon",
    attribute: "data-icon",
    runtimeDefault: "",
    sandboxInitialValue: "",
    production: true,
  },
  {
    key: "screenshot",
    attribute: "data-screenshot",
    runtimeDefault: "optional",
    sandboxInitialValue: "optional",
    production: true,
  },
  {
    key: "welcome",
    attribute: "data-welcome",
    runtimeDefault: "once",
    sandboxInitialValue: "always",
    production: true,
  },
  {
    key: "showName",
    attribute: "data-show-name",
    runtimeDefault: false,
    sandboxInitialValue: false,
    production: true,
  },
  {
    key: "requireName",
    attribute: "data-require-name",
    runtimeDefault: false,
    sandboxInitialValue: false,
    production: true,
  },
  {
    key: "showEmail",
    attribute: "data-show-email",
    runtimeDefault: false,
    sandboxInitialValue: false,
    production: true,
  },
  {
    key: "requireEmail",
    attribute: "data-require-email",
    runtimeDefault: false,
    sandboxInitialValue: false,
    production: true,
  },
  {
    key: "buttonDismissible",
    attribute: "data-button-dismissible",
    runtimeDefault: false,
    sandboxInitialValue: false,
    production: true,
  },
  {
    key: "dismissDuration",
    attribute: "data-dismiss-duration",
    runtimeDefault: "",
    sandboxInitialValue: "30",
    production: true,
  },
  {
    key: "showRestore",
    attribute: "data-show-restore",
    runtimeDefault: true,
    sandboxInitialValue: true,
    production: true,
  },
  {
    key: "showButton",
    attribute: "data-button",
    runtimeDefault: true,
    sandboxInitialValue: true,
    production: true,
  },
  {
    key: "screenshotScale",
    attribute: "data-screenshot-scale",
    runtimeDefault: "2",
    sandboxInitialValue: "2",
    production: true,
  },
  {
    key: "font",
    attribute: "data-font",
    runtimeDefault: "",
    sandboxInitialValue: "inherit",
    production: true,
  },
  {
    key: "radius",
    attribute: "data-radius",
    runtimeDefault: "",
    sandboxInitialValue: "8",
    production: true,
  },
  {
    key: "bg",
    attribute: "data-bg",
    runtimeDefault: "",
    sandboxInitialValue: "#ffffff",
    production: true,
  },
  {
    key: "text",
    attribute: "data-text",
    runtimeDefault: "",
    sandboxInitialValue: "#162033",
    production: true,
  },
  {
    key: "borderWidth",
    attribute: "data-border-width",
    runtimeDefault: "",
    sandboxInitialValue: "1",
    production: true,
  },
  {
    key: "borderColor",
    attribute: "data-border-color",
    runtimeDefault: "",
    sandboxInitialValue: "#dbe3ee",
    production: true,
  },
  {
    key: "shadow",
    attribute: "data-shadow",
    runtimeDefault: "soft",
    sandboxInitialValue: "soft",
    production: true,
  },
  {
    key: "categoryLabels",
    attribute: "data-category-labels",
    runtimeDefault: "",
    sandboxInitialValue: "",
    production: true,
  },
] as const satisfies readonly ManifestEntry[];

export const attributeMap = Object.fromEntries(
  widgetConfigManifest.map((entry) => [entry.key, entry.attribute]),
) as Record<keyof SandboxConfig, string>;

export const initialConfig = Object.fromEntries(
  widgetConfigManifest.map((entry) => [entry.key, entry.sandboxInitialValue]),
) as SandboxConfig;

export function numericDays(value: string) {
  const trimmed = value.trim();
  return /^[1-9]\d*$/.test(trimmed) ? trimmed : "";
}

export function numericValue(value: string) {
  const trimmed = value.trim();
  return /^(0|[1-9]\d*)(\.\d+)?$/.test(trimmed) ? trimmed : "";
}

export function validRepo(value: string) {
  return /^[^/\s]+\/[^/\s]+$/.test(value.trim());
}

export function validCategoryLabels(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return true;

  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return false;

    const allowed = new Set(["bug", "feature", "question"]);
    return Object.entries(parsed as Record<string, unknown>).every(([key, labels]) => {
      if (!allowed.has(key)) return false;
      return (
        typeof labels === "string" ||
        (Array.isArray(labels) &&
          labels.length > 0 &&
          labels.every((label) => typeof label === "string"))
      );
    });
  } catch {
    return false;
  }
}

export function validateConfig(config: SandboxConfig) {
  const messages: ValidationMessage[] = [];

  if (!validRepo(config.repo)) {
    messages.push({
      key: "repo",
      level: "error",
      message: "Use GitHub owner/repo format before copying a production install.",
    });
  }

  if (config.buttonDismissible && !numericDays(config.dismissDuration)) {
    messages.push({
      key: "dismissDuration",
      level: "warning",
      message: "Dismiss duration must be a positive whole number of days. It is omitted until valid.",
    });
  }

  if (!numericValue(config.radius)) {
    messages.push({
      key: "radius",
      level: "warning",
      message: "Radius must be a number of pixels. It is omitted until valid.",
    });
  }

  if (!numericValue(config.borderWidth)) {
    messages.push({
      key: "borderWidth",
      level: "warning",
      message: "Border width must be a number of pixels. It is omitted until valid.",
    });
  }

  if (!numericValue(config.screenshotScale)) {
    messages.push({
      key: "screenshotScale",
      level: "warning",
      message: "Screenshot scale must be a positive number. It is omitted until valid.",
    });
  }

  if (!validCategoryLabels(config.categoryLabels)) {
    messages.push({
      key: "categoryLabels",
      level: "warning",
      message:
        'Category labels must be JSON using bug, feature, or question keys. It is omitted until valid.',
    });
  }

  return messages;
}

export function scriptAttributes(config: SandboxConfig) {
  const attrs: Partial<Record<keyof SandboxConfig, string>> = {
    repo: config.repo,
    theme: config.theme,
    position: config.position,
    color: config.color,
    label: config.label,
    icon: config.icon,
    screenshot: config.screenshot,
    welcome: config.welcome,
    showName: config.showName ? "true" : "",
    requireName: config.requireName ? "true" : "",
    showEmail: config.showEmail ? "true" : "",
    requireEmail: config.requireEmail ? "true" : "",
    buttonDismissible: config.buttonDismissible ? "true" : "",
    dismissDuration: config.buttonDismissible ? numericDays(config.dismissDuration) : "",
    showRestore: config.showRestore ? "" : "false",
    showButton: config.showButton ? "" : "false",
    screenshotScale: config.screenshotScale === "2" ? "" : numericValue(config.screenshotScale),
    font: config.font,
    radius: numericValue(config.radius),
    bg: config.bg,
    text: config.text,
    borderWidth: numericValue(config.borderWidth),
    borderColor: config.borderColor,
    shadow: config.shadow === "soft" ? "" : config.shadow,
    categoryLabels: validCategoryLabels(config.categoryLabels) ? config.categoryLabels : "",
  };

  return Object.entries(attrs).filter(([, value]) => Boolean(value)) as Array<
    [keyof SandboxConfig, string]
  >;
}
