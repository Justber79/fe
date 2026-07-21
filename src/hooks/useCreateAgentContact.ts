import { apiPathAgent } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { ApiAgentContactPost, ApiAgentMembership } from "need4deed-sdk";

export const useCreateAgentContact = (agentId: string) => {
  return useMutationQuery<ApiAgentContactPost, ApiAgentMembership>({
    apiPath: `${apiPathAgent}/${agentId}/contact`,
    method: "post",
    successMessage: "dashboard.agentProfile.contactDetails.addContact.success",
    queryKeyToInvalidate: ["agent", agentId],
  });
};
