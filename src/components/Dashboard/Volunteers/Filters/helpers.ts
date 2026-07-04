import { TFunction } from "i18next";
import { Availability, VolunteerCardsFilter } from "./types";
import { generateNestedFilterControlItems } from "../../common/CardsFilter/helpers";
import { SelectionMap, SetFilter } from "../../common/CardsFilter/types";
import { EntityTableName, QueryParamsKeys } from "need4deed-sdk";

/**
 * Creates filter items for districts, languages, engagement, and availability.
 */
export const createFilterItems = (
  filter: VolunteerCardsFilter,
  setFilter: SetFilter<VolunteerCardsFilter>,
  t: TFunction,
) => {
  const typeFilters = generateNestedFilterControlItems(filter.type, setFilter, "type", (key) =>
    t(`dashboard.volunteers.filters.volunteerType_options.${key}`),
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

  const activityFilters = generateNestedFilterControlItems(
    filter[EntityTableName.ACTIVITY],
    setFilter,
    EntityTableName.ACTIVITY,
    (key) => key,
  );

  const availabilityFilters = createAvailabilityFilterItems(filter[QueryParamsKeys.AVAILABILITY], setFilter, t);

  return { districtFilters, languageFilters, engagementFilters, availabilityFilters, typeFilters, activityFilters };
};

/**
 * Builds availability-based filter sections (days, times, occasional).
 */
export const createAvailabilityFilterItems = (
  availability: Availability,
  setFilter: SetFilter<VolunteerCardsFilter>,
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

export const createSelectedFilterItemsAsFlatArray = (
  filter: VolunteerCardsFilter,
  setFilter: SetFilter<VolunteerCardsFilter>,
  t: TFunction,
) => {
  const filterItems = createFilterItems(filter, setFilter, t);

  const { districtFilters, engagementFilters, languageFilters, availabilityFilters, typeFilters, activityFilters } =
    filterItems;
  const flatAvFilters = availabilityFilters.map((avFilter) => avFilter.items).flat();

  return [
    ...typeFilters,
    ...districtFilters,
    ...engagementFilters,
    ...languageFilters,
    ...activityFilters,
    ...flatAvFilters,
  ].filter((f) => f.checked);
};
