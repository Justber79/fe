import { z } from "zod";

export const createAgentFormSchema = (t: (key: string) => string) => {
  return z.object({
    title: z.string().min(1, t("dashboard.agents.createAgent.validation.titleRequired")),
    addressStreet: z.string().optional().or(z.literal("")),
    addressPostcode: z.string().optional().or(z.literal("")),
  });
};

export type CreateAgentFormData = z.infer<ReturnType<typeof createAgentFormSchema>>;
