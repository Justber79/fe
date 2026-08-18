import { ApiOpportunityGet } from "need4deed-sdk";
import { useStatusDialog, UseStatusDialogReturn } from "../common/useStatusDialog";
import { useTransferOpportunityToAgent } from "@/hooks/useTransferOpportunityToAgent";

export type UseOpportunityAgentDialogReturn = UseStatusDialogReturn<number>;

export const useOpportunityAgentDialog = (opportunity: ApiOpportunityGet) => {
  const { mutate: updateAgent } = useTransferOpportunityToAgent(Number(opportunity.id));

  const onSave = (id: number, { onSuccess }: { onSuccess: () => void }) => {
    updateAgent({ agent: { id } }, { onSuccess });
  };

  return useStatusDialog({
    initial: opportunity.agent?.id,
    onSave,
  });
};
