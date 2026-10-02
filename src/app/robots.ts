import type { MetadataRoute } from "next";
import { apiPrefix, siteURL } from "@/config/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [`/${apiPrefix}/`, "/*/dashboard", "/*/verify-email", "/*/reset-password"],
    },
    sitemap: `${siteURL}/sitemap.xml`,
  };
}
