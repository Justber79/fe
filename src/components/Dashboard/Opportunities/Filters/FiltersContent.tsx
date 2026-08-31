import { useTranslation } from "react-i18next";
import { OpportunityCardsFilter } from "./types";
import AccordionFilter from "../../common/CardsFilter/AccordionFilter";
import { SetFilter } from "../../common/CardsFilter/types";
import { createOpportunityFilterItems } from "./helpers";
import { FiltersContentContainer } from "./styles";
import { useAuth } from "@/hooks/useAuth";

type Props = {
  filter: OpportunityCardsFilter;
  setFilter: SetFilter<OpportunityCardsFilter>;
};

export default function FiltersContent({ setFilter, filter }: Props) {
  const { t } = useTranslation();
  const { isAuthorized, isAgent } = useAuth();
  const canSeeFullView = isAuthorized || isAgent;

  const {
    districtFilters,
    languageFilters,
    statusFilters,
    typeFilters,
    activityFilters,
    skillFilters,
    availabilityFilters,
  } = createOpportunityFilterItems(filter, setFilter, t);
  return (
    <FiltersContentContainer data-testid="opportunity-filters-content">
      <AccordionFilter header={t("dashboard.opportunities.filters.type.header")} items={typeFilters} />
      <AccordionFilter header={t("dashboard.opportunities.filters.status.header")} items={statusFilters} />
      <AccordionFilter header={t("dashboard.volunteers.filters.district")} items={districtFilters} />
      <AccordionFilter header={t("dashboard.volunteers.filters.languages")} items={languageFilters} />
      <AccordionFilter header={t("dashboard.volunteers.filters.activities")} items={activityFilters} />
      <AccordionFilter header={t("dashboard.volunteers.filters.skills")} items={skillFilters} />
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
