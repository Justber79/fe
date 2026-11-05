"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { DashboardLayout } from "@/components/Layout";
import {
  apiPathOption,
  DEFAULT_MAX_COMMUTE_MINUTES,
  questionMark,
  ScreenTypes,
  USER_QUERY_KEY,
} from "@/config/constants";
import { useGetOpportunity, useGetQuery } from "@/hooks";
import {
  ApiOptionLists,
  LangPurpose,
  ProfileVolunteeringType,
  QueryParamsKeys,
  SortOrder,
  UserRole,
  VolunteerStateEngagementType,
} from "need4deed-sdk";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Filters from "../common/CardsFilter/Filters";
import CardsHeader from "../common/CardsHeader/CardsHeader";
import { getClearFilter, getClearSingleFilter } from "../common/CardsFilter/helpers";
import {
  applyMatchingPrefill,
  clearCommutePrefill,
  hasFilterParams,
  PREFILLED_PARAM,
  withPrefilledMarker,
} from "../common/CardsFilter/matchingPrefill";
import { withOptionFilters } from "../common/CardsFilter/selectionFilters";
import { volunteerFilterConfigs } from "./Filters/config";
import {
  DEFAULT_NGO_VOLUNTEER_ENGAGEMENTS,
  DEFAULT_VOLUNTEER_ENGAGEMENTS,
  defaultVolunteerCardsFilter,
} from "./Filters/constants";
import FiltersContent from "./Filters/FiltersContent";
import { VolunteerCardsFilter } from "./Filters/types";
import { createSelectedFilterItemsAsFlatArray, deserializeVolunteerFilters, serializeFilters } from "./helpers";
import { VolunteerListController } from "./VolunteerListController";
import { ViewMode } from "../common/types";
import { useCurrentUserQuery } from "@/hooks/useCurrentUser";
import { useQueryClient } from "@tanstack/react-query";
import { DashboardListLoading } from "../common/DashboardListLoading";
import { ErrorMessage } from "@/components/core/common";
import { Button } from "@/components/core/button";
import { useScreenType } from "@/context/DeviceContext";

export function Volunteers() {
  const { data: user, isLoading: isUserLoading, isError: isUserError } = useCurrentUserQuery(true, false);
  const queryClient = useQueryClient();
  const isAgent = user?.role === UserRole.AGENT;
  const screenType = useScreenType();
  const { t } = useTranslation();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [numOfVols, setNumOfVols] = useState(0);
  const [sortOrder, setSortOrder] = useState(SortOrder.NewToOld);
  const { data: apiFilterOptions } = useGetQuery<ApiOptionLists>({ queryKey: ["options"], apiPath: apiPathOption });
  const searchParams = useSearchParams();
  const isExplicitEngagementClear = searchParams.getAll(QueryParamsKeys.ENGAGEMENT).includes("");
  const defaultEngagements =
    isAgent && !isExplicitEngagementClear ? DEFAULT_NGO_VOLUNTEER_ENGAGEMENTS : DEFAULT_VOLUNTEER_ENGAGEMENTS;
  const cardsFilter = useMemo(() => {
    const baseFilters = apiFilterOptions
      ? withOptionFilters(volunteerFilterConfigs, defaultVolunteerCardsFilter, apiFilterOptions)
      : structuredClone(defaultVolunteerCardsFilter);
    const filter = deserializeVolunteerFilters(baseFilters, searchParams);
    if (isAgent) {
      filter.search = "";
      if (!isExplicitEngagementClear && !Object.values(filter[QueryParamsKeys.ENGAGEMENT]).some(Boolean)) {
        defaultEngagements.forEach((engagement) => {
          filter[QueryParamsKeys.ENGAGEMENT][engagement] = true;
        });
      }
    }
    return filter;
  }, [apiFilterOptions, defaultEngagements, isAgent, isExplicitEngagementClear, searchParams]);
  const pathname = usePathname();
  const router = useRouter();
  const tabs = !user
    ? []
    : [
        t("dashboard.volunteers.tabs.tab1"),
        t("dashboard.volunteers.tabs.tab2"),
        t("dashboard.opportunities.tabs.tab3"),
      ];
  const urlViewParam = searchParams.get("view");
  const VIEW_MODE_BY_TAB = [ViewMode.LIST, ViewMode.CARDS, ViewMode.MAP];
  const isMobileUser = screenType === ScreenTypes.MOBILE && Boolean(user);
  const defaultTabIndex = isMobileUser ? 1 : 0;
  const foundIndex = VIEW_MODE_BY_TAB.findIndex((mode) => mode === urlViewParam);
  const selectedTabIndex = foundIndex === -1 ? defaultTabIndex : foundIndex;
  const viewMode = VIEW_MODE_BY_TAB[selectedTabIndex];
  const opportunityId = searchParams.get("opportunity") ?? undefined;
  const opportunityFilter = useGetOpportunity(opportunityId);
  const prefilledForRef = useRef<string | null>(null);

  const handleSearchInputChange = (searchInput: string) => {
    handleFilterUpdate((prev) => ({ ...prev, [QueryParamsKeys.SEARCH]: searchInput }));
  };

  const handleSortChange = (sortOrder: string) => {
    setSortOrder(sortOrder as SortOrder);
  };

  const handleTabChange = (index: number) => {
    const targetViewMode = VIEW_MODE_BY_TAB[index] ?? ViewMode.LIST;

    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    params.set("view", targetViewMode);

    router.push(pathname + questionMark + params.toString(), { scroll: false });
  };

  const serializeFilterUpdate = (filter: VolunteerCardsFilter) => {
    const params = new URLSearchParams(serializeFilters(filter, searchParams));
    if (isAgent && !Object.values(filter[QueryParamsKeys.ENGAGEMENT]).some(Boolean)) {
      params.set(QueryParamsKeys.ENGAGEMENT, "");
    }
    return params;
  };

  const handleFilterUpdate = (
    newFilter: VolunteerCardsFilter | ((prev: VolunteerCardsFilter) => VolunteerCardsFilter),
  ) => {
    const updatedFilter = typeof newFilter === "function" ? newFilter(cardsFilter) : newFilter;

    router.push(pathname + questionMark + serializeFilterUpdate(updatedFilter), { scroll: false });
  };

  const handleRemoveOpportunityFilter = () => {
    const wasPrefilled = searchParams.has(PREFILLED_PARAM);
    const cleared = wasPrefilled ? getClearFilter(cardsFilter) : clearCommutePrefill(cardsFilter);
    const params = new URLSearchParams(serializeFilters(cleared, searchParams));
    params.delete("opportunity");
    params.delete(PREFILLED_PARAM);
    router.push(pathname + questionMark + params.toString(), { scroll: false });
  };

  const handleClearFilter = (filterKey: string, parentKey?: string) => {
    const cleared =
      filterKey === QueryParamsKeys.COMMUTE_OPPORTUNITY_ID
        ? clearCommutePrefill(cardsFilter)
        : getClearSingleFilter(cardsFilter, filterKey, parentKey);
    router.push(pathname + questionMark + serializeFilterUpdate(cleared), { scroll: false });
  };

  const handleClearAllFilters = () => {
    const cleared = getClearFilter(cardsFilter);
    router.push(pathname + questionMark + serializeFilterUpdate(cleared), { scroll: false });
  };

  useEffect(() => {
    if (!user || !opportunityId || !opportunityFilter || !apiFilterOptions) return;
    if (prefilledForRef.current === opportunityId) return;
    prefilledForRef.current = opportunityId;
    if (hasFilterParams(searchParams, Object.keys(volunteerFilterConfigs))) return;

    const isAccompanying = opportunityFilter.volunteerType === ProfileVolunteeringType.ACCOMPANYING;
    const needsRefugeeLanguage =
      isAccompanying || opportunityFilter.volunteerType === ProfileVolunteeringType.REGULAR_ACCOMPANYING;
    const languages = opportunityFilter.languages.filter(({ purpose = LangPurpose.GENERAL }) =>
      needsRefugeeLanguage
        ? purpose === LangPurpose.RECIPIENT || purpose === LangPurpose.TRANSLATION
        : purpose === LangPurpose.GENERAL,
    );
    const prefilled = applyMatchingPrefill(
      withOptionFilters(volunteerFilterConfigs, defaultVolunteerCardsFilter, apiFilterOptions),
      {
        districtIds: opportunityFilter.districtIds,
        languages,
        availability: isAccompanying ? [] : opportunityFilter.availability,
        appointmentDate: isAccompanying ? opportunityFilter.appointmentDate : null,
        appointmentTime: isAccompanying ? opportunityFilter.appointmentTime : null,
        hasCommuteSource: user.role === UserRole.COORDINATOR || user.role === UserRole.ADMIN,
        maxCommuteMinutes: DEFAULT_MAX_COMMUTE_MINUTES,
      },
      { district: apiFilterOptions.district, language: apiFilterOptions.language },
    );
    prefilled[QueryParamsKeys.ENGAGEMENT][VolunteerStateEngagementType.AVAILABLE] = true;
    router.replace(pathname + questionMark + withPrefilledMarker(serializeFilters(prefilled, searchParams)));
  }, [apiFilterOptions, opportunityFilter, opportunityId, pathname, router, searchParams, user]);

  useEffect(() => {
    if (!isAgent || !searchParams.has(QueryParamsKeys.SEARCH)) return;

    const params = new URLSearchParams(searchParams.toString());
    params.delete(QueryParamsKeys.SEARCH);
    router.replace(pathname + questionMark + params.toString());
  }, [isAgent, pathname, router, searchParams]);

  const activeFilters = createSelectedFilterItemsAsFlatArray(cardsFilter, handleFilterUpdate, t);

  if (isUserLoading) {
    return (
      <DashboardLayout>
        <DashboardListLoading />
      </DashboardLayout>
    );
  }

  if (isUserError || !user) {
    return (
      <DashboardLayout>
        <VolunteersContainer role="alert">
          <ErrorMessage message={t("message.errorGeneric")} />
          <Button
            text={t("dashboard.volunteers.retry")}
            onClick={() => queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY })}
          />
        </VolunteersContainer>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <VolunteersContainer>
        <CardsHeader
          header={t(isAgent ? "dashboard.volunteers.agentHeadline" : "dashboard.volunteers.volunteers")}
          resultCounter={numOfVols}
          resultText={t("dashboard.home.sidebar.volunteers")}
          tabs={tabs}
          selectedTabIndex={selectedTabIndex}
          setSelectedTabIndex={handleTabChange}
          setIsFiltersOpen={setIsFiltersOpen}
          onSearchInputChange={handleSearchInputChange}
          searchValue={cardsFilter.search}
          showSearch={!isAgent}
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
            setFilter={handleFilterUpdate}
            apiFilterOptions={apiFilterOptions}
            opportunityId={opportunityId}
            viewMode={viewMode}
            opportunityFilter={opportunityFilter}
            defaultEngagements={defaultEngagements}
          />
          <Filters
            isFiltersOpen={isFiltersOpen}
            setIsFiltersOpen={setIsFiltersOpen}
            filtersContent={
              <FiltersContent
                setFilter={handleFilterUpdate}
                filter={cardsFilter}
                viewMode={viewMode}
                isMatchMode={!!opportunityId}
              />
            }
          />
        </ContentRow>
      </VolunteersContainer>
    </DashboardLayout>
  );
}

export default Volunteers;

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
