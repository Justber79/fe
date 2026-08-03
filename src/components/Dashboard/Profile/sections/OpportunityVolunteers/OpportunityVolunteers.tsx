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
import { OpportunityVolunteersContainer } from "./styles";
import { useGetVolunteerOpportunityLinked } from "@/hooks/useGetVolunteerOpportunityLinked";

export const OpportunityVolunteers = ({
  opportunityId,
  hasEditingRights,
}: {
  opportunityId: Id;
  hasEditingRights: boolean;
}) => {
  const { t } = useTranslation();

  const queryKey = ["opportunity-volunteers", String(opportunityId)];

  const { data, isLoading } = useGetVolunteerOpportunityLinked(opportunityId);

  const volunteers = useMemo(() => data ?? [], [data]);

  const { mutate: updateStatus } = useUpdateOpportunityVolunteerStatus(queryKey);
  const { mutate: deleteLink } = useDeleteOpportunityVolunteer(queryKey);

  const { selectedTabIndex, setSelectedTabIndex, currentTabStatus, tabCounts, visibleItems, setItemStatus } =
    useTabTransitions(volunteers);

  const tabs = TAB_STATUS_ORDER.map((key, index) => ({
    label: t(`dashboard.opportunityProfile.volunteersSec.tabs.${key}`),
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
    return <OpportunityVolunteersContainer data-testid="opportunity-volunteers" />;
  }

  return (
    <OpportunityVolunteersContainer data-testid="opportunity-volunteers" id={"opportunity-volunteers-container"}>
      <Tabs tabs={tabs} selectedTabIndex={selectedTabIndex} setSelectedTabIndex={setSelectedTabIndex} />
      {visibleItems.length === 0 ? (
        <SectionEmptyState data-testid="volunteers-empty-state">
          {t("dashboard.opportunityProfile.volunteersSec.emptyState")}
        </SectionEmptyState>
      ) : (
        visibleItems.map((volunteer) => (
          <AccordionVolunteer
            key={volunteer.id}
            volunteer={volunteer}
            currentStatus={currentTabStatus}
            hasEditingRights={hasEditingRights}
            onMatch={() => handleMatch(volunteer.id)}
            onNotAMatch={() => handleNotAMatch(volunteer.id)}
            onMarkAsActive={() => handleMarkAsActive(volunteer.id)}
            onMarkAsPast={() => handleMarkAsPast(volunteer.id)}
          />
        ))
      )}
    </OpportunityVolunteersContainer>
  );
};
