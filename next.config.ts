import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.producthunt.com",
        pathname: "/widgets/embed-image/v1/**",
      },
    ],
  },
  experimental: {
    mdxRs: {
      mdxType: "gfm",
    },
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.bugdrop.dev" }],
        destination: "https://bugdrop.dev/:path*",
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
