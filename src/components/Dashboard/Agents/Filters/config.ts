import { EntityTableName, QueryParamsKeys } from "need4deed-sdk";
import { SelectionFilterConfigs } from "../../common/CardsFilter/selectionFilters";
import { ViewMode } from "../../common/types";
import { AgentCardsFilter } from "./types";

// `type` and `services` values are already translated titles from GET /option.
export const agentFilterConfigs: SelectionFilterConfigs<AgentCardsFilter> = {
  type: {
    header: "dashboard.agents.filters.type.header",
    option: EntityTableName.AGENT_TYPE,
    // "Tandem" is both an agent type and a service, so prefix the type one.
    label: (value, t) => (value.toLowerCase() === "tandem" ? `${t("dashboard.agents.table.type")} ${value}` : value),
  },
  volunteerSearch: {
    header: "dashboard.agents.filters.volunteerSearch.header",
    label: (value, t) => t(`dashboard.agents.filters.volunteerSearch.${value}`),
    isVisible: ({ isAuthorized }) => isAuthorized,
  },
  [QueryParamsKeys.DISTRICT]: {
    header: "dashboard.agents.filters.district.header",
    option: EntityTableName.DISTRICT,
    isVisible: ({ viewMode }) => viewMode === ViewMode.CARDS,
  },
  engagementStatus: {
    header: "dashboard.agents.filters.engagementStatus.header",
    label: (value, t) => t(`dashboard.agents.filters.engagementStatus.${value}`),
  },
  services: {
    header: "dashboard.agents.filters.services.header",
    option: EntityTableName.SERVICE,
  },
};
