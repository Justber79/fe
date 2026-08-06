import { PreferredCommunicationType } from "need4deed-sdk";
import { z } from "zod";

export const createOpportunityContactDetailsSchema = (t: (key: string) => string) => {
  return z.object({
    name: z.string().min(1, t("dashboard.opportunityProfile.contactDetails.validation.nameRequired")),
    phone: z.string(),
    email: z.string(),
    waysToContact: z.array(z.nativeEnum(PreferredCommunicationType)).optional(),
  });
};

export type OpportunityContactDetailsFormData = z.infer<ReturnType<typeof createOpportunityContactDetailsSchema>>;
