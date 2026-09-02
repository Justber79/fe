import { EntityTableName, QueryParamsKeys } from "need4deed-sdk";
import { ScheduleFilter, SelectionMap } from "../../common/CardsFilter/types";

export interface OpportunityCardsFilter {
  [QueryParamsKeys.SEARCH]: string;
  [QueryParamsKeys.DISTRICT]: SelectionMap;
  [QueryParamsKeys.LANGUAGE]: SelectionMap;
  status: SelectionMap;
  type: SelectionMap;
  [EntityTableName.ACTIVITY]: SelectionMap;
  [EntityTableName.SKILL]: SelectionMap;
  [QueryParamsKeys.AVAILABILITY]: ScheduleFilter;
}

export type OpportunityCardFilterKeys = keyof OpportunityCardsFilter;
