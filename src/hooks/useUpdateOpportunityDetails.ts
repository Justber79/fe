import { apiPathOpportunity } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { ApiOpportunityGet, ApiOpportunityPatch } from "need4deed-sdk";

export const useUpdateOpportunityDetails = (opportunityId: ApiOpportunityGet["id"]) => {
  return useMutationQuery<ApiOpportunityPatch, { message: string; data: ApiOpportunityGet }>({
    apiPath: `${apiPathOpportunity}/${opportunityId}`,
    method: "patch",
    successMessage: "dashboard.opportunityProfile.opportunityDetails.saveSuccess",
    queryKeyToInvalidate: [
      ["opportunity", String(opportunityId)],
      ["opportunity-translations", String(opportunityId)],
    ],
  });
};
