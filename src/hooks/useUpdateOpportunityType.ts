import { apiPathOpportunity } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { ApiOpportunityGet, OpportunityType, TranslatedIntoType } from "need4deed-sdk";

export type OpportunityTypeUpdateData = {
  opportunity_type: OpportunityType;
  accompanyingDetails?: {
    appointmentAddress?: string;
    appointmentPostcode?: string;
    appointmentDate?: string;
    appointmentTime?: string;
    refugeeNumber?: string;
    refugeeName?: string;
    refugeeLanguage?: { id: string | number }[];
    appointmentLanguage?: TranslatedIntoType;
  };
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
