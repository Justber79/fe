import { useEffect } from "react";

import { DashboardListLoading } from "@/components/Dashboard/common/DashboardListLoading";
import { apiPathVolunteer, cacheTTL, CARD_COLUMNS, CARD_LIMIT, CARD_ROWS, TABLE_LIMIT } from "@/config/constants";
import { useGetQuery, usePageParam } from "@/hooks";
import { ApiOptionLists, ApiVolunteerGetList, SortOrder, UserRole } from "need4deed-sdk";
import { VolunteerCardsFilter } from "./Filters/types";
import { serializeFilters } from "./helpers";
import { VolunteerCardList } from "./VolunteerCardList";
import { VolunteerTableList } from "./VolunteerTableList";
import { ViewMode } from "../common/types";
import { useCopyEmails } from "@/hooks/useCopyEmails";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface VolunteerListControllerProps {
  setNumOfVols: (numOfVols: number) => void;
  sortOrder: SortOrder;
  isFiltersOpen: boolean;
  filter: VolunteerCardsFilter;
  apiFilterOptions?: ApiOptionLists;
  opportunityId?: string;
  viewMode: ViewMode;
}

export function VolunteerListController({
  setNumOfVols,
  sortOrder,
  isFiltersOpen,
  filter,
  apiFilterOptions,
  opportunityId,
  viewMode,
}: VolunteerListControllerProps) {
  const isListView = viewMode === ViewMode.LIST;
  const limit = isListView ? TABLE_LIMIT : CARD_LIMIT;
  const { currentPage, setCurrentPage } = usePageParam();
  const serializedFilter = serializeFilters(filter, undefined, false, {
    serializeToIDs: true,
    apiFilterOptions,
  }) as URLSearchParams;

  if (opportunityId) {
    serializedFilter.set("opportunity", opportunityId);
  }
  const params = {
    limit,
    page: currentPage,
    sortOrder,
    // Table renders only languages + locations; card renders all collections.
    // Tell the backend so it loads (and returns) only the needed relations.
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
  const { handleCopyEmails, isCopying } = useCopyEmails(apiPathVolunteer, "volunteer-emails", serializedFilter);
  const user = useCurrentUser();
  const canSeeContactColumns = user?.role === UserRole.COORDINATOR || user?.role === UserRole.ADMIN;

  useEffect(() => {
    setNumOfVols(count);
  }, [count, setNumOfVols]);

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
      />
    );
  }

  return (
    <VolunteerCardList
      volunteers={volunteers}
      count={count}
      columns={CARD_COLUMNS - (isFiltersOpen ? 1 : 0)}
      rows={CARD_ROWS + (isFiltersOpen ? 1 : 0)}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      opportunityId={opportunityId}
    />
  );
}
