import { ByDay, OccasionalType, QueryParamsKeys, TimeSlot, VolunteerStateEngagementType, VolunteerStateTypeType } from "need4deed-sdk";
import { CardsFilter } from "./types";

export const defaultVolunteerCardsFilter: CardsFilter = {
  [QueryParamsKeys.SEARCH]: "",
  [QueryParamsKeys.ACCOMPANYING]: false,
  type: {
    [VolunteerStateTypeType.ACCOMPANYING]: false,
    [VolunteerStateTypeType.REGULAR]: false,
    [VolunteerStateTypeType.EVENTS]: false,
    [VolunteerStateTypeType.REGULAR_ACCOMPANYING]: false,
  },
  [QueryParamsKeys.DISTRICT]: {},
  [QueryParamsKeys.LANGUAGE]: {},
  [QueryParamsKeys.ENGAGEMENT]: {
    [VolunteerStateEngagementType.NEW]: false,
    [VolunteerStateEngagementType.ACTIVE]: false,
    [VolunteerStateEngagementType.AVAILABLE]: false,
    [VolunteerStateEngagementType.TEMP_UNAVAILABLE]: false,
    [VolunteerStateEngagementType.INACTIVE]: false,
    [VolunteerStateEngagementType.UNRESPONSIVE]: false,
  },
  [QueryParamsKeys.AVAILABILITY]: {
    times: {
      [TimeSlot.morning]: false,
      [TimeSlot.noon]: false,
      [TimeSlot.afternoon]: false,
      [TimeSlot.evening]: false,
    },
    days: {
      [ByDay.MO]: false,
      [ByDay.TU]: false,
      [ByDay.WE]: false,
      [ByDay.TH]: false,
      [ByDay.FR]: false,
      [ByDay.SA]: false,
      [ByDay.SU]: false,
    },
    occasional: {
      [OccasionalType.WEEKDAYS]: false,
      [OccasionalType.WEEKENDS]: false,
    },
  },
};

export const SEPARATOR = "~";
export type AvailabilityKeys = keyof CardsFilter["availability"];
export type AvailabilitySubKeys = TimeSlot | ByDay | OccasionalType;
