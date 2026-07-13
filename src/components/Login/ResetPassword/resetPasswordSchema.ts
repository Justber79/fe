import { z } from "zod";

export const createResetPasswordSchema = (t: (key: string) => string) => {
  return z
    .object({
      newPassword: z
        .string()
        .min(1, { message: t("dashboard.login.passwordMissing") })
        .min(8, { message: t("dashboard.login.passwordTooShort") })
        .max(50, { message: t("dashboard.login.passwordTooLong") }),
      confirmPassword: z.string().min(1, { message: t("dashboard.login.passwordMissing") }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("dashboard.login.passwordNotMatching"),
      path: ["confirmPassword"],
    });
};

export type ResetPasswordFormData = z.infer<ReturnType<typeof createResetPasswordSchema>>;
