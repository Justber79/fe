import { isValidPLZ } from "@/components/forms/utils";
import { TranslatedIntoType } from "need4deed-sdk";
import { z } from "zod";

const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
const i18nPrefix = "dashboard.opportunityProfile.accompanyingDetails.validation";

export const createAccompanyingDetailsSchema = (t: (key: string) => string, required: boolean) => {
  return z.object({
    appointmentAddress: required ? z.string().min(1, t(`${i18nPrefix}.addressRequired`)) : z.string().optional(),
    appointmentPostcode: required
      ? z
          .string()
          .min(1, t(`${i18nPrefix}.postcodeRequired`))
          .refine(isValidPLZ, t("form.error.postcode"))
      : z.string().optional(),
    appointmentDate: required ? z.date({ message: t(`${i18nPrefix}.dateRequired`) }) : z.date().nullable().optional(),
    appointmentTime: required
      ? z
          .string()
          .min(1, t(`${i18nPrefix}.timeRequired`))
          .regex(timeRegex, t(`${i18nPrefix}.invalidTimeFormat`))
      : z
          .string()
          .optional()
          .refine((val) => !val || timeRegex.test(val), {
            message: t(`${i18nPrefix}.invalidTimeFormat`),
          }),
    refugeeNumber: z.string().optional(),
    refugeeName: required ? z.string().min(1, t(`${i18nPrefix}.nameRequired`)) : z.string().optional(),
    refugeeLanguage: z.array(z.string()).optional(),
    appointmentLanguage: required
      ? z.nativeEnum(TranslatedIntoType, { message: t(`${i18nPrefix}.appointmentLanguageRequired`) })
      : z.nativeEnum(TranslatedIntoType).or(z.literal("")).optional(),
  });
};

export type AccompanyingDetailsFormData = z.infer<ReturnType<typeof createAccompanyingDetailsSchema>>;
