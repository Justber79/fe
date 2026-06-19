"use client";
import { Heading2, Heading3 } from "@/components/styled/text";
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
