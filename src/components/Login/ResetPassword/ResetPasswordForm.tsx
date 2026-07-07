import React from "react";
import { LoginButtonDiv, StyledForm } from "../LoginForm";
import { useForm } from "@tanstack/react-form";
import { FormInput } from "../../core/common";
import { useTranslation } from "react-i18next";
import { Button } from "../../core/button";
import { useMutationQuery } from "@/hooks";
import { useSearchParams } from "next/navigation";

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
    apiPath: "/api/auth/password-reset/confirm",
    successMessage: "Email sent",
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
          onChange: ({ value }) => (!value ? t("dashboard.login.passwordMissing") : undefined),
        }}
      >
        {(field) => (
          <FormInput
            type="password"
            value={field.state.value}
            onInputChange={field.handleChange}
            placeHolder="New Password"
            errors={field.state.meta.errors}
          />
        )}
      </form.Field>
      <form.Field
        name="confirmPassword"
        validators={{
          onChange: ({ value }) =>
            !value
              ? t("dashboard.login.passwordMissing")
              : form.state.values.newPassword !== value
                ? "passwords must match"
                : undefined,
        }}
      >
        {(field) => (
          <FormInput
            type="password"
            value={field.state.value}
            onInputChange={field.handleChange}
            placeHolder="Confirm Password"
            errors={field.state.meta.errors}
          />
        )}
      </form.Field>
      <LoginButtonDiv>
        <form.Subscribe selector={(state) => state}>
          {() => (
            <Button
              type="submit"
              text={"Reset Password"}
              backgroundcolor={form.state.canSubmit && !isPending ? "var(--color-aubergine)" : "var(--color-grey-50)"}
              textColor={form.state.canSubmit && !isPending ? "var(--color-white)" : "var(--color-grey-400)"}
              textHoverColor="var(--color-magnolia)"
              disabled={!form.state.canSubmit || isPending}
            />
          )}
        </form.Subscribe>
      </LoginButtonDiv>
    </StyledForm>
  );
}
