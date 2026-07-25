import { apiPathAgent } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { ApiAgentContactPatch, ApiAgentMembership } from "need4deed-sdk";

export const useUpdateAgentContactMembership = (agentId: string, membershipId: number) => {
  return useMutationQuery<ApiAgentContactPatch, ApiAgentMembership>({
    apiPath: `${apiPathAgent}/${agentId}/contact/${membershipId}`,
    method: "patch",
    successMessage: "dashboard.agentProfile.contactDetails.editContact.success",
    queryKeyToInvalidate: ["agent", agentId],
  });
};
