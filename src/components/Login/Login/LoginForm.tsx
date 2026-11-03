import { useForm } from "@tanstack/react-form";
import { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { FormInput } from "../../core/common";
import { Button, Checkbox } from "../../core/button";
import { useMutationQuery } from "@/hooks";
import { apiPathLogin } from "@/config/constants";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FormActions } from "../styles";
import { FieldGroup, FieldLabel, LoginFormLayout, SubmitRow } from "./login-styles";

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  data: { token: string };
}

const useLoginMutation = (onLoginSuccess: () => void) => {
  return useMutationQuery<LoginData, LoginResponse>({
    apiPath: apiPathLogin,
    successMessage: "dashboard.login.successMessage",
    onSuccessCallback: async () => {
      onLoginSuccess();
    },
  });
};

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const { t } = useTranslation();
  const { mutate: login, isPending } = useLoginMutation(onLoginSuccess);
  const { lang } = useParams<{ lang: string }>();
  const fieldId = useId();
  const [rememberMeChecked, setRememberMeChecked] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      login(value);
    },
  });

  return (
    <LoginFormLayout
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.Field
        name="email"
        validators={{
          onSubmit: ({ value }) => (!value ? t("dashboard.login.emailMissing") : undefined),
          onChange: ({ value }) => (!value ? t("dashboard.login.emailMissing") : undefined),
          onChangeAsyncDebounceMs: 500,
          onChangeAsync: async ({ value }) => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            return value.includes("@") ? undefined : t("dashboard.login.emailMissingAtChar");
          },
        }}
      >
        {(field) => (
          <FieldGroup>
            <FieldLabel htmlFor={`${fieldId}-email`}>{t("dashboard.login.email")}</FieldLabel>
            <FormInput
              id={`${fieldId}-email`}
              type="email"
              name="email"
              autoComplete="username"
              value={field.state.value}
              onInputChange={field.handleChange}
              placeHolder={t("dashboard.login.email")}
              errors={field.state.meta.errors}
            />
          </FieldGroup>
        )}
      </form.Field>

      <form.Field
        name="password"
        validators={{
          onSubmit: ({ value }) => (!value ? t("dashboard.login.passwordMissing") : undefined),
          onChange: ({ value }) => (!value ? t("dashboard.login.passwordMissing") : undefined),
        }}
      >
        {(field) => (
          <FieldGroup>
            <FieldLabel htmlFor={`${fieldId}-password`}>{t("dashboard.login.password")}</FieldLabel>
            <FormInput
              id={`${fieldId}-password`}
              type="password"
              name="password"
              autoComplete="current-password"
              value={field.state.value}
              onInputChange={field.handleChange}
              placeHolder={t("dashboard.login.password")}
              errors={field.state.meta.errors}
            />
          </FieldGroup>
        )}
      </form.Field>

      <FormActions>
        <Checkbox
          checked={rememberMeChecked}
          onChange={() => setRememberMeChecked(!rememberMeChecked)}
          height="24px"
          width="24px"
          label={t("dashboard.login.rememberMe")}
          labelFontSize="var(--dashboard-login-checkbox-label-fontSize)"
        />
        <Link href={`/${lang}/forgotten-password`}>{t("dashboard.login.forgotPassword")}?</Link>
      </FormActions>

      <SubmitRow>
        <form.Subscribe selector={(state) => state}>
          {() => (
            <Button
              type="submit"
              text={t("dashboard.login.login")}
              backgroundcolor={form.state.canSubmit && !isPending ? "var(--color-aubergine)" : "var(--color-grey-50)"}
              textColor={form.state.canSubmit && !isPending ? "var(--color-white)" : "var(--color-grey-400)"}
              textHoverColor="var(--color-magnolia)"
              disabled={!form.state.canSubmit || isPending}
            />
          )}
        </form.Subscribe>
      </SubmitRow>
    </LoginFormLayout>
  );
};
