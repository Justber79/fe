import { useAuth } from "@/hooks/useAuth";
import { apiPathAgent, cacheTTL } from "@/config/constants";
import { useGetQuery } from "@/hooks/useGetQuery";
import {
  useDeleteOpportunityVolunteer,
  useUpdateOpportunityVolunteerStatus,
} from "@/hooks/useUpdateOpportunityVolunteerStatus";
import { Id, OpportunityVolunteerStatusType } from "need4deed-sdk";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SectionEmptyState } from "../shared/styles";
import { Tabs } from "../shared/Tabs";
import { ITEM_STATUS_REMOVED, TAB_STATUS_ORDER, useTabTransitions } from "../shared/useTabTransitions";
import { AccordionVolunteer } from "./AccordionVolunteer";
import { VolunteerOpportunitiesContainer } from "./styles";
import { MappedVolunteerAgent } from "./types";

type Props = { agentId: Id };

export const VolunteerAgents = ({ agentId }: Props) => {
  const { t } = useTranslation();
  // NGO users may change a match's status or remove it, but matching is for coordinators.
  const { isAuthorized } = useAuth();

  const queryKey = ["agent-volunteers", String(agentId)];

  const { data, isLoading } = useGetQuery<MappedVolunteerAgent[]>({
    queryKey,
    apiPath: `${apiPathAgent}/${agentId}/volunteer-linked`,
    staleTime: cacheTTL,
    enabled: !!agentId,
  });

  const volunteers = useMemo(() => data ?? [], [data]);

  const {
    selectedTabIndex,
    setSelectedTabIndex,
    currentTabStatus,
    tabCounts,
    visibleItems,
    setItemStatus,
    clearItemStatus,
  } = useTabTransitions(volunteers);

  const { mutate: updateStatus } = useUpdateOpportunityVolunteerStatus(queryKey, ({ m2mId, status }) =>
    clearItemStatus(m2mId, status),
  );
  const { mutate: deleteLink } = useDeleteOpportunityVolunteer(queryKey, ({ m2mId }) =>
    clearItemStatus(m2mId, ITEM_STATUS_REMOVED),
  );

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
    return <VolunteerOpportunitiesContainer data-testid="agent-volunteers" />;
  }

  return (
    <VolunteerOpportunitiesContainer data-testid="agent-volunteers">
      <Tabs tabs={tabs} selectedTabIndex={selectedTabIndex} setSelectedTabIndex={setSelectedTabIndex} />
      {visibleItems.length === 0 ? (
        <SectionEmptyState>{t("dashboard.volunteerProfile.opportunitiesSec.emptyState")}</SectionEmptyState>
      ) : (
        visibleItems.map((volunteer) => (
          <AccordionVolunteer
            key={volunteer.id}
            volunteer={volunteer}
            currentStatus={currentTabStatus}
            onMatch={isAuthorized ? () => handleMatch(volunteer.id) : undefined}
            onNotAMatch={() => handleNotAMatch(volunteer.id)}
            onMarkAsActive={() => handleMarkAsActive(volunteer.id)}
            onMarkAsPast={() => handleMarkAsPast(volunteer.id)}
          />
        ))
      )}
    </VolunteerOpportunitiesContainer>
  );
};
