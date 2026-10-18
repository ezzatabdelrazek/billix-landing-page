import type { MetadataRoute } from "next";

import { SITE_URL } from "@/constants";

// The marketing site lives on billix.xyz (Ezzat 2026-10-18); APP_URL (billix.io) is only for the product links.
const BASE_URL = SITE_URL;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
