import { useEffect, useMemo } from "react";

import { DashboardListLoading } from "@/components/Dashboard/common/DashboardListLoading";
import { apiPathVolunteer, cacheTTL, CARD_LIMIT, MAP_LIMIT, TABLE_LIMIT } from "@/config/constants";
import { useGetQuery, usePageParam } from "@/hooks";
import { ApiOptionLists, ApiVolunteerGetList, QueryParamsKeys, SortOrder, UserRole } from "need4deed-sdk";
import { VolunteerCardsFilter } from "./Filters/types";
import { getCheckedOptionIds, serializeFilters } from "./helpers";
import { VolunteerCardList } from "./VolunteerCardList";
import { VolunteerTableList } from "./VolunteerTableList";
import { ViewMode } from "../common/types";
import { useCopyEmails } from "@/hooks/useCopyEmails";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { DEFAULT_VOLUNTEER_ENGAGEMENTS } from "./Filters/constants";
import { createVolunteerFilterSections } from "./Filters/helpers";
import { getSectionItems } from "../common/CardsFilter/selectionFilters";
import { useTranslation } from "react-i18next";
import { LoadingVolunteerTableList } from "./LoadingVolunteerTableList";
import { LoadingMapView } from "../common/MapView/LoadingMapView";
import { VolunteerMapView } from "./VolunteerMapView";
import { createSingleOpportunityMarker, createVolunteerMarkers } from "../common/MapView/helpers";
import { SingleFilter } from "../common/MapView/types";

interface VolunteerListControllerProps {
  setNumOfVols: (numOfVols: number) => void;
  sortOrder: SortOrder;
  filter: VolunteerCardsFilter;
  setFilter: (newFilter: VolunteerCardsFilter | ((prev: VolunteerCardsFilter) => VolunteerCardsFilter)) => void;
  apiFilterOptions?: ApiOptionLists;
  opportunityId?: string;
  viewMode: ViewMode;
  opportunityFilter: SingleFilter | undefined;
}

export function VolunteerListController({
  setNumOfVols,
  sortOrder,
  filter,
  setFilter,
  apiFilterOptions,
  opportunityId,
  viewMode,
  opportunityFilter,
}: VolunteerListControllerProps) {
  const isListView = viewMode === ViewMode.LIST;
  const isMapView = viewMode === ViewMode.MAP;
  const limit = isListView ? TABLE_LIMIT : isMapView ? MAP_LIMIT : CARD_LIMIT;
  const { currentPage, setCurrentPage } = usePageParam();
  const { t, i18n } = useTranslation();
  const serializedFilter = serializeFilters(filter, undefined, false, {
    serializeToIDs: true,
    apiFilterOptions,
  }) as URLSearchParams;
  const filterSections = createVolunteerFilterSections(filter, setFilter, t);
  const dropdownFilters = {
    typeFilters: getSectionItems(filterSections, "type"),
    languageFilters: getSectionItems(filterSections, QueryParamsKeys.LANGUAGE),
    districtFilters: getSectionItems(filterSections, QueryParamsKeys.DISTRICT),
    engagementFilters: getSectionItems(filterSections, QueryParamsKeys.ENGAGEMENT),
  };

  const selectedDistrictIds = getCheckedOptionIds(dropdownFilters.districtFilters, apiFilterOptions?.district);

  if (opportunityId) {
    serializedFilter.set("opportunity", opportunityId);
  }

  const emailsFilter = new URLSearchParams(serializedFilter);

  if (!serializedFilter.has(QueryParamsKeys.ENGAGEMENT)) {
    DEFAULT_VOLUNTEER_ENGAGEMENTS.forEach((defaultEngagement) =>
      serializedFilter.append(QueryParamsKeys.ENGAGEMENT, defaultEngagement.replace(/^vol-/, "")),
    );
  }

  const params = {
    limit,
    page: currentPage,
    sortOrder,
    listType: isListView ? "table" : "card",
    filter: serializedFilter,
  };
  const { data, count, isLoading } = useGetQuery<ApiVolunteerGetList[]>({
    queryKey: ["volunteers"],
    apiPath: apiPathVolunteer,
    params,
    staleTime: cacheTTL,
  });
  const volunteers = data || [];
  const { handleCopyEmails, isCopying } = useCopyEmails(apiPathVolunteer, "volunteer-emails", emailsFilter);
  const user = useCurrentUser();
  const canSeeContactColumns = user?.role === UserRole.COORDINATOR || user?.role === UserRole.ADMIN;

  const markers = useMemo(
    () => createVolunteerMarkers(volunteers, t, i18n.language, opportunityId),
    [volunteers, t, i18n.language, opportunityId],
  );
  const opportunityMarker = createSingleOpportunityMarker(opportunityFilter, t, i18n.language);

  const markerCount = useMemo(() => {
    return markers?.flatMap((marker) => marker.children ?? []).length ?? 0;
  }, [markers]);

  const activeCount = isMapView ? markerCount : (count ?? 0);

  useEffect(() => {
    setNumOfVols(activeCount);
  }, [activeCount, setNumOfVols]);

  if (isLoading && isListView)
    return <LoadingVolunteerTableList canSeeContactColumns={canSeeContactColumns} dropdownFilters={dropdownFilters} />;
  if (isLoading && isMapView) return <LoadingMapView />;
  if (isLoading) return <DashboardListLoading />;

  if (isListView) {
    return (
      <VolunteerTableList
        volunteers={volunteers}
        count={count}
        itemsPerPage={limit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        opportunityId={opportunityId}
        onCopyEmails={handleCopyEmails}
        isCopying={isCopying}
        canSeeContactColumns={canSeeContactColumns}
        selectedDistrictIds={selectedDistrictIds}
        dropdownFilters={dropdownFilters}
      />
    );
  }

  if (isMapView) {
    return (
      <VolunteerMapView
        markers={markers}
        itemsPerPage={limit}
        count={count}
        opportunityMarker={opportunityMarker}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    );
  }

  return (
    <VolunteerCardList
      volunteers={volunteers}
      count={count}
      itemsPerPage={limit}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      opportunityId={opportunityId}
      selectedDistrictIds={selectedDistrictIds}
    />
  );
}
