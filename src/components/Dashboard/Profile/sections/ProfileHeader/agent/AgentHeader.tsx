"use client";
import { EMPTY_PLACEHOLDER_VALUE } from "@/config/constants";
import { formatDateTime } from "@/utils";
import { HouseIcon } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { useUpdateAgentStatus } from "@/hooks";
import { AgentTrustLevel, ApiAgentProfileGet } from "../../../types/agent";
import { EditButton, HeaderCard, IconContainer, StatusRowField } from "../common";
import { ChangeAgentEngagementStatusDialog } from "./ChangeAgentEngagementStatusDialog";
import {
  createEngagementStatusLabelMap,
  createTrustLevelLabelMap,
  createVolunteerSearchLabelMap,
  getDistrictLabel,
  TRUST_LEVEL_OPTIONS,
} from "./constants";
import { TrustLevelDropdown } from "./TrustLevelDropdown";
import { useAgentEngagementStatusDialog } from "./useAgentEngagementStatusDialog";

type Props = {
  agent: ApiAgentProfileGet;
};

export const AgentHeader = ({ agent }: Props) => {
  const { t, i18n } = useTranslation();
  const districtLabel = getDistrictLabel(agent.district, i18n.language);
  const dialog = useAgentEngagementStatusDialog(agent);
  const { mutate: patchAgent } = useUpdateAgentStatus(agent.id);

  const registeredDate = agent.createdAt ? formatDateTime(agent.createdAt) : EMPTY_PLACEHOLDER_VALUE;
  const subtitle = `${t("dashboard.agentProfile.registeredSince")} ${registeredDate}`;

  const engagementStatusLabels = createEngagementStatusLabelMap(t);
  const volunteerSearchLabels = createVolunteerSearchLabelMap(t);
  const trustLevelLabels = createTrustLevelLabelMap(t);

  const handleTrustLevelChange = (next: AgentTrustLevel) => {
    patchAgent({ trustLevel: next });
  };

  return (
    <HeaderCard
      testId="agent-header"
      avatar={
        <IconContainer data-testid="agent-header-icon">
          <HouseIcon size={120} color="var(--color-blue-500)" weight="duotone" />
        </IconContainer>
      }
      title={agent.title}
      subtitle={subtitle}
      after={<ChangeAgentEngagementStatusDialog dialog={dialog} />}
    >
      <StatusRowField
        title={t("dashboard.agentProfile.engagementStatus")}
        status={agent.statusEngagement}
        label={engagementStatusLabels[agent.statusEngagement]}
        action={<EditButton onClick={dialog.openDialog}>{t("dashboard.agentProfile.changeStatus")}</EditButton>}
      />

      <StatusRowField
        title={t("dashboard.agentProfile.volunteerSearch")}
        status={agent.volunteerSearch}
        label={volunteerSearchLabels[agent.volunteerSearch]}
      />

      <StatusRowField
        title={t("dashboard.agentProfile.trustLevel")}
        extra={
          <TrustLevelDropdown
            value={agent.trustLevel}
            options={TRUST_LEVEL_OPTIONS}
            labels={trustLevelLabels}
            onChange={handleTrustLevelChange}
          />
        }
      />

      <StatusRowField title={t("dashboard.agentProfile.district")} showIcon={false} extra={districtLabel} />
    </HeaderCard>
  );
};
