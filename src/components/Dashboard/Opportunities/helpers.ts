import {
  ApiLanguage,
  ApiOptionLists,
  EntityTableName,
  LangPurpose,
  OptionById,
  OptionItem,
  QueryParamsKeys,
} from "need4deed-sdk";
import { ReadonlyURLSearchParams } from "next/navigation";
import { AvailabilityKeys, AvailabilitySubKeys, SEPARATOR } from "./Filters/constants";
import { OpportunityCardsFilter } from "./Filters/types";

interface SerializeFiltersOptions {
  serializeToIDs?: boolean;
  apiFilterOptions?: ApiOptionLists;
}

export function serializeOpportunityFilters(
  filter: OpportunityCardsFilter,
  searchParams?: ReadonlyURLSearchParams,
  asString = true,
  options?: SerializeFiltersOptions,
) {
  const params = new URLSearchParams(searchParams);
  params.delete("page");

  if (filter.search) params.set(QueryParamsKeys.SEARCH, filter.search);
  else params.delete(QueryParamsKeys.SEARCH);

  params.delete(QueryParamsKeys.DISTRICT);
  Object.entries(filter.district).forEach(([key, value]) => {
    if (value === true) {
      const paramValue =
        (options?.serializeToIDs && options.apiFilterOptions?.district?.find((d) => d.title === key)?.id) || key;
      params.append(QueryParamsKeys.DISTRICT, String(paramValue));
    }
  });

  params.delete(QueryParamsKeys.LANGUAGE);
  Object.entries(filter.language).forEach(([key, value]) => {
    if (value === true) {
      const paramValue =
        (options?.serializeToIDs && options.apiFilterOptions?.language?.find((d) => d.title === key)?.id) || key;
      params.append(QueryParamsKeys.LANGUAGE, String(paramValue));
    }
  });

  params.delete("status");
  Object.entries(filter.status).forEach(([key, value]) => {
    if (value === true) {
      params.append("status", key);
    }
  });

  params.delete("type");
  Object.entries(filter.type).forEach(([key, value]) => {
    if (value === true) {
      params.append("type", key);
    }
  });

  params.delete(EntityTableName.ACTIVITY);
  Object.entries(filter.activity).forEach(([key, value]) => {
    if (value === true) {
      const paramValue =
        (options?.serializeToIDs && options.apiFilterOptions?.activity?.find((d) => d.title === key)?.id) || key;
      params.append(EntityTableName.ACTIVITY, String(paramValue));
    }
  });

  params.delete(QueryParamsKeys.AVAILABILITY);
  Object.entries(filter.availability).forEach(([key, subSlot]) => {
    const availabilityKey = key as AvailabilityKeys;
    Object.entries(subSlot).forEach(([slot, value]) => {
      if (value) {
        params.append(QueryParamsKeys.AVAILABILITY, `${availabilityKey}${SEPARATOR}${slot}`);
      }
    });
  });

  return asString ? params.toString() : params;
}

export function deserializeOpportunityFilters(
  filter: OpportunityCardsFilter,
  searchParams: ReadonlyURLSearchParams,
): OpportunityCardsFilter {
  const newFilter: OpportunityCardsFilter = structuredClone(filter);

  const search = searchParams.get(QueryParamsKeys.SEARCH);
  if (search !== null) newFilter.search = search;

  const queryDistricts = searchParams.getAll(QueryParamsKeys.DISTRICT);
  queryDistricts.forEach((d) => {
    newFilter.district[d] = true;
  });
  const queryLanguages = searchParams.getAll(QueryParamsKeys.LANGUAGE);
  queryLanguages.forEach((l) => {
    newFilter.language[l] = true;
  });

  const queryStatus = searchParams.getAll("status");
  queryStatus.forEach((s) => {
    newFilter.status[s] = true;
  });

  const queryType = searchParams.getAll("type");
  queryType.forEach((s) => {
    newFilter.type[s] = true;
  });

  const queryActivities = searchParams.getAll(EntityTableName.ACTIVITY);
  queryActivities.forEach((l) => {
    newFilter.activity[l] = true;
  });

  const queryAvailability = searchParams.getAll(QueryParamsKeys.AVAILABILITY);
  queryAvailability.forEach((item) => {
    const [firstKey, secondKey] = item.split(SEPARATOR);
    const avKey = firstKey as AvailabilityKeys;
    const avSubKey = secondKey as AvailabilitySubKeys;
    const subFilter = newFilter.availability[avKey] as Record<AvailabilitySubKeys, boolean>;
    if (subFilter && subFilter[avSubKey] !== undefined) {
      subFilter[avSubKey] = true;
    }
  });

  return newFilter;
}

export function getLanguagesByPurpose(languages: ApiLanguage[] | undefined, purpose: LangPurpose) {
  if (!languages) return "";
  return languages
    .filter((lang) => lang.purpose === purpose)
    .map((lang) => lang.title)
    .join(", ");
}

export function getOptionTitles(items: OptionById[] | undefined): string[] {
  if (!items || !Array.isArray(items)) return [];
  return items.map((item) => (typeof item.title === "string" ? item.title : "")).filter(Boolean);
}

function cleanActivityTitle(title: string): string {
  return title
    .replace(/^Begleitung:\s*/i, "")
    .replace(/\*\s*$/, "")
    .trim();
}

export function getActivityTitles(activities: OptionById[], activityList: OptionItem[] | undefined): string[] {
  if (!activities?.length || !activityList?.length) return [];
  const activityMap = new Map(activityList.map((item) => [String(item.id), item.title]));
  return activities
    .map((act) => activityMap.get(String(act.id)))
    .filter((title): title is string => Boolean(title))
    .map(cleanActivityTitle);
}
