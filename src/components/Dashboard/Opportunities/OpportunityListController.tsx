import { useEffect } from "react";
import { DashboardListLoading } from "@/components/Dashboard/common/DashboardListLoading";
import { apiPathOpportunity, cacheTTL, CARD_COLUMNS, CARD_LIMIT, CARD_ROWS, TABLE_LIMIT } from "@/config/constants";
import { useGetQuery, usePageParam } from "@/hooks";
import { ApiVolunteerOpportunityGetList, ApiOptionLists, SortOrder } from "need4deed-sdk";
import { OpportunityCardsFilter } from "./Filters/types";
import { serializeOpportunityFilters } from "./helpers";
import { OpportunityCardList } from "./OpportunityCardList";
import { ViewMode } from "../common/types";
import { OpportunityTableList } from "./OpportunityTableList";

const APPOINTMENT_SORT_VALUES = ["appointment-proximal", "appointment-distant"] as const;
type AppointmentSort = (typeof APPOINTMENT_SORT_VALUES)[number];

function isAppointmentSort(sort: string): sort is AppointmentSort {
  return (APPOINTMENT_SORT_VALUES as readonly string[]).includes(sort);
}

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
  isFiltersOpen: boolean;
  filter: OpportunityCardsFilter;
  apiFilterOptions?: ApiOptionLists;
  volunteerId?: string;
  viewMode: ViewMode;
};

export function OpportunityListController({
  setNumOfOpps,
  sortOrder,
  isFiltersOpen,
  filter,
  apiFilterOptions,
  volunteerId,
  viewMode,
}: Props) {
  const { currentPage, setCurrentPage } = usePageParam();
  const isListView = viewMode === ViewMode.LIST;
  const limit = isListView ? TABLE_LIMIT : CARD_LIMIT;

  const serializedFilter = serializeOpportunityFilters(filter, undefined, false, {
    serializeToIDs: true,
    apiFilterOptions,
  }) as URLSearchParams;

  if (volunteerId) {
    serializedFilter.set("volunteer", volunteerId);
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
  const opportunities = isAppointmentSort(sortOrder)
    ? sortByAppointmentDate(rawOpportunities, sortOrder)
    : rawOpportunities;

  useEffect(() => {
    setNumOfOpps(count);
  }, [count, setNumOfOpps]);

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
      />
    );
  }

  return (
    <OpportunityCardList
      activitiesList={apiFilterOptions?.activity ?? undefined}
      districtsList={apiFilterOptions?.district ?? undefined}
      opportunities={opportunities}
      count={count}
      columns={CARD_COLUMNS - (isFiltersOpen ? 1 : 0)}
      rows={CARD_ROWS + (isFiltersOpen ? 1 : 0)}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      volunteerId={volunteerId}
    />
  );
}
