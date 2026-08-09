import type React from "react";
import {
  BinocularsIcon,
  ChartLineIcon,
  CheckCircleIcon,
  HandPalmIcon,
  PhoneXIcon,
  QuestionIcon,
  SmileyIcon,
  SmileySadIcon,
  SparkleIcon,
  StopCircleIcon,
} from "@phosphor-icons/react";
import { AgentEngagementStatusType, AgentTrustType, AgentVolunteerSearchType } from "need4deed-sdk";

export type StatusValue = AgentEngagementStatusType | AgentVolunteerSearchType | AgentTrustType;

export const statusColorMap: Record<StatusValue, string> = {
  [AgentEngagementStatusType.ACTIVE]: "var(--color-green-100)",
  [AgentEngagementStatusType.UNRESPONSIVE]: "var(--color-grey-50)",
  [AgentEngagementStatusType.INACTIVE]: "var(--color-grey-50)",
  [AgentEngagementStatusType.NEW]: "var(--color-green-100)",
  [AgentVolunteerSearchType.NOT_NEEDED]: "var(--color-grey-50)",
  [AgentVolunteerSearchType.VOLUNTEERS_FOUND]: "var(--color-green-100)",
  [AgentVolunteerSearchType.SEARCHING]: "var(--color-red-50)",
  [AgentTrustType.UNKNOWN]: "var(--color-grey-50)",
  [AgentTrustType.LOW]: "var(--color-red-50)",
  [AgentTrustType.HIGH]: "var(--color-green-100)",
};

type IconComponent = React.ComponentType<{ size?: number; color?: string }>;

export const statusIconMap: Record<StatusValue, IconComponent> = {
  [AgentEngagementStatusType.ACTIVE]: ChartLineIcon,
  [AgentEngagementStatusType.UNRESPONSIVE]: PhoneXIcon,
  [AgentEngagementStatusType.INACTIVE]: StopCircleIcon,
  [AgentEngagementStatusType.NEW]: SparkleIcon,
  [AgentVolunteerSearchType.NOT_NEEDED]: HandPalmIcon,
  [AgentVolunteerSearchType.VOLUNTEERS_FOUND]: CheckCircleIcon,
  [AgentVolunteerSearchType.SEARCHING]: BinocularsIcon,
  [AgentTrustType.UNKNOWN]: QuestionIcon,
  [AgentTrustType.LOW]: SmileySadIcon,
  [AgentTrustType.HIGH]: SmileyIcon,
};
