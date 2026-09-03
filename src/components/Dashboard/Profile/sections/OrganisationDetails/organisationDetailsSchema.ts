import { LanguageLevel } from "@/types";
import { z } from "zod";

const languageObjectSchema = z.object({
  id: z.number(),
  language: z.string(),
  level: z.union([z.enum(LanguageLevel), z.literal("")]),
});

const urlRegex = /^https?:\/\/.+/;

export const createOrganisationDetailsSchema = (t: (key: string) => string, validOperators: string[]) => {
  const required = t(`${i18nPrefix}.required`);

  return z.object({
    title: z.string().min(1, required),
    about: z.string().min(1, required),
    website: z
      .string()
      .refine((val) => !val || urlRegex.test(val), {
        message: t(`${i18nPrefix}.websiteInvalid`),
      })
      .optional(),
    addressStreet: z.string(),
    addressPostcode: z.string(),
    // Stores the translated title (like `district` elsewhere), resolved
    // back to an id at submit time via AgentType/Service option mappings.
    organizationType: z.string().min(1, required),
    operator: z
      .string()
      .min(3, t(`${i18nPrefix}.operatorRequired`))
      .refine((val) => validOperators.includes(val), { message: t(`${i18nPrefix}.operatorInvalid`) }),
    services: z.array(z.string()).min(1, required),
    clientLanguages: z.array(languageObjectSchema).min(1, t(`${i18nPrefix}.clientLanguagesRequired`)),
  });
};

const i18nPrefix = "dashboard.agentProfile.organisationDetails.validation";

export type OrganisationDetailsFormData = z.infer<ReturnType<typeof createOrganisationDetailsSchema>>;
