import { TFunction } from "i18next";
import {
  createSelectionFilterSections,
  getSelectedSelectionFilterItems,
} from "../../common/CardsFilter/selectionFilters";
import { SetFilter } from "../../common/CardsFilter/types";
import { agentFilterConfigs } from "./config";
import { AgentCardsFilter } from "./types";

export const createAgentFilterSections = (
  filter: AgentCardsFilter,
  setFilter: SetFilter<AgentCardsFilter>,
  t: TFunction,
) => createSelectionFilterSections(agentFilterConfigs, filter, setFilter, t);

export const createSelectedAgentFiltersAsFlatArray = (
  filter: AgentCardsFilter,
  setFilter: SetFilter<AgentCardsFilter>,
  t: TFunction,
) => getSelectedSelectionFilterItems(createAgentFilterSections(filter, setFilter, t));
