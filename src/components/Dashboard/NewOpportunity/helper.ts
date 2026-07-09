import { ApiLanguageOption } from "@/components/Dashboard/Profile/sections/VolunteerProfile/hooks";
import { TFunction } from "i18next";
import { OptionItem, TranslatedIntoType, Lang, VolunteerStateTypeType } from "need4deed-sdk";
import { HeaderFormData } from "./NewOpportunity";
import { OpportunityDetailsFormData } from "@/components/Dashboard/Profile/sections/OpportunityDetails/opportunityDetailsSchema";
import { AccompanyingDetailsFormData } from "../Profile/sections/AccompanyingDetails/createAccompanyingDetailsSchema";

// ─── Types ──────────────────────────────────────────────────────────────────

// Not yet in need4deed-sdk — defined locally until the SDK is updated.
type OpportunityFormDataWithAgentSubmitter = {
  title: string;
  opportunity_type: "accompanying" | "volunteering";
  vo_information: string | null;
  volunteers_number: number;
  languages: string[];
  activities: string[];
  skills: string[];
  timeslots: [number, string][] | null;
  onetime_date_time: string | null;
  accomp_address: string | null;
  accomp_postcode: string | null;
  accomp_datetime: string | null;
  accomp_name: string | null;
  accomp_phone: string | null;
  accomp_information: string | null;
  accomp_translation: `${TranslatedIntoType}` | null;
  berlin_locations: string[] | null;
  category: string;
  category_id: string;
  language: `${Lang}`;
  agent_id: number;
  submitted_by_id: number | null;
  last_edited_time_notion: string | null;
};

export function toLangOptionItems(
  formLangs: { language: string }[],
  apiLanguages: ApiLanguageOption[],
  t: TFunction,
): OptionItem[] {
  return formLangs.flatMap(({ language }) => {
    if (!language) return [];
    const numId = Number(language);
    if (!isNaN(numId) && numId > 0) {
      const found = apiLanguages.find((a) => a.id === numId);
      return found ? [{ id: found.id, title: found.title }] : [];
    }
    const found = apiLanguages.find((a) => {
      if (a.title === language || a.title.toLowerCase() === language.toLowerCase()) return true;
      const key = `languageNames.${a.title.toLowerCase()}`;
      const translated = t(key);
      return translated !== key && translated === language;
    });
    return found ? [{ id: found.id, title: found.title }] : [];
  });
}

export function toOptionItems(ids: string[], apiItems: ApiLanguageOption[]): OptionItem[] {
  const map = new Map(apiItems.map((i) => [i.id, i.title]));
  return ids.flatMap((id) => {
    const numId = Number(id);
    const title = map.get(numId);
    return title ? [{ id: numId, title }] : [];
  });
}

export function availabilityToTimeslots(availability: OpportunityDetailsFormData["availability"]): [number, string][] {
  return (availability ?? []).flatMap(({ weekday, timeSlots }) =>
    timeSlots
      .filter((ts) => ts.selected)
      .map((ts) => {
        const slotId = weekday === 0 ? ts.id.charAt(0).toUpperCase() + ts.id.slice(1) : ts.id;
        return [weekday, slotId] as [number, string];
      }),
  );
}

export function buildCreatePayload(
  headerData: HeaderFormData,
  detailsData: OpportunityDetailsFormData,
  accompData: AccompanyingDetailsFormData | null,
  apiLanguages: ApiLanguageOption[],
  apiActivities: ApiLanguageOption[],
  apiSkills: ApiLanguageOption[],
  lang: string,
  t: TFunction,
  agentId: number,
): OpportunityFormDataWithAgentSubmitter {
  const isEvent = headerData.volunteerType === VolunteerStateTypeType.EVENTS;
  const isAccompanying = headerData.volunteerType === VolunteerStateTypeType.ACCOMPANYING;

  const mainLangIds = toLangOptionItems(detailsData.mainCommunication, apiLanguages, t).map((i) => String(i.id));
  const residentsLangIds = toLangOptionItems(detailsData.residentsSpeak, apiLanguages, t).map((i) => String(i.id));
  const refugeeLangIds = (accompData?.refugeeLanguage ?? []).map(String).filter(Boolean);
  const languages = [...new Set([...mainLangIds, ...residentsLangIds, ...refugeeLangIds])];

  const activities = toOptionItems(detailsData.activities, apiActivities).map((i) => String(i.id));
  const skills = toOptionItems(detailsData.skills, apiSkills).map((i) => String(i.id));
  const timeslots = isEvent ? null : availabilityToTimeslots(detailsData.availability);

  const onetime_date_time =
    isEvent && detailsData.eventDate
      ? `${detailsData.eventDate.toISOString().split("T")[0]}T${detailsData.eventTime || "00:00"}:00`
      : null;

  const accomp_datetime =
    isAccompanying && accompData?.appointmentDate
      ? `${accompData.appointmentDate.toISOString().split("T")[0]}T${accompData.appointmentTime || "00:00"}:00`
      : null;

  return {
    title: headerData.title,
    opportunity_type: isAccompanying ? "accompanying" : "volunteering",
    vo_information: detailsData.description || null,
    volunteers_number: Number(detailsData.numberOfVolunteers) || 1,
    languages,
    activities,
    skills,
    timeslots,
    onetime_date_time,
    accomp_address: isAccompanying ? (accompData?.appointmentAddress ?? null) : null,
    accomp_postcode: isAccompanying ? (accompData?.appointmentPostcode ?? null) : null,
    accomp_datetime,
    accomp_name: isAccompanying ? (accompData?.refugeeName ?? null) : null,
    accomp_phone: isAccompanying ? (accompData?.refugeeNumber ?? null) : null,
    accomp_information: null,
    accomp_translation: isAccompanying ? accompData?.appointmentLanguage || null : null,
    berlin_locations: null,
    category: "",
    category_id: "",
    language: lang as `${Lang}`,
    agent_id: agentId,
    submitted_by_id: null,
    last_edited_time_notion: null,
  };
}
