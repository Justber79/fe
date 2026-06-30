import { TFunction } from "i18next";
import { generateNestedFilterControlItems } from "../../common/CardsFilter/helpers";
import { ScheduleFilter, SelectionMap, SetFilter } from "../../common/CardsFilter/types";
import { EntityTableName, QueryParamsKeys } from "need4deed-sdk";
import { OpportunityCardsFilter } from "./types";

export const createOpportunityFilterItems = (
  filter: OpportunityCardsFilter,
  setFilter: SetFilter<OpportunityCardsFilter>,
  t: TFunction,
) => {
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
    (key) => {
      const translationKey = `languageNames.${key.toLowerCase()}`;
      const translated = t(translationKey);
      return translated !== translationKey ? translated : key;
    },
  );

  const statusFilters = generateNestedFilterControlItems(filter.status, setFilter, "status", (key) =>
    t(`dashboard.opportunities.filters.status.${key}`),
  );

  const typeFilters = generateNestedFilterControlItems(filter.type, setFilter, "type", (key) =>
    t(`dashboard.opportunities.filters.type.${key}`),
  );

  const activityFilters = generateNestedFilterControlItems(
    filter[EntityTableName.ACTIVITY],
    setFilter,
    EntityTableName.ACTIVITY,
    (key) => key,
  );

  const availabilityFilters = createAvailabilityFilterItems(filter[QueryParamsKeys.AVAILABILITY], setFilter, t);

  return { districtFilters, languageFilters, statusFilters, typeFilters, activityFilters, availabilityFilters };
};

/**
 * Builds availability-based filter sections (days, times, occasional).
 */
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
  const { districtFilters, languageFilters, statusFilters, typeFilters, activityFilters, availabilityFilters } =
    createOpportunityFilterItems(filter, setFilter, t);
  const flatAvFilters = availabilityFilters.map((avFilter) => avFilter.items).flat();
  return [
    ...districtFilters,
    ...languageFilters,
    ...statusFilters,
    ...typeFilters,
    ...activityFilters,
    ...flatAvFilters,
  ].filter((f) => f.checked);
};
