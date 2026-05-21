import { z } from "zod";
import { Availability } from "@/components/forms/types";
import { LanguageLevel, LanguageObject } from "@/types";
import { LangPurpose } from "need4deed-sdk";

export const createVolunteerProfileSchema = (t: (key: string) => string) => {
  return z.object({
    languages: z
      .array(
        z.object({
          id: z.number(),
          language: z.string(),
          level: z.union([z.enum(LanguageLevel), z.literal("")]),
          purpose: z.nativeEnum(LangPurpose).optional(),
        }) satisfies z.ZodType<LanguageObject>,
      )
      .min(1, t("dashboard.volunteerProfile.profileSection.validation.languageRequired"))
      .superRefine((languages, ctx) => {
        // Check if any row has a missing language (when level is filled)
        const hasMissingLanguage = languages.some((lang) => lang.language === "" && lang.level !== "");
        if (hasMissingLanguage) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("dashboard.volunteerProfile.profileSection.validation.languageRequired"),
          });
          return;
        }

        // Check if any row has a missing level (when language is filled)
        const hasMissingLevel = languages.some((lang) => lang.language !== "" && lang.level === "");
        if (hasMissingLevel) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("dashboard.volunteerProfile.profileSection.validation.levelRequired"),
          });
          return;
        }

        // Check if at least one complete row exists
        const hasCompleteRow = languages.some((lang) => lang.language !== "" && lang.level !== "");
        if (!hasCompleteRow) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("dashboard.volunteerProfile.profileSection.validation.languageRequired"),
          });
        }
      }),
    availability: z.custom<Availability>((data) => {
      if (!Array.isArray(data)) return false;
      return data.some((day) => day.timeSlots.some((slot: { selected: boolean }) => slot.selected));
    }, t("dashboard.volunteerProfile.profileSection.validation.availabilityRequired")),
    districts: z.array(z.string()).min(1, t("dashboard.volunteerProfile.profileSection.validation.districtsRequired")),
    volunteerType: z.string().min(1, t("dashboard.volunteerProfile.profileSection.validation.volunteerTypeRequired")),
    activities: z
      .array(z.string())
      .min(1, t("dashboard.volunteerProfile.profileSection.validation.activitiesRequired")),
    skills: z.array(z.string()),
  });
};

export type VolunteerProfileFormData = z.infer<ReturnType<typeof createVolunteerProfileSchema>>;
