import type { MetadataRoute } from "next";
import { siteURL, supportedLangs } from "@/config/constants";
import { Subpage } from "@/types";

const publicPages = [
  "",
  Subpage.ABOUT,
  Subpage.FAQ,
  Subpage.OPPORTUNITY_CARDS,
  "forms/volunteer",
  "event-page",
  Subpage.RAC_GUIDELINES,
  Subpage.AGREEMENT,
  Subpage.LEGAL_NOTICE,
  Subpage.DATA_PRIVACY,
];

const pageURL = (lang: string, page: string) => `${siteURL}/${lang}${page ? `/${page}` : ""}`;

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPages.flatMap((page) =>
    supportedLangs.map((lang) => ({
      url: pageURL(lang, page),
      alternates: {
        languages: Object.fromEntries(supportedLangs.map((alt) => [alt, pageURL(alt, page)])),
      },
    })),
  );
}
