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

export const createOpportunityDetailsSchema = (t: (key: string) => string) =>
  z.object({
    title: z.string().min(1, t(`${i18nPrefix}.opportunityNameRequired`)),
    description: z.string().max(MAX_DESCRIPTION_LENGTH, t(`${i18nPrefix}.descriptionTooLong`)),
    numberOfVolunteers: z.string(),
    mainCommunication: z.array(languageObjectSchema),
    residentsSpeak: z.array(languageObjectSchema),
    availability: z.custom<Availability>().nullable().optional(),
    eventDate: z.date().nullable().optional(),
    eventTime: z.string().optional(),
    activities: z.array(z.string()),
    skills: z.array(z.string()),
  });

export type OpportunityDetailsFormData = z.infer<ReturnType<typeof createOpportunityDetailsSchema>>;

export const createNewOpportunityDetailsSchema = (t: (key: string) => string) =>
  createOpportunityDetailsSchema(t).omit({ title: true });

export type NewOpportunityDetailsFormData = z.infer<ReturnType<typeof createNewOpportunityDetailsSchema>>;
