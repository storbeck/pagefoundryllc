import type { MetadataRoute } from "next";
import { writingConfigs } from "@/lib/writing";

const FALLBACK_SITE_URL = "https://pagefoundry.dev";

function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL;
  try {
    return new URL(raw);
  } catch {
    return new URL(FALLBACK_SITE_URL);
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl().toString().replace(/\/$/, "");
  const lastModified = new Date();
  const publicRoutes = ["/", "/appdev", "/ux", "/ai", "/projects", "/writing"];
  const insightRoutes = writingConfigs.map((post) => `/writing/${post.slug}`);
  const allRoutes = [...publicRoutes, ...insightRoutes];

  return allRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
