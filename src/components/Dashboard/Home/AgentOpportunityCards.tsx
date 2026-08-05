"use client";
import { apiPathOption } from "@/config/constants";
import { useGetCurrentAgent } from "@/hooks/useGetCurrentAgent";
import { useGetQuery } from "@/hooks";
import { ApiOptionLists, ApiVolunteerOpportunityGetList } from "need4deed-sdk";
import { OpportunityCard } from "../Opportunities/OpportunityCard";
import { useTranslation } from "react-i18next";
import { Heading4 } from "@/components/styled/text";
import { DashboardCardContainer } from "./styles";
import { useGetMultiOpportunityLinked } from "@/hooks/useGetMultiOpportunityLinked";

export function AgentOpportunityCards() {
  const { t } = useTranslation();
  const { agentId } = useGetCurrentAgent();

  const { data: apiFilterOptions } = useGetQuery<ApiOptionLists>({ queryKey: ["options"], apiPath: apiPathOption });

  const { allLinkedOpportunities: opportunities, isLoading } = useGetMultiOpportunityLinked([agentId ?? 0]);

  const activitiesList = apiFilterOptions?.activity ?? undefined;
  const districtsList = apiFilterOptions?.district ?? undefined;

  if (isLoading) return <Heading4>{t("dashboard.home.content.loading")}</Heading4>;

  return (
    <DashboardCardContainer>
      {opportunities.map((opp) => (
        <OpportunityCard
          key={String(opp.id)}
          opportunity={opp as ApiVolunteerOpportunityGetList}
          volunteerId={undefined}
          activitiesList={activitiesList}
          districtsList={districtsList}
        />
      ))}
    </DashboardCardContainer>
  );
}
