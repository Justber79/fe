import { ApiAgentProfileGet } from "@/components/Dashboard/Profile/types";
import { apiPathAgent } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { ApiAgentPatch } from "need4deed-sdk";

export const useUpdateOrganization = (agentId: string) => {
  return useMutationQuery<ApiAgentPatch, ApiAgentProfileGet>({
    apiPath: `${apiPathAgent}/${agentId}`,
    method: "patch",
    successMessage: "dashboard.agentProfile.organisationDetails.saveSuccess",
    queryKeyToInvalidate: ["agent", agentId],
  });
};
