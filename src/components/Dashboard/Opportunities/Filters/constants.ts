import {
  ByDay,
  EntityTableName,
  OccasionalType,
  OpportunityStatusType,
  OpportunityType,
  QueryParamsKeys,
  TimeSlot,
} from "need4deed-sdk";
import { OpportunityCardsFilter } from "./types";

export const defaultOpportunityCardsFilter: OpportunityCardsFilter = {
  [QueryParamsKeys.SEARCH]: "",
  [QueryParamsKeys.DISTRICT]: {},
  [QueryParamsKeys.LANGUAGE]: {},
  status: {
    [OpportunityStatusType.NEW]: false,
    [OpportunityStatusType.SEARCHING]: false,
    [OpportunityStatusType.ACTIVE]: false,
    [OpportunityStatusType.PAST]: false,
  },
  type: {
    [OpportunityType.ACCOMPANYING]: false,
    [OpportunityType.EVENTS]: false,
    [OpportunityType.REGULAR]: false,
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

export const SEPARATOR = "~";
export type AvailabilityKeys = keyof OpportunityCardsFilter["availability"];
export type AvailabilitySubKeys = TimeSlot | ByDay | OccasionalType;
