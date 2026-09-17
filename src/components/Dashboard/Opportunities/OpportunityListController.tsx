import { useEffect } from "react";
import { DashboardListLoading } from "@/components/Dashboard/common/DashboardListLoading";
import { apiPathOpportunity, cacheTTL, CARD_LIMIT, TABLE_LIMIT } from "@/config/constants";
import { useGetQuery, usePageParam } from "@/hooks";
import { ApiVolunteerOpportunityGetList, ApiOptionLists, SortOrder } from "need4deed-sdk";
import { OpportunityCardsFilter } from "./Filters/types";
import { AppointmentSort, isAppointmentSort, serializeOpportunityFilters } from "./helpers";
import { OpportunityCardList } from "./OpportunityCardList";
import { ViewMode } from "../common/types";
import { OpportunityTableList } from "./OpportunityTableList";
import { DEFAULT_OPPORTUNITY_STATUSES, STATUS_PARAM } from "./Filters/constants";
import { createOpportunityFilterItems } from "./Filters/helpers";
import { useTranslation } from "react-i18next";
import { LoadingOpportunityTableList } from "./LoadingOpportunityTableList";
import { LoadingMapView } from "../common/MapView/LoadingMapView";
import { createOpportunityMarkers } from "../common/MapView/helpers";
import { OpportunityMapView } from "./OpportunityMapView";

type OpportunityWithAccompanying = ApiVolunteerOpportunityGetList & {
  accompanyingDetails?: { appointmentDate?: string };
};

function sortByAppointmentDate(
  opportunities: ApiVolunteerOpportunityGetList[],
  sort: AppointmentSort,
): ApiVolunteerOpportunityGetList[] {
  return [...opportunities].sort((a, b) => {
    const dateA = (a as OpportunityWithAccompanying).accompanyingDetails?.appointmentDate;
    const dateB = (b as OpportunityWithAccompanying).accompanyingDetails?.appointmentDate;

    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;

    const diff = new Date(dateA).getTime() - new Date(dateB).getTime();
    return sort === "appointment-proximal" ? diff : -diff;
  });
}

type Props = {
  setNumOfOpps: (num: number) => void;
  sortOrder: string;
  filter: OpportunityCardsFilter;
  setFilter: (newFilter: OpportunityCardsFilter | ((prev: OpportunityCardsFilter) => OpportunityCardsFilter)) => void;
  apiFilterOptions?: ApiOptionLists;
  volunteerId?: string;
  viewMode: ViewMode;
};

export function OpportunityListController({
  setNumOfOpps,
  sortOrder,
  filter,
  setFilter,
  apiFilterOptions,
  volunteerId,
  viewMode,
}: Props) {
  const { currentPage, setCurrentPage } = usePageParam();
  const { t } = useTranslation();
  const isListView = viewMode === ViewMode.LIST;
  const isMapView = viewMode === ViewMode.MAP;
  const limit = isListView ? TABLE_LIMIT : CARD_LIMIT;

  const serializedFilter = serializeOpportunityFilters(filter, undefined, false, {
    serializeToIDs: true,
    apiFilterOptions,
  });

  if (volunteerId) {
    serializedFilter.set("volunteer", volunteerId);
  }

  if (!serializedFilter.has(STATUS_PARAM)) {
    DEFAULT_OPPORTUNITY_STATUSES.forEach((defaultStatus) => serializedFilter.append(STATUS_PARAM, defaultStatus));
  }

  const backendSortOrder = isAppointmentSort(sortOrder) ? SortOrder.NewToOld : (sortOrder as SortOrder);

  const { data, count, isLoading } = useGetQuery<ApiVolunteerOpportunityGetList[]>({
    queryKey: ["opportunities"],
    apiPath: `${apiPathOpportunity}/`,
    params: {
      limit,
      page: currentPage,
      sortOrder: backendSortOrder,
      filter: serializedFilter,
    },
    staleTime: cacheTTL,
  });

  const rawOpportunities: ApiVolunteerOpportunityGetList[] = data || [];
  const { districtFilters, languageFilters } = createOpportunityFilterItems(filter, setFilter, t);
  const dropdownFilters = { districtFilters, languageFilters };
  const opportunities = isAppointmentSort(sortOrder)
    ? sortByAppointmentDate(rawOpportunities, sortOrder)
    : rawOpportunities;

  useEffect(() => {
    setNumOfOpps(count);
  }, [count, setNumOfOpps, viewMode]);

  const markers = createOpportunityMarkers(opportunities);

  if (isLoading && isListView) return <LoadingOpportunityTableList dropdownFilters={dropdownFilters} />;
  if (isLoading && isMapView) return <LoadingMapView showSideBar={true} />;
  if (isLoading) return <DashboardListLoading />;

  if (isListView) {
    return (
      <OpportunityTableList
        opportunities={opportunities}
        count={count}
        itemsPerPage={limit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        districtsList={apiFilterOptions?.district ?? undefined}
        volunteerId={volunteerId}
        dropdownFilters={dropdownFilters}
      />
    );
  }

  if (isMapView) {
    return <OpportunityMapView count={count} setNumOfOpps={setNumOfOpps} markers={markers} />;
  }

  return (
    <OpportunityCardList
      activitiesList={apiFilterOptions?.activity ?? undefined}
      districtsList={apiFilterOptions?.district ?? undefined}
      opportunities={opportunities}
      count={count}
      itemsPerPage={limit}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      volunteerId={volunteerId}
    />
  );
}
