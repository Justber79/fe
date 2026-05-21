import { getScheduleState } from "@/components/forms/utils";
import { EMPTY_PLACEHOLDER_VALUE } from "@/config/constants";
import { LanguageLevel, LanguageObject } from "@/types";
import { TFunction } from "i18next";
import { ApiVolunteerGet, VolunteerStateTypeType } from "need4deed-sdk";

type VolunteerLanguages = ApiVolunteerGet["languages"];
type VolunteerLocations = ApiVolunteerGet["locations"];
type VolunteerAvailability = ApiVolunteerGet["availability"];

export function formatLanguages(
  langs: VolunteerLanguages,
  languageTitleToDbId: Record<string, number>,
): LanguageObject[] {
  if (!langs || langs.length === 0) {
    return [{ id: 1, language: "", level: "" }];
  }

  const proficiencyToLevel: Record<string, LanguageLevel> = {
    native: LanguageLevel.NATIVE,
    fluent: LanguageLevel.FLUENT,
    intermediate: LanguageLevel.INTERMEDIATE,
    advanced: LanguageLevel.FLUENT,
    beginner: LanguageLevel.INTERMEDIATE,
  };

  return langs.map((lang) => {
    const dbId = languageTitleToDbId[lang.title.toLowerCase()] || lang.id;

    return {
      id: lang.id,
      language: String(dbId),
      level: proficiencyToLevel[lang.proficiency?.toLowerCase() || "native"] || LanguageLevel.NATIVE,
      purpose: lang.purpose,
    };
  });
}

function formatItemsToIds(
  items: { id: number; title: string }[] | undefined,
  titleToIdLower: Record<string, number>,
): string[] {
  if (!items || items.length === 0) return [];
  return items
    .map((item) => {
      const dbId = titleToIdLower[item.title.toLowerCase()] || item.id;
      return String(dbId);
    })
    .filter((id) => id && id !== "0");
}

export const formatActivities = formatItemsToIds;
export const formatSkills = formatItemsToIds;
export const formatDistricts = formatItemsToIds;

export function formatLanguagesForDisplay(
  langs: VolunteerLanguages,
  languageIdToTitle: Record<number, string>,
  t: TFunction,
): string {
  if (!langs || langs.length === 0) return EMPTY_PLACEHOLDER_VALUE;
  return langs
    .map((lang) => {
      const localizedTitle = languageIdToTitle[lang.id] || lang.title;
      const proficiencyKey = lang.proficiency?.toLowerCase();
      const localizedProficiency = proficiencyKey ? t(`dashboard.volunteers.langProficiency.${proficiencyKey}`) : "";
      const proficiency = localizedProficiency ? ` – ${localizedProficiency}` : "";
      return `${localizedTitle}${proficiency}`;
    })
    .join(", ");
}

/**
 * Formats a single availability item with proper translations
 */
export function formatAvailabilityItem(day: string, daytime: string, t: TFunction): string {
  // For "weekdays" and "weekends", the translation already includes "Gelegentlich"
  if (daytime === "weekdays" || daytime === "weekends") {
    return t(`form.schedule.${daytime}`);
  }

  const dayName =
    day === "occasionally"
      ? t("dashboard.volunteers.filters.preferredAv.occasional.header")
      : t(`dashboard.volunteers.filters.preferredAv.days.${day}`);

  return `${dayName}, ${daytime}`;
}

export function formatAvailability(avails: VolunteerAvailability, t: TFunction): string {
  if (!avails || avails.length === 0) {
    const defaultSchedule = getScheduleState();
    const hasSelectedSlots = defaultSchedule.some((day) => day.timeSlots.some((slot) => slot.selected));
    if (!hasSelectedSlots) return EMPTY_PLACEHOLDER_VALUE;
  }

  const timeSlotGroups = new Map<string, string[]>();

  avails.forEach((avail) => {
    if (!avail.day) return;

    const dayName =
      avail.day === "occasionally"
        ? t("dashboard.volunteers.filters.preferredAv.occasional.header")
        : t(`dashboard.volunteers.filters.preferredAv.days.${avail.day}`);

    const timeKey = avail.daytime || "";

    if (!timeSlotGroups.has(timeKey)) {
      timeSlotGroups.set(timeKey, []);
    }
    timeSlotGroups.get(timeKey)?.push(dayName);
  });

  const formatted = Array.from(timeSlotGroups.entries()).map(([time, days]) => {
    if (time === "weekdays" || time === "weekends") {
      return t(`form.schedule.${time}`);
    }

    const daysStr = days.join(" & ");
    return time ? `${daysStr}, ${time}` : daysStr;
  });

  return formatted.join("; ");
}

export function extractTitles(items: { title: string }[]): string[] {
  if (!items || items.length === 0) return [];
  return items.map((item) => item.title);
}

export function getVolunteerTypeLabel(statusType: VolunteerStateTypeType | undefined, t: TFunction): string {
  if (!statusType) return "";
  return t(`dashboard.volunteerProfile.volunteerHeader.volunteerType_options.${statusType}`);
}

export function formatLocationsForDisplay(locations: VolunteerLocations): string {
  if (!locations || locations.length === 0) return EMPTY_PLACEHOLDER_VALUE;
  return locations.map((loc) => loc.title).join(", ");
}
