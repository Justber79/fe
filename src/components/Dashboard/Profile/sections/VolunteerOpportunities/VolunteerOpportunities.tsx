import { apiPathVolunteer, cacheTTL } from "@/config/constants";
import { useGetQuery } from "@/hooks/useGetQuery";
import {
  useDeleteOpportunityVolunteer,
  useUpdateOpportunityVolunteerStatus,
} from "@/hooks/useUpdateOpportunityVolunteerStatus";
import { ApiOpportunityVolunteerGet, Id, OpportunityVolunteerStatusType } from "need4deed-sdk";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { SectionEmptyState } from "../shared/styles";
import { Tabs } from "../shared/Tabs";
import { ITEM_STATUS_REMOVED, TAB_STATUS_ORDER, useTabTransitions } from "../shared/useTabTransitions";
import AccordionOpportunity from "./AccordionOpportunity";

export default function VolunteerOpportunities({ volunteerId }: { volunteerId: Id }) {
  const { t } = useTranslation();

  const queryKey = ["volunteer-opportunities", String(volunteerId)];

  const { data, isLoading } = useGetQuery<ApiOpportunityVolunteerGet[]>({
    queryKey,
    apiPath: `${apiPathVolunteer}/${volunteerId}/opportunity-linked`,
    staleTime: cacheTTL,
    enabled: !!volunteerId,
  });

  const opportunities = useMemo(() => data ?? [], [data]);

  const { mutate: updateStatus } = useUpdateOpportunityVolunteerStatus(queryKey);
  const { mutate: deleteLink } = useDeleteOpportunityVolunteer(queryKey);

  const { selectedTabIndex, setSelectedTabIndex, currentTabStatus, tabCounts, visibleItems, setItemStatus } =
    useTabTransitions(opportunities);

  const tabs = TAB_STATUS_ORDER.map((key, index) => ({
    label: t(`dashboard.volunteerProfile.opportunitiesSec.tabs.${key}`),
    count: tabCounts[index],
  }));

  const handleMatch = (m2mId: number) => {
    setItemStatus(m2mId, OpportunityVolunteerStatusType.MATCHED);
    updateStatus({ m2mId, status: OpportunityVolunteerStatusType.MATCHED });
  };

  const handleNotAMatch = (m2mId: number) => {
    setItemStatus(m2mId, ITEM_STATUS_REMOVED);
    deleteLink({ m2mId });
  };

  const handleMarkAsActive = (m2mId: number) => {
    setItemStatus(m2mId, OpportunityVolunteerStatusType.ACTIVE);
    updateStatus({ m2mId, status: OpportunityVolunteerStatusType.ACTIVE });
  };

  const handleMarkAsPast = (m2mId: number) => {
    setItemStatus(m2mId, OpportunityVolunteerStatusType.PAST);
    updateStatus({ m2mId, status: OpportunityVolunteerStatusType.PAST });
  };

  if (isLoading) {
    return <VolunteerOpportunitiesContainer />;
  }

  return (
    <VolunteerOpportunitiesContainer>
      <Tabs tabs={tabs} selectedTabIndex={selectedTabIndex} setSelectedTabIndex={setSelectedTabIndex} />
      {visibleItems.length === 0 ? (
        <SectionEmptyState>{t("dashboard.volunteerProfile.opportunitiesSec.emptyState")}</SectionEmptyState>
      ) : (
        visibleItems.map((opportunity) => (
          <AccordionOpportunity
            key={opportunity.id}
            opportunity={opportunity}
            currentStatus={currentTabStatus}
            onMatch={() => handleMatch(opportunity.id)}
            onNotAMatch={() => handleNotAMatch(opportunity.id)}
            onMarkAsActive={() => handleMarkAsActive(opportunity.id)}
            onMarkAsPast={() => handleMarkAsPast(opportunity.id)}
          />
        ))
      )}
    </VolunteerOpportunitiesContainer>
  );
}

const VolunteerOpportunitiesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--volunteer-profile-opportunities-container-gap);
`;
