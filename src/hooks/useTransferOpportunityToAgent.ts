import { apiPathOpportunity } from "@/config/constants";
import { useMutationQuery } from "@/hooks";

type TransferPayload = { agent: { id: number } };

export const useTransferOpportunityToAgent = (opportunityId: number, onSuccess?: () => void) => {
  return useMutationQuery<TransferPayload, unknown>({
    apiPath: `${apiPathOpportunity}/${opportunityId}`,
    method: "patch",
    successMessage: "dashboard.agents.transferMode.success",
    onSuccessCallback: onSuccess,
    queryKeyToInvalidate: ["opportunity", String(opportunityId)],
  });
};
