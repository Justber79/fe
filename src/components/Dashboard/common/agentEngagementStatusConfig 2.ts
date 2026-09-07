import type React from "react";
import {
  ChartLineIcon,
  ChatsCircleIcon,
  PhoneDisconnectIcon,
  PhoneXIcon,
  SparkleIcon,
  StopCircleIcon,
} from "@phosphor-icons/react";
import { AgentEngagementStatusType } from "need4deed-sdk";

type IconComponent = React.ComponentType<{ size?: number; color?: string }>;

export interface AgentEngagementStatusConfig {
  color: string;
  icon: IconComponent;
}

export const agentEngagementStatusConfig: Record<AgentEngagementStatusType, AgentEngagementStatusConfig> = {
  [AgentEngagementStatusType.NEW]: {
    color: "var(--color-violet-100)",
    icon: SparkleIcon,
  },
  [AgentEngagementStatusType.ACTIVE]: {
    color: "var(--color-green-100)",
    icon: ChartLineIcon,
  },
  [AgentEngagementStatusType.INACTIVE]: {
    color: "var(--color-grey-50)",
    icon: StopCircleIcon,
  },
  [AgentEngagementStatusType.UNRESPONSIVE]: {
    color: "var(--color-grey-50)",
    icon: PhoneXIcon,
  },
  [AgentEngagementStatusType.INCONTACT]: {
    color: "var(--color-green-500)",
    icon: ChatsCircleIcon,
  },
  [AgentEngagementStatusType.TRIED_TO_CONTACT]: {
    color: "var(--color-grey-200)",
    icon: PhoneDisconnectIcon,
  },
};
