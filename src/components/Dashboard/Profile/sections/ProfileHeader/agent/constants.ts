import { EMPTY_PLACEHOLDER_VALUE } from "@/config/constants";
import { TFunction } from "i18next";
import { Lang } from "need4deed-sdk";
import { AgentEngagementStatus, AgentTrustLevel, AgentVolunteerSearch, ApiAgentProfileGet } from "../../../types/agent";

export const createEngagementStatusLabelMap = (t: TFunction): Record<AgentEngagementStatus, string> => ({
  [AgentEngagementStatus.NEW]: t("dashboard.agentProfile.status.engagement.new"),
  [AgentEngagementStatus.ACTIVE]: t("dashboard.agentProfile.status.engagement.active"),
  [AgentEngagementStatus.UNRESPONSIVE]: t("dashboard.agentProfile.status.engagement.unresponsive"),
  [AgentEngagementStatus.INACTIVE]: t("dashboard.agentProfile.status.engagement.inactive"),
});

export const AGENT_DIALOG_STATUSES = [AgentEngagementStatus.UNRESPONSIVE, AgentEngagementStatus.INACTIVE] as const;

export const AGENT_ENGAGEMENT_DESCRIPTION_KEYS: Record<(typeof AGENT_DIALOG_STATUSES)[number], string> = {
  [AgentEngagementStatus.UNRESPONSIVE]: "unresponsive_description",
  [AgentEngagementStatus.INACTIVE]: "inactive_description",
};

export const createAgentDialogOptions = (t: TFunction) => {
  const engagementStatusLabels = createEngagementStatusLabelMap(t);
  return AGENT_DIALOG_STATUSES.map((status) => ({
    value: status,
    label: engagementStatusLabels[status],
    description: t(`dashboard.agentProfile.modalData.options.${AGENT_ENGAGEMENT_DESCRIPTION_KEYS[status]}`),
  }));
};

export const createVolunteerSearchLabelMap = (t: TFunction): Record<AgentVolunteerSearch, string> => ({
  [AgentVolunteerSearch.NOT_NEEDED]: t("dashboard.agentProfile.status.volunteerSearch.notNeeded"),
  [AgentVolunteerSearch.VOLUNTEERS_FOUND]: t("dashboard.agentProfile.status.volunteerSearch.filled"),
  [AgentVolunteerSearch.SEARCHING]: t("dashboard.agentProfile.status.volunteerSearch.searching"),
});

export const TRUST_LEVEL_OPTIONS = [AgentTrustLevel.HIGH, AgentTrustLevel.LOW, AgentTrustLevel.UNKNOWN] as const;

export const createTrustLevelLabelMap = (t: TFunction): Record<AgentTrustLevel, string> => ({
  [AgentTrustLevel.UNKNOWN]: t("dashboard.agentProfile.status.trustLevel.unknown"),
  [AgentTrustLevel.LOW]: t("dashboard.agentProfile.status.trustLevel.low"),
  [AgentTrustLevel.HIGH]: t("dashboard.agentProfile.status.trustLevel.high"),
});

export const getDistrictLabel = (district: ApiAgentProfileGet["district"], language: string): string => {
  const { title } = district || {};
  return title?.[language as Lang] ?? title?.en ?? EMPTY_PLACEHOLDER_VALUE;
};
