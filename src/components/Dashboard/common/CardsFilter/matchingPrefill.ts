import { ApiAvailability, ByDay, OccasionalType, OptionItem, TimeSlot } from "need4deed-sdk";
import { ScheduleFilter, SelectionMap } from "./types";

type MatchingSource = {
  districtIds: number[];
  languages: { id?: number; title: string }[];
  availability: ApiAvailability[];
  appointmentDate?: string | null;
};

type PrefillableFilter = {
  district: SelectionMap;
  language: SelectionMap;
  availability: ScheduleFilter;
};

const WEEKDAYS: ByDay[] = [ByDay.SU, ByDay.MO, ByDay.TU, ByDay.WE, ByDay.TH, ByDay.FR, ByDay.SA];

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
    const weekday = WEEKDAYS[new Date(source.appointmentDate).getUTCDay()];
    if (weekday) next.availability.days[weekday] = true;
  }

  return next;
}

const FILTER_PARAM_KEYS = [
  "search",
  "engagement",
  "match",
  "district",
  "language",
  "availability",
  "type",
  "activity",
  "skill",
  "status",
];

export const hasFilterParams = (searchParams: URLSearchParams | { has: (key: string) => boolean }) =>
  FILTER_PARAM_KEYS.some((key) => searchParams.has(key));
