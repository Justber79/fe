import { apiPathAgent } from "@/config/constants";
import { useMutationQuery } from "@/hooks";

export const useDeleteAgentContactMembership = (agentId: string, membershipId: number) => {
  return useMutationQuery<unknown, { message: string }>({
    apiPath: `${apiPathAgent}/${agentId}/contact/${membershipId}`,
    method: "delete",
    successMessage: "dashboard.agentProfile.contactDetails.deleteContact.success",
    queryKeyToInvalidate: ["agent", agentId],
  });
};
