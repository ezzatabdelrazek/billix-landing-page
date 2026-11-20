import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  experimental: {
    optimizePackageImports: ["lucide-react", "motion", "gsap"],
  },
  images: {
    // Self-hosted: every image in /public is pre-rendered as WebP width variants at q92
    // (scripts/image-variants.mjs, runs before each build), so Vercel's paid optimizer is never used.
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
    // Widths match image-variants.json, so every srcset step has its own file.
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920, 2400, 3200],
    imageSizes: [256, 384],
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        {
          key: "X-Frame-Options",
          value: "DENY",
        },
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
      ],
    },
  ],
};

export default withNextIntl(nextConfig);
