import { ConfirmationDialog } from "@/components/core/common/ConfirmationDialog";
import { EmailNoteField } from "@/components/Dashboard/Profile/sections/shared/EmailNoteField";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  volunteerName: string;
  opportunityName: string | undefined;
  onCancel: () => void;
  onConfirm: (emailNote: string) => void;
  isPending?: boolean;
};

export function SuggestDialog({ volunteerName, opportunityName, onCancel, onConfirm, isPending = false }: Props) {
  const { t } = useTranslation();
  const [emailNote, setEmailNote] = useState("");

  const message = (
    <>
      <strong>{volunteerName}</strong> {t("dashboard.volunteerProfile.suggestDialog.messageMid")}{" "}
      <strong>{opportunityName ?? "…"}</strong> {t("dashboard.volunteerProfile.suggestDialog.messageEnd")}
    </>
  );

  return (
    <ConfirmationDialog
      title={t("dashboard.volunteerProfile.suggestDialog.title")}
      message={message}
      confirmText={t("dashboard.volunteerProfile.suggestDialog.confirm")}
      cancelText={t("dashboard.volunteerProfile.suggestDialog.cancel")}
      onCancel={onCancel}
      onConfirm={() => onConfirm(emailNote)}
      confirmDisabled={isPending}
    >
      <EmailNoteField value={emailNote} onChange={setEmailNote} disabled={isPending} />
    </ConfirmationDialog>
  );
}
