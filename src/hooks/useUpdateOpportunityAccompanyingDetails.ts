import { apiPathOpportunity } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { ApiOpportunityGet, TranslatedIntoType } from "need4deed-sdk";

export type OpportunityAccompanyingDetailsUpdateData = {
  accompanyingDetails: {
    appointmentAddress?: string;
    appointmentPostcode?: string;
    appointmentDistrict?: string;
    appointmentDate?: string;
    appointmentTime?: string;
    refugeeNumber?: string;
    refugeeName?: string;
    refugeeLanguage?: { id: string | number }[];
    appointmentLanguage?: TranslatedIntoType;
  };
};

export const useUpdateOpportunityAccompanyingDetails = (opportunityId: ApiOpportunityGet["id"]) => {
  return useMutationQuery<OpportunityAccompanyingDetailsUpdateData, { message: string; data: ApiOpportunityGet }>({
    apiPath: `${apiPathOpportunity}/${opportunityId}`,
    method: "patch",
    successMessage: "dashboard.opportunityProfile.accompanyingDetails.saveSuccess",
    queryKeyToInvalidate: ["opportunity", String(opportunityId)],
  });
};
