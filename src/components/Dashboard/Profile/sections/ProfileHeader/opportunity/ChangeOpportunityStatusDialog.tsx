"use client";
import { useTranslation } from "react-i18next";
import { ChangeStatusDialog } from "../common";
import { createOpportunityStatusLabelMap, OpportunityManualStatusType, STATUS_DESCRIPTION_KEYS } from "./constants";
import { UseOpportunityStatusDialogReturn } from "./useOpportunityStatusDialog";

type Props = {
  dialog: UseOpportunityStatusDialogReturn;
  isAuthorized: boolean;
};

export const ChangeOpportunityStatusDialog = ({
  dialog: { isOpen, closeDialog, selected, setSelected, saveDialog, isSaveDisabled },
  isAuthorized,
}: Props) => {
  const { t } = useTranslation();
  const statusLabelMap = createOpportunityStatusLabelMap(t);

  const options = Object.values(OpportunityManualStatusType)
    .filter((status) => isAuthorized || status !== OpportunityManualStatusType.SEARCHING)
    .map((status) => ({
      value: status,
      label: statusLabelMap[status],
      description: t(`dashboard.opportunityProfile.statusModal.options.${STATUS_DESCRIPTION_KEYS[status]}`),
    }));

  return (
    <ChangeStatusDialog
      testId="change-opportunity-status-dialog"
      isOpen={isOpen}
      title={t("dashboard.opportunityProfile.statusModal.title")}
      options={options}
      selected={selected}
      onSelect={setSelected}
      onSave={saveDialog}
      onCancel={closeDialog}
      isSaveDisabled={isSaveDisabled}
      radioName="opportunity-status"
      saveLabel={t("dashboard.opportunityProfile.statusModal.save")}
      cancelLabel={t("dashboard.opportunityProfile.statusModal.cancel")}
    />
  );
};
