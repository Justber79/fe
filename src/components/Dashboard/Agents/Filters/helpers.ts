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

  const typeFilters = generateNestedFilterControlItems(filter.type, setFilter, "type", (key, parent) => {
    const fallbackPath = `dashboard.agents.filters.type.${key.toLocaleLowerCase()}`;

    if (key === "tandem" && parent === "type") {
      return `${t("dashboard.agents.table.type")} ${t(fallbackPath)}`;
    }

    return t(fallbackPath);
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

  const servicesFilters = generateNestedFilterControlItems(filter.services, setFilter, "services", (key) =>
    t(`dashboard.agents.filters.services.${key}`),
  );

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
