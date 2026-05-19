import { ApiAgentGetList, ApiOptionLists, SortOrder } from "need4deed-sdk";
import { AgentCardList } from "./AgentCardList";
import { useEffect } from "react";
import { DashboardListLoading } from "@/components/Dashboard/common/DashboardListLoading";
import { useGetQuery, usePageParam } from "@/hooks";
import { apiPathAgent, cacheTTL } from "@/config/constants";
import { serializeAgentFilters } from "./helpers";
import { AgentCardsFilter } from "./Filters/types";

const columns = 3;
const rows = 3;
const limit = columns * rows;

type Props = {
  setNumOfAgents: (num: number) => void;
  sortOrder: SortOrder;
  isFiltersOpen: boolean;
  filter: AgentCardsFilter;
  apiFilterOptions?: ApiOptionLists;
  volunteerId?: string;
};

export const AgentListController = ({ setNumOfAgents, sortOrder, isFiltersOpen, filter, apiFilterOptions }: Props) => {
  const { currentPage, setCurrentPage } = usePageParam();

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

  return (
    <AgentCardList
      agents={agents}
      count={count}
      columns={columns - (isFiltersOpen ? 1 : 0)}
      rows={rows + (isFiltersOpen ? 1 : 0)}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
    />
  );
};
