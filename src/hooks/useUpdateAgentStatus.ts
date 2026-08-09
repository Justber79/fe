import { apiPathAgent } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import {
  AgentEngagementStatus,
  AgentTrustLevel,
  AgentVolunteerSearch,
  ApiAgentProfileGet,
} from "@/components/Dashboard/Profile/types";

export type AgentStatusUpdateData = {
  statusEngagement?: AgentEngagementStatus;
  trustLevel?: AgentTrustLevel;
  volunteerSearch?: AgentVolunteerSearch;
};

export const useUpdateAgentStatus = (agentId: number, noToast = false) => {
  return useMutationQuery<AgentStatusUpdateData, { message: string; data: ApiAgentProfileGet }>({
    apiPath: `${apiPathAgent}/${agentId}`,
    method: "patch",
    successMessage: "dashboard.agentProfile.statusUpdateSuccess",
    queryKeyToInvalidate: ["agent", String(agentId)],
    noToast,
  });
};
