import type { MetadataRoute } from "next";

const FALLBACK_SITE_URL = "https://pagefoundry.dev";

function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL;
  try {
    return new URL(raw);
  } catch {
    return new URL(FALLBACK_SITE_URL);
  }
}

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        disallow: ["/work/", "/login", "/logout"],
      },
    ],
    sitemap: `${siteUrl.toString().replace(/\/$/, "")}/sitemap.xml`,
  };
}
