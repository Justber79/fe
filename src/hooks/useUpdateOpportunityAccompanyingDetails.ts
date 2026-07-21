import { apiPathOpportunity } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { ApiOpportunityGet, ApiOpportunityPatch } from "need4deed-sdk";

export type OpportunityAccompanyingDetailsUpdateData = {
  accompanyingDetails: ApiOpportunityPatch["accompanyingDetails"];
};

export const useUpdateOpportunityAccompanyingDetails = (opportunityId: ApiOpportunityGet["id"]) => {
  return useMutationQuery<OpportunityAccompanyingDetailsUpdateData, { message: string; data: ApiOpportunityGet }>({
    apiPath: `${apiPathOpportunity}/${opportunityId}`,
    method: "patch",
    successMessage: "dashboard.opportunityProfile.accompanyingDetails.saveSuccess",
    queryKeyToInvalidate: ["opportunity", String(opportunityId)],
  });
};
