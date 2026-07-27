import {
  dateFromDateTimeUTCStrings,
  dateFromLocalDateAndTimeString,
  formatToLocalTime,
  formatToUtcTime,
} from "@/utils";
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

// Matches the legacy form's rule: an accompanying appointment must be at
// least 8 calendar days out (day+1 through day+7 are disallowed).
export const getMinAppointmentDate = (): Date => {
  const date = new Date();
  date.setDate(date.getDate() + 8);
  date.setHours(0, 0, 0, 0);
  return date;
};

// Form state stores local time (already converted from UTC on init), so display as-is.
export const formatTimeForDisplay = (time: string | undefined): string => time ?? "";

export const getInitialFormValues = (
  details: ApiOpportunityAccompanyingDetails | undefined,
): AccompanyingDetailsFormData => {
  const ext = details as ExtendedAccompanyingDetails | undefined;

  let appointmentDateTime: Date | null = null;
  if (details?.appointmentDate && details?.appointmentTime) {
    appointmentDateTime = dateFromDateTimeUTCStrings(details.appointmentDate, details.appointmentTime);
  }

  return {
    appointmentAddress: details?.appointmentAddress || "",
    appointmentPostcode: ext?.appointmentPostcode || "",
    appointmentDate: appointmentDateTime,
    appointmentTime: appointmentDateTime ? formatToLocalTime(appointmentDateTime!) : "",
    refugeeNumber: details?.refugeeNumber || "",
    refugeeName: details?.refugeeName || "",
    refugeeLanguage: ext?.refugeeLanguage?.map((lang: { id: number | string }) => String(lang.id)) ?? [],
    appointmentLanguage:
      (ext?.appointmentLanguage as import("need4deed-sdk").TranslatedIntoType | undefined) ?? undefined,
  };
};

export const buildAccompanyingPayload = (values: AccompanyingDetailsFormData) => {
  let appointmentDateTime: Date | null = null;

  if (values.appointmentDate && values.appointmentTime) {
    appointmentDateTime = dateFromLocalDateAndTimeString(values.appointmentDate, values.appointmentTime);
  }

  return {
    appointmentAddress: values.appointmentAddress,
    appointmentPostcode: values.appointmentPostcode || undefined,
    appointmentDate: appointmentDateTime ? appointmentDateTime.toISOString() : undefined,
    appointmentTime: appointmentDateTime ? formatToUtcTime(appointmentDateTime) : undefined,
    refugeeNumber: values.refugeeNumber,
    refugeeName: values.refugeeName,
    refugeeLanguage: (values.refugeeLanguage ?? []).map((id) => ({ id })),
    appointmentLanguage: values.appointmentLanguage || undefined,
  };
};
