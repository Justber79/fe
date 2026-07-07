import React from "react";
import { useForm } from "@tanstack/react-form";
import { FormInput } from "../../core/common";
import { useTranslation } from "react-i18next";
import { Button } from "../../core/button";
import { useMutationQuery } from "@/hooks";
import { useSearchParams } from "next/navigation";
import { apiPathPasswordReset } from "@/config/constants";
import { createResetPasswordSchema } from "./resetPasswordSchema";
import { StyledForm } from "../styles";

interface ResetPasswordData {
  newPassword: string;
  confirmPassword: string;
  token: string;
}

interface ResetPasswordResponse {
  message: string;
}

type Props = {
  onResetSuccess: () => void;
};

const useResetPasswordMutation = (onResetSuccess: () => void) => {
  return useMutationQuery<ResetPasswordData, ResetPasswordResponse>({
    apiPath: apiPathPasswordReset,
    successMessage: "dashboard.login.successResetPasswordMessage",
    onSuccessCallback: async () => {
      onResetSuccess();
    },
  });
};

export function ResetPasswordForm({ onResetSuccess }: Props) {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const urlTokenParam = searchParams.get("token");
  const { mutate: resetPassword, isPending } = useResetPasswordMutation(onResetSuccess);
  const form = useForm({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
      token: urlTokenParam || "",
    },
    onSubmit: async ({ value }) => {
      resetPassword(value);
    },
  });
  const schema = createResetPasswordSchema(t);
  console.log("s", schema);
  return (
    <StyledForm
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.Field
        name="newPassword"
        validators={{
          onChange: ({ value }) => {
            const result = schema.shape.newPassword.safeParse(value);
            if (!result.success) {
              const errorKey = result.error.issues[0].message;
              return errorKey.startsWith("dashboard.") ? t(errorKey) : errorKey;
            }
            return undefined;
          },
        }}
      >
        {(field) => (
          <FormInput
            type="password"
            value={field.state.value}
            onInputChange={field.handleChange}
            placeHolder={t("dashboard.login.newPassword")}
            errors={field.state.meta.errors}
          />
        )}
      </form.Field>
      <form.Field
        name="confirmPassword"
        validators={{
          onChange: ({ value, fieldApi }) => {
            const resultValue = schema.shape.newPassword.safeParse(value);
            if (!resultValue.success) {
              const errorKey = resultValue.error.issues[0].message;
              return errorKey.startsWith("dashboard.") ? t(errorKey) : errorKey;
            }
            const result = schema.safeParse(fieldApi.form.state.values);
            if (!result.success) {
              const confirmError = result.error.issues.find((i) => i.path.includes("confirmPassword"));
              if (confirmError) {
                const errorKey = confirmError.message;
                return errorKey.startsWith("dashboard.") ? t(errorKey) : errorKey;
              }
            }
            return undefined;
          },
        }}
      >
        {(field) => (
          <FormInput
            type="password"
            value={field.state.value}
            onInputChange={field.handleChange}
            placeHolder={t("dashboard.login.confirmPassword")}
            errors={field.state.meta.errors}
          />
        )}
      </form.Field>
      <form.Subscribe selector={(state) => state}>
        {() => (
          <Button
            type="submit"
            text={t("dashboard.login.resetPassword")}
            backgroundcolor={form.state.canSubmit && !isPending ? "var(--color-aubergine)" : "var(--color-grey-50)"}
            textColor={form.state.canSubmit && !isPending ? "var(--color-white)" : "var(--color-grey-400)"}
            textHoverColor="var(--color-magnolia)"
            disabled={
              !form.state.canSubmit || !form.state.values.newPassword || !form.state.values.confirmPassword || isPending
            }
          />
        )}
      </form.Subscribe>
    </StyledForm>
  );
}
