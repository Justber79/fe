import {
  ApiLanguage,
  ApiOptionLists,
  ApiVolunteerGetList,
  LangProficiency,
  OptionItem,
  QueryParamsKeys,
} from "need4deed-sdk";
export { createFilterFromOption } from "../common/CardsFilter/helpers";
export { createSelectedFilterItemsAsFlatArray } from "./Filters/helpers";
import { ReadonlyURLSearchParams } from "next/navigation";
import { AvailabilityKeys, AvailabilitySubKeys, SEPARATOR } from "./Filters/constants";
import { CardsFilter } from "./Filters/types";

const proficiencyOrder = [
  LangProficiency.NATIVE,
  LangProficiency.FLUENT,
  LangProficiency.ADVANCED,
  LangProficiency.INTERMEDIATE,
  LangProficiency.BEGINNER,
];

interface GroupedLanguage {
  proficiency: LangProficiency;
  list: string[];
}

/**
 * Groups a list of languages by their proficiency level.
 * @param languages The input array of ApiLanguage objects.
 * @returns An array of GroupedLanguage objects.
 */
export const groupLanguagesByProficiency = (languages: ApiLanguage[]): GroupedLanguage[] => {
  const groupedLanguagesMap = new Map<LangProficiency, string[]>();

  for (const { proficiency, title } of languages) {
    if (!proficiency) continue;

    if (!groupedLanguagesMap.has(proficiency || LangProficiency.BEGINNER)) {
      groupedLanguagesMap.set(proficiency || LangProficiency.BEGINNER, []);
    }

    groupedLanguagesMap.get(proficiency || LangProficiency.BEGINNER)!.push(title);
  }

  // Convert the Map to the desired array format
  const groupedLanguages: GroupedLanguage[] = [];
  groupedLanguagesMap.forEach((list, proficiency) => {
    groupedLanguages.push({ proficiency, list });
  });

  // 👇️ Sorting Languages
  groupedLanguages.sort((a, b) => {
    return proficiencyOrder.indexOf(a.proficiency) - proficiencyOrder.indexOf(b.proficiency);
  });

  return groupedLanguages;
};

interface SerializeFiltersOptions {
  serializeToIDs?: boolean;
  apiFilterOptions?: ApiOptionLists;
}

export function serializeFilters(
  filter: CardsFilter,
  searchParams?: ReadonlyURLSearchParams,
  asString = true,
  options?: SerializeFiltersOptions,
) {
  const params = new URLSearchParams(searchParams);
  params.delete("page");

  if (filter.search) params.set(QueryParamsKeys.SEARCH, filter.search);
  else params.delete(QueryParamsKeys.SEARCH);

  if (filter.accompanying) params.set(QueryParamsKeys.ACCOMPANYING, "true");
  else params.delete(QueryParamsKeys.ACCOMPANYING);

  params.delete("type");
  Object.entries(filter.type).forEach(([key, value]) => {
    if (value === true) params.append("type", key);
  });

  // 2. Clear all existing 'district' params
  params.delete(QueryParamsKeys.DISTRICT);
  Object.entries(filter.district).forEach(([key, value]) => {
    if (value === true) {
      if (options?.serializeToIDs && options.apiFilterOptions) {
        const districtId = options.apiFilterOptions.district?.find((d) => d.title === key)?.id;
        if (districtId !== undefined) {
          params.append(QueryParamsKeys.DISTRICT, String(districtId));
        }
      } else {
        params.append(QueryParamsKeys.DISTRICT, key);
      }
    }
  });

  // 2. Clear all existing 'language' params
  params.delete(QueryParamsKeys.LANGUAGE);
  Object.entries(filter.language).forEach(([key, value]) => {
    if (value === true) {
      if (options?.serializeToIDs && options.apiFilterOptions) {
        const languageId = options.apiFilterOptions.language?.find((d) => d.title === key)?.id;
        if (languageId !== undefined) {
          params.append(QueryParamsKeys.LANGUAGE, String(languageId));
        }
      } else {
        params.append(QueryParamsKeys.LANGUAGE, key);
      }
    }
  });

  // 2. Clear all existing 'engagement' params
  // Strip the "vol-" prefix because the backend's engagementWorkaround re-adds it
  params.delete(QueryParamsKeys.ENGAGEMENT);
  Object.entries(filter.engagement).forEach(([key, value]) => {
    if (value === true) {
      params.append(QueryParamsKeys.ENGAGEMENT, key.replace(/^vol-/, ""));
    }
  });

  // 2. Clear all existing 'availability' params
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

export function deserializeVolunteerFilters(filter: CardsFilter, searchParams: ReadonlyURLSearchParams) {
  const newFilter: CardsFilter = structuredClone(filter);

  const search = searchParams.get(QueryParamsKeys.SEARCH);
  if (search !== null) {
    newFilter.search = search;
  }

  const queryAccompanying = searchParams.get(QueryParamsKeys.ACCOMPANYING);
  if (queryAccompanying === "true") {
    newFilter.accompanying = true;
  }

  const queryTypes = searchParams.getAll("type");
  queryTypes.forEach((t) => {
    if (newFilter.type[t] !== undefined) {
      newFilter.type[t] = true;
    }
  });

  const queryDistricts = searchParams.getAll(QueryParamsKeys.DISTRICT);
  queryDistricts.forEach((d) => {
    // Check if the query param value is exist in the filters. if not, ignore that query param !!!
    if (newFilter.district[d] !== undefined) {
      newFilter.district[d] = true;
    }
  });

  const queryLanguages = searchParams.getAll(QueryParamsKeys.LANGUAGE);
  queryLanguages.forEach((l) => {
    if (newFilter.language[l] !== undefined) {
      newFilter.language[l] = true;
    }
  });

  const queryEngagement = searchParams.getAll(QueryParamsKeys.ENGAGEMENT);
  queryEngagement.forEach((e) => {
    if (newFilter.engagement[e] !== undefined) {
      newFilter.engagement[e] = true;
    }
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

function getTitleFromOptionItem(optionItem: OptionItem): string {
  return optionItem.title;
}

export function getNormalizedVolunteer(volunteer: ApiVolunteerGetList): Omit<
  ApiVolunteerGetList,
  "activities" | "skills" | "locations"
> & {
  activities: string[];
  skills: string[];
  locations: string[];
} {
  return {
    ...volunteer,
    activities: volunteer.activities.map(getTitleFromOptionItem),
    skills: volunteer.skills.map(getTitleFromOptionItem),
    locations: volunteer.locations.map(getTitleFromOptionItem),
  };
}
