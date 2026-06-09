import { apiPathAgent, apiPathOpportunity, apiPathVolunteer, DashboardRoutes } from "@/config/constants";
import { DashboardEntityType } from "@/hooks/useGetEntityTitle";
import { ApiAgentGet, ApiOpportunityGet, ApiVolunteerGet } from "need4deed-sdk";

export type ApiEntityGet = {
  agent: ApiAgentGet;
  opportunity: ApiOpportunityGet;
  volunteer: ApiVolunteerGet;
};

export const processEntity: Record<DashboardEntityType, { linkUrl: string; path: string }> = {
  agent: {
    linkUrl: DashboardRoutes.Agents,
    path: apiPathAgent,
  },
  opportunity: {
    linkUrl: DashboardRoutes.Opportunities,
    path: apiPathOpportunity,
  },
  volunteer: {
    linkUrl: DashboardRoutes.Volunteers,
    path: apiPathVolunteer,
  },
};
