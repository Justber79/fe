import { AgentServiceType, AgentType, AgentVolunteerSearchType } from "need4deed-sdk";
import { TFunction } from "i18next";

export const createAgentTypeMap = (t: TFunction): Record<AgentType, string> => ({
  [AgentType.AE]: t("dashboard.agents.filters.type.ae"),
  [AgentType.ASOG]: t("dashboard.agents.filters.type.asog"),
  [AgentType.COUNSELING_CENTER]: t("dashboard.agents.filters.type.counseling-center"),
  [AgentType.GU1]: t("dashboard.agents.filters.type.gu1"),
  [AgentType.GU2]: t("dashboard.agents.filters.type.gu2"),
  [AgentType.GU2_PLUS]: t("dashboard.agents.filters.type.gu2+"),
  [AgentType.GU3]: t("dashboard.agents.filters.type.gu3"),
  [AgentType.MULTIPLE_SOCIAL_SUPPORT]: t("dashboard.agents.filters.type.multiple-social-support"),
  [AgentType.NU]: t("dashboard.agents.filters.type.nu"),
  [AgentType.TANDEM]: t("dashboard.agents.filters.type.tandem"),
});

export const createVolunteerSearchMap = (t: TFunction): Record<AgentVolunteerSearchType, string> => ({
  [AgentVolunteerSearchType.SEARCHING]: t("dashboard.agentProfile.status.volunteerSearch.searching"),
  [AgentVolunteerSearchType.NOT_NEEDED]: t("dashboard.agentProfile.status.volunteerSearch.notNeeded"),
  [AgentVolunteerSearchType.VOLUNTEERS_FOUND]: t("dashboard.agentProfile.status.volunteerSearch.filled"),
});

export const createServiceTypeMap = (t: TFunction): Record<AgentServiceType, string> => ({
  [AgentServiceType.CHILDCARE]: t("dashboard.agentProfile.status.serviceType.childcare"),
  [AgentServiceType.CONSULTATION]: t("dashboard.agentProfile.status.serviceType.consultation"),
  [AgentServiceType.JOB_COACHING]: t("dashboard.agentProfile.status.serviceType.jobCoaching"),
  [AgentServiceType.REFUGEE_ACCOMMODATION]: t("dashboard.agentProfile.status.serviceType.refugeeAccommodation"),
  [AgentServiceType.SPORT]: t("dashboard.agentProfile.status.serviceType.sport"),
  [AgentServiceType.TANDEM]: t("dashboard.agentProfile.status.serviceType.tandem"),
  [AgentServiceType.TUTORING]: t("dashboard.agentProfile.status.serviceType.tutoring"),
  [AgentServiceType.VOLUNTARY_SUPPORT]: t("dashboard.agentProfile.status.serviceType.volunteerSupport"),
  [AgentServiceType.WELFARE]: t("dashboard.agentProfile.status.serviceType.welfare"),
  [AgentServiceType.YOUTH]: t("dashboard.agentProfile.status.serviceType.youth"),
});
