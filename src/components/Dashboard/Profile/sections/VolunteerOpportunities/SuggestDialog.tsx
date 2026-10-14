import { ConfirmationDialog } from "@/components/core/common/ConfirmationDialog";
import { useTranslation } from "react-i18next";

type Props = {
  volunteerName: string;
  opportunityName: string | undefined;
  onCancel: () => void;
  onConfirm: () => void;
};

export function SuggestDialog({ volunteerName, opportunityName, onCancel, onConfirm }: Props) {
  const { t } = useTranslation();

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
      onConfirm={onConfirm}
    />
  );
}
