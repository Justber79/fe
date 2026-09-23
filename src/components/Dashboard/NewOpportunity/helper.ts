import { ApiLanguageOption } from "@/components/Dashboard/Profile/sections/VolunteerProfile/hooks";
import { format } from "date-fns";
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
  const timeslots = isEvent ? undefined : availabilityToTimeslots(detailsData.availability);

  // eventDate/appointmentDate are local-midnight Date objects from the date
  // picker (react-day-picker) — extract the *local* calendar date here, not
  // its UTC date, or a positive UTC offset (Europe/Berlin is always +1/+2)
  // reads back the previous day (fe#920).
  const onetime_date_time =
    isEvent && detailsData.eventDate
      ? `${format(detailsData.eventDate, "yyyy-MM-dd")}T${detailsData.eventTime || "00:00"}:00`
      : undefined;

  const accomp_datetime =
    isAccompanying && accompData?.appointmentDate
      ? `${format(accompData.appointmentDate, "yyyy-MM-dd")}T${accompData.appointmentTime || "00:00"}:00`
      : undefined;

  // The backend's POST /opportunity schema allows these optional properties
  // to be omitted, but rejects them when present as `null` (fe#1036) — so
  // every field below that doesn't apply to the selected type, or has no
  // value, is left `undefined` rather than `null` so it's dropped from the
  // JSON body instead of being sent as an explicit null.
  return {
    title: headerData.title,
    opportunity_type: isAccompanying ? OpportunityLegacyType.ACCOMPANYING : OpportunityLegacyType.VOLUNTEERING,
    vo_information: detailsData.description || undefined,
    volunteers_number: Number(detailsData.numberOfVolunteers) || 1,
    languageIds,
    activityIds,
    skillIds,
    timeslots,
    onetime_date_time,
    accomp_address: isAccompanying ? accompData?.appointmentAddress || undefined : undefined,
    accomp_postcode: isAccompanying ? accompData?.appointmentPostcode || undefined : undefined,
    accomp_datetime,
    accomp_name: isAccompanying ? accompData?.refugeeName || undefined : undefined,
    accomp_phone: isAccompanying ? accompData?.refugeeNumber || undefined : undefined,
    accomp_information: undefined,
    accomp_translation: isAccompanying ? accompData?.appointmentLanguage || undefined : undefined,
    districtIds: undefined,
    category: "",
    category_id: "",
    language: lang as `${Lang}`,
    agent_id: agentId,
    submitted_by_id: undefined,
    last_edited_time_notion: undefined,
  };
}
