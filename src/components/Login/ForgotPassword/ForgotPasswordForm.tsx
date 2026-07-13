import React from "react";
import { useForm } from "@tanstack/react-form";
import { FormInput } from "../../core/common";
import { useTranslation } from "react-i18next";
import { Button } from "../../core/button";
import { useMutationQuery } from "@/hooks";
import { apiPathRequestPasswordReset } from "@/config/constants";
import Link from "next/link";
import { EmailButtonDiv, StyledForm } from "../styles";

interface ForgotPasswordData {
  email: string;
}

interface ForgotPasswordResponse {
  message: string;
}

type Props = {
  onSuccess: () => void;
};

const useRequestPasswordResetMutation = (onResetSuccess: () => void) => {
  return useMutationQuery<ForgotPasswordData, ForgotPasswordResponse>({
    apiPath: apiPathRequestPasswordReset,
    successMessage: "dashboard.login.successEmailLinkMessage",
    onSuccessCallback: async () => {
      onResetSuccess();
    },
  });
};

export function ForgotPasswordForm({ onSuccess }: Props) {
  const { t } = useTranslation();
  const { mutate: requestPasswordReset, isPending } = useRequestPasswordResetMutation(onSuccess);
  const form = useForm({
    defaultValues: {
      email: "",
    },
    onSubmit: async ({ value }) => {
      requestPasswordReset(value);
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
          onChange: ({ value }) => {
            if (!value) return t("dashboard.login.emailMissing");
            if (!value.includes("@")) return t("dashboard.login.emailMissingAtChar");
            return undefined;
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
      <EmailButtonDiv>
        <form.Subscribe selector={(state) => state}>
          {() => (
            <Button
              type="submit"
              text={t("dashboard.login.sendEmail")}
              backgroundcolor={form.state.canSubmit && !isPending ? "var(--color-aubergine)" : "var(--color-grey-50)"}
              textColor={form.state.canSubmit && !isPending ? "var(--color-white)" : "var(--color-grey-400)"}
              textHoverColor="var(--color-magnolia)"
              disabled={!form.state.canSubmit || isPending}
            />
          )}
        </form.Subscribe>
        <Link href="/login">{t("dashboard.login.backToLogin")}</Link>
      </EmailButtonDiv>
    </StyledForm>
  );
}
