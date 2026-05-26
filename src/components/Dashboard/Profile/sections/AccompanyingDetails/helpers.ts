import { utcHhmmToLocal } from "@/utils";
import { ApiOpportunityAccompanyingDetails, VolunteerStateTypeType } from "need4deed-sdk";
import { AccompanyingDetailsFormData } from "./accompanyingDetailsSchema";

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

export const parseDate = (date: Date | string | undefined): Date | null => {
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
): AccompanyingDetailsFormData => ({
  appointmentAddress: details?.appointmentAddress || "",
  appointmentPostcode:
    (details as ApiOpportunityAccompanyingDetails & { appointmentPostcode?: string })?.appointmentPostcode || "",
  appointmentDate: parseDate(details?.appointmentDate),
  appointmentTime: details?.appointmentTime ? utcHhmmToLocal(parseTime(details.appointmentTime)) : "",
  refugeeNumber: details?.refugeeNumber || "",
  refugeeName: details?.refugeeName || "",
  refugeeLanguage: details?.refugeeLanguage?.map((lang) => String(lang.id)) ?? [],
  appointmentLanguage: details?.appointmentLanguage ?? undefined,
});
