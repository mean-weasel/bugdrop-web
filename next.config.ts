import createMDX from "@next/mdx";
import type { NextConfig } from "next";

function origin(value: string) {
  return new URL(value).origin;
}

const unsafeWidgetUrl = () => {
  throw new TypeError("Unsafe BugDrop widget URL");
};

export function widgetCspSource(value: string) {
  if (value !== value.trim() || value.includes("\\")) {
    return unsafeWidgetUrl();
  }

  if (value.startsWith("/") && !value.startsWith("//")) {
    const sameOriginUrl = new URL(value, "https://bugdrop.invalid");
    if (
      sameOriginUrl.origin === "https://bugdrop.invalid" &&
      sameOriginUrl.username === "" &&
      sameOriginUrl.password === ""
    ) {
      return "'self'";
    }

    return unsafeWidgetUrl();
  }

  if (!/^https?:\/\//i.test(value)) {
    return unsafeWidgetUrl();
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return unsafeWidgetUrl();
  }

  if (
    (url.protocol !== "http:" && url.protocol !== "https:") ||
    url.username !== "" ||
    url.password !== ""
  ) {
    return unsafeWidgetUrl();
  }

  return url.origin;
}

const widgetOrigin = widgetCspSource(
  process.env.NEXT_PUBLIC_BUGDROP_WIDGET_URL ??
    "https://bugdrop.neonwatty.workers.dev/widget.js",
);
const posthogOrigin = origin(
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
);

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${
    process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""
  } ${widgetOrigin} https://www.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self' ${widgetOrigin} ${posthogOrigin} https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com`,
  "frame-src 'self' https://www.youtube-nocookie.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  experimental: {
    mdxRs: {
      mdxType: "gfm",
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.bugdrop.dev" }],
        destination: "https://bugdrop.dev/:path*",
        permanent: true,
      },
      {
        source: "/security",
        destination: "/docs/security",
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
