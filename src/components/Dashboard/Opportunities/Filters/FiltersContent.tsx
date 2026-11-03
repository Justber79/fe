import { useTranslation } from "react-i18next";
import { OpportunityCardsFilter } from "./types";
import AccordionFilter from "../../common/CardsFilter/AccordionFilter";
import { getVisibleSelectionFilterSections } from "../../common/CardsFilter/selectionFilters";
import { SetFilter } from "../../common/CardsFilter/types";
import { createAvailabilityFilterItems, createOpportunityFilterSections } from "./helpers";
import { FiltersContentContainer } from "./styles";
import { useAuth } from "@/hooks/useAuth";
import { ViewMode } from "../../common/types";
import { QueryParamsKeys } from "need4deed-sdk";
import { createCommuteMinutesFilterItems } from "../../common/CardsFilter/matchingPrefill";

type Props = {
  filter: OpportunityCardsFilter;
  setFilter: SetFilter<OpportunityCardsFilter>;
  viewMode: ViewMode;
  isMatchMode: boolean;
};

export default function FiltersContent({ setFilter, filter, viewMode, isMatchMode }: Props) {
  const { t } = useTranslation();
  const { isAuthorized, isAgent, isVolunteer } = useAuth();
  const canSeeFullView = isAuthorized || isAgent;

  const sections = getVisibleSelectionFilterSections(createOpportunityFilterSections(filter, setFilter, t), {
    viewMode,
    isAuthorized,
    isAgent,
    isVolunteer,
  });
  const availabilityFilters = createAvailabilityFilterItems(filter[QueryParamsKeys.AVAILABILITY], setFilter, t);

  return (
    <FiltersContentContainer data-testid="opportunity-filters-content">
      {sections.map(({ key, config, items }) => (
        <AccordionFilter key={key} header={t(config.header)} items={items} />
      ))}
      {isMatchMode && filter.hasCommuteSource && (
        <AccordionFilter
          header={t("dashboard.filters.commuteMinutesHeader")}
          items={createCommuteMinutesFilterItems(filter, setFilter, t)}
        />
      )}
      {canSeeFullView && (
        <AccordionFilter
          header={t("dashboard.opportunities.filters.schedule.header")}
          groupedItems={availabilityFilters}
          groupedItemsDisplayType="button"
        />
      )}
    </FiltersContentContainer>
  );
}
