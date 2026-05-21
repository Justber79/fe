import {
  AgentVolunteerSearchType,
  ApiAgentGetList,
  AgentServiceType,
  ApiOptionLists,
  AgentTrustType,
  ApiAgentGet,
  OptionById,
  QueryParamsKeys,
  AgentType,
} from "need4deed-sdk";

import { ReadonlyURLSearchParams } from "next/navigation";
import { AgentCardsFilter } from "./Filters/types";

type AgentListItem = ApiAgentGetList & Partial<ApiAgentGet>;

export function getNormalizedAgent(agent: AgentListItem): Omit<
  AgentListItem,
  "district" | "volunteerSearch" | "type" | "trustLevel" | "serviceType"
> & {
  district: OptionById | undefined;
  volunteerSearch: AgentVolunteerSearchType;
  type: AgentType;
  trustLevel: AgentTrustType;
  serviceType: AgentServiceType[] | undefined;
} {
  return {
    ...agent,
    type: agent.type,
    district: agent.district,
    volunteerSearch: agent.volunteerSearch ?? AgentVolunteerSearchType.NOT_NEEDED,
    trustLevel: agent.trustLevel ? agent.trustLevel : AgentTrustType.UNKNOWN,
    serviceType: agent.serviceType,
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

  params.delete(QueryParamsKeys.DISTRICT);
  Object.entries(filter.district).forEach(([key, value]) => {
    if (value === true) {
      const paramValue =
        (options?.serializeToIDs && options.apiFilterOptions?.district?.find((d) => d.title === key)?.id) || key;
      params.append(QueryParamsKeys.DISTRICT, String(paramValue));
    }
  });

  params.delete("type");
  Object.entries(filter.type).forEach(([key, value]) => {
    if (value === true) {
      params.append("type", key);
    }
  });

  params.delete("volunteerSearch");
  Object.entries(filter.volunteerSearch).forEach(([key, value]) => {
    if (value === true) {
      params.append("volunteerSearch", key);
    }
  });

  params.delete("engagementStatus");
  Object.entries(filter.engagementStatus).forEach(([key, value]) => {
    if (value === true) {
      params.append("engagementStatus", key);
    }
  });

  params.delete("services");
  Object.entries(filter.services).forEach(([key, value]) => {
    if (value === true) {
      params.append("services", key);
    }
  });

  return asString ? params.toString() : params;
}

export function deserializeAgentFilters(
  filter: AgentCardsFilter,
  searchParams: ReadonlyURLSearchParams,
): AgentCardsFilter {
  const newFilter: AgentCardsFilter = structuredClone(filter);

  const search = searchParams.get(QueryParamsKeys.SEARCH);
  if (search !== null) newFilter.search = search;

  const queryDistricts = searchParams.getAll(QueryParamsKeys.DISTRICT);
  queryDistricts.forEach((d) => {
    if (newFilter.district[d] !== undefined) newFilter.district[d] = true;
  });

  const queryType = searchParams.getAll("type");
  queryType.forEach((s) => {
    if (newFilter.type[s] !== undefined) newFilter.type[s] = true;
  });

  const queryVolunteerSearch = searchParams.getAll("volunteerSearch");
  queryVolunteerSearch.forEach((s) => {
    if (newFilter.volunteerSearch[s] !== undefined) newFilter.volunteerSearch[s] = true;
  });

  const queryEngagementStatus = searchParams.getAll("engagementStatus");
  queryEngagementStatus.forEach((s) => {
    if (newFilter.engagementStatus[s] !== undefined) newFilter.engagementStatus[s] = true;
  });

  const queryServices = searchParams.getAll("services");
  queryServices.forEach((s) => {
    if (newFilter.services[s] !== undefined) newFilter.services[s] = true;
  });

  return newFilter;
}

export function getOptionTitles(items: OptionById[] | undefined): string[] {
  if (!items) return [];
  return items.map((item) => (typeof item.title === "string" ? item.title : "")).filter(Boolean);
}
