import { TFunction } from "i18next";
import {
  Lang,
  OccasionalType,
  OpportunityType,
  Option,
  OptionId,
  TimeSlot as SdkTimeSlot,
  TranslatedIntoType,
} from "need4deed-sdk";

import { range } from "@/utils";
import { maxPLZBerlin, maxPLZGermany, minPLZBerlin, minPLZGermany } from "../../config/constants";
import { OpportunityData } from "./AddOpportunity/dataStructure";
import { VolunteerData } from "./BecomeVolunteer/dataStructure";
import { Availability, AvailabilitySlot, Selected, TypePLZ } from "./types";

export function getSelectedIds(state: Selected[]): OptionId[] {
  return state.filter(({ selected }) => selected).map(({ id }) => id);
}

export interface VolunteerDTO {
  origin_opportunity: string | null;
  full_name: string;
  email: string;
  phone: string;
  postal_code: number | null;
  preferred_berlin_locations: OptionId[];
  native_languages: OptionId[];
  fluent_languages: OptionId[];
  intermediate_languages: OptionId[];
  schedule: [number, OptionId][];
  activities: OptionId[];
  skills: OptionId[];
  comments: string | null;
  good_conduct_certificate: "Yes" | "No";
  if_measles_vaccination?: boolean;
  lead_from: string;
  language: Lang | null;
}

export function parseFormStateDTOVolunteer(form: VolunteerData): VolunteerDTO {
  const preferred_berlin_locations = form.locations.filter((l) => l.selected).map((l) => l.id);

  const schedule = form.availability.flatMap(({ weekday, timeSlots }) =>
    timeSlots
      .filter((ts) => ts.selected)
      .map((ts) => {
        const slotId = weekday === 0 ? ts.id.charAt(0).toUpperCase() + ts.id.slice(1) : ts.id;
        return [weekday, slotId];
      }),
  ) as [number, OptionId][];

  const native_languages = form.languages.filter((l) => l.level === "native").map((l) => l.language);
  const fluent_languages = form.languages.filter((l) => l.level === "fluent").map((l) => l.language);
  const intermediate_languages = form.languages.filter((l) => l.level === "intermediate").map((l) => l.language);

  const activities = form.activities.filter((a) => a.selected).map((a) => a.id);

  const skills = form.skills.filter((s) => s.selected).map((s) => s.id);

  const lead_from = form.leadFrom
    .filter((l) => l.selected)
    .map((l) => l.id)
    .join(", ");

  return {
    origin_opportunity: form.opportunityId || null,
    full_name: form.name,
    email: form.email,
    phone: form.phone,
    postal_code: form.postcode ? Number(form.postcode) : null,
    preferred_berlin_locations,
    schedule,
    native_languages,
    fluent_languages,
    intermediate_languages,
    activities,
    skills,
    good_conduct_certificate: form.certOfGoodConduct ? "Yes" : "No",
    if_measles_vaccination: form.certMeaslesVaccination,
    lead_from,
    comments: form.comments ?? null,
    language: form.language ?? null,
  };
}

export interface OpportunityDTO {
  title: string;
  opportunity_type?: OpportunityType;
  rac_email: string | null;
  rac_full_name: string | null;
  rac_phone: string | null;
  rac_address: string | null;
  rac_plz: string | null;
  accomp_address: string | null;
  accomp_postcode: string | null;
  accomp_datetime: string | null;
  accomp_name: string | null;
  accomp_phone: string | null;
  accomp_information: string | null;
  accomp_translation: TranslatedIntoType | null;
  volunteers_number: number | null;
  berlin_locations: OptionId[];
  languages: OptionId[];
  activities: OptionId[];
  skills: OptionId[];
  vo_information: string | null;
  timeslots: (string | number)[][];
  onetime_date_time?: string;
  language: Lang | null;
}

export function parseFormStateDTOOpportunity(form: OpportunityData): OpportunityDTO {
  const TRANSLATION_TYPE_MAP = {
    englishOk: "englishOk",
    needTranslation: "englishOk",
    noTranslation: "noTranslation",
    deutsche: "deutsche",
  };

  const isAccompanying = form.opportunityType === "accompanying";

  const berlin_locations = form.locations.filter((l) => l.selected).map((l) => l.id);

  const timeslots = (form.schedule ?? []).flatMap(({ weekday, timeSlots }) =>
    timeSlots
      .filter((ts) => ts.selected)
      .map((ts) => {
        const slotId = weekday === 0 ? ts.id.charAt(0).toUpperCase() + ts.id.slice(1) : ts.id;
        return [weekday, slotId];
      }),
  );

  const languages = form.languages.filter((l) => l.selected).map((l) => l.id);

  const activities = [...(form.activities ?? []), ...(form.activitiesAccompanying ?? [])]
    .filter((a) => a.selected)
    .map((a) => a.id);

  const skills = form.skills.filter((s) => s.selected).map((s) => s.id);

  const accomp_address = isAccompanying ? form.aaAddress || null : null;
  const accomp_postcode = isAccompanying ? form.aaPostcode || null : null;
  const accomp_datetime = isAccompanying ? (form.dateTime || null) : null;
  const accomp_name = isAccompanying ? form.refugeeName || null : null;
  const accomp_phone = isAccompanying ? form.refugeeNumber || null : null;
  const accomp_information = isAccompanying ? form.aaInformation || null : null;
  const accomp_translation = isAccompanying
    ? form.translatedInto
      ? ((TRANSLATION_TYPE_MAP[form.translatedInto as `${TranslatedIntoType}`] ?? null) as TranslatedIntoType)
      : null
    : null;

  return {
    title: form.title,
    opportunity_type: form.opportunityType,
    vo_information: form.voInformation || null,

    accomp_address,
    accomp_postcode,
    accomp_datetime,
    accomp_name,
    accomp_phone,
    accomp_information,
    accomp_translation,

    rac_email: form.email || null,
    rac_full_name: form.fullName || null,
    rac_phone: form.racPhone || null,
    rac_address: form.racAddress || null,
    rac_plz: form.racPostcode || null,

    volunteers_number: form.numberVolunteers ? Number(form.numberVolunteers) : null,

    berlin_locations,
    languages,
    activities,
    skills,
    timeslots,
    onetime_date_time: form.onetimeDateTime,

    language: form.language ?? null,
  };
}

export function isValidPLZ(code: string, scope: TypePLZ = TypePLZ.BERLIN) {
  const codeNum = Number(code);

  if (Number.isNaN(codeNum)) return false;

  if (scope === TypePLZ.GERMANY) {
    return codeNum >= minPLZGermany && codeNum <= maxPLZGermany;
  }
  if (scope === TypePLZ.BERLIN) {
    return codeNum >= minPLZBerlin && codeNum <= maxPLZBerlin;
  }
  return false;
}

export function getTickMark(isTicked: boolean) {
  return isTicked ? "☑" : "◻️";
}

export function getDate(datetime: string) {
  return new Date(datetime);
}

export function getScheduleState(): Availability {
  const createTimeSlots = (): AvailabilitySlot[] =>
    Object.values(SdkTimeSlot).map((timeSlot) => ({
      id: timeSlot,
      title: { en: timeSlot, de: timeSlot },
      selected: false,
    }));
  const schedule: Availability = [];

  for (const weekday of range(1, 8)) {
    schedule.push({ weekday, timeSlots: createTimeSlots() });
  }

  schedule.push({
    weekday: 0,
    timeSlots: [
      {
        id: OccasionalType.WEEKDAYS,
        title: { en: "weekdays", de: "wochentage" },
        selected: false,
      },
      {
        id: OccasionalType.WEEKENDS,
        title: { en: "weekends", de: "wocheenden" },
        selected: false,
      },
    ],
  });

  return schedule;
}

export function getAllSelectedFalse(list: Option[]): Selected[] {
  return list.map(({ id, title }) => ({
    id,
    title,
    selected: false,
  }));
}

export function getTimeslotTitle(t: TFunction<"translation", undefined>, title: string) {
  if (title === "weekdays" || title === "wochentage") {
    return t(`form.schedule.weekdays`);
  } else if (title === "weekends" || title === "wocheenden") {
    return t(`form.schedule.weekends`);
  }
  return title;
}

export function isTimeSlotSelected(state: Availability) {
  return state
    .map(({ timeSlots }) => timeSlots)
    .flat()
    .some(({ selected }) => selected);
}

export function isSelected<T extends { selected: boolean }>(items: T[], errorMsg: string) {
  return items.some(({ selected }) => selected) ? undefined : errorMsg;
}
