import { TFunction } from "i18next";
import { Availability, CardsFilter } from "./types";
import { generateFilterControlItem, generateNestedFilterControlItems } from "../../common/CardsFilter/helpers";
import { SelectionMap, SetFilter } from "../../common/CardsFilter/types";
import { QueryParamsKeys } from "need4deed-sdk";

/**
 * Creates filter items for districts, languages, engagement, and availability.
 */
export const createFilterItems = (filter: CardsFilter, setFilter: SetFilter<CardsFilter>, t: TFunction) => {
  const accompanyingFilter = generateFilterControlItem(filter, setFilter, QueryParamsKeys.ACCOMPANYING, (key) =>
    t(`dashboard.volunteers.filters.${key}`),
  );

  const typeFilters = generateNestedFilterControlItems(
    filter.type,
    setFilter,
    "type",
    (key) => t(`dashboard.volunteers.filters.volunteerType_options.${key}`),
  );

  const districtFilters = generateNestedFilterControlItems(
    filter[QueryParamsKeys.DISTRICT],
    setFilter,
    QueryParamsKeys.DISTRICT,
    (key) => key,
  );

  const languageFilters = generateNestedFilterControlItems(
    filter[QueryParamsKeys.LANGUAGE],
    setFilter,
    QueryParamsKeys.LANGUAGE,
    (key) => key,
  );

  const engagementFilters = generateNestedFilterControlItems(
    filter[QueryParamsKeys.ENGAGEMENT],
    setFilter,
    QueryParamsKeys.ENGAGEMENT,
    (key) => t(`dashboard.volunteers.filters.engagement.${key}`),
  );

  const availabilityFilters = createAvailabilityFilterItems(filter[QueryParamsKeys.AVAILABILITY], setFilter, t);

  return { districtFilters, languageFilters, engagementFilters, availabilityFilters, accompanyingFilter, typeFilters };
};

/**
 * Builds availability-based filter sections (days, times, occasional).
 */
export const createAvailabilityFilterItems = (
  availability: Availability,
  setFilter: SetFilter<CardsFilter>,
  t: TFunction,
) => {
  const { days, times, occasional } = availability;

  const createAvailabilityGroup = <K extends keyof Availability, T extends SelectionMap>(labelKey: K, obj: T) => ({
    label: t(`dashboard.volunteers.filters.preferredAv.${labelKey}.header`),
    items: Object.keys(obj).map((key) => ({
      label: t(`dashboard.volunteers.filters.preferredAv.${labelKey}.${key}`),
      checked: obj[key],
      onChange: (checked: boolean) => {
        const updated = { ...obj, [key]: checked };
        setFilter((prev) => ({
          ...prev,
          [QueryParamsKeys.AVAILABILITY]: { ...availability, [labelKey]: updated },
        }));
      },
    })),
  });

  return [
    createAvailabilityGroup("days", days),
    createAvailabilityGroup("times", times),
    createAvailabilityGroup("occasional", occasional),
  ];
};

export const createSelectedFilterItemsAsFlatArray = (
  filter: CardsFilter,
  setFilter: SetFilter<CardsFilter>,
  t: TFunction,
) => {
  const filterItems = createFilterItems(filter, setFilter, t);

  const { districtFilters, engagementFilters, languageFilters, availabilityFilters, accompanyingFilter, typeFilters } = filterItems;
  const flatAvFilters = availabilityFilters.map((avFilter) => avFilter.items).flat();

  return [accompanyingFilter, ...typeFilters, ...districtFilters, ...engagementFilters, ...languageFilters, ...flatAvFilters].filter(
    (f) => f.checked,
  );
};
