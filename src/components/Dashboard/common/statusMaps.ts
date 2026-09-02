import type React from "react";
import {
  BinocularsIcon,
  CheckCircleIcon,
  HandPalmIcon,
  QuestionIcon,
  SmileyIcon,
  SmileySadIcon,
} from "@phosphor-icons/react";
import { AgentEngagementStatusType, AgentTrustType, AgentVolunteerSearchType } from "need4deed-sdk";
import { agentEngagementStatusConfig } from "./agentEngagementStatusConfig";

export type StatusValue = AgentEngagementStatusType | AgentVolunteerSearchType | AgentTrustType;

export const statusColorMap: Record<StatusValue, string> = {
  [AgentEngagementStatusType.ACTIVE]: agentEngagementStatusConfig[AgentEngagementStatusType.ACTIVE].color,
  [AgentEngagementStatusType.UNRESPONSIVE]: agentEngagementStatusConfig[AgentEngagementStatusType.UNRESPONSIVE].color,
  [AgentEngagementStatusType.INACTIVE]: agentEngagementStatusConfig[AgentEngagementStatusType.INACTIVE].color,
  [AgentEngagementStatusType.NEW]: agentEngagementStatusConfig[AgentEngagementStatusType.NEW].color,
  [AgentEngagementStatusType.INCONTACT]: agentEngagementStatusConfig[AgentEngagementStatusType.INCONTACT].color,
  [AgentEngagementStatusType.TRIED_TO_CONTACT]:
    agentEngagementStatusConfig[AgentEngagementStatusType.TRIED_TO_CONTACT].color,
  [AgentVolunteerSearchType.NOT_NEEDED]: "var(--color-grey-50)",
  [AgentVolunteerSearchType.VOLUNTEERS_FOUND]: "var(--color-green-100)",
  [AgentVolunteerSearchType.SEARCHING]: "var(--color-red-50)",
  [AgentTrustType.UNKNOWN]: "var(--color-grey-50)",
  [AgentTrustType.LOW]: "var(--color-red-50)",
  [AgentTrustType.HIGH]: "var(--color-green-100)",
};

type IconComponent = React.ComponentType<{ size?: number; color?: string }>;

export const statusIconMap: Record<StatusValue, IconComponent> = {
  [AgentEngagementStatusType.ACTIVE]: agentEngagementStatusConfig[AgentEngagementStatusType.ACTIVE].icon,
  [AgentEngagementStatusType.UNRESPONSIVE]: agentEngagementStatusConfig[AgentEngagementStatusType.UNRESPONSIVE].icon,
  [AgentEngagementStatusType.INACTIVE]: agentEngagementStatusConfig[AgentEngagementStatusType.INACTIVE].icon,
  [AgentEngagementStatusType.NEW]: agentEngagementStatusConfig[AgentEngagementStatusType.NEW].icon,
  [AgentEngagementStatusType.INCONTACT]: agentEngagementStatusConfig[AgentEngagementStatusType.INCONTACT].icon,
  [AgentEngagementStatusType.TRIED_TO_CONTACT]:
    agentEngagementStatusConfig[AgentEngagementStatusType.TRIED_TO_CONTACT].icon,
  [AgentVolunteerSearchType.NOT_NEEDED]: HandPalmIcon,
  [AgentVolunteerSearchType.VOLUNTEERS_FOUND]: CheckCircleIcon,
  [AgentVolunteerSearchType.SEARCHING]: BinocularsIcon,
  [AgentTrustType.UNKNOWN]: QuestionIcon,
  [AgentTrustType.LOW]: SmileySadIcon,
  [AgentTrustType.HIGH]: SmileyIcon,
};
