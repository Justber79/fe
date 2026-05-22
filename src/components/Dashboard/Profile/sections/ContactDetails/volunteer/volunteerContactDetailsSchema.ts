import { VolunteerCommunicationType } from "need4deed-sdk";
import { z } from "zod";

export const createVolunteerContactDetailsSchema = (t: (key: string) => string) => {
  return z.object({
    phone: z
      .string()
      .min(1, t("dashboard.volunteerProfile.contactDetails.validation.phoneRequired")),
    email: z
      .string()
      .min(1, t("dashboard.volunteerProfile.contactDetails.validation.emailRequired"))
      .email(t("dashboard.volunteerProfile.contactDetails.validation.emailInvalid")),
    address: z.string().min(1, t("dashboard.volunteerProfile.contactDetails.validation.addressRequired")),
    preferredCommunicationType: z
      .array(z.enum(Object.values(VolunteerCommunicationType)))
      .min(1, t("dashboard.volunteerProfile.contactDetails.validation.preferredCommunicationTypeRequired")),
  });
};

export type VolunteerContactDetailsFormData = z.infer<ReturnType<typeof createVolunteerContactDetailsSchema>>;
