"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/components/Layout";
import { apiPathOption, questionMark, ScreenTypes } from "@/config/constants";
import { useGetVolunteer, useGetQuery } from "@/hooks";
import { ApiOptionLists, LangProficiency, UserRole } from "need4deed-sdk";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Filters from "../common/CardsFilter/Filters";
import CardsHeader from "../common/CardsHeader/CardsHeader";
import { getClearFilter, getClearSingleFilter } from "../common/CardsFilter/helpers";
import {
  applyMatchingPrefill,
  hasFilterParams,
  PREFILLED_PARAM,
  withPrefilledMarker,
} from "../common/CardsFilter/matchingPrefill";
import { withOptionFilters } from "../common/CardsFilter/selectionFilters";
import { opportunityFilterConfigs } from "./Filters/config";
import { defaultOpportunityCardsFilter, STATUS_PARAM } from "./Filters/constants";
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
import { OtherOpportunities } from "./OtherOpportunities";
import { ContentRow, OpportunitiesContainer } from "./styles";
import { ViewMode } from "../common/types";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useScreenType } from "@/context/DeviceContext";

export function Opportunities() {
  const user = useCurrentUser(true);
  const screenType = useScreenType();
  const { t } = useTranslation();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [numOfOpps, setNumOfOpps] = useState(0);
  const [cardsFilter, setCardsFilter] = useState(defaultOpportunityCardsFilter);
  const { data: apiFilterOptions } = useGetQuery<ApiOptionLists>({ queryKey: ["options"], apiPath: apiPathOption });
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const sortOrder = parseSortParam(searchParams.get(SORT_PARAM));
  const isAgent = user?.role === UserRole.AGENT;
  const tabs = !user
    ? []
    : [
        t("dashboard.opportunities.tabs.tab1"),
        t("dashboard.opportunities.tabs.tab2"),
        t("dashboard.opportunities.tabs.tab3"),
        ...(isAgent ? [t("dashboard.opportunities.other.title")] : []),
      ];

  const urlViewParam = searchParams.get("view");
  const VIEW_MODE_BY_TAB = [ViewMode.LIST, ViewMode.CARDS, ViewMode.MAP];
  const isOtherTab = isAgent && urlViewParam === OTHER_OPPORTUNITIES_VIEW;
  const foundIndex = VIEW_MODE_BY_TAB.findIndex((mode) => mode === urlViewParam);
  const defaultTabIndex = screenType === ScreenTypes.MOBILE ? 1 : 0;
  const selectedTabIndex = isOtherTab ? VIEW_MODE_BY_TAB.length : foundIndex === -1 ? defaultTabIndex : foundIndex;
  const viewMode = VIEW_MODE_BY_TAB[isOtherTab ? defaultTabIndex : selectedTabIndex];

  const volunteerId = searchParams.get("volunteer") ?? undefined;
  const volunteerFilter = useGetVolunteer(volunteerId);
  const prefilledForRef = useRef<string | null>(null);

  useEffect(() => {
    if (!volunteerId || !volunteerFilter || !apiFilterOptions) return;
    if (prefilledForRef.current === volunteerId) return;
    prefilledForRef.current = volunteerId;
    if (hasFilterParams(searchParams, Object.keys(opportunityFilterConfigs))) return;

    const prefilled = applyMatchingPrefill(
      withOptionFilters(opportunityFilterConfigs, defaultOpportunityCardsFilter, apiFilterOptions),
      {
        districtIds: volunteerFilter.districtIds,
        languages: volunteerFilter.languages.filter(({ proficiency }) => proficiency !== LangProficiency.BEGINNER),
        availability: volunteerFilter.availability,
      },
      { district: apiFilterOptions.district, language: apiFilterOptions.language },
    );
    router.replace(pathname + questionMark + withPrefilledMarker(serializeOpportunityFilters(prefilled, searchParams)));
  }, [apiFilterOptions, volunteerFilter, volunteerId, pathname, router, searchParams]);

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
    const targetViewMode =
      index === VIEW_MODE_BY_TAB.length ? OTHER_OPPORTUNITIES_VIEW : (VIEW_MODE_BY_TAB[index] ?? ViewMode.LIST);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
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
    const wasPrefilled = searchParams.has(PREFILLED_PARAM);
    const cleared = wasPrefilled ? getClearFilter(cardsFilter) : cardsFilter;
    if (wasPrefilled) setCardsFilter(cleared);
    const params = new URLSearchParams(serializeOpportunityFilters(cleared, searchParams));
    params.delete("volunteer");
    params.delete(PREFILLED_PARAM);
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
      const baseFilters = withOptionFilters(opportunityFilterConfigs, prev, apiFilterOptions);

      return deserializeOpportunityFilters(baseFilters, searchParams);
    });
  }, [apiFilterOptions, searchParams]);

  const isVolunteer = user?.role === UserRole.VOLUNTEER;
  const activeFilters = createSelectedOpportunityFiltersAsFlatArray(cardsFilter, setCardsFilter, t).filter(
    ({ parentKey }) => !isVolunteer || parentKey !== STATUS_PARAM,
  );

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
          activeFilters={isOtherTab ? [] : activeFilters}
          onClearAllFilters={handleClearAllFilters}
          onClearFilter={handleClearFilter}
          entityFilter={
            volunteerFilter && !isOtherTab ? { ...volunteerFilter, onRemove: handleRemoveVolunteerFilter } : undefined
          }
          showListControls={!isOtherTab}
        />

        {isOtherTab ? (
          <OtherOpportunities search={cardsFilter.search} setCount={setNumOfOpps} />
        ) : (
          <ContentRow>
            <OpportunityListController
              setNumOfOpps={setNumOfOpps}
              sortOrder={sortOrder}
              filter={cardsFilter}
              setFilter={handleFilterUpdate}
              apiFilterOptions={apiFilterOptions}
              volunteerId={volunteerId}
              viewMode={viewMode}
              volunteerFilter={volunteerFilter}
            />
            <Filters
              isFiltersOpen={isFiltersOpen}
              setIsFiltersOpen={setIsFiltersOpen}
              filtersContent={
                <FiltersContent setFilter={handleFilterUpdate} filter={cardsFilter} viewMode={viewMode} />
              }
            />
          </ContentRow>
        )}
      </OpportunitiesContainer>
    </DashboardLayout>
  );
}

const OTHER_OPPORTUNITIES_VIEW = "other";
