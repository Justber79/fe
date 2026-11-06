"use client";
import { LoginLayout } from "../../Layout";
import { useTranslation } from "react-i18next";
import { LoginController } from "./LoginController";

export function Login() {
  const { t } = useTranslation();
  return (
    <LoginLayout heading={t("dashboard.login.login")} showRegistration>
      <LoginController />
    </LoginLayout>
  );
}
