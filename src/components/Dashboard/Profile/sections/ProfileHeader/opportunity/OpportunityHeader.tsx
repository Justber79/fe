"use client";
import {
  matchStatusColorMap,
  matchStatusIconMap,
  OpportunityMatchStatusType,
} from "@/components/Dashboard/Opportunities/OpportunityCard.helpers";
import { EmptyPlaceholder } from "@/components/core/common/EmptyPlaceholder";
import { EMPTY_PLACEHOLDER_VALUE } from "@/config/constants";
import { formatDateTime } from "@/utils";
import { ShootingStarIcon } from "@phosphor-icons/react";
import { ApiOpportunityGet, UserRole } from "need4deed-sdk";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { createVolunteerTypeLabelMap, EditButton, HeaderCard, IconContainer, StatusRowField } from "../common";
import { ChangeOpportunityStatusDialog } from "./ChangeOpportunityStatusDialog";
import { ChangeOpportunityTypeDialog } from "./ChangeOpportunityTypeDialog/ChangeOpportunityTypeDialog";
import { createOpportunityStatusLabelMap } from "./constants";
import { useOpportunityStatusDialog } from "./useOpportunityStatusDialog";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentUser } from "@/hooks/useCurrentUser";

type Props = {
  opportunity: ApiOpportunityGet;
};

export const OpportunityHeader = ({ opportunity }: Props) => {
  const { isAuthorized } = useAuth();
  const currentUser = useCurrentUser();
  // Coordinator/admin may edit any opportunity; an agent may only change the
  // status of an opportunity belonging to their own agent (mirrors the be
  // ownership check on PATCH /opportunity/:id).
  const canChangeStatus =
    isAuthorized || (currentUser?.role === UserRole.AGENT && currentUser?.agentId === opportunity.agent?.id);
  const { t, i18n } = useTranslation();
  const dialog = useOpportunityStatusDialog(opportunity);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
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
      after={
        <>
          <ChangeOpportunityStatusDialog dialog={dialog} isAuthorized={isAuthorized} />
          {isTypeOpen && <ChangeOpportunityTypeDialog onClose={() => setIsTypeOpen(false)} opportunity={opportunity} />}
        </>
      }
    >
      <StatusRowField
        title={t("dashboard.opportunityProfile.currentStatus")}
        status={dialog.selected}
        label={statusLabelMap[dialog.selected]}
        action={
          canChangeStatus && (
            <EditButton onClick={dialog.openDialog}>{t("dashboard.opportunityProfile.change_status")}</EditButton>
          )
        }
      />

      <StatusRowField
        title={t("dashboard.opportunityProfile.matchingStatus")}
        extra={
          statusMatch ? (
            <MatchStatusBadge
              $color={matchStatusColorMap[statusMatch as OpportunityMatchStatusType] ?? "var(--color-blue-700)"}
            >
              {matchStatusIconMap[statusMatch as OpportunityMatchStatusType]}
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
        action={
          isAuthorized && (
            <EditButton onClick={() => setIsTypeOpen(true)}>{t("dashboard.opportunityProfile.change_type")}</EditButton>
          )
        }
      />

      {(opportunity.agent as typeof opportunity.agent & { id?: number })?.id && (
        <StatusRowField
          title={t("dashboard.opportunityProfile.agent")}
          extra={
            <AgentLink
              href={`/${i18n.language}/dashboard/agents/${(opportunity.agent as typeof opportunity.agent & { id?: number }).id}`}
            >
              {opportunity.agent.name}
            </AgentLink>
          }
        />
      )}
    </HeaderCard>
  );
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

const AgentLink = styled(Link)`
  color: var(--color-blue-700);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
