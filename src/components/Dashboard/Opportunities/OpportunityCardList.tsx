import { ApiVolunteerOpportunityGetList, OptionItem } from "need4deed-sdk";
import { PaginatedGrid } from "@/components/core/paginatedGrid";
import { OpportunityCard } from "./OpportunityCard";
import { OpportunityCardListContainer } from "./styles";
import { OpportunityReadOnlyCard } from "./OpportunityReadOnlyCard";
import { useAuth } from "@/hooks/useAuth";

type Props = {
  activitiesList?: OptionItem[];
  districtsList?: OptionItem[];
  opportunities: ApiVolunteerOpportunityGetList[];
  count: number;
  itemsPerPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  volunteerId?: string;
};

export function OpportunityCardList({
  opportunities,
  count,
  itemsPerPage,
  currentPage,
  setCurrentPage,
  volunteerId,
  activitiesList,
  districtsList,
}: Props) {
  const { isAuthorized, isAgent } = useAuth();
  const canSeeFullView = isAuthorized || isAgent;

  const items = opportunities.map((opp) =>
    canSeeFullView ? (
      <OpportunityCard
        key={opp.id}
        opportunity={opp}
        volunteerId={volunteerId}
        activitiesList={activitiesList}
        districtsList={districtsList}
      />
    ) : (
      <OpportunityReadOnlyCard key={opp.id} opportunity={opp} districtsList={districtsList} />
    ),
  );

  return (
    <OpportunityCardListContainer data-testid="opportunity-card-list">
      <PaginatedGrid
        pageItems={items}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalItemCounts={count}
      />
    </OpportunityCardListContainer>
  );
}
