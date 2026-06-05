import { Heading2, Heading3 } from "@/components/styled/text";
import React from "react";
import { NewestOpportunities } from "./NewestOpportunities";
import { NewestVolunteers } from "./NewestVolunteers";
import { DashboardCardContainer, DashboardContentContainer } from "./styles";
import { useTranslation } from "react-i18next";
import { NewestTaggedComments } from "./NewestTaggedComments";

export default function DashboardHomeContent() {
  const { t } = useTranslation();
  return (
    <DashboardContentContainer>
      <Heading2>{t("dashboard.home.content.header")}</Heading2>
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
