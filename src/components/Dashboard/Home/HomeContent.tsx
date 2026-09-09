"use client";
import { Heading2, Heading3 } from "@/components/styled/text";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { UserRole } from "need4deed-sdk";
import React from "react";
import { useTranslation } from "react-i18next";
import { AgentOpportunityCards } from "./AgentOpportunityCards";
import { CreateOpportunityButton } from "./CreateOpportunityButton";
import { DashboardContentContainer, RelevantOppsWrapper } from "./styles";
import { VolunteerMostRelevantOppCards } from "./VolunteerMostRelevantOppCards";

// Only AGENT gets the agent-specific view. Every other role (VOLUNTEER,
// COORDINATOR, ADMIN, USER, or a misresolved/unrecognized role) falls back
// to the volunteer view rather than the old coordinator-oriented one, which
// listed other volunteers and opportunities platform-wide — safer default
// while the root cause of some volunteer accounts not resolving to
// UserRole.VOLUNTEER is still being investigated (fe#997/#998).
export default function DashboardHomeContent() {
  const { t } = useTranslation();
  const user = useCurrentUser(true);
  const isAgent = user?.role === UserRole.AGENT;

  if (isAgent) {
    return (
      <DashboardContentContainer>
        <Heading2>{t("dashboard.home.content.header")}</Heading2>
        <CreateOpportunityButton />
        <AgentOpportunityCards />
      </DashboardContentContainer>
    );
  }

  return (
    <DashboardContentContainer>
      <Heading2>{t("dashboard.home.content.header")}</Heading2>
      <RelevantOppsWrapper>
        <Heading3 margin={0}>{t("dashboard.home.content.mostRelevantOpp")}</Heading3>
        <span>{t("dashboard.home.content.mostRelevantOppDesc")}</span>
      </RelevantOppsWrapper>
      <VolunteerMostRelevantOppCards volunteerId={user?.volunteerId} />
    </DashboardContentContainer>
  );
}
