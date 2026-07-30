import { type ApiAgentGetList, type ApiOptionLists, SortOrder } from "need4deed-sdk";
import { AgentCardList } from "./AgentCardList";
import { useEffect } from "react";
import { DashboardListLoading } from "@/components/Dashboard/common/DashboardListLoading";
import { useGetQuery, usePageParam } from "@/hooks";
import { apiPathAgent, cacheTTL, CARD_LIMIT, TABLE_LIMIT } from "@/config/constants";
import { serializeAgentFilters } from "./helpers";
import { AgentCardsFilter } from "./Filters/types";
import { ViewMode } from "../common/types";
import { AgentTableList } from "./AgentTableList";
import { useCopyEmails } from "@/hooks/useCopyEmails";

type Props = {
  setNumOfAgents: (num: number) => void;
  sortOrder: SortOrder;
  filter: AgentCardsFilter;
  apiFilterOptions?: ApiOptionLists;
  volunteerId?: string;
  viewMode: ViewMode;
  onSelect?: (agent: ApiAgentGetList) => void;
};

export const AgentListController = ({ setNumOfAgents, sortOrder, filter, apiFilterOptions, viewMode, onSelect }: Props) => {
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
  const { handleCopyEmails, isCopying } = useCopyEmails(`${apiPathAgent}/`, "agents-emails", serializedFilter);

  useEffect(() => {
    setNumOfAgents(count);
  }, [count, setNumOfAgents]);

  if (isLoading) return <DashboardListLoading />;

  if (isListView) {
    return (
      <AgentTableList
        agents={agents}
        count={count}
        itemsPerPage={limit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        districtsList={apiFilterOptions?.district ?? undefined}
        onCopyEmails={handleCopyEmails}
        isCopying={isCopying}
        onSelect={onSelect}
      />
    );
  }

  return (
    <AgentCardList
      agents={agents}
      count={count}
      itemsPerPage={limit}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      districtsList={apiFilterOptions?.district ?? undefined}
      onSelect={onSelect}
    />
  );
};
