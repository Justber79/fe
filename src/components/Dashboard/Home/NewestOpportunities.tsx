import { apiPathOpportunity, apiPathOption, cacheTTL } from "@/config/constants";
import { useGetQuery } from "@/hooks";
import { ApiOptionLists, ApiVolunteerOpportunityGetList, OpportunityStatusType, SortOrder } from "need4deed-sdk";
import { OpportunityCard } from "../Opportunities/OpportunityCard";
import { useTranslation } from "react-i18next";
import { Heading4 } from "@/components/styled/text";

export function NewestOpportunities() {
  const { t } = useTranslation();
  const { data: apiFilterOptions } = useGetQuery<ApiOptionLists>({ queryKey: ["options"], apiPath: apiPathOption });
  const { data: opportunities, isLoading } = useGetQuery<ApiVolunteerOpportunityGetList[]>({
    queryKey: ["opportunities", "newest"],
    apiPath: `${apiPathOpportunity}/`,
    params: {
      limit: 2,
      page: 1,
      sortOrder: SortOrder.NewToOld,
      filter: { status: OpportunityStatusType.NEW },
    },
    staleTime: cacheTTL,
  });
  const activitiesList = apiFilterOptions?.activity;
  const districtsList = apiFilterOptions?.district;

  if (isLoading) {
    return <Heading4>{t("dashboard.home.content.loading")}</Heading4>;
  }

  return opportunities?.map((opp) => (
    <OpportunityCard key={opp.id} opportunity={opp} volunteerId={undefined} activitiesList={activitiesList} districtsList={districtsList} />
  ));
}
