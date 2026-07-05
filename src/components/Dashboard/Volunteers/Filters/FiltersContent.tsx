import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { VolunteerCardsFilter } from "./types";
import { createFilterItems } from "./helpers";
import AccordionFilter from "../../common/CardsFilter/AccordionFilter";
import { SetFilter } from "../../common/CardsFilter/types";

interface Props {
  filter: VolunteerCardsFilter;
  setFilter: SetFilter<VolunteerCardsFilter>;
}

export default function FiltersContent({ setFilter, filter }: Props) {
  const { t } = useTranslation();

  const {
    availabilityFilters,
    districtFilters,
    engagementFilters,
    statusMatchFilters,
    languageFilters,
    typeFilters,
    activityFilters,
  } = createFilterItems(filter, setFilter, t);

  return (
    <FiltersContentContainer>
      <AccordionFilter header={t("dashboard.volunteers.filters.volunteerType_title")} items={typeFilters} />
      <AccordionFilter header={t("dashboard.volunteers.filters.engagement.header")} items={engagementFilters} />
      <AccordionFilter header={t("dashboard.volunteers.filters.matchStatus.header")} items={statusMatchFilters} />
      <AccordionFilter header={t("dashboard.volunteers.filters.district")} items={districtFilters} />
      <AccordionFilter header={t("dashboard.volunteers.filters.languages")} items={languageFilters} />
      <AccordionFilter header={t("dashboard.volunteers.filters.activities")} items={activityFilters} />
      <AccordionFilter
        header={t("dashboard.volunteers.filters.preferredAv.header")}
        groupedItems={availabilityFilters}
        groupedItemsDisplayType="button"
      />
    </FiltersContentContainer>
  );
}

/* Styles */

const FiltersContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: var(--opportunities-filters-content-container-width);
  height: auto;
  gap: var(--opportunities-filters-content-container-gap);
  padding: var(--opportunities-filters-content-container-padding);
`;
