import { AgentEngagementStatusType, AgentVolunteerSearchType, QueryParamsKeys } from "need4deed-sdk";
import { AgentCardsFilter } from "./types";

// `type`/`services` are populated dynamically from GET /option (like
// `district` below) once the translated AgentType/Service lists load — see
// Agents.tsx's useEffect — rather than hardcoded from an enum.
export const defaultAgentCardsFilter: AgentCardsFilter = {
  [QueryParamsKeys.SEARCH]: "",
  [QueryParamsKeys.DISTRICT]: {},
  type: {},
  volunteerSearch: {
    [AgentVolunteerSearchType.SEARCHING]: false,
    [AgentVolunteerSearchType.NOT_NEEDED]: false,
    [AgentVolunteerSearchType.VOLUNTEERS_FOUND]: false,
  },
  engagementStatus: {
    [AgentEngagementStatusType.NEW]: false,
    [AgentEngagementStatusType.INACTIVE]: false,
    [AgentEngagementStatusType.ACTIVE]: false,
    [AgentEngagementStatusType.UNRESPONSIVE]: false,
  },
  services: {},
};
