import { ApiAvailability, ApiLanguage, ByDay, OccasionalType, OptionItem, TimeSlot } from "need4deed-sdk";
import { ScheduleFilter, SelectionMap } from "./types";

type MatchingSource = {
  districtIds: number[];
  languages: Pick<ApiLanguage, "id" | "title">[];
  availability: ApiAvailability[];
  appointmentDate?: string | null;
  appointmentTime?: string | null;
};

type PrefillableFilter = {
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

  return next;
}

export const PREFILLED_PARAM = "prefilled";

const ALWAYS_FILTER_PARAMS = [PREFILLED_PARAM, "search", "availability"];

export const hasFilterParams = (searchParams: { has: (key: string) => boolean }, configKeys: string[]) =>
  [...ALWAYS_FILTER_PARAMS, ...configKeys].some((key) => searchParams.has(key));

export const withPrefilledMarker = (query: string | URLSearchParams) => {
  const params = new URLSearchParams(query.toString());
  params.set(PREFILLED_PARAM, "1");
  return params.toString();
};
