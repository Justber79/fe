import { Availability } from "@/components/forms/types";
import { MAX_DESCRIPTION_LENGTH } from "@/config/constants";
import { LanguageLevel } from "@/types";
import { z } from "zod";

const i18nPrefix = "dashboard.opportunityProfile.opportunityDetails.validation";

const languageObjectSchema = z.object({
  id: z.number(),
  language: z.string(),
  level: z.union([z.nativeEnum(LanguageLevel), z.literal("")]),
});

type MainCommunicationLanguageOption = { id: number; title: string };

// The org's main communication language is German, with English as the only
// secondary option — unlike "Residents speak", which allows any language.
export function getMainCommunicationLanguageOptions<T extends MainCommunicationLanguageOption>(apiLanguages: T[]): T[] {
  return apiLanguages.filter((l) => ["german", "english"].includes(l.title.toLowerCase()));
}

// The main-communication field is UI-restricted to German/English, but the
// dropdown alone can't stop a user picking English without German — this
// resolves each row back to a canonical title and enforces the org rule:
// none, German alone, or German+English together.
function resolveLanguageTitle(
  language: string,
  options: MainCommunicationLanguageOption[],
  t: (key: string) => string,
): string | undefined {
  if (!language) return undefined;
  const numId = Number(language);
  if (!isNaN(numId) && numId > 0) {
    return options.find((o) => o.id === numId)?.title;
  }
  return options.find((o) => {
    if (o.title === language || o.title.toLowerCase() === language.toLowerCase()) return true;
    const key = `languageNames.${o.title.toLowerCase()}`;
    const translated = t(key);
    return translated !== key && translated === language;
  })?.title;
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
      const titles = new Set(
        langs
          .map(({ language }) => resolveLanguageTitle(language, mainCommunicationLanguageOptions, t))
          .filter((title): title is string => !!title)
          .map((title) => title.toLowerCase()),
      );
      const isNone = titles.size === 0;
      const isGermanOnly = titles.size === 1 && titles.has("german");
      const isGermanAndEnglish = titles.size === 2 && titles.has("german") && titles.has("english");
      if (!isNone && !isGermanOnly && !isGermanAndEnglish) {
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
