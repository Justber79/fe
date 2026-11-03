import { TFunction } from "i18next";
import {
  ApiAvailability,
  ApiLanguage,
  ByDay,
  OccasionalType,
  OptionItem,
  QueryParamsKeys,
  TimeSlot,
} from "need4deed-sdk";
import { FilterItem, ScheduleFilter, SelectionMap, SetFilter } from "./types";

export type CommutePrefillFilter = {
  hasCommutePrefill: boolean;
  maxCommuteMinutes: number;
};

export type CommuteSourceKey = QueryParamsKeys.COMMUTE_OPPORTUNITY_ID | QueryParamsKeys.COMMUTE_VOLUNTEER_ID;

export const MAX_COMMUTE_MINUTES_OPTIONS = [5, 10, 20, 30, 40, 50, 60];

type MatchingSource = {
  districtIds: number[];
  languages: Pick<ApiLanguage, "id" | "title">[];
  availability: ApiAvailability[];
  appointmentDate?: string | null;
  appointmentTime?: string | null;
  commutePostcode?: string | null;
  maxCommuteMinutes: number;
};

type PrefillableFilter = CommutePrefillFilter & {
  district: SelectionMap;
  language: SelectionMap;
  availability: ScheduleFilter;
};

const berlinWeekday = new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "Europe/Berlin" });

const titleOf = (options: OptionItem[] | undefined, id: number | undefined, fallback?: string) =>
  options?.find((option) => option.id === id)?.title ?? fallback;

export function applyMatchingPrefill<T extends PrefillableFilter>(
  filter: T,
  source: MatchingSource,
  options: { district?: OptionItem[] | null; language?: OptionItem[] | null },
): T {
  const next = structuredClone(filter);

  source.districtIds.forEach((id) => {
    const title = titleOf(options.district ?? undefined, id);
    if (title && title in next.district) next.district[title] = true;
  });

  source.languages.forEach(({ id, title }) => {
    const optionTitle = titleOf(options.language ?? undefined, id, title);
    if (optionTitle && optionTitle in next.language) next.language[optionTitle] = true;
  });

  source.availability.forEach(({ day, daytime }) => {
    if (day && day in next.availability.days) next.availability.days[day as ByDay] = true;
    if (daytime && daytime in next.availability.times) next.availability.times[daytime as TimeSlot] = true;
    if (daytime && daytime in next.availability.occasional)
      next.availability.occasional[daytime as OccasionalType] = true;
  });

  if (source.appointmentDate) {
    const appointment = new Date(`${source.appointmentDate}T${source.appointmentTime ?? "12:00"}:00Z`);
    const weekday = Number.isNaN(appointment.getTime()) ? undefined : (berlinWeekday.format(appointment) as ByDay);
    if (weekday && weekday in next.availability.days) next.availability.days[weekday] = true;
  }
  if (source.commutePostcode && source.maxCommuteMinutes > 0) {
    next.hasCommutePrefill = true;
    next.maxCommuteMinutes = source.maxCommuteMinutes;
  }

  return next;
}

export const PREFILLED_PARAM = "prefilled";

const ALWAYS_FILTER_PARAMS = [
  PREFILLED_PARAM,
  "search",
  "availability",
  QueryParamsKeys.COMMUTE_OPPORTUNITY_ID,
  QueryParamsKeys.COMMUTE_VOLUNTEER_ID,
  QueryParamsKeys.MAX_COMMUTE_MINUTES,
];

export const hasFilterParams = (searchParams: { has: (key: string) => boolean }, configKeys: string[]) =>
  [...ALWAYS_FILTER_PARAMS, ...configKeys].some((key) => searchParams.has(key));

export const serializeCommutePrefill = (
  filter: CommutePrefillFilter,
  params: URLSearchParams,
  sourceKey: CommuteSourceKey,
  sourceId?: string,
) => {
  params.delete(QueryParamsKeys.COMMUTE_OPPORTUNITY_ID);
  params.delete(QueryParamsKeys.COMMUTE_VOLUNTEER_ID);
  params.delete(QueryParamsKeys.MAX_COMMUTE_MINUTES);

  const sourceParam = sourceKey === QueryParamsKeys.COMMUTE_OPPORTUNITY_ID ? "opportunity" : "volunteer";
  const commuteSourceId = sourceId ?? params.get(sourceParam) ?? undefined;
  if (!filter.hasCommutePrefill || !commuteSourceId || filter.maxCommuteMinutes <= 0) return;

  params.set(sourceKey, commuteSourceId);
  params.set(QueryParamsKeys.MAX_COMMUTE_MINUTES, String(filter.maxCommuteMinutes));
};

export const deserializeCommutePrefill = <TFilter extends CommutePrefillFilter>(
  filter: TFilter,
  searchParams: { get: (key: string) => string | null },
  sourceKey: CommuteSourceKey,
): TFilter => {
  filter.hasCommutePrefill = false;
  filter.maxCommuteMinutes = 0;

  const commuteSourceId = searchParams.get(sourceKey);
  const maxCommuteMinutes = Number(searchParams.get(QueryParamsKeys.MAX_COMMUTE_MINUTES));

  if (commuteSourceId && Number.isFinite(maxCommuteMinutes) && maxCommuteMinutes > 0) {
    filter.hasCommutePrefill = true;
    filter.maxCommuteMinutes = maxCommuteMinutes;
  }

  return filter;
};

export const clearCommutePrefill = <TFilter extends CommutePrefillFilter>(filter: TFilter): TFilter => ({
  ...filter,
  hasCommutePrefill: false,
  maxCommuteMinutes: 0,
});

export const createCommutePrefillItem = <TFilter extends CommutePrefillFilter>(
  filter: TFilter,
  setFilter: SetFilter<TFilter>,
  t: TFunction,
  sourceKey: CommuteSourceKey,
): FilterItem | undefined => {
  if (!filter.hasCommutePrefill || filter.maxCommuteMinutes <= 0) return undefined;

  return {
    label: t("dashboard.filters.commute", {
      minutes: filter.maxCommuteMinutes,
    }),
    checked: true,
    onChange: (checked) => {
      if (!checked) setFilter((prev) => clearCommutePrefill(prev));
    },
    keyValue: sourceKey,
  };
};

export const createCommuteMinutesFilterItems = <TFilter extends CommutePrefillFilter>(
  filter: TFilter,
  setFilter: SetFilter<TFilter>,
  t: TFunction,
): FilterItem[] =>
  MAX_COMMUTE_MINUTES_OPTIONS.map((minutes) => ({
    label: t("dashboard.filters.commuteMinutesOption", { minutes }),
    checked: filter.maxCommuteMinutes === minutes,
    onChange: (checked) => {
      setFilter((prev) => ({ ...prev, maxCommuteMinutes: checked ? minutes : 0 }));
    },
    keyValue: String(minutes),
  }));

export const withPrefilledMarker = (query: string | URLSearchParams) => {
  const params = new URLSearchParams(query.toString());
  params.set(PREFILLED_PARAM, "1");
  return params.toString();
};
