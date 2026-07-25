"use client";

import { DashboardLayout } from "@/components/Layout";
import { AgentListController } from "./AgentListController";
import { PendingMemberships } from "./PendingMemberships";
import { AgentsContainer, ContentRow } from "./styles";
import CardsHeader from "../common/CardsHeader/CardsHeader";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ApiOptionLists, EntityTableName, SortOrder, UserRole } from "need4deed-sdk";
import { useGetQuery } from "@/hooks";
import { apiPathOption, questionMark } from "@/config/constants";
import { AgentCardsFilter } from "./Filters/types";
import { createSelectedAgentFiltersAsFlatArray } from "./Filters/helpers";
import { defaultAgentCardsFilter } from "./Filters/constants";
import { createFilterFromOption, getClearFilter, getClearSingleFilter } from "../common/CardsFilter/helpers";
import { deserializeAgentFilters, serializeAgentFilters } from "./helpers";
import Filters from "../common/CardsFilter/Filters";
import FiltersContent from "./Filters/FiltersContent";
import { ViewMode } from "../common/types";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export const Agents = () => {
  const user = useCurrentUser(true);
  const isAgent = user?.role === UserRole.AGENT;
  const { t } = useTranslation();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState(SortOrder.NewToOld);
  const [numOfAgents, setNumOfAgents] = useState(0);
  const [cardsFilter, setCardsFilter] = useState(defaultAgentCardsFilter);
  const { data: apiFilterOptions } = useGetQuery<ApiOptionLists>({ queryKey: ["options"], apiPath: apiPathOption });
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const tabs = !user
    ? []
    : isAgent
      ? [t("dashboard.agents.tabs.tab2"), t("dashboard.agents.tabs.tab3")]
      : [t("dashboard.agents.tabs.tab1"), t("dashboard.agents.tabs.tab2"), t("dashboard.agents.tabs.tab3")];

  const VIEW_MODE_BY_TAB = isAgent ? [ViewMode.CARDS, ViewMode.MAP] : [ViewMode.LIST, ViewMode.CARDS, ViewMode.MAP];
  const viewMode = VIEW_MODE_BY_TAB[selectedTabIndex] ?? ViewMode.CARDS;

  const handleSearchInputChange = (searchInput: string) => {
    handleFilterUpdate((prev) => ({ ...prev, search: searchInput }));
  };

  const handleSortChange = (order: string) => {
    setSortOrder(order as SortOrder);
  };

  const handleFilterUpdate = (newFilter: AgentCardsFilter | ((prev: AgentCardsFilter) => AgentCardsFilter)) => {
    const updatedFilter = typeof newFilter === "function" ? newFilter(cardsFilter) : newFilter;
    setCardsFilter(updatedFilter);
    router.push(pathname + questionMark + serializeAgentFilters(updatedFilter, searchParams));
  };

  const handleClearFilter = (filterKey: string, parentKey?: string) => {
    const cleared = getClearSingleFilter(cardsFilter, filterKey, parentKey);
    setCardsFilter(cleared);
    router.push(pathname + questionMark + serializeAgentFilters(cleared, searchParams));
  };

  const handleClearAllFilters = () => {
    const cleared = getClearFilter<AgentCardsFilter>(cardsFilter);
    setCardsFilter(cleared);
    router.push(pathname + questionMark + serializeAgentFilters(cleared, searchParams));
  };

  useEffect(() => {
    if (!apiFilterOptions) return;

    setCardsFilter((prev) => {
      const baseFilters = {
        ...prev,
        district: createFilterFromOption(apiFilterOptions, EntityTableName.DISTRICT),
        type: createFilterFromOption(apiFilterOptions, EntityTableName.AGENT_TYPE),
        services: createFilterFromOption(apiFilterOptions, EntityTableName.SERVICE),
      };

      return deserializeAgentFilters(baseFilters, searchParams);
    });
  }, [apiFilterOptions, searchParams]);

  const activeFilters = createSelectedAgentFiltersAsFlatArray(cardsFilter, setCardsFilter, t);
  return (
    <DashboardLayout>
      <AgentsContainer data-testid="agents-container">
        <CardsHeader
          header={t("dashboard.agents.agents")}
          resultCounter={numOfAgents}
          resultText={t("dashboard.home.sidebar.racs")}
          tabs={tabs}
          selectedTabIndex={selectedTabIndex}
          setSelectedTabIndex={setSelectedTabIndex}
          setIsFiltersOpen={setIsFiltersOpen}
          onSearchInputChange={handleSearchInputChange}
          searchValue={cardsFilter.search}
          searchPlaceholder={t("dashboard.agents.card.search")}
          sortOrder={sortOrder}
          onSortOrderChange={handleSortChange}
          activeFilters={activeFilters}
          onClearAllFilters={handleClearAllFilters}
          onClearFilter={handleClearFilter}
        />
        <PendingMemberships />
        <ContentRow>
          <AgentListController
            setNumOfAgents={setNumOfAgents}
            sortOrder={sortOrder}
            isFiltersOpen={isFiltersOpen}
            filter={cardsFilter}
            apiFilterOptions={apiFilterOptions}
            viewMode={viewMode}
          />
          <Filters
            isFiltersOpen={isFiltersOpen}
            setIsFiltersOpen={setIsFiltersOpen}
            filtersContent={<FiltersContent setFilter={handleFilterUpdate} filter={cardsFilter} />}
          />
        </ContentRow>
      </AgentsContainer>
    </DashboardLayout>
  );
};
