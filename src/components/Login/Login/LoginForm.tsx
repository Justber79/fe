import { useForm } from "@tanstack/react-form";
import axios from "axios";
import { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { FormInput } from "../../core/common";
import { Button, Checkbox } from "../../core/button";
import { useMutationQuery } from "@/hooks";
import { apiPathLogin, LOGIN_ERROR_KEYS, LOGIN_ERROR_TOAST_ID } from "@/config/constants";
import Link from "next/link";
import { useParams } from "next/navigation";
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
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  return useMutationQuery<LoginData, LoginResponse>({
    apiPath: apiPathLogin,
    successMessage: "dashboard.login.successMessage",
    onSuccessCallback: async () => {
      onLoginSuccess();
    },
    onErrorCallback: (error) => {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      const key = status ? LOGIN_ERROR_KEYS[status] : undefined;
      if (!key) return false;
      const message =
        status === 401 ? (
          <span>
            {t(key)} <Link href={`/${lang}/forgotten-password`}>{t("dashboard.login.forgotPassword")}?</Link>
          </span>
        ) : (
          t(key)
        );
      if (toast.isActive(LOGIN_ERROR_TOAST_ID)) {
        toast.update(LOGIN_ERROR_TOAST_ID, { render: message, type: "error" });
      } else {
        toast.error(message, { toastId: LOGIN_ERROR_TOAST_ID });
      }
      return true;
    },
  });
};

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const { mutate: login, isPending } = useLoginMutation(onLoginSuccess);
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
              placeHolder=""
              errors={field.state.meta.errors}
            />
          </FieldGroup>
        )}
      </form.Field>

      <form.Field
        name="password"
        validators={{
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
              placeHolder=""
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
              width="100%"
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
