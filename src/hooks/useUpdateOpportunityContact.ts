import { apiPathOpportunity } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { ApiOpportunityGet } from "need4deed-sdk";

export type OpportunityContactUpdateData = {
  contact: {
    id: number;
  };
};

export const useUpdateOpportunityContact = (opportunityId: ApiOpportunityGet["id"]) => {
  return useMutationQuery<OpportunityContactUpdateData, { message: string; data: ApiOpportunityGet }>({
    apiPath: `${apiPathOpportunity}/${opportunityId}`,
    method: "patch",
    successMessage: "dashboard.opportunityProfile.contactDetails.saveSuccess",
    queryKeyToInvalidate: ["opportunity", String(opportunityId)],
  });
};
