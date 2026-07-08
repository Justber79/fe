import { EntityTableName, QueryParamsKeys } from "need4deed-sdk";
import { ScheduleFilter, SelectionMap } from "../../common/CardsFilter/types";

export type Availability = ScheduleFilter;

export enum VolunteerStatusMatch {
  MATCH = "match",
}

export interface VolunteerCardsFilter {
  [QueryParamsKeys.SEARCH]: string;
  [QueryParamsKeys.ENGAGEMENT]: SelectionMap;
  [VolunteerStatusMatch.MATCH]: SelectionMap;
  [EntityTableName.ACTIVITY]: SelectionMap;
  [QueryParamsKeys.AVAILABILITY]: Availability;
  [QueryParamsKeys.DISTRICT]: SelectionMap;
  [QueryParamsKeys.LANGUAGE]: SelectionMap;
  type: SelectionMap;
}

export type VolunteerCardFilterKeys = keyof VolunteerCardsFilter;
