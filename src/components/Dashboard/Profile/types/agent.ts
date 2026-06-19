import { AgentDetails, ApiAgentGet } from "need4deed-sdk";

export {
  AgentEngagementStatusType as AgentEngagementStatus,
  AgentTrustType as AgentTrustLevel,
  AgentVolunteerSearchType as AgentVolunteerSearch,
} from "need4deed-sdk";

type AgentDetailsExtended = AgentDetails & {
  addressStreet?: string | null;
  addressPostcode?: string | null;
};

export type ApiAgentProfileGet = Omit<ApiAgentGet, "agentDetails"> & {
  agentDetails: AgentDetailsExtended;
};
