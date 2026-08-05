"use client";
import { useTranslation } from "react-i18next";
import { ChangeStatusDialog } from "../common";
import { UseOpportunityAgentDialogReturn } from "./useOpportunityAgentDialog";
import { ApiAgentGet } from "need4deed-sdk";

type Props = {
  dialog: UseOpportunityAgentDialogReturn;
  currentAgents: ApiAgentGet[];
};

export const ChangeOpportunityAgentDialog = ({
  dialog: { isOpen, closeDialog, selected, setSelected, saveDialog, isSaveDisabled },
  currentAgents,
}: Props) => {
  const { t } = useTranslation();

  const options = currentAgents
    ?.filter((agent) => Boolean(agent?.id))
    ?.map((agent) => ({
      value: agent?.id,
      label: agent?.title,
      description: agent?.agentDetails.about,
    }));
  return (
    <ChangeStatusDialog
      testId="change-agent-dialog"
      isOpen={isOpen}
      title={t("dashboard.opportunityProfile.ngoModal.title")}
      options={options}
      selected={selected}
      onSelect={setSelected}
      onSave={saveDialog}
      onCancel={closeDialog}
      isSaveDisabled={isSaveDisabled}
      radioName="agentId"
      saveLabel={t("dashboard.opportunityProfile.ngoModal.save")}
      cancelLabel={t("dashboard.opportunityProfile.ngoModal.cancel")}
    />
  );
};
