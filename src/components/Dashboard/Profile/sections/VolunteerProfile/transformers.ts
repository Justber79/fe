import { ApiLanguage, ApiVolunteerGet, LangPurpose } from "need4deed-sdk";
import { LanguageLevel } from "@/types";
import { apiToFormAvailability } from "./availabilityUtils";
import { LEVEL_TO_PROFICIENCY } from "./constants";
import { formatActivities, formatDistricts, formatLanguages, formatSkills } from "./formatters";
import { Mapping } from "./mappingUtils";
import { VolunteerProfileFormData } from "./volunteerProfileSchema";

export function createFormDefaultValues(
  volunteer: ApiVolunteerGet,
  languageMapping: Mapping,
  districtMapping: Mapping,
  activityMapping: Mapping,
  skillMapping: Mapping,
): VolunteerProfileFormData {
  return {
    languages: formatLanguages(volunteer.languages, languageMapping.titleToIdLower),
    availability: apiToFormAvailability(volunteer.availability),
    districts: formatDistricts(volunteer.locations, districtMapping.titleToIdLower),
    activities: formatActivities(volunteer.activities, activityMapping.titleToIdLower),
    skills: formatSkills(volunteer.skills, skillMapping.titleToIdLower),
  };
}

export function mapToApiItems(ids: string[], mapping: { idToTitle: Record<number, string> }) {
  return ids
    .map((id) => {
      const numId = parseInt(id, 10);
      return { id: numId, title: mapping.idToTitle[numId] || "" };
    })
    .filter((item) => !isNaN(item.id) && item.id > 0);
}

type FormLanguage = VolunteerProfileFormData["languages"][number];

export function transformLanguagesToApi(
  languages: VolunteerProfileFormData["languages"],
  languageMapping: Mapping,
): ApiLanguage[] {
  return languages
    .filter((lang): lang is FormLanguage & { level: LanguageLevel } => Boolean(lang.language && lang.level))
    .map((lang) => ({
      id: parseInt(lang.language, 10),
      title: languageMapping.idToTitle[parseInt(lang.language, 10)] || "",
      proficiency: LEVEL_TO_PROFICIENCY[lang.level],
      purpose: lang.purpose ?? LangPurpose.GENERAL,
    }));
}
