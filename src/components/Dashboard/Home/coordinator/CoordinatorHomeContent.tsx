import React from "react";
import { Heading3 } from "@/components/styled/text";
import { NewestTaggedComments } from "./NewestTaggedComments";
import { DashboardCardContainer } from "../styles";
import { NewestOpportunities } from "./NewestOpportunities";
import { NewestVolunteers } from "./NewestVolunteers";
import { useTranslation } from "react-i18next";

export function CoordinatorHomeContent() {
  const { t } = useTranslation();
  return (
    <>
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
    </>
  );
}
