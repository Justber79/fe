import { utcHhmmToLocal } from "@/utils";
import { ApiOpportunityAccompanyingDetails, VolunteerStateTypeType } from "need4deed-sdk";
import { AccompanyingDetailsFormData } from "./createAccompanyingDetailsSchema";

// These fields are not yet in the SDK ApiOpportunityAccompanyingDetails type
type ExtendedAccompanyingDetails = ApiOpportunityAccompanyingDetails & {
  appointmentPostcode?: string;
  refugeeLanguage?: { id: number | string }[];
  appointmentLanguage?: string;
};

export const isAccompanyingType = (volunteerType: VolunteerStateTypeType | undefined): boolean => {
  return (
    volunteerType === VolunteerStateTypeType.ACCOMPANYING ||
    volunteerType === VolunteerStateTypeType.REGULAR_ACCOMPANYING
  );
};

export const getMinAppointmentDate = (): Date => {
  const date = new Date();
  let weekdaysAdded = 0;
  while (weekdaysAdded < 7) {
    date.setDate(date.getDate() + 1);
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      weekdaysAdded++;
    }
  }
  date.setHours(0, 0, 0, 0);
  return date;
};

export const parseDate = (date: Date | string | undefined | null): Date | null => {
  if (!date) return null;
  const parsed = date instanceof Date ? date : new Date(date);
  return isNaN(parsed.getTime()) ? null : parsed;
};

export const parseTime = (time: Date | string | undefined): string => {
  if (!time) return "";
  if (typeof time === "string") return time;
  return time.toTimeString().slice(0, 5);
};

// Form state stores local time (already converted from UTC on init), so display as-is.
export const formatTimeForDisplay = (time: string | undefined): string => time ?? "";

export const getInitialFormValues = (
  details: ApiOpportunityAccompanyingDetails | undefined,
): AccompanyingDetailsFormData => {
  const ext = details as ExtendedAccompanyingDetails | undefined;
  return {
    appointmentAddress: details?.appointmentAddress || "",
    appointmentPostcode: ext?.appointmentPostcode || "",
    appointmentDate: parseDate(details?.appointmentDate),
    appointmentTime: details?.appointmentTime ? utcHhmmToLocal(parseTime(details.appointmentTime)) : "",
    refugeeNumber: details?.refugeeNumber || "",
    refugeeName: details?.refugeeName || "",
    refugeeLanguage: ext?.refugeeLanguage?.map((lang: { id: number | string }) => String(lang.id)) ?? [],
    appointmentLanguage:
      (ext?.appointmentLanguage as import("need4deed-sdk").TranslatedIntoType | undefined) ?? undefined,
  };
};
