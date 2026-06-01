import { QueryParamsKeys } from "need4deed-sdk";
import { ScheduleFilter, SelectionMap } from "../../common/CardsFilter/types";

export type Availability = ScheduleFilter;

export interface CardsFilter {
  [QueryParamsKeys.SEARCH]: string;
  [QueryParamsKeys.ACCOMPANYING]: boolean;
  [QueryParamsKeys.ENGAGEMENT]: SelectionMap;
  [QueryParamsKeys.AVAILABILITY]: Availability;
  [QueryParamsKeys.DISTRICT]: SelectionMap;
  [QueryParamsKeys.LANGUAGE]: SelectionMap;
  type: SelectionMap;
}

export type CardFilterKeys = keyof CardsFilter;
