import { EMPTY_PLACEHOLDER_VALUE } from "@/config/constants";
import { useTranslation } from "react-i18next";
import { ConfirmationDialog } from "@/components/core/common/ConfirmationDialog";

type Props = {
  opportunityName: string;
  volunteerName: string | undefined;
  onCancel: () => void;
  onConfirm: () => void;
};

export function SuggestDialog({ opportunityName, volunteerName, onCancel, onConfirm }: Props) {
  const { t } = useTranslation();

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
      onConfirm={onConfirm}
    />
  );
}
