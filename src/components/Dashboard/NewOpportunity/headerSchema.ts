import z from "zod";
import { VolunteerStateTypeType } from "need4deed-sdk";

export const createHeaderSchema = (t: (key: string) => string) =>
  z.object({
    title: z.string().min(1, t("form.error.required")),
    volunteerType: z.enum([
      VolunteerStateTypeType.REGULAR,
      VolunteerStateTypeType.ACCOMPANYING,
      VolunteerStateTypeType.EVENTS,
    ]),
  });

export type HeaderFormData = z.infer<ReturnType<typeof createHeaderSchema>>;
