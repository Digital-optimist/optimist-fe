import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/login", "/sign-up", "/reset-password", "/forgot-password"],
      },
    ],
    sitemap: "https://www.optimist.in/sitemap.xml",
    host: "https://www.optimist.in",
  };
}
