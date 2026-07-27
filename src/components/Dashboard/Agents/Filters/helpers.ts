import { TFunction } from "i18next";
import { generateNestedFilterControlItems } from "../../common/CardsFilter/helpers";
import { SetFilter } from "../../common/CardsFilter/types";
import { QueryParamsKeys } from "need4deed-sdk";
import { AgentCardsFilter } from "./types";

export const createAgentFilterItems = (
  filter: AgentCardsFilter,
  setFilter: SetFilter<AgentCardsFilter>,
  t: TFunction,
) => {
  const districtFilters = generateNestedFilterControlItems(
    filter[QueryParamsKeys.DISTRICT],
    setFilter,
    QueryParamsKeys.DISTRICT,
    (key) => key,
  );

  // `key` is already the translated title from GET /option (see
  // Agents.tsx's createFilterFromOption), not an enum value — no i18n
  // lookup needed. "Tandem" happens to be both an agent type and a
  // service, so disambiguate the type one with a "Type" prefix.
  const typeFilters = generateNestedFilterControlItems(filter.type, setFilter, "type", (key, parent) => {
    if (key.toLowerCase() === "tandem" && parent === "type") {
      return `${t("dashboard.agents.table.type")} ${key}`;
    }

    return key;
  });

  const volunteerSearchFilters = generateNestedFilterControlItems(
    filter.volunteerSearch,
    setFilter,
    "volunteerSearch",
    (key) => t(`dashboard.agents.filters.volunteerSearch.${key}`),
  );

  const engagementStatusFilters = generateNestedFilterControlItems(
    filter.engagementStatus,
    setFilter,
    "engagementStatus",
    (key) => t(`dashboard.agents.filters.engagementStatus.${key}`),
  );

  // Same as `type` above: `key` is already the translated title.
  const servicesFilters = generateNestedFilterControlItems(filter.services, setFilter, "services", (key) => key);

  return {
    districtFilters,
    typeFilters,
    volunteerSearchFilters,
    engagementStatusFilters,
    servicesFilters,
  };
};

export const createSelectedAgentFiltersAsFlatArray = (
  filter: AgentCardsFilter,
  setFilter: SetFilter<AgentCardsFilter>,
  t: TFunction,
) => {
  const { districtFilters, typeFilters, volunteerSearchFilters, engagementStatusFilters, servicesFilters } =
    createAgentFilterItems(filter, setFilter, t);
  return [
    ...districtFilters,
    ...typeFilters,
    ...volunteerSearchFilters,
    ...engagementStatusFilters,
    ...servicesFilters,
  ].filter((f) => f.checked);
};
