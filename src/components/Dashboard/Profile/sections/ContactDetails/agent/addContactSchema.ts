import { AgentRoles, PHONE_NUMBER_REGEX } from "@/config/constants";
import { z } from "zod";

export const createAddContactSchema = (t: (key: string) => string) => {
  return z.object({
    firstName: z.string().min(1, t("dashboard.agentProfile.contactDetails.validation.nameRequired")),
    lastName: z.string().min(1, t("dashboard.agentProfile.contactDetails.validation.nameRequired")),
    role: z.enum(AgentRoles, { message: t("dashboard.agentProfile.contactDetails.validation.roleRequired") }),
    email: z.email(t("dashboard.agentProfile.contactDetails.validation.emailInvalid")).optional().or(z.literal("")),
    phone: z
      .string()
      .regex(PHONE_NUMBER_REGEX, t("dashboard.agentProfile.contactDetails.validation.mobileInvalid"))
      .optional()
      .or(z.literal("")),
    addressStreet: z.string().optional().or(z.literal("")),
    addressPostcode: z.string().optional().or(z.literal("")),
  });
};

export type AddContactFormData = z.infer<ReturnType<typeof createAddContactSchema>>;
