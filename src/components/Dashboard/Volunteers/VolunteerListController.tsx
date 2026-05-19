import { useEffect } from "react";

import { DashboardListLoading } from "@/components/Dashboard/common/DashboardListLoading";
import { apiPathVolunteer, cacheTTL } from "@/config/constants";
import { useGetQuery, usePageParam } from "@/hooks";
import { ApiOptionLists, ApiVolunteerGetList, SortOrder } from "need4deed-sdk";
import { CardsFilter } from "./Filters/types";
import { serializeFilters } from "./helpers";
import { VolunteerCardList } from "./VolunteerCardList";

const columns = 3;
const rows = 3;
const limit = columns * rows;

interface VolunteerListControllerProps {
  setNumOfVols: (numOfVols: number) => void;
  sortOrder: SortOrder;
  isFiltersOpen: boolean;
  filter: CardsFilter;
  apiFilterOptions?: ApiOptionLists;
  opportunityId?: string;
}

export function VolunteerListController({
  setNumOfVols,
  sortOrder,
  isFiltersOpen,
  filter,
  apiFilterOptions,
  opportunityId,
}: VolunteerListControllerProps) {
  const { currentPage, setCurrentPage } = usePageParam();
  const serializedFilter = serializeFilters(filter, undefined, false, {
    serializeToIDs: true,
    apiFilterOptions,
  }) as URLSearchParams;

  if (opportunityId) {
    serializedFilter.set("opportunity", opportunityId);
  }
  const params = {
    limit: limit,
    page: currentPage,
    sortOrder,
    filter: serializedFilter,
  };
  const { data, count, isLoading } = useGetQuery<ApiVolunteerGetList[]>({
    queryKey: ["volunteers"],
    apiPath: apiPathVolunteer,
    params,
    staleTime: cacheTTL,
  });
  const volunteers = data || [];

  useEffect(() => {
    setNumOfVols(count);
  }, [count, setNumOfVols]);

  if (isLoading) return <DashboardListLoading />;

  return (
    <VolunteerCardList
      volunteers={volunteers}
      count={count}
      columns={columns - (isFiltersOpen ? 1 : 0)}
      rows={rows + (isFiltersOpen ? 1 : 0)}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      opportunityId={opportunityId}
    />
  );
}
