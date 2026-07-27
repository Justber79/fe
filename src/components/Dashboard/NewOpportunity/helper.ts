import { ApiLanguageOption } from "@/components/Dashboard/Profile/sections/VolunteerProfile/hooks";
import { TFunction } from "i18next";
import {
  OptionItem,
  Lang,
  VolunteerStateTypeType,
  OpportunityLegacyType,
  OpportunityFormDataWithAgentSubmitter,
} from "need4deed-sdk";
import { HeaderFormData } from "./headerSchema";
import { AccompanyingDetailsFormData } from "../Profile/sections/AccompanyingDetails/createAccompanyingDetailsSchema";
import { NewOpportunityDetailsFormData } from "@/components/Dashboard/Profile/sections/OpportunityDetails/opportunityDetailsSchema";
import { resolveFormLanguageToOption } from "../Profile/sections/OpportunityDetails/formatters";

export function toLangOptionItems(
  formLangs: { language: string }[],
  apiLanguages: ApiLanguageOption[],
  t: TFunction,
): OptionItem[] {
  return formLangs.flatMap(({ language }) => {
    const found = resolveFormLanguageToOption(language, apiLanguages, t);
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

export function availabilityToTimeslots(
  availability: NewOpportunityDetailsFormData["availability"],
): [number, string][] {
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
  detailsData: NewOpportunityDetailsFormData,
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

  const mainLangIds = toLangOptionItems(detailsData.mainCommunication, apiLanguages, t).map((i) => i.id);
  const residentsLangIds = toLangOptionItems(detailsData.residentsSpeak, apiLanguages, t).map((i) => i.id);
  const refugeeLangIds = (accompData?.refugeeLanguage ?? []).map(Number).filter((id) => !isNaN(id));
  const languageIds = [...new Set([...mainLangIds, ...residentsLangIds, ...refugeeLangIds])];

  const activityIds = toOptionItems(detailsData.activities, apiActivities).map((i) => i.id);
  const skillIds = toOptionItems(detailsData.skills, apiSkills).map((i) => i.id);
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
    opportunity_type: isAccompanying ? OpportunityLegacyType.ACCOMPANYING : OpportunityLegacyType.VOLUNTEERING,
    vo_information: detailsData.description || null,
    volunteers_number: Number(detailsData.numberOfVolunteers) || 1,
    languageIds,
    activityIds,
    skillIds,
    timeslots,
    onetime_date_time,
    accomp_address: isAccompanying ? (accompData?.appointmentAddress ?? null) : null,
    accomp_postcode: isAccompanying ? (accompData?.appointmentPostcode ?? null) : null,
    accomp_datetime,
    accomp_name: isAccompanying ? (accompData?.refugeeName ?? null) : null,
    accomp_phone: isAccompanying ? (accompData?.refugeeNumber ?? null) : null,
    accomp_information: null,
    accomp_translation: isAccompanying ? accompData?.appointmentLanguage || null : null,
    districtIds: null,
    category: "",
    category_id: "",
    language: lang as `${Lang}`,
    agent_id: agentId,
    submitted_by_id: null,
    last_edited_time_notion: null,
  };
}
