"use client";
import { useTranslation } from "react-i18next";
import { LoginLayout } from "../../Layout";
import { ResetPasswordController } from "./ResetPasswordController";

export function ResetPassword() {
  const { t } = useTranslation();

  return (
    <LoginLayout heading={t("dashboard.login.resetPassword")}>
      <ResetPasswordController />
    </LoginLayout>
  );
}
