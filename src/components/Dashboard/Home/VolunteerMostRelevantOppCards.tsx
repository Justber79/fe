"use client";
import { apiPathOption } from "@/config/constants";
import { useGetQuery } from "@/hooks";
import { ApiOptionLists } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { Heading4 } from "@/components/styled/text";
import { DashboardCardContainer } from "./styles";
import { useGetMostRelevantOpportunities } from "@/hooks/useGetMostRelevantOpportunities";
import { OpportunityReadOnlyCard } from "../Opportunities/OpportunityReadOnlyCard";

export function VolunteerMostRelevantOppCards({ volunteerId }: { volunteerId: number | undefined }) {
  const { t } = useTranslation();

  const { data: apiFilterOptions } = useGetQuery<ApiOptionLists>({ queryKey: ["options"], apiPath: apiPathOption });

  const { opportunities, isLoading, isError } = useGetMostRelevantOpportunities(volunteerId ?? 0);

  if (isLoading) return <Heading4>{t("dashboard.home.content.loading")}</Heading4>;
  if (isError) return <Heading4>{t("dashboard.home.content.error")}</Heading4>;

  const districtsList = apiFilterOptions?.district ?? undefined;

  return (
    <DashboardCardContainer>
      {opportunities && opportunities?.length > 0 ? (
        opportunities.map((opp) => (
          <OpportunityReadOnlyCard key={opp.id} opportunity={opp} districtsList={districtsList} />
        ))
      ) : (
        <Heading4>{t("dashboard.home.content.mostRelevantNoResults")}</Heading4>
      )}
    </DashboardCardContainer>
  );
}
