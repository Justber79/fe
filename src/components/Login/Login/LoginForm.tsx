import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FormInput } from "../../core/common";
import { Button, Checkbox } from "../../core/button";
import { useMutationQuery } from "@/hooks";
import { apiPathLogin } from "@/config/constants";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormActions, LoginButtonDiv, StyledForm } from "../styles";

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
  const router = useRouter();
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

      <form.Field
        name="password"
        validators={{
          onChange: ({ value }) => (!value ? t("dashboard.login.passwordMissing") : undefined),
        }}
      >
        {(field) => (
          <FormInput
            type="password"
            value={field.state.value}
            onInputChange={field.handleChange}
            placeHolder={t("dashboard.login.password")}
            errors={field.state.meta.errors}
          />
        )}
      </form.Field>

      <FormActions>
        <Checkbox
          checked={rememberMeChecked}
          onChange={() => setRememberMeChecked(!rememberMeChecked)}
          // !Reason for fixed value: var() definition is not working for SVGs and a value should be given for initial SSR.
          height="24px"
          width="24px"
          label={t("dashboard.login.rememberMe")}
          labelFontSize="var(--dashboard-login-checkbox-label-fontSize)"
        />
        <Link href={"/forgotten-password"} onClick={() => router.push("forgotten-password")}>
          {t("dashboard.login.forgotPassword")}?
        </Link>
      </FormActions>

      <LoginButtonDiv>
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

        <Button
          type="button"
          onClick={() => router.push("/register/agent")}
          text={t("dashboard.login.createAccount")}
          backgroundcolor="transparent"
          textColor="var(--color-aubergine)"
          textHoverColor="var(--color-aubergine)"
          border="1px solid var(--color-aubergine)"
          height="48px"
          padding="8px 20px"
        />
      </LoginButtonDiv>
    </StyledForm>
  );
};
