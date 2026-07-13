import React from "react";
import { FieldApi, useForm } from "@tanstack/react-form";
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

type FieldApiType = FieldApi<
  {
    newPassword: string;
    confirmPassword: string;
    token: string;
  },
  "confirmPassword",
  undefined,
  undefined,
  string
>;

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

  const handleValidation = (value: string, fieldApi?: FieldApiType) => {
    const result = schema.shape.newPassword.safeParse(value);
    if (!result.success) {
      return result.error.issues[0].message;
    }
    if (fieldApi) {
      const result = schema.safeParse(fieldApi.form.state.values);
      if (!result.success) {
        const confirmError = result.error.issues.find((i) => i.path.includes("confirmPassword"));
        if (confirmError) {
          return confirmError.message;
        }
      }
    }
    return undefined;
  };
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
          onChange: ({ value }) => handleValidation(value),
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
          onChange: ({ value, fieldApi }) => handleValidation(value, fieldApi),
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
            disabled={!form.state.canSubmit || isPending}
          />
        )}
      </form.Subscribe>
    </StyledForm>
  );
}
