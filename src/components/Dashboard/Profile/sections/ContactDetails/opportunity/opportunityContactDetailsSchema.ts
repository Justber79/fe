import { PHONE_NUMBER_REGEX } from "@/config/constants";
import { PreferredCommunicationType } from "need4deed-sdk";
import { z } from "zod";

export const createOpportunityContactDetailsSchema = (t: (key: string) => string) => {
  return z.object({
    name: z.string().min(1, t("dashboard.opportunityProfile.contactDetails.validation.nameRequired")),
    phone: z
      .string()
      .min(1, t("dashboard.opportunityProfile.contactDetails.validation.phoneRequired"))
      .regex(PHONE_NUMBER_REGEX, t("dashboard.opportunityProfile.contactDetails.validation.phoneInvalid")),
    email: z
      .string()
      .min(1, t("dashboard.opportunityProfile.contactDetails.validation.emailRequired"))
      .email(t("dashboard.opportunityProfile.contactDetails.validation.emailInvalid")),
    waysToContact: z.array(z.nativeEnum(PreferredCommunicationType)).optional(),
  });
};

export type OpportunityContactDetailsFormData = z.infer<ReturnType<typeof createOpportunityContactDetailsSchema>>;
