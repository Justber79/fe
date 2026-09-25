"use client";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Button, SwitchButton } from "@/components/core/button";
import { IconName } from "@/components/core/button/Button/icon";
import { Heading4, Paragraph } from "@/components/styled/text";
import { defaultFilter } from "../constants";
import { CardsFilter, DayKeys, DaysKeys, SetFilter } from "../types";
import AccordionFilter from "./AccordionFilter";

const weekDays = Object.keys(defaultFilter.days) as DaysKeys[];
const daySlots = Object.keys(defaultFilter.days.monday) as DayKeys[];

// Keys of the `weekdays` translation block (0 = Sunday).
const daysTranslationMap: Record<DaysKeys, string> = {
  monday: "1",
  tuesday: "2",
  wednesday: "3",
  thursday: "4",
  friday: "5",
  saturday: "6",
  sunday: "0",
};

interface Props {
  isFiltersOpen: boolean;
  setIsFiltersOpen: (isOpen: boolean) => void;
  filter: CardsFilter;
  setFilter: SetFilter;
}

export default function Filters({ isFiltersOpen, setIsFiltersOpen, filter, setFilter }: Props) {
  const { t } = useTranslation();

  if (!isFiltersOpen) return null;

  const toggleIn = (group: "activityType" | "district", key: string) => (checked: boolean) =>
    setFilter((prev) => ({ ...prev, [group]: { ...prev[group], [key]: checked } }));

  const toItems = (group: "activityType" | "district") =>
    Object.keys(filter[group])
      .sort()
      .map((key) => ({ label: key, checked: filter[group][key], onChange: toggleIn(group, key) }));

  const daysFilterItems = weekDays.map((day) => ({
    label: `${t(`weekdays.${daysTranslationMap[day]}`)}s`,
    items: daySlots.map((daySlot) => ({
      label: t(`opportunityPage.filters.${daySlot}`),
      checked: filter.days[day][daySlot],
      onChange: (checked: boolean) =>
        setFilter((prev) => ({
          ...prev,
          days: { ...prev.days, [day]: { ...prev.days[day], [daySlot]: checked } },
        })),
    })),
  }));

  const uncheckAll = (options: Record<string, boolean>) =>
    Object.fromEntries(Object.keys(options).map((key) => [key, false]));

  const clearAll = () =>
    // The search bar isn't a filter; keep its input.
    setFilter((prev) => ({
      ...structuredClone(defaultFilter),
      searchInput: prev.searchInput,
      activityType: uncheckAll(prev.activityType),
      district: uncheckAll(prev.district),
    }));

  return (
    <FiltersContainer>
      <CloseFilters onClick={() => setIsFiltersOpen(false)}>
        <ArrowLeftIcon size={32} />
        <Heading4 margin={0} color="var(--color-midnight)">
          {t("opportunityPage.filters.closeFilters")}
        </Heading4>
      </CloseFilters>

      <FiltersContent>
        <AccompanyingFilter>
          <AccompanyingFilterHeader>
            <Heading4 margin={0} color="var(--color-midnight)">
              {t("opportunityPage.filters.accompanying")}
            </Heading4>
            <SwitchButton
              isChecked={filter.accompanying}
              onToggle={() => setFilter((prev) => ({ ...prev, accompanying: !prev.accompanying }))}
            />
          </AccompanyingFilterHeader>
          <Paragraph
            fontWeight="var(--opportunities-filters-description-font-weight)"
            fontSize="var(--opportunities-filters-description-font-size)"
            color="var(--color-midnight)"
            lineheight="var(--opportunities-filters-description-font-size)"
          >
            {t("opportunityPage.filters.accompanyingDesc")}
          </Paragraph>
        </AccompanyingFilter>

        <AccordionFilter header={t("opportunityPage.filters.activityType")} items={toItems("activityType")} />
        <AccordionFilter header={t("opportunityPage.filters.district")} items={toItems("district")} />
        <AccordionFilter header={t("opportunityPage.filters.days")} groupedItems={daysFilterItems} />
      </FiltersContent>

      <ClearAllFilters>
        <Button
          text={t("opportunityPage.filters.clearAllFilters")}
          iconName={IconName.X}
          iconColor="var(--color-midnight)"
          iconSize="var(--opportunities-filters-clear-all-button-icon-size)"
          iconPosition="right"
          onClick={clearAll}
          backgroundcolor="var(--color-white)"
          textColor="var(--color-midnight)"
          height="var(--opportunities-filters-clear-all-button-height)"
          textFontSize="var(--opportunities-filters-clear-all-button-text-font-size)"
        />
      </ClearAllFilters>
    </FiltersContainer>
  );
}

/* Styles */

const FiltersContainer = styled.div`
  position: absolute;
  right: 0;
  width: 320px;
  max-width: 100%;
  z-index: 1;
  background: var(--color-orchid-subtle);
`;

const CloseFilters = styled.div`
  display: flex;
  align-items: center;
  background: var(--color-orchid-light);
  height: var(--opportunities-filters-close-filter-height);
  gap: var(--opportunities-filters-close-filter-gap);
  padding: var(--opportunities-filters-close-filter-padding);
  cursor: pointer;

  svg {
    color: var(--color-midnight);
  }

  &:hover svg {
    color: var(--color-midnight-light);
  }

  &:hover ${Heading4} {
    color: var(--color-midnight-bright);
  }
`;

const FiltersContent = styled.div`
  display: flex;
  flex-direction: column;
  width: var(--opportunities-filters-content-container-width);
  gap: var(--opportunities-filters-content-container-gap);
  padding: var(--opportunities-filters-content-container-padding);
`;

const AccompanyingFilter = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--opportunities-filters-content-filter-container-gap);
`;

const AccompanyingFilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ClearAllFilters = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 24px;
`;
