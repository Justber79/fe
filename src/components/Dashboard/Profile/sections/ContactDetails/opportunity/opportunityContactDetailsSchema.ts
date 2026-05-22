import { z } from "zod";

export const createOpportunityContactDetailsSchema = (t: (key: string) => string) => {
  return z.object({
    name: z.string().min(1, t("dashboard.opportunityProfile.contactDetails.validation.nameRequired")),
    phone: z
      .string()
      .min(1, t("dashboard.opportunityProfile.contactDetails.validation.phoneRequired")),
    email: z
      .string()
      .min(1, t("dashboard.opportunityProfile.contactDetails.validation.emailRequired"))
      .email(t("dashboard.opportunityProfile.contactDetails.validation.emailInvalid")),
  });
};

export type OpportunityContactDetailsFormData = z.infer<ReturnType<typeof createOpportunityContactDetailsSchema>>;
