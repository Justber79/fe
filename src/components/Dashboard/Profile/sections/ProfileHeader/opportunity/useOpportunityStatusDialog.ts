import { useUpdateOpportunityStatus } from "@/hooks/useUpdateOpportunityStatus";
import { ApiOpportunityGet, OpportunityStatusType } from "need4deed-sdk";
import { useStatusDialog, UseStatusDialogReturn } from "../common/useStatusDialog";
import { MANUAL_TO_SDK, OpportunityManualStatusType, SDK_TO_MANUAL } from "./constants";

export type UseOpportunityStatusDialogReturn = UseStatusDialogReturn<OpportunityManualStatusType>;

const toManualStatus = (status: OpportunityStatusType): OpportunityManualStatusType =>
  SDK_TO_MANUAL[status] ?? OpportunityManualStatusType.NEW;

export const useOpportunityStatusDialog = (
  opportunity: ApiOpportunityGet,
  agentId?: number | null,
): UseOpportunityStatusDialogReturn => {
  const { mutate: updateStatus } = useUpdateOpportunityStatus(opportunity.id, agentId ?? 0);

  const onSave = (status: OpportunityManualStatusType, { onSuccess }: { onSuccess: () => void }) => {
    const sdkStatus = MANUAL_TO_SDK[status];
    if (sdkStatus) {
      updateStatus({ statusOpportunity: sdkStatus }, { onSuccess });
    } else {
      onSuccess();
    }
  };

  return useStatusDialog({
    initial: toManualStatus(opportunity.statusOpportunity),
    onSave,
  });
};
