import {
  AgentVolunteerSearchType,
  ApiAgentGetList,
  ApiOptionLists,
  AgentTrustType,
  ApiAgentGet,
  OptionById,
  QueryParamsKeys,
  AgentType,
  Service,
} from "need4deed-sdk";

import { ReadonlyURLSearchParams } from "next/navigation";
import { AgentCardsFilter } from "./Filters/types";
import { deserializeSelectionFilters, serializeSelectionFilters } from "../common/CardsFilter/selectionFilters";
import { agentFilterConfigs } from "./Filters/config";

type AgentListItem = ApiAgentGetList & Partial<ApiAgentGet>;

export function getNormalizedAgent(agent: AgentListItem): Omit<
  AgentListItem,
  "district" | "volunteerSearch" | "type" | "trustLevel" | "services"
> & {
  district: OptionById | undefined;
  volunteerSearch: AgentVolunteerSearchType;
  type: AgentType;
  trustLevel: AgentTrustType;
  services: Service[] | undefined;
} {
  return {
    ...agent,
    type: agent.type,
    district: agent.district ?? undefined,
    volunteerSearch: agent.volunteerSearch ?? AgentVolunteerSearchType.NOT_NEEDED,
    trustLevel: agent.trustLevel ? agent.trustLevel : AgentTrustType.UNKNOWN,
    services: agent.services ?? undefined,
  };
}

interface SerializeFiltersOptions {
  serializeToIDs?: boolean;
  apiFilterOptions?: ApiOptionLists;
}

export function serializeAgentFilters(
  filter: AgentCardsFilter,
  searchParams?: ReadonlyURLSearchParams,
  asString = true,
  options?: SerializeFiltersOptions,
) {
  const params = new URLSearchParams(searchParams);
  params.delete("page");

  if (filter.search) params.set(QueryParamsKeys.SEARCH, filter.search);
  else params.delete(QueryParamsKeys.SEARCH);

  serializeSelectionFilters(agentFilterConfigs, filter, params, options);

  return asString ? params.toString() : params;
}

export function deserializeAgentFilters(
  filter: AgentCardsFilter,
  searchParams: ReadonlyURLSearchParams,
): AgentCardsFilter {
  const newFilter: AgentCardsFilter = structuredClone(filter);

  const search = searchParams.get(QueryParamsKeys.SEARCH);
  if (search !== null) newFilter.search = search;

  deserializeSelectionFilters(agentFilterConfigs, newFilter, searchParams);

  return newFilter;
}

export function getOptionTitles(items: OptionById[] | undefined): string[] {
  if (!items) return [];
  return items.map((item) => (typeof item.title === "string" ? item.title : "")).filter(Boolean);
}
