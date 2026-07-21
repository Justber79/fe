import { Availability } from "@/components/forms/types";
import { MAX_DESCRIPTION_LENGTH } from "@/config/constants";
import { LanguageLevel } from "@/types";
import { z } from "zod";
import { resolveFormLanguageToOption } from "./formatters";

const i18nPrefix = "dashboard.opportunityProfile.opportunityDetails.validation";

const languageObjectSchema = z.object({
  id: z.number(),
  language: z.string(),
  level: z.union([z.nativeEnum(LanguageLevel), z.literal("")]),
});

type MainCommunicationLanguageOption = { id: number; title: string; isoCode?: string };

// The org's main communication language is German, with English as the only
// secondary option — unlike "Residents speak", which allows any language.
// isoCode is preferred when the option list provides it; title matching is
// the fallback for callers/tests that only supply id+title.
export function getMainCommunicationLanguageOptions<T extends MainCommunicationLanguageOption>(apiLanguages: T[]): T[] {
  return apiLanguages.filter((l) =>
    l.isoCode ? ["de", "en"].includes(l.isoCode) : ["german", "english"].includes(l.title.toLowerCase()),
  );
}

export const createOpportunityDetailsSchema = (
  t: (key: string) => string,
  mainCommunicationLanguageOptions: MainCommunicationLanguageOption[] = [],
) =>
  z.object({
    title: z.string().min(1, t(`${i18nPrefix}.opportunityNameRequired`)),
    description: z.string().max(MAX_DESCRIPTION_LENGTH, t(`${i18nPrefix}.descriptionTooLong`)),
    numberOfVolunteers: z.string(),
    mainCommunication: z.array(languageObjectSchema).superRefine((langs, ctx) => {
      const selected = langs.filter(({ language }) => !!language);
      if (selected.length === 0) return; // nothing picked — always valid

      const resolved = selected.map(
        ({ language }) => resolveFormLanguageToOption(language, mainCommunicationLanguageOptions, t)?.title,
      );
      // A row that fails to resolve is a legacy/out-of-set language (saved
      // before this restriction existed, or no longer offered) — that must
      // be flagged, not silently dropped from the title set below, or it
      // would incorrectly read as "none selected" and pass validation.
      const hasUnresolved = resolved.some((title) => !title);
      const titles = new Set(resolved.filter((title): title is string => !!title).map((title) => title.toLowerCase()));
      const isGermanOnly = titles.size === 1 && titles.has("german");
      const isGermanAndEnglish = titles.size === 2 && titles.has("german") && titles.has("english");
      if (hasUnresolved || !(isGermanOnly || isGermanAndEnglish)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t(`${i18nPrefix}.mainCommunicationInvalid`),
        });
      }
    }),
    residentsSpeak: z.array(languageObjectSchema),
    availability: z.custom<Availability>().nullable().optional(),
    eventDate: z.date().nullable().optional(),
    eventTime: z.string().optional(),
    activities: z.array(z.string()),
    skills: z.array(z.string()),
  });

export type OpportunityDetailsFormData = z.infer<ReturnType<typeof createOpportunityDetailsSchema>>;

export const createNewOpportunityDetailsSchema = (
  t: (key: string) => string,
  mainCommunicationLanguageOptions: MainCommunicationLanguageOption[] = [],
) => createOpportunityDetailsSchema(t, mainCommunicationLanguageOptions).omit({ title: true });

export type NewOpportunityDetailsFormData = z.infer<ReturnType<typeof createNewOpportunityDetailsSchema>>;
