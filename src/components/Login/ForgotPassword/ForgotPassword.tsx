"use client";
import { useTranslation } from "react-i18next";
import { LoginLayout } from "../../Layout";
import { ForgotPasswordController } from "./ForgotPasswordController";

export function ForgotPassword() {
  const { t } = useTranslation();

  return (
    <LoginLayout heading={t("dashboard.login.sendEmailLink")}>
      <ForgotPasswordController />
    </LoginLayout>
  );
}
