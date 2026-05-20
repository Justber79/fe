import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { CardsFilter } from "./types";
import { Heading4, Paragraph } from "@/components/styled/text";
import { SwitchButton } from "@/components/core/button";
import { createFilterItems } from "./helpers";
import AccordionFilter from "../../common/CardsFilter/AccordionFilter";
import { SetFilter } from "../../common/CardsFilter/types";

interface Props {
  filter: CardsFilter;
  setFilter: SetFilter<CardsFilter>;
}

export default function FiltersContent({ setFilter, filter }: Props) {
  const { t } = useTranslation();

  const { availabilityFilters, districtFilters, engagementFilters, languageFilters, accompanyingFilter, typeFilters } =
    createFilterItems(filter, setFilter, t);

  return (
    <FiltersContentContainer>
      <AccompanyingFilterContainer>
        <Heading4 margin={0} color="var(--color-blue-700)">
          {t("dashboard.volunteers.filters.accompanying")}
        </Heading4>

        <AccompanyingFilterHeaderContainer>
          <SwitchButton
            isChecked={accompanyingFilter.checked as boolean}
            onToggle={() => accompanyingFilter.onChange(!accompanyingFilter.checked)}
          />

          <Paragraph
            fontWeight="var(--filters-description-font-weight)"
            fontSize="var(--filters-description-font-size)"
            color="var(--color-blue-700)"
            lineheight="var(--filters-description-line-height)"
            letterSpacing="var(--filters-description-letter-spacing)"
          >
            {t("dashboard.volunteers.filters.accompanyingDesc")}
          </Paragraph>
        </AccompanyingFilterHeaderContainer>
      </AccompanyingFilterContainer>

      <AccordionFilter header={t("dashboard.volunteers.filters.volunteerType_title")} items={typeFilters} />
      <AccordionFilter header={t("dashboard.volunteers.filters.engagement.header")} items={engagementFilters} />
      <AccordionFilter header={t("dashboard.volunteers.filters.district")} items={districtFilters} />
      <AccordionFilter header={t("dashboard.volunteers.filters.languages")} items={languageFilters} />
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

const AccompanyingFilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--opportunities-filters-content-filter-container-gap);
`;

const AccompanyingFilterHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: var(--dashboard-volunteers-filters-accompanying-header-container-gap);
  align-items: center;
`;
