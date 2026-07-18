import { LanguageLevel } from "@/types";
import { AgentType } from "need4deed-sdk";
import { z } from "zod";

const languageObjectSchema = z.object({
  id: z.number(),
  language: z.string(),
  level: z.union([z.enum(LanguageLevel), z.literal("")]),
});

const urlRegex = /^https?:\/\/.+/;

export const createOrganisationDetailsSchema = (t: (key: string) => string) => {
  const required = t(`${i18nPrefix}.required`);

  return z.object({
    title: z.string().min(1, required),
    about: z.string().min(1, required),
    website: z
      .string()
      .min(1, required)
      .refine((val) => urlRegex.test(val), {
        message: t(`${i18nPrefix}.websiteInvalid`),
      }),
    addressStreet: z.string(),
    addressPostcode: z.string(),
    organizationType: z.enum(AgentType),
    operator: z.string().min(1, required),
    services: z.string().min(1, required),
    clientLanguages: z.array(languageObjectSchema).min(1, t(`${i18nPrefix}.clientLanguagesRequired`)),
  });
};

const i18nPrefix = "dashboard.agentProfile.organisationDetails.validation";

export type OrganisationDetailsFormData = z.infer<ReturnType<typeof createOrganisationDetailsSchema>>;
