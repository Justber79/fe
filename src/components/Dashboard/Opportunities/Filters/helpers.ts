import { TFunction } from "i18next";
import {
  createSelectionFilterSections,
  getSelectedSelectionFilterItems,
} from "../../common/CardsFilter/selectionFilters";
import { ScheduleFilter, SelectionMap, SetFilter } from "../../common/CardsFilter/types";
import { QueryParamsKeys } from "need4deed-sdk";
import { opportunityFilterConfigs } from "./config";
import { OpportunityCardsFilter } from "./types";

export const createOpportunityFilterSections = (
  filter: OpportunityCardsFilter,
  setFilter: SetFilter<OpportunityCardsFilter>,
  t: TFunction,
) => createSelectionFilterSections(opportunityFilterConfigs, filter, setFilter, t);

export const createAvailabilityFilterItems = (
  availability: ScheduleFilter,
  setFilter: SetFilter<OpportunityCardsFilter>,
  t: TFunction,
) => {
  const { days, times, occasional } = availability;

  const createAvailabilityGroup = <K extends keyof ScheduleFilter, T extends SelectionMap>(labelKey: K, obj: T) => ({
    label: t(`dashboard.opportunities.filters.preferredAv.${labelKey}.header`),
    items: Object.keys(obj).map((key) => ({
      label: t(`dashboard.opportunities.filters.preferredAv.${labelKey}.${key}`),
      checked: obj[key],
      onChange: (checked: boolean) => {
        const updated = { ...obj, [key]: checked };
        setFilter((prev) => ({
          ...prev,
          [QueryParamsKeys.AVAILABILITY]: { ...availability, [labelKey]: updated },
        }));
      },
      keyValue: key,
      parentKey: QueryParamsKeys.AVAILABILITY,
    })),
  });

  return [
    createAvailabilityGroup("days", days),
    createAvailabilityGroup("times", times),
    createAvailabilityGroup("occasional", occasional),
  ];
};

export const createSelectedOpportunityFiltersAsFlatArray = (
  filter: OpportunityCardsFilter,
  setFilter: SetFilter<OpportunityCardsFilter>,
  t: TFunction,
) => {
  const sections = createOpportunityFilterSections(filter, setFilter, t);
  const availabilityItems = createAvailabilityFilterItems(filter[QueryParamsKeys.AVAILABILITY], setFilter, t)
    .flatMap(({ items }) => items)
    .filter((item) => item.checked);
  return [...getSelectedSelectionFilterItems(sections), ...availabilityItems];
};
