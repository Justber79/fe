import { apiPathOpportunity } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { ApiOpportunityGet, OpportunityStatusType } from "need4deed-sdk";

export type OpportunityStatusUpdateData = {
  statusOpportunity: OpportunityStatusType;
};

export const useUpdateOpportunityStatus = (opportunityId: ApiOpportunityGet["id"], agentId?: number) => {
  return useMutationQuery<OpportunityStatusUpdateData, { message: string; data: ApiOpportunityGet }>({
    apiPath: `${apiPathOpportunity}/${opportunityId}`,
    method: "patch",
    successMessage: "dashboard.opportunityProfile.statusUpdateSuccess",
    queryKeyToInvalidate: [
      ["opportunity", String(opportunityId)],
      ["agent", String(agentId)],
    ],
  });
};
