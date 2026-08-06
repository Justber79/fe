"use client";
import { useTranslation } from "react-i18next";
import { ChangeStatusDialog } from "../common";
import { createAgentVolunteerSearchDialogOptions } from "./constants";
import { UseAgentVolunteerSearchDialogReturn } from "./useAgentVolunteerSearchDialog";

type Props = {
  dialog: UseAgentVolunteerSearchDialogReturn;
};

export const ChangeAgentVolunteerSearchDialog = ({
  dialog: { isOpen, closeDialog, selected, setSelected, saveDialog, isSaveDisabled },
}: Props) => {
  const { t } = useTranslation();
  const options = createAgentVolunteerSearchDialogOptions(t);

  return (
    <ChangeStatusDialog
      testId="change-agent-volunteer-search-dialog"
      isOpen={isOpen}
      title={t("dashboard.agentProfile.modalData.titleVolSearch")}
      options={options}
      selected={selected}
      onSelect={setSelected}
      onSave={saveDialog}
      onCancel={closeDialog}
      isSaveDisabled={isSaveDisabled}
      radioName="agent-volunteer-search"
      saveLabel={t("dashboard.agentProfile.modalData.save")}
      cancelLabel={t("dashboard.agentProfile.modalData.cancel")}
    />
  );
};
