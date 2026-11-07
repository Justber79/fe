import { useEffect } from "react";
import { DashboardListLoading } from "@/components/Dashboard/common/DashboardListLoading";
import { apiPathOpportunity, AUTH_HINT_COOKIE_NAME, cacheTTL, CARD_LIMIT, TABLE_LIMIT } from "@/config/constants";
import { useGetQuery, usePageParam } from "@/hooks";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getCookie } from "@/utils/helpers";
import { ApiVolunteerOpportunityGetList, ApiOptionLists, QueryParamsKeys, SortOrder, UserRole } from "need4deed-sdk";
import { OpportunityCardsFilter } from "./Filters/types";
import { AppointmentSort, isAppointmentSort, serializeOpportunityFilters } from "./helpers";
import { OpportunityCardList } from "./OpportunityCardList";
import { ViewMode } from "../common/types";
import { OpportunityTableList } from "./OpportunityTableList";
import { DEFAULT_OPPORTUNITY_STATUSES, STATUS_PARAM, VOLUNTEER_OPPORTUNITY_STATUSES } from "./Filters/constants";
import { createOpportunityFilterSections } from "./Filters/helpers";
import { getSectionItems } from "../common/CardsFilter/selectionFilters";
import { useTranslation } from "react-i18next";
import { LoadingMapView } from "../common/MapView/LoadingMapView";
import { createSingleVolunteerMarker } from "../common/MapView/helpers";
import { SingleFilter } from "../common/MapView/types";
import { OpportunityMapView } from "./OpportunityMapView";
import { hasUnsupportedDistrictMapFilter } from "../common/MapView/helpers";

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
  volunteerFilter: SingleFilter | undefined;
};

export function OpportunityListController(props: Props) {
  return <OpportunityListControllerContent key={props.viewMode} {...props} />;
}

function OpportunityListControllerContent({
  setNumOfOpps,
  sortOrder,
  filter,
  setFilter,
  apiFilterOptions,
  volunteerId,
  viewMode,
  volunteerFilter,
}: Props) {
  const { currentPage, setCurrentPage } = usePageParam();
  const { t, i18n } = useTranslation();
  const user = useCurrentUser(true);
  const isVolunteer = user?.role === UserRole.VOLUNTEER;
  // Statuses depend on the role, so don't fetch until /me has resolved.
  const isRoleKnown = Boolean(user) || getCookie(AUTH_HINT_COOKIE_NAME) !== "true";
  const isListView = viewMode === ViewMode.LIST;
  const isMapView = viewMode === ViewMode.MAP;
  const hasUnsupportedMapFilters =
    isMapView && (Boolean(filter.search) || hasUnsupportedDistrictMapFilter(filter.district));
  const limit = isListView ? TABLE_LIMIT : isMapView ? 1 : CARD_LIMIT;

  const serializedFilter = serializeOpportunityFilters(filter, undefined, false, {
    serializeToIDs: true,
    apiFilterOptions,
    commuteSourceId: volunteerId,
  });

  if (volunteerId) {
    serializedFilter.set("volunteer", volunteerId);
  }

  if (isVolunteer) {
    serializedFilter.delete(STATUS_PARAM);
    VOLUNTEER_OPPORTUNITY_STATUSES.forEach((status) => serializedFilter.append(STATUS_PARAM, status));
  } else if (!serializedFilter.has(STATUS_PARAM)) {
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
    enabled: isRoleKnown && (!isMapView || hasUnsupportedMapFilters),
    keepPreviousData: isMapView,
  });

  const rawOpportunities: ApiVolunteerOpportunityGetList[] = data || [];
  const filterSections = createOpportunityFilterSections(filter, setFilter, t);
  const dropdownFilters = {
    districtFilters: getSectionItems(filterSections, QueryParamsKeys.DISTRICT),
    languageFilters: getSectionItems(filterSections, QueryParamsKeys.LANGUAGE),
  };
  const opportunities = isAppointmentSort(sortOrder)
    ? sortByAppointmentDate(rawOpportunities, sortOrder)
    : rawOpportunities;

  const volunteerMarker = createSingleVolunteerMarker(volunteerFilter, t, i18n.language);

  useEffect(() => {
    if (!isMapView || hasUnsupportedMapFilters) setNumOfOpps(count);
  }, [count, hasUnsupportedMapFilters, isMapView, setNumOfOpps]);

  const isPending = isLoading || !isRoleKnown;
  if (isPending && isMapView) return <LoadingMapView />;
  if (isPending && !isListView) return <DashboardListLoading />;

  if (isListView) {
    return (
      <OpportunityTableList
        isLoading={isPending}
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
    return (
      <OpportunityMapView filter={serializedFilter} onCountChange={setNumOfOpps} volunteerMarker={volunteerMarker} />
    );
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
