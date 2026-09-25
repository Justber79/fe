import { TFunction } from "i18next";
import { Lang, OpportunityLegacyType, TranslatedIntoType } from "need4deed-sdk";
import { IconName } from "@/components/VolunteeringCategories/types";
import {
  CategoryTitle,
  DASH,
  FILTER_KEY,
  FILTER_KEY_LIST,
  FilterKey,
  LegacyTimeSlot,
  langQueryParamKey,
} from "./constants";
import { CardsFilter, Day, DayKeys, Days, DaysKeys, LegacyTimeslot, Opportunity, OpportunityApi } from "./types";

/* Mapping API → view model */

const mapOpportunity = (opp: OpportunityApi, t: TFunction): Opportunity => {
  const accompanyingTranslationMap = {
    [TranslatedIntoType.ENGLISH_OK]: t("homepage.volunteeringOpportunities.accompanyingTranslation.en"),
    [TranslatedIntoType.DEUTSCHE]: t("homepage.volunteeringOpportunities.accompanyingTranslation.de"),
    [TranslatedIntoType.NO_TRANSLATION]: t("homepage.volunteeringOpportunities.accompanyingTranslation.no"),
  };

  const otherCategory = t("homepage.volunteeringOpportunities.otherCategory");

  const category =
    (opp.category_id === CategoryTitle.ACCOMPANYING && opp.opportunity_type === OpportunityLegacyType.VOLUNTEERING) ||
    !opp.category
      ? otherCategory
      : opp.category;

  return {
    accompanyingDate: opp.accomp_datetime ? new Date(opp.accomp_datetime) : null,
    accompanyingInfo: opp.accomp_information,
    accompanyingTranslation: accompanyingTranslationMap[opp.accomp_translation || TranslatedIntoType.NO_TRANSLATION],
    activities: opp.activities ?? [],
    createdAt: new Date(opp.created_at),
    datetime: opp.datetime_str,
    id: opp.id,
    languages: opp.languages ?? [],
    locations: opp.berlin_locations ?? [],
    opportunityType: opp.opportunity_type,
    schedule: opp.schedule_str,
    skills: opp.skills ?? [],
    status: opp.status,
    timeslots: opp.timeslots ?? [],
    title: opp.title,
    updatedAt: new Date(opp.updated_at),
    voInformation: opp.vo_information,
    categoryId: opp.category_id,
    // be sends null since the Notion sync is gone; fall back so sorting still means something.
    lastEditedTimeNotion: new Date(opp.last_edited_time_notion ?? opp.updated_at),
    defaultMainCommunication: t("homepage.volunteeringOpportunities.defaultMainCommunication"),
    category,
  };
};

export const getMappedOpportunities = (opps: OpportunityApi[], t: TFunction) =>
  (Array.isArray(opps) ? opps : []).map((opp) => mapOpportunity(opp, t));

export function getIconName(category: CategoryTitle) {
  const categoryIconMap = {
    [CategoryTitle.ACCOMPANYING]: IconName.Users,
    [CategoryTitle.SPORT_ACTIVITIES]: IconName.PingPong,
    [CategoryTitle.EVENTS]: IconName.CalendarStar,
    [CategoryTitle.SKILLS_BASED]: IconName.Bicycle,
    [CategoryTitle.CHILD_CARE]: IconName.Baby,
    [CategoryTitle.DE_LNG_SUPPORT]: IconName.ChatsTeardrop,
  };

  return category in categoryIconMap ? categoryIconMap[category] : IconName.Sparkle;
}

const langLocaleMap: Record<Lang, string> = {
  [Lang.EN]: "en-US",
  [Lang.DE]: "de-DE",
};

export const formatAccompanyingDate = (date: Date, lang: Lang): string => {
  const locale = langLocaleMap[lang] ?? langLocaleMap[Lang.DE];
  const datePart = new Intl.DateTimeFormat(locale, { weekday: "long", month: "long", day: "numeric" }).format(date);
  const timePart = new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", hour12: false }).format(date);

  return `${datePart}, ${timePart}`;
};

export const getRegisterCtaUrl = (lang: Lang, { id, title }: Pick<Opportunity, "id" | "title">) =>
  `/${lang}/forms/volunteer?id=${id}&title=${encodeURIComponent(title)}`;

/* Filtering */

const dayEnumMap: Record<number, DaysKeys> = {
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
  7: "sunday",
};

// be reports morning as "9-12"; the website only knew the older 08-11/11-14 slots.
const slotsByDaySlot: Record<DayKeys, string[]> = {
  morning: [LegacyTimeSlot.MORNING, LegacyTimeSlot.NOON, "9-12"],
  afternoon: [LegacyTimeSlot.AFTERNOON],
  evening: [LegacyTimeSlot.EVENING],
};

const getSearchableTimeSlotsMap = (timeslots: LegacyTimeslot[]) => {
  const timeslotsMap: Partial<Record<DaysKeys, string[]>> = {};

  for (const { day, time_slot } of timeslots) {
    const dayKey = dayEnumMap[day];
    if (!dayKey) continue;
    (timeslotsMap[dayKey] ??= []).push(time_slot);
  }

  return timeslotsMap;
};

type SelectedDays = Partial<Record<DaysKeys, Partial<Day>>>;

const getSelectedDays = (daysFilter: Days) => {
  const selectedDays: SelectedDays = {};

  for (const day of Object.keys(daysFilter) as DaysKeys[]) {
    for (const daySlot of Object.keys(daysFilter[day]) as DayKeys[]) {
      if (daysFilter[day][daySlot]) {
        selectedDays[day] = { ...selectedDays[day], [daySlot]: true };
      }
    }
  }

  return selectedDays;
};

interface ReducedFilter extends Pick<CardsFilter, "searchInput" | "accompanying"> {
  selectedActivityTypes: string[];
  selectedDistricts: string[];
  selectedDays: SelectedDays;
}

export const reduceFilter = ({
  searchInput,
  accompanying,
  activityType,
  district,
  days,
}: CardsFilter): ReducedFilter => ({
  searchInput,
  accompanying,
  selectedActivityTypes: Object.keys(activityType).filter((type) => activityType[type]),
  selectedDistricts: Object.keys(district).filter((d) => district[d]),
  selectedDays: getSelectedDays(days),
});

export const filterOpportunity = (opportunity: Opportunity, reducedFilter: ReducedFilter) => {
  const {
    title,
    activities,
    languages,
    accompanyingTranslation,
    defaultMainCommunication,
    locations,
    opportunityType,
    timeslots,
    category,
  } = opportunity;
  const { searchInput, accompanying, selectedActivityTypes, selectedDistricts, selectedDays } = reducedFilter;

  if (searchInput) {
    const searchableData =
      title + activities.join("") + languages.join("") + accompanyingTranslation + defaultMainCommunication;
    if (!searchableData.toLowerCase().includes(searchInput.toLowerCase())) return false;
  }

  if (accompanying && opportunityType !== OpportunityLegacyType.ACCOMPANYING) return false;

  if (selectedActivityTypes.length && !selectedActivityTypes.includes(category)) return false;

  if (selectedDistricts.length && !selectedDistricts.some((d) => locations.includes(d))) return false;

  const selectedDayKeys = Object.keys(selectedDays) as DaysKeys[];
  if (selectedDayKeys.length) {
    if (!timeslots.length) return false;

    const slotsByDay = getSearchableTimeSlotsMap(timeslots);

    return selectedDayKeys.some((day) => {
      const daySlots = slotsByDay[day];
      const selected = selectedDays[day];
      if (!daySlots || !selected) return false;

      return (Object.keys(selected) as DayKeys[]).some((daySlot) =>
        daySlots.some((slot) => slotsByDaySlot[daySlot].includes(slot)),
      );
    });
  }

  return true;
};

const createDefaultFilterFromSet = (set: Set<string>) =>
  Object.fromEntries([...set].map((key) => [key, false])) as Record<string, boolean>;

export const extractCardsFilter = (opportunities: Opportunity[], t: TFunction): Partial<CardsFilter> => {
  const categoriesSet = new Set<string>();
  const districtSet = new Set<string>();

  for (const opp of opportunities) {
    // "Accompanying" is its own switch, not an activity type.
    if (opp.categoryId !== CategoryTitle.ACCOMPANYING) categoriesSet.add(opp.category);
    opp.locations.forEach((l) => districtSet.add(l));
  }

  // Keep "Other" last.
  const otherCategory = t("homepage.volunteeringOpportunities.otherCategory");
  if (categoriesSet.delete(otherCategory)) categoriesSet.add(otherCategory);

  return { activityType: createDefaultFilterFromSet(categoriesSet), district: createDefaultFilterFromSet(districtSet) };
};

export const isObjectEmpty = (obj: object) => Object.keys(obj).length === 0;

const hasKey = <T extends object>(obj: T | null | undefined, key: PropertyKey): key is keyof T =>
  !!obj && Object.prototype.hasOwnProperty.call(obj, key);

/* Filter ⇄ URL query */

export function serializeFilters(filters: CardsFilter, language: Lang) {
  const params = new URLSearchParams();

  if (filters.searchInput) params.set(FILTER_KEY.SEARCH_INPUT, filters.searchInput);
  if (filters.accompanying) params.set(FILTER_KEY.ACCOMPANYING, "true");

  Object.entries(filters.activityType).forEach(([key, value]) => {
    if (value) params.append(FILTER_KEY.ACTIVITY_TYPE, key);
  });

  Object.entries(filters.district).forEach(([key, value]) => {
    if (value) params.append(FILTER_KEY.DISTRICT, key);
  });

  Object.entries(filters.days).forEach(([day, slots]) => {
    Object.entries(slots as Day).forEach(([slot, value]) => {
      if (value) params.append(FILTER_KEY.DAYS, `${day}${DASH}${slot}`);
    });
  });

  if (params.size) params.set(langQueryParamKey, language);

  return params;
}

export function deserializeFilters(query: URLSearchParams, filter: CardsFilter): CardsFilter {
  const filters: CardsFilter = structuredClone(filter);

  const search = query.get(FILTER_KEY.SEARCH_INPUT);
  if (search !== null) filters.searchInput = search;

  if (query.get(FILTER_KEY.ACCOMPANYING) === "true") filters.accompanying = true;

  query.getAll(FILTER_KEY.ACTIVITY_TYPE).forEach((type) => {
    if (hasKey(filters.activityType, type)) filters.activityType[type] = true;
  });

  query.getAll(FILTER_KEY.DISTRICT).forEach((dist) => {
    if (hasKey(filters.district, dist)) filters.district[dist] = true;
  });

  query.getAll(FILTER_KEY.DAYS).forEach((slot) => {
    const [day, time] = slot.split(DASH) as [DaysKeys, DayKeys];
    if (filters.days[day]?.[time] !== undefined) filters.days[day][time] = true;
  });

  return filters;
}

const getFilterKeysExcluding = (exclude: FilterKey[] = []): FilterKey[] =>
  FILTER_KEY_LIST.filter((key) => !exclude.includes(key));

export const openFilters = (searchParams: URLSearchParams) =>
  getFilterKeysExcluding([FILTER_KEY.SEARCH_INPUT]).some((key) => searchParams.has(key));
