import { apiPathOpportunity } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { ApiOpportunityGet, ApiOpportunityPatch } from "need4deed-sdk";

export type OpportunityTypeUpdateData = {
  opportunity_type: ApiOpportunityPatch["opportunity_type"];
  accompanyingDetails?: ApiOpportunityPatch["accompanyingDetails"];

  // It's not yet implemented in api, for now keep it like that, change later.
  eventDetails?: {
    eventDate?: string;
    eventTime?: string;
  };
};

export const useUpdateOpportunityType = (opportunityId: ApiOpportunityGet["id"]) => {
  return useMutationQuery<OpportunityTypeUpdateData, { message: string; data: ApiOpportunityGet }>({
    apiPath: `${apiPathOpportunity}/${opportunityId}`,
    method: "patch",
    successMessage: "dashboard.opportunityProfile.typeUpdateSuccess",
    queryKeyToInvalidate: ["opportunity", String(opportunityId)],
  });
};
