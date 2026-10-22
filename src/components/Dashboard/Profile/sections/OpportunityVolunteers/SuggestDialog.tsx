import { EMPTY_PLACEHOLDER_VALUE } from "@/config/constants";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ConfirmationDialog } from "@/components/core/common/ConfirmationDialog";
import { EmailNoteField } from "@/components/Dashboard/Profile/sections/shared/EmailNoteField";

type Props = {
  opportunityName: string;
  volunteerName: string | undefined;
  onCancel: () => void;
  onConfirm: (emailNote: string) => void;
  isPending?: boolean;
};

export function SuggestDialog({ opportunityName, volunteerName, onCancel, onConfirm, isPending = false }: Props) {
  const { t } = useTranslation();
  const [emailNote, setEmailNote] = useState("");

  const message = (
    <>
      {t("dashboard.opportunityProfile.volunteersSec.suggestDialog.messageStart")} <strong>{opportunityName}</strong>{" "}
      {t("dashboard.opportunityProfile.volunteersSec.suggestDialog.messageMid")}{" "}
      <strong>{volunteerName ?? EMPTY_PLACEHOLDER_VALUE}</strong>{" "}
      {t("dashboard.opportunityProfile.volunteersSec.suggestDialog.messageEnd")}
    </>
  );

  return (
    <ConfirmationDialog
      title={t("dashboard.opportunityProfile.volunteersSec.suggestDialog.title")}
      message={message}
      confirmText={t("dashboard.opportunityProfile.volunteersSec.suggestDialog.confirm")}
      cancelText={t("dashboard.opportunityProfile.volunteersSec.suggestDialog.cancel")}
      onCancel={onCancel}
      onConfirm={() => onConfirm(emailNote)}
      confirmDisabled={isPending}
    >
      <EmailNoteField value={emailNote} onChange={setEmailNote} disabled={isPending} />
    </ConfirmationDialog>
  );
}
