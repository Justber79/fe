import { EntityTableName, QueryParamsKeys } from "need4deed-sdk";
import { ScheduleFilter, SelectionMap } from "../../common/CardsFilter/types";

export type Availability = ScheduleFilter;

export interface VolunteerCardsFilter {
  [QueryParamsKeys.SEARCH]: string;
  [QueryParamsKeys.ENGAGEMENT]: SelectionMap;
  [EntityTableName.ACTIVITY]: SelectionMap;
  [QueryParamsKeys.AVAILABILITY]: Availability;
  [QueryParamsKeys.DISTRICT]: SelectionMap;
  [QueryParamsKeys.LANGUAGE]: SelectionMap;
  type: SelectionMap;
}

export type VolunteerCardFilterKeys = keyof VolunteerCardsFilter;
