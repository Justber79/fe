import { useUpdateOpportunityStatus } from "@/hooks/useUpdateOpportunityStatus";
import { AgentVolunteerSearchType, ApiOpportunityGet, OpportunityStatusType } from "need4deed-sdk";
import { useStatusDialog, UseStatusDialogReturn } from "../common/useStatusDialog";
import { MANUAL_TO_SDK, OpportunityManualStatusType, SDK_TO_MANUAL } from "./constants";
import { useUpdateAgentStatus } from "@/hooks/useUpdateAgentStatus";

export type UseOpportunityStatusDialogReturn = UseStatusDialogReturn<OpportunityManualStatusType>;

const toManualStatus = (status: OpportunityStatusType): OpportunityManualStatusType =>
  SDK_TO_MANUAL[status] ?? OpportunityManualStatusType.NEW;

export const useOpportunityStatusDialog = (opportunity: ApiOpportunityGet): UseOpportunityStatusDialogReturn => {
  const { mutate: updateStatus } = useUpdateOpportunityStatus(opportunity.id);
  const { mutate: updateVolunteerSearch } = useUpdateAgentStatus(opportunity.agent?.id);

  const handleStatusChange = (status: OpportunityManualStatusType, { onSuccess }: { onSuccess: () => void }) => {
    const sdkStatus = MANUAL_TO_SDK[status];
    if (sdkStatus) {
      updateStatus({ statusOpportunity: sdkStatus }, { onSuccess });
      if (
        sdkStatus === OpportunityStatusType.ACTIVE ||
        sdkStatus === OpportunityStatusType.NEW ||
        sdkStatus === OpportunityStatusType.SEARCHING
      ) {
        updateVolunteerSearch({ volunteerSearch: AgentVolunteerSearchType.SEARCHING }, { onSuccess });
      }
    } else {
      onSuccess();
    }
  };

  const onSave = (status: OpportunityManualStatusType, { onSuccess }: { onSuccess: () => void }) => {
    // const sdkStatus = MANUAL_TO_SDK[status];
    // if (sdkStatus) {
    //   updateStatus({ statusOpportunity: sdkStatus }, { onSuccess });
    // } else {
    //   onSuccess();
    // }
    handleStatusChange(status, { onSuccess });
  };

  return useStatusDialog({
    initial: toManualStatus(opportunity.statusOpportunity),
    onSave,
  });
};
