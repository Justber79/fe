import {
  ByDay,
  EntityTableName,
  OccasionalType,
  QueryParamsKeys,
  TimeSlot,
  VolunteerStateEngagementType,
  VolunteerStateMatchType,
  VolunteerStateTypeType,
} from "need4deed-sdk";
import { VolunteerCardsFilter, VolunteerStatusMatch } from "./types";

export const defaultVolunteerCardsFilter: VolunteerCardsFilter = {
  [QueryParamsKeys.SEARCH]: "",
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
  [VolunteerStatusMatch.MATCH]: {
    [VolunteerStateMatchType.MATCHED]: false,
    [VolunteerStateMatchType.NEEDS_REMATCH]: false,
    [VolunteerStateMatchType.NO_MATCHES]: false,
    [VolunteerStateMatchType.PAST]: false,
    [VolunteerStateMatchType.PENDING_MATCH]: false,
  },
  [EntityTableName.ACTIVITY]: {},
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

// Every engagement except inactive. Derived so new SDK values are visible by default
export const DEFAULT_VOLUNTEER_ENGAGEMENTS = Object.values(VolunteerStateEngagementType).filter(
  (engagement) => engagement !== VolunteerStateEngagementType.INACTIVE,
);

export const SEPARATOR = "~";
export type AvailabilityKeys = keyof VolunteerCardsFilter["availability"];
export type AvailabilitySubKeys = TimeSlot | ByDay | OccasionalType;
