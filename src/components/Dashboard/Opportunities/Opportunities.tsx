"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { DashboardLayout } from "@/components/Layout";
import { apiPathOption, questionMark } from "@/config/constants";
import { useGetVolunteer, useGetQuery } from "@/hooks";
import { ApiOptionLists, EntityTableName, SortOrder } from "need4deed-sdk";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Filters from "../common/CardsFilter/Filters";
import CardsHeader from "../common/CardsHeader/CardsHeader";
import { createFilterFromOption, getClearFilter } from "../common/CardsFilter/helpers";
import { defaultOpportunityCardsFilter } from "./Filters/constants";
import FiltersContent from "./Filters/FiltersContent";
import { OpportunityCardsFilter } from "./Filters/types";
import { createSelectedOpportunityFiltersAsFlatArray } from "./Filters/helpers";
import { deserializeOpportunityFilters, serializeOpportunityFilters } from "./helpers";
import { OpportunityListController } from "./OpportunityListController";
import { ContentRow, OpportunitiesContainer } from "./styles";

export function Opportunities() {
  const { t } = useTranslation();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [numOfOpps, setNumOfOpps] = useState(0);
  const [sortOrder, setSortOrder] = useState<string>(SortOrder.NewToOld);
  const [cardsFilter, setCardsFilter] = useState(defaultOpportunityCardsFilter);
  const { data: apiFilterOptions } = useGetQuery<ApiOptionLists>({ queryKey: ["options"], apiPath: apiPathOption });
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const tabs = [
    t("dashboard.opportunities.tabs.tab1"),
    t("dashboard.opportunities.tabs.tab2"),
    t("dashboard.opportunities.tabs.tab3"),
  ];

  const volunteerId = searchParams.get("volunteer") ?? undefined;
  const volunteerFilter = useGetVolunteer(volunteerId);

  const handleSearchInputChange = (searchInput: string) => {
    handleFilterUpdate((prev) => ({ ...prev, search: searchInput }));
  };

  const handleSortChange = (order: string) => {
    setSortOrder(order);
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

  const handleClearAllFilters = () => {
    const cleared = getClearFilter(cardsFilter) as unknown as OpportunityCardsFilter;
    setCardsFilter(cleared);
    router.push(pathname + questionMark + serializeOpportunityFilters(cleared, searchParams));
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
          setSelectedTabIndex={setSelectedTabIndex}
          setIsFiltersOpen={setIsFiltersOpen}
          onSearchInputChange={handleSearchInputChange}
          searchValue={cardsFilter.search}
          searchPlaceholder={t("dashboard.opportunities.card.search")}
          sortOrder={sortOrder}
          onSortOrderChange={handleSortChange}
          extraSortOptions={extraSortOptions}
          activeFilters={activeFilters}
          onClearAllFilters={handleClearAllFilters}
          entityFilter={volunteerFilter ? { ...volunteerFilter, onRemove: handleRemoveVolunteerFilter } : undefined}
        />

        <ContentRow>
          <OpportunityListController
            setNumOfOpps={setNumOfOpps}
            sortOrder={sortOrder}
            isFiltersOpen={isFiltersOpen}
            filter={cardsFilter}
            apiFilterOptions={apiFilterOptions}
            volunteerId={volunteerId}
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
