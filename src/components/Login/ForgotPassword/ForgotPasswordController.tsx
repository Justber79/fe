import { Heading3 } from "@/components/styled/text";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { EnvelopeIcon } from "@phosphor-icons/react";
import { EmailSentMessageDiv } from "../styles";

export function ForgotPasswordController() {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { t } = useTranslation();

  return isEmailSent ? (
    <EmailSentMessageDiv>
      <EnvelopeIcon size={44} />
      <Heading3 margin={0}>{t("dashboard.login.checkEmails")}</Heading3>
    </EmailSentMessageDiv>
  ) : (
    <ForgotPasswordForm onSuccess={() => setIsEmailSent(true)} />
  );
}
