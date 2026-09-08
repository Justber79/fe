"use client";
import { Heading2, Heading3, Heading4 } from "@/components/styled/text";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { UserRole } from "need4deed-sdk";
import React from "react";
import { useTranslation } from "react-i18next";
import { AgentOpportunityCards } from "./AgentOpportunityCards";
import { CreateOpportunityButton } from "./CreateOpportunityButton";
import { NewestOpportunities } from "./NewestOpportunities";
import { NewestVolunteers } from "./NewestVolunteers";
import { DashboardCardContainer, DashboardContentContainer } from "./styles";
import { NewestTaggedComments } from "./NewestTaggedComments";
import { VolunteerMostRelevantOppCards } from "./VolunteerMostRelevantOppCards";

export default function DashboardHomeContent() {
  const { t } = useTranslation();
  const user = useCurrentUser(true);
  const isAgent = user?.role === UserRole.AGENT;
  const isVolunteer = user?.role === UserRole.VOLUNTEER;

  if (isAgent) {
    return (
      <DashboardContentContainer>
        <Heading2>{t("dashboard.home.content.header")}</Heading2>
        <CreateOpportunityButton />
        <AgentOpportunityCards />
      </DashboardContentContainer>
    );
  }

  if (isVolunteer) {
    return (
      <DashboardContentContainer>
        <Heading2>{t("dashboard.home.content.header")}</Heading2>
        <Heading3>Most relevant opportunities</Heading3>
        <Heading4>(based on district and availability)</Heading4>
        <VolunteerMostRelevantOppCards volunteerId={user?.volunteerId} />
      </DashboardContentContainer>
    );
  }

  return (
    <DashboardContentContainer>
      <Heading2>{t("dashboard.home.content.header")}</Heading2>
      <CreateOpportunityButton />
      <Heading3>{t("dashboard.home.content.newTags")}</Heading3>
      <NewestTaggedComments />
      <Heading3>{t("dashboard.home.content.newOpportunities")}</Heading3>
      <DashboardCardContainer>
        <NewestOpportunities />
      </DashboardCardContainer>
      <Heading3>{t("dashboard.home.content.newVolunteers")}</Heading3>
      <DashboardCardContainer>
        <NewestVolunteers />
      </DashboardCardContainer>
    </DashboardContentContainer>
  );
}
