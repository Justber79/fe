import { isValidPLZ } from "@/components/forms/utils";
import { format, isSameDay } from "date-fns";
import { MIN_APPOINTMENT_WORKING_DAYS, TranslatedIntoType } from "need4deed-sdk";
import { z } from "zod";

const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
const i18nPrefix = "dashboard.opportunityProfile.accompanyingDetails.validation";

type Translate = (key: string, options?: Record<string, unknown>) => string;

const isAppointmentTooSoon = (date: Date | null | undefined, minDate?: Date, currentDate?: Date | null) =>
  !!date && !!minDate && !(currentDate && isSameDay(date, currentDate)) && date < minDate;

export const createAccompanyingDetailsSchema = (
  t: Translate,
  required: boolean,
  minAppointmentDate?: Date,
  currentAppointmentDate?: Date | null,
) => {
  const dateTooSoonMessage =
    minAppointmentDate &&
    t(`${i18nPrefix}.dateTooSoon`, {
      days: MIN_APPOINTMENT_WORKING_DAYS,
      date: format(minAppointmentDate, "dd.MM.yyyy"),
    });
  const notTooSoon = (date: Date | null | undefined) =>
    !isAppointmentTooSoon(date, minAppointmentDate, currentAppointmentDate);

  return z.object({
    appointmentAddress: required ? z.string().min(1, t(`${i18nPrefix}.addressRequired`)) : z.string().optional(),
    appointmentPostcode: required
      ? z
          .string()
          .min(1, t(`${i18nPrefix}.postcodeRequired`))
          .refine(isValidPLZ, t("form.error.postcode"))
      : z.string().optional(),
    appointmentDate: required
      ? z.date({ message: t(`${i18nPrefix}.dateRequired`) }).refine(notTooSoon, dateTooSoonMessage)
      : z.date().nullable().optional().refine(notTooSoon, dateTooSoonMessage),
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
