import { TFunction } from "i18next";
import { ApiLanguage, ApiVolunteerGet, LangPurpose, VolunteerStateTypeType } from "need4deed-sdk";
import { apiToFormAvailability } from "./availabilityUtils";
import { LEVEL_TO_PROFICIENCY } from "./constants";
import { formatActivities, formatDistricts, formatLanguages, formatSkills, getVolunteerTypeLabel } from "./formatters";
import { Mapping } from "./mappingUtils";
import { VolunteerProfileFormData } from "./volunteerProfileSchema";

export function createFormDefaultValues(
  volunteer: ApiVolunteerGet,
  languageMapping: Mapping,
  districtMapping: Mapping,
  activityMapping: Mapping,
  skillMapping: Mapping,
  t: TFunction,
): VolunteerProfileFormData {
  return {
    languages: formatLanguages(volunteer.languages, languageMapping.titleToIdLower),
    availability: apiToFormAvailability(volunteer.availability),
    districts: formatDistricts(volunteer.locations, districtMapping.titleToIdLower),
    volunteerType: getVolunteerTypeLabel(volunteer.statusType, t),
    activities: formatActivities(volunteer.activities, activityMapping.titleToIdLower),
    skills: formatSkills(volunteer.skills, skillMapping.titleToIdLower),
  };
}

export function createLabelToVolunteerTypeMap(t: TFunction): Record<string, VolunteerStateTypeType> {
  return Object.values(VolunteerStateTypeType).reduce(
    (acc, type) => {
      acc[t(`dashboard.volunteerProfile.volunteerHeader.volunteerType_options.${type}`)] = type;
      return acc;
    },
    {} as Record<string, VolunteerStateTypeType>,
  );
}

export function mapToApiItems(ids: string[], mapping: { idToTitle: Record<number, string> }) {
  return ids
    .map((id) => {
      const numId = parseInt(id, 10);
      return { id: numId, title: mapping.idToTitle[numId] || "" };
    })
    .filter((item) => !isNaN(item.id) && item.id > 0);
}

export function transformLanguagesToApi(languages: VolunteerProfileFormData["languages"], languageMapping: Mapping) {
  return languages
    .filter((lang) => lang.language && lang.level)
    .map(
      (lang) =>
        ({
          id: parseInt(lang.language, 10),
          title: languageMapping.idToTitle[parseInt(lang.language, 10)] || "",
          proficiency: LEVEL_TO_PROFICIENCY[lang.level as unknown as number],
          purpose: lang.purpose ?? LangPurpose.GENERAL,
        }) as ApiLanguage,
    );
}
