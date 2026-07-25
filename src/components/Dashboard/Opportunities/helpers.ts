import {
  ApiLanguage,
  ApiOptionLists,
  EntityTableName,
  LangPurpose,
  OptionById,
  OptionItem,
  QueryParamsKeys,
  SortOrder,
} from "need4deed-sdk";
import { ReadonlyURLSearchParams } from "next/navigation";
import { AvailabilityKeys, AvailabilitySubKeys, SEPARATOR } from "./Filters/constants";
import { OpportunityCardsFilter } from "./Filters/types";
import { format } from "date-fns";
import { utcHhmmToLocal } from "@/utils";
import { TFunction } from "i18next";
import { ApiVolunteerOpportunityGetList } from "need4deed-sdk";

type Availability = ApiVolunteerOpportunityGetList["availability"];

interface SerializeFiltersOptions {
  serializeToIDs?: boolean;
  apiFilterOptions?: ApiOptionLists;
}

export const SORT_PARAM = "sort";
export const DEFAULT_SORT_ORDER: string = SortOrder.NewToOld;

export const APPOINTMENT_SORT_VALUES = ["appointment-proximal", "appointment-distant"] as const;
export type AppointmentSort = (typeof APPOINTMENT_SORT_VALUES)[number];

export function isAppointmentSort(sort: string): sort is AppointmentSort {
  return (APPOINTMENT_SORT_VALUES as readonly string[]).includes(sort);
}

const VALID_SORT_VALUES: string[] = [SortOrder.NewToOld, SortOrder.OldToNew, ...APPOINTMENT_SORT_VALUES];

export function parseSortParam(value: string | null): string {
  return value && VALID_SORT_VALUES.includes(value) ? value : DEFAULT_SORT_ORDER;
}

export function serializeOpportunityFilters(
  filter: OpportunityCardsFilter,
  searchParams?: ReadonlyURLSearchParams,
  asString?: true,
  options?: SerializeFiltersOptions,
): string;
export function serializeOpportunityFilters(
  filter: OpportunityCardsFilter,
  searchParams: ReadonlyURLSearchParams | undefined,
  asString: false,
  options?: SerializeFiltersOptions,
): URLSearchParams;
export function serializeOpportunityFilters(
  filter: OpportunityCardsFilter,
  searchParams?: ReadonlyURLSearchParams,
  asString = true,
  options?: SerializeFiltersOptions,
): string | URLSearchParams {
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

export function formatAccompanyingDate(details?: {
  appointmentDate?: string | null;
  appointmentTime?: string | null;
}): string | null {
  if (!details?.appointmentDate) return null;

  const date = new Date(details.appointmentDate);
  const formattedDate = isNaN(date.getTime()) ? details.appointmentDate : format(date, "dd.MM.yyyy");
  const formattedTime = details.appointmentTime ? utcHhmmToLocal(details.appointmentTime) : null;

  return [formattedDate, formattedTime].filter(Boolean).join(" ");
}

export function formatSchedule(availability: Availability, t: TFunction): string {
  if (!availability?.length) return "—";

  const groups = new Map<string, string[]>();
  for (const a of availability) {
    if (!a.day) continue;
    const day =
      a.day === "occasionally"
        ? t("dashboard.volunteers.filters.preferredAv.occasional.header")
        : t(`dashboard.volunteers.filters.preferredAv.days.${a.day}`);
    const time = a.daytime || "";
    if (!groups.has(time)) groups.set(time, []);
    groups.get(time)!.push(day);
  }

  return Array.from(groups.entries())
    .map(([time, days]) => {
      if (time === "weekdays" || time === "weekends") return t(`form.schedule.${time}`);
      const d = days.join(" & ");
      return time ? `${d}, ${time}` : d;
    })
    .join("; ");
}

export const abbreviateDistrict = (district: string | null) => {
  if (!district) return "-";
  if (district?.includes("-")) {
    const abbreviation = district
      .split("-")
      .filter((word) => word.trim())
      .map((word) => word.trim()[0])
      .join("-");
    return abbreviation.toUpperCase();
  }
  return district;
};
