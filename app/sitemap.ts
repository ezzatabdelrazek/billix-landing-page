import type { MetadataRoute } from "next";
import { getAllCategorySlugs, getAllTagSlugs } from "@/content/blogs";

import { SITE_URL } from "@/constants";

// The marketing site lives on billix.xyz (Ezzat 2026-10-18); APP_URL (billix.io) is only for the product links.
const BASE_URL = SITE_URL;

type SitemapPage = {
  path: string;
  changeFrequency: "weekly" | "monthly" | "yearly";
  priority: number;
};

const PAGES: SitemapPage[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/pricing", changeFrequency: "weekly", priority: 0.9 },
  { path: "/enterprise", changeFrequency: "monthly", priority: 0.8 },
  { path: "/blogs", changeFrequency: "weekly", priority: 0.7 },
  { path: "/changelog", changeFrequency: "weekly", priority: 0.6 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms-of-service", changeFrequency: "yearly", priority: 0.3 },
  { path: "/security-policy", changeFrequency: "yearly", priority: 0.3 },
  ...getAllCategorySlugs().map(
    (slug): SitemapPage => ({ path: `/blogs/category/${slug}`, changeFrequency: "weekly", priority: 0.5 }),
  ),
  ...getAllTagSlugs().map(
    (slug): SitemapPage => ({ path: `/blogs/tag/${slug}`, changeFrequency: "weekly", priority: 0.4 }),
  ),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap(({ path, changeFrequency, priority }) => {
    const enUrl = `${BASE_URL}${path}` || BASE_URL;
    const arUrl = `${BASE_URL}/ar${path}`;
    const alternates = {
      languages: {
        en: enUrl,
        ar: arUrl,
      },
    };

    return [
      {
        url: enUrl,
        lastModified: new Date(),
        changeFrequency,
        priority,
        alternates,
      },
      {
        url: arUrl,
        lastModified: new Date(),
        changeFrequency,
        priority: priority * 0.9,
        alternates,
      },
    ];
  });
}
