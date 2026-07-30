"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/components/Layout";
import { apiPathOption, questionMark } from "@/config/constants";
import { useGetVolunteer, useGetQuery } from "@/hooks";
import { ApiOptionLists, EntityTableName, UserRole } from "need4deed-sdk";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Filters from "../common/CardsFilter/Filters";
import CardsHeader from "../common/CardsHeader/CardsHeader";
import { createFilterFromOption, getClearFilter, getClearSingleFilter } from "../common/CardsFilter/helpers";
import { defaultOpportunityCardsFilter } from "./Filters/constants";
import FiltersContent from "./Filters/FiltersContent";
import { OpportunityCardsFilter } from "./Filters/types";
import { createSelectedOpportunityFiltersAsFlatArray } from "./Filters/helpers";
import {
  deserializeOpportunityFilters,
  serializeOpportunityFilters,
  parseSortParam,
  SORT_PARAM,
  DEFAULT_SORT_ORDER,
} from "./helpers";
import { OpportunityListController } from "./OpportunityListController";
import { ContentRow, OpportunitiesContainer } from "./styles";
import { ViewMode } from "../common/types";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export function Opportunities() {
  const user = useCurrentUser(true);
  const isAgent = user?.role === UserRole.AGENT;
  const { t } = useTranslation();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [numOfOpps, setNumOfOpps] = useState(0);
  const [cardsFilter, setCardsFilter] = useState(defaultOpportunityCardsFilter);
  const { data: apiFilterOptions } = useGetQuery<ApiOptionLists>({ queryKey: ["options"], apiPath: apiPathOption });
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const sortOrder = parseSortParam(searchParams.get(SORT_PARAM));
  const tabs = !user
    ? []
    : isAgent
      ? [t("dashboard.opportunities.tabs.tab2"), t("dashboard.opportunities.tabs.tab3")]
      : [
          t("dashboard.opportunities.tabs.tab1"),
          t("dashboard.opportunities.tabs.tab2"),
          t("dashboard.opportunities.tabs.tab3"),
        ];

  const urlViewParam = searchParams.get("view");
  const VIEW_MODE_BY_TAB = isAgent ? [ViewMode.CARDS, ViewMode.MAP] : [ViewMode.LIST, ViewMode.CARDS, ViewMode.MAP];
  const foundIndex = VIEW_MODE_BY_TAB.findIndex((mode) => mode === urlViewParam);
  const selectedTabIndex = foundIndex === -1 ? 0 : foundIndex;
  const viewMode = VIEW_MODE_BY_TAB[selectedTabIndex];

  const volunteerId = searchParams.get("volunteer") ?? undefined;
  const volunteerFilter = useGetVolunteer(volunteerId);

  const handleSearchInputChange = (searchInput: string) => {
    handleFilterUpdate((prev) => ({ ...prev, search: searchInput }));
  };

  const handleSortChange = (order: string) => {
    const sort = parseSortParam(order);
    const params = new URLSearchParams(searchParams);
    params.delete("page");
    if (sort === DEFAULT_SORT_ORDER) params.delete(SORT_PARAM);
    else params.set(SORT_PARAM, sort);
    router.push(pathname + questionMark + params.toString());
  };

  const handleTabChange = (index: number) => {
    const targetViewMode = VIEW_MODE_BY_TAB[index] ?? ViewMode.LIST;

    const params = new URLSearchParams(searchParams.toString());
    params.set("view", targetViewMode);

    router.push(pathname + questionMark + params.toString());
  };

  const extraSortOptions = [
    { value: "appointment-proximal", label: t("dashboard.sortBy.appointmentProximal") },
    { value: "appointment-distant", label: t("dashboard.sortBy.appointmentDistant") },
  ];

  const handleFilterUpdate = (
    newFilter: OpportunityCardsFilter | ((prev: OpportunityCardsFilter) => OpportunityCardsFilter),
  ) => {
    const updatedFilter = typeof newFilter === "function" ? newFilter(cardsFilter) : newFilter;
    setCardsFilter(updatedFilter);
    router.push(pathname + questionMark + serializeOpportunityFilters(updatedFilter, searchParams));
  };

  const handleRemoveVolunteerFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("volunteer");
    router.push(pathname + questionMark + params.toString());
  };

  const handleClearFilter = (filterKey: string, parentKey?: string) => {
    const cleared = getClearSingleFilter(cardsFilter, filterKey, parentKey);
    setCardsFilter(cleared);
    router.push(pathname + questionMark + serializeOpportunityFilters(cleared, searchParams));
  };

  const handleClearAllFilters = () => {
    const cleared = getClearFilter(cardsFilter);
    setCardsFilter(cleared);
    const params = serializeOpportunityFilters(cleared, searchParams, false);
    params.delete(SORT_PARAM);
    router.push(pathname + questionMark + params.toString());
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

      return deserializeOpportunityFilters(baseFilters, searchParams);
    });
  }, [apiFilterOptions, searchParams]);

  const activeFilters = createSelectedOpportunityFiltersAsFlatArray(cardsFilter, setCardsFilter, t);

  return (
    <DashboardLayout>
      <OpportunitiesContainer data-testid="opportunities-container">
        <CardsHeader
          header={t("dashboard.opportunities.opportunities")}
          resultCounter={numOfOpps}
          resultText={t("dashboard.home.sidebar.opportunities")}
          tabs={tabs}
          selectedTabIndex={selectedTabIndex}
          setSelectedTabIndex={handleTabChange}
          setIsFiltersOpen={setIsFiltersOpen}
          onSearchInputChange={handleSearchInputChange}
          searchValue={cardsFilter.search}
          searchPlaceholder={t("dashboard.opportunities.card.search")}
          sortOrder={sortOrder}
          onSortOrderChange={handleSortChange}
          extraSortOptions={extraSortOptions}
          activeFilters={activeFilters}
          onClearAllFilters={handleClearAllFilters}
          onClearFilter={handleClearFilter}
          entityFilter={volunteerFilter ? { ...volunteerFilter, onRemove: handleRemoveVolunteerFilter } : undefined}
        />

        <ContentRow>
          <OpportunityListController
            setNumOfOpps={setNumOfOpps}
            sortOrder={sortOrder}
            filter={cardsFilter}
            apiFilterOptions={apiFilterOptions}
            volunteerId={volunteerId}
            viewMode={viewMode}
          />
          <Filters
            isFiltersOpen={isFiltersOpen}
            setIsFiltersOpen={setIsFiltersOpen}
            filtersContent={<FiltersContent setFilter={handleFilterUpdate} filter={cardsFilter} />}
          />
        </ContentRow>
      </OpportunitiesContainer>
    </DashboardLayout>
  );
}
