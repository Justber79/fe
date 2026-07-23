import { apiPathOpportunity } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { Id } from "need4deed-sdk";

export const useDeleteOpportunity = (opportunityId: Id, onSuccess?: () => void) => {
  return useMutationQuery<unknown, { message: string }>({
    apiPath: `${apiPathOpportunity}/${opportunityId}`,
    method: "delete",
    successMessage: "dashboard.opportunityProfile.dangerZone.deleteSuccess",
    onSuccessCallback: onSuccess,
  });
};
