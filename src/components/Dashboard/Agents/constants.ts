import { AgentVolunteerSearchType } from "need4deed-sdk";
import { TFunction } from "i18next";

export const createVolunteerSearchMap = (t: TFunction): Record<AgentVolunteerSearchType, string> => ({
  [AgentVolunteerSearchType.SEARCHING]: t("dashboard.agentProfile.status.volunteerSearch.searching"),
  [AgentVolunteerSearchType.NOT_NEEDED]: t("dashboard.agentProfile.status.volunteerSearch.notNeeded"),
  [AgentVolunteerSearchType.VOLUNTEERS_FOUND]: t("dashboard.agentProfile.status.volunteerSearch.filled"),
});
