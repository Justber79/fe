"use client";
import { matchStatusColorMap, matchStatusIconMap } from "@/components/Dashboard/Opportunities/OpportunityCard.helpers";
import { EmptyPlaceholder } from "@/components/core/common/EmptyPlaceholder";
import { EMPTY_PLACEHOLDER_VALUE } from "@/config/constants";
import { formatDateTime } from "@/utils";
import { ShootingStarIcon } from "@phosphor-icons/react";
import { ApiOpportunityGet } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { createVolunteerTypeLabelMap, EditButton, HeaderCard, IconContainer, StatusRowField } from "../common";
import { ChangeOpportunityStatusDialog } from "./ChangeOpportunityStatusDialog";
import { createOpportunityStatusLabelMap } from "./constants";
import { useOpportunityStatusDialog } from "./useOpportunityStatusDialog";

type Props = {
  opportunity: ApiOpportunityGet;
};

const MatchStatusBadge = styled.div<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-4);
  padding: var(--spacing-12);
  border-radius: var(--border-radius-xs);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-24);
  letter-spacing: var(--letter-spacing-tight);
  width: fit-content;
  background-color: var(--color-grey-50);
  color: ${({ $color }) => $color};
`;

export const OpportunityHeader = ({ opportunity }: Props) => {
  const { t } = useTranslation();
  const dialog = useOpportunityStatusDialog(opportunity);
  const statusLabelMap = createOpportunityStatusLabelMap(t);
  const volunteerTypeLabelMap = createVolunteerTypeLabelMap(t);
  const { statusMatch } = opportunity as ApiOpportunityGet & { statusMatch?: string };

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
        title={t("dashboard.opportunityProfile.matchingStatus")}
        extra={
          statusMatch ? (
            <MatchStatusBadge $color={matchStatusColorMap[statusMatch] ?? "var(--color-blue-700)"}>
              {matchStatusIconMap[statusMatch]}
              <span>{t(`dashboard.opportunities.matchStatus.${statusMatch}`)}</span>
            </MatchStatusBadge>
          ) : (
            <EmptyPlaceholder />
          )
        }
      />

      <StatusRowField
        title={t("dashboard.volunteerProfile.volunteerHeader.volunteerType_title")}
        status={opportunity.volunteerType}
        label={opportunity.volunteerType ? volunteerTypeLabelMap[opportunity.volunteerType] : undefined}
      />
    </HeaderCard>
  );
};
