import {
  ApiLanguage,
  ApiOptionLists,
  ApiVolunteerGetList,
  LangProficiency,
  OptionItem,
  QueryParamsKeys,
} from "need4deed-sdk";
export { createSelectedFilterItemsAsFlatArray } from "./Filters/helpers";
import { ReadonlyURLSearchParams } from "next/navigation";
import { AvailabilityKeys, AvailabilitySubKeys, SEPARATOR } from "./Filters/constants";
import { VolunteerCardsFilter } from "./Filters/types";
import { deserializeSelectionFilters, serializeSelectionFilters } from "../common/CardsFilter/selectionFilters";
import { volunteerFilterConfigs } from "./Filters/config";

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

export const groupLanguagesByProficiency = (languages: ApiLanguage[]): GroupedLanguage[] => {
  const groupedLanguagesMap = new Map<LangProficiency, string[]>();

  for (const { proficiency, title } of languages) {
    if (!proficiency) continue;

    if (!groupedLanguagesMap.has(proficiency || LangProficiency.BEGINNER)) {
      groupedLanguagesMap.set(proficiency || LangProficiency.BEGINNER, []);
    }

    groupedLanguagesMap.get(proficiency || LangProficiency.BEGINNER)!.push(title);
  }

  const groupedLanguages: GroupedLanguage[] = [];
  groupedLanguagesMap.forEach((list, proficiency) => {
    groupedLanguages.push({ proficiency, list });
  });

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
  filter: VolunteerCardsFilter,
  searchParams?: ReadonlyURLSearchParams,
  asString = true,
  options?: SerializeFiltersOptions,
) {
  const params = new URLSearchParams(searchParams);
  params.delete("page");

  if (filter.search) params.set(QueryParamsKeys.SEARCH, filter.search);
  else params.delete(QueryParamsKeys.SEARCH);

  serializeSelectionFilters(volunteerFilterConfigs, filter, params, options);

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

export function deserializeVolunteerFilters(filter: VolunteerCardsFilter, searchParams: ReadonlyURLSearchParams) {
  const newFilter: VolunteerCardsFilter = structuredClone(filter);

  const search = searchParams.get(QueryParamsKeys.SEARCH);
  if (search !== null) {
    newFilter.search = search;
  }

  deserializeSelectionFilters(volunteerFilterConfigs, newFilter, searchParams);

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

export function getFirstName(fullName: string): string {
  return fullName.split(" ")[0];
}

export function truncateList(items: string[], max: number): string {
  if (items.length <= max) return items.join(", ");
  return `${items.slice(0, max).join(", ")} +${items.length - max}`;
}

export function getTopLanguages(languages: ApiLanguage[], max = 2): string[] {
  const order = [
    LangProficiency.NATIVE,
    LangProficiency.FLUENT,
    LangProficiency.ADVANCED,
    LangProficiency.INTERMEDIATE,
    LangProficiency.BEGINNER,
  ];
  const rank = (p: LangProficiency | undefined) => (p !== undefined ? order.indexOf(p) : order.length);
  return [...languages]
    .sort((a, b) => rank(a.proficiency) - rank(b.proficiency))
    .map((l) => l.title)
    .filter(Boolean)
    .slice(0, max);
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
