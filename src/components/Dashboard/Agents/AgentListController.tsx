import { ApiAgentGetList, ApiOptionLists, SortOrder } from "need4deed-sdk";
import { AgentCardList } from "./AgentCardList";
import { useEffect } from "react";
import { DashboardListLoading } from "@/components/Dashboard/common/DashboardListLoading";
import { useGetQuery, usePageParam } from "@/hooks";
import { apiPathAgent, cacheTTL, TABLE_LIMIT } from "@/config/constants";
import { serializeAgentFilters } from "./helpers";
import { AgentCardsFilter } from "./Filters/types";
import { ViewMode } from "../common/types";

const CARD_COLUMNS = 3;
const CARD_ROWS = 3;
const CARD_LIMIT = CARD_COLUMNS * CARD_ROWS;

type Props = {
  setNumOfAgents: (num: number) => void;
  sortOrder: SortOrder;
  isFiltersOpen: boolean;
  filter: AgentCardsFilter;
  apiFilterOptions?: ApiOptionLists;
  volunteerId?: string;
  viewMode: ViewMode;
};

export const AgentListController = ({
  setNumOfAgents,
  sortOrder,
  isFiltersOpen,
  filter,
  apiFilterOptions,
  viewMode,
}: Props) => {
  const { currentPage, setCurrentPage } = usePageParam();
  const isListView = viewMode === ViewMode.LIST;
  const limit = isListView ? TABLE_LIMIT : CARD_LIMIT;

  const serializedFilter = new URLSearchParams(
    serializeAgentFilters(filter, undefined, false, {
      serializeToIDs: true,
      apiFilterOptions,
    }),
  );

  const { data, count, isLoading } = useGetQuery<ApiAgentGetList[]>({
    queryKey: ["agents"],
    apiPath: `${apiPathAgent}/`,
    params: {
      limit,
      page: currentPage,
      sortOrder,
      filter: serializedFilter,
    },
    staleTime: cacheTTL,
    addLang: false,
  });

  const agents: ApiAgentGetList[] = data || [];

  useEffect(() => {
    setNumOfAgents(count);
  }, [count, setNumOfAgents]);

  if (isLoading) return <DashboardListLoading />;

  if (isListView) {
    return <h1>List</h1>;
  }

  return (
    <AgentCardList
      agents={agents}
      count={count}
      columns={CARD_COLUMNS - (isFiltersOpen ? 1 : 0)}
      rows={CARD_ROWS + (isFiltersOpen ? 1 : 0)}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
    />
  );
};
