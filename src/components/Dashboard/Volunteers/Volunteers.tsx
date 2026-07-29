"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { DashboardLayout } from "@/components/Layout";
import { apiPathOption, questionMark } from "@/config/constants";
import { useGetOpportunity, useGetQuery } from "@/hooks";
import { ApiOptionLists, EntityTableName, QueryParamsKeys, SortOrder, UserRole } from "need4deed-sdk";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Filters from "../common/CardsFilter/Filters";
import CardsHeader from "../common/CardsHeader/CardsHeader";
import { getClearFilter, getClearSingleFilter } from "../common/CardsFilter/helpers";
import { defaultVolunteerCardsFilter } from "./Filters/constants";
import FiltersContent from "./Filters/FiltersContent";
import { VolunteerCardsFilter } from "./Filters/types";
import {
  createFilterFromOption,
  createSelectedFilterItemsAsFlatArray,
  deserializeVolunteerFilters,
  serializeFilters,
} from "./helpers";
import { VolunteerListController } from "./VolunteerListController";
import { ViewMode } from "../common/types";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export function Volunteers() {
  const user = useCurrentUser(true);
  const isAgent = user?.role === UserRole.AGENT;
  const { t } = useTranslation();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [numOfVols, setNumOfVols] = useState(0);
  const [sortOrder, setSortOrder] = useState(SortOrder.NewToOld);
  const [cardsFilter, setCardsFilter] = useState(defaultVolunteerCardsFilter);
  const { data: apiFilterOptions } = useGetQuery<ApiOptionLists>({ queryKey: ["options"], apiPath: apiPathOption });
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const tabs = !user || isAgent ? [] : [t("dashboard.volunteers.tabs.tab1"), t("dashboard.volunteers.tabs.tab2")];
  const viewMode = isAgent ? ViewMode.CARDS : Object.values(ViewMode)[selectedTabIndex];
  const opportunityId = searchParams.get("opportunity") ?? undefined;
  const opportunityFilter = useGetOpportunity(opportunityId);

  const handleSearchInputChange = (searchInput: string) => {
    handleFilterUpdate((prev) => ({ ...prev, [QueryParamsKeys.SEARCH]: searchInput }));
  };

  const handleSortChange = (sortOrder: string) => {
    setSortOrder(sortOrder as SortOrder);
  };

  const handleFilterUpdate = (
    newFilter: VolunteerCardsFilter | ((prev: VolunteerCardsFilter) => VolunteerCardsFilter),
  ) => {
    const updatedFilter = typeof newFilter === "function" ? newFilter(cardsFilter) : newFilter;

    setCardsFilter(updatedFilter);
    router.push(pathname + questionMark + serializeFilters(updatedFilter, searchParams));
  };

  const handleRemoveOpportunityFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("opportunity");
    router.push(pathname + questionMark + params.toString());
  };

  const handleClearFilter = (filterKey: string, parentKey?: string) => {
    const cleared = getClearSingleFilter(cardsFilter, filterKey, parentKey);
    setCardsFilter(cleared);
    router.push(pathname + questionMark + serializeFilters(cleared, searchParams));
  };

  const handleClearAllFilters = () => {
    const cleared = getClearFilter(cardsFilter);
    setCardsFilter(cleared);
    router.push(pathname + questionMark + serializeFilters(cleared, searchParams));
  };

  useEffect(() => {
    if (!apiFilterOptions) return;

    setCardsFilter((prev) => {
      const baseFilters = {
        ...prev,
        district: createFilterFromOption(apiFilterOptions, EntityTableName.DISTRICT),
        language: createFilterFromOption(apiFilterOptions, EntityTableName.LANGUAGE),
        activity: createFilterFromOption(apiFilterOptions, EntityTableName.ACTIVITY),
      };

      return deserializeVolunteerFilters(baseFilters, searchParams);
    });
  }, [apiFilterOptions, searchParams]);

  const activeFilters = createSelectedFilterItemsAsFlatArray(cardsFilter, setCardsFilter, t);

  return (
    <DashboardLayout>
      <VolunteersContainer>
        <CardsHeader
          header={t("dashboard.volunteers.volunteers")}
          resultCounter={numOfVols}
          resultText={t("dashboard.home.sidebar.volunteers")}
          tabs={tabs}
          selectedTabIndex={selectedTabIndex}
          setSelectedTabIndex={setSelectedTabIndex}
          setIsFiltersOpen={setIsFiltersOpen}
          onSearchInputChange={handleSearchInputChange}
          searchValue={cardsFilter.search}
          sortOrder={sortOrder}
          onSortOrderChange={handleSortChange}
          activeFilters={activeFilters}
          onClearAllFilters={handleClearAllFilters}
          onClearFilter={handleClearFilter}
          entityFilter={
            opportunityFilter ? { ...opportunityFilter, onRemove: handleRemoveOpportunityFilter } : undefined
          }
        />
        <ContentRow>
          <VolunteerListController
            setNumOfVols={setNumOfVols}
            sortOrder={sortOrder}
            filter={cardsFilter}
            apiFilterOptions={apiFilterOptions}
            opportunityId={opportunityId}
            viewMode={viewMode}
          />
          <Filters
            isFiltersOpen={isFiltersOpen}
            setIsFiltersOpen={setIsFiltersOpen}
            filtersContent={<FiltersContent setFilter={handleFilterUpdate} filter={cardsFilter} />}
          />
        </ContentRow>
      </VolunteersContainer>
    </DashboardLayout>
  );
}

export default Volunteers;

/** Styles */

const VolunteersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--dashboard-volunteers-container-gap);
`;

const ContentRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: var(--dashboard-volunteers-container-gap);

  @media (max-width: 1023px) {
    flex-wrap: wrap;
  }
`;
