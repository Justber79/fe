import { useEffect } from "react";
import { apiPathOpportunity, cacheTTL } from "@/config/constants";
import { useGetQuery, usePageParam } from "@/hooks";
import { ApiVolunteerOpportunityGetList, ApiOptionLists, SortOrder } from "need4deed-sdk";
import { OpportunityCardsFilter } from "./Filters/types";
import { serializeOpportunityFilters } from "./helpers";
import { OpportunityCardList } from "./OpportunityCardList";

const columns = 3;
const rows = 3;
const limit = columns * rows;

const APPOINTMENT_SORT_VALUES = ["appointment-proximal", "appointment-distant"] as const;
type AppointmentSort = (typeof APPOINTMENT_SORT_VALUES)[number];

function isAppointmentSort(sort: string): sort is AppointmentSort {
  return (APPOINTMENT_SORT_VALUES as readonly string[]).includes(sort);
}

function sortByAppointmentDate(
  opportunities: ApiVolunteerOpportunityGetList[],
  sort: AppointmentSort,
): ApiVolunteerOpportunityGetList[] {
  return [...opportunities].sort((a, b) => {
    const dateA = a.accompanyingDetails?.appointmentDate;
    const dateB = b.accompanyingDetails?.appointmentDate;

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
};

export function OpportunityListController({
  setNumOfOpps,
  sortOrder,
  isFiltersOpen,
  filter,
  apiFilterOptions,
  volunteerId,
}: Props) {
  const { currentPage, setCurrentPage } = usePageParam();

  const serializedFilter = serializeOpportunityFilters(filter, undefined, false, {
    serializeToIDs: true,
    apiFilterOptions,
  }) as URLSearchParams;

  if (volunteerId) {
    serializedFilter.set("volunteer", volunteerId);
  }

  const backendSortOrder = isAppointmentSort(sortOrder) ? SortOrder.NewToOld : (sortOrder as SortOrder);

  const { data, count } = useGetQuery<ApiVolunteerOpportunityGetList[]>({
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

  return (
    <OpportunityCardList
      activitiesList={apiFilterOptions?.activity}
      districtsList={apiFilterOptions?.district}
      opportunities={opportunities}
      count={count}
      columns={columns - (isFiltersOpen ? 1 : 0)}
      rows={rows + (isFiltersOpen ? 1 : 0)}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      volunteerId={volunteerId}
    />
  );
}
