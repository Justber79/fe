import { apiPathOpportunity } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { getOpportunityTranslationsKey } from "@/hooks/use-opportunity-translations";
import { ApiOpportunityGet, ApiOpportunityPatch } from "need4deed-sdk";

export const useUpdateOpportunityDetails = (opportunityId: ApiOpportunityGet["id"]) => {
  return useMutationQuery<ApiOpportunityPatch, { message: string; data: ApiOpportunityGet }>({
    apiPath: `${apiPathOpportunity}/${opportunityId}`,
    method: "patch",
    successMessage: "dashboard.opportunityProfile.opportunityDetails.saveSuccess",
    queryKeyToInvalidate: [["opportunity", String(opportunityId)], getOpportunityTranslationsKey(opportunityId)],
  });
};
