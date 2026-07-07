import React from "react";
import { LoginButtonDiv, StyledForm } from "../LoginForm";
import { useForm } from "@tanstack/react-form";
import { FormInput } from "../../core/common";
import { useTranslation } from "react-i18next";
import { Button } from "../../core/button";
import { useMutationQuery } from "@/hooks";

interface ResetPasswordData {
  email: string;
}

interface ResetPasswordResponse {
  message: string;
}

type Props = {
  onResetSuccess: () => void;
};

const useResetPasswordMutation = (onResetSuccess: () => void) => {
  return useMutationQuery<ResetPasswordData, ResetPasswordResponse>({
    apiPath: "/api/auth/request-reset",
    successMessage: "Email sent",
    onSuccessCallback: async () => {
      onResetSuccess();
    },
  });
};

export function ForgotPasswordForm({ onResetSuccess }: Props) {
  const { t } = useTranslation();
  const { mutate: resetPassword, isPending } = useResetPasswordMutation(onResetSuccess);
  const form = useForm({
    defaultValues: {
      email: "",
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
        name="email"
        validators={{
          onChange: ({ value }) => (!value ? t("dashboard.login.emailMissing") : undefined),
          onChangeAsyncDebounceMs: 500,
          onChangeAsync: async ({ value }) => {
            // Simulating a network request for validation
            await new Promise((resolve) => setTimeout(resolve, 500));
            return value.includes("@") ? undefined : t("dashboard.login.emailMissingAtChar");
          },
        }}
      >
        {(field) => (
          <FormInput
            type="email"
            value={field.state.value}
            onInputChange={field.handleChange}
            placeHolder={t("dashboard.login.email")}
            errors={field.state.meta.errors}
          />
        )}
      </form.Field>
      <LoginButtonDiv>
        <form.Subscribe selector={(state) => state}>
          {() => (
            <Button
              type="submit"
              text={"Send reset link"}
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
