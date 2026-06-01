"use client";
import { EMPTY_PLACEHOLDER_VALUE } from "@/config/constants";
import { formatDateTime } from "@/utils";
import { ShootingStarIcon } from "@phosphor-icons/react";
import { ApiOpportunityGet, VolunteerStateMatchType } from "need4deed-sdk";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { createVolunteerTypeLabelMap, EditButton, HeaderCard, IconContainer, StatusRowField } from "../common";
import { ChangeOpportunityStatusDialog } from "./ChangeOpportunityStatusDialog";
import { createMatchLabelMap } from "../volunteer/constants";
import { createOpportunityStatusLabelMap } from "./constants";
import { useOpportunityStatusDialog } from "./useOpportunityStatusDialog";

type OpportunityWithMatch = ApiOpportunityGet & { statusMatch?: VolunteerStateMatchType };

type Props = {
  opportunity: OpportunityWithMatch;
};

export const OpportunityHeader = ({ opportunity }: Props) => {
  const { t, i18n } = useTranslation();
  const dialog = useOpportunityStatusDialog(opportunity);
  const statusLabelMap = createOpportunityStatusLabelMap(t);
  const volunteerTypeLabelMap = createVolunteerTypeLabelMap(t);
  const matchLabelMap = createMatchLabelMap(t);

  const postedDate = opportunity.createdAt ? formatDateTime(opportunity.createdAt) : EMPTY_PLACEHOLDER_VALUE;
  const subtitle = `${t("dashboard.opportunityProfile.postedOn")} ${postedDate}`;

  return (
    <HeaderCard
      testId="opportunity-header"
      avatar={
        <IconContainer data-testid="opportunity-header-icon">
          <ShootingStarIcon size={120} color="var(--color-blue-500)" weight="duotone" />
        </IconContainer>
      }
      title={opportunity.title}
      subtitle={subtitle}
      after={<ChangeOpportunityStatusDialog dialog={dialog} />}
    >
      <StatusRowField
        title={t("dashboard.opportunityProfile.currentStatus")}
        status={dialog.selected}
        label={statusLabelMap[dialog.selected]}
        action={<EditButton onClick={dialog.openDialog}>{t("dashboard.opportunityProfile.change_status")}</EditButton>}
      />

      <StatusRowField
        title={t("dashboard.volunteerProfile.volunteerHeader.volunteerType_title")}
        status={opportunity.volunteerType}
        label={opportunity.volunteerType ? volunteerTypeLabelMap[opportunity.volunteerType] : undefined}
      />

      <StatusRowField
        title={t("dashboard.volunteerProfile.volunteerHeader.matchStatus_title")}
        status={opportunity.statusMatch}
        label={opportunity.statusMatch ? matchLabelMap[opportunity.statusMatch] : undefined}
      />

      {opportunity.agent?.id && (
        <StatusRowField
          title={t("dashboard.opportunityProfile.agent")}
          extra={
            <AgentLink href={`/${i18n.language}/dashboard/agents/${opportunity.agent.id}`}>
              {opportunity.agent.name}
            </AgentLink>
          }
        />
      )}
    </HeaderCard>
  );
};

const AgentLink = styled(Link)`
  color: var(--color-blue-700);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
