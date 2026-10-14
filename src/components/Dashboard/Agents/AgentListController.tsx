import { type ApiAgentGetList, type ApiOptionLists, QueryParamsKeys, SortOrder } from "need4deed-sdk";
import { AgentCardList } from "./AgentCardList";
import { useEffect, useMemo } from "react";
import { DashboardListLoading } from "@/components/Dashboard/common/DashboardListLoading";
import { useGetQuery, usePageParam } from "@/hooks";
import { apiPathAgent, cacheTTL, CARD_LIMIT, MAP_LIMIT, TABLE_LIMIT } from "@/config/constants";
import { serializeAgentFilters } from "./helpers";
import { AgentCardsFilter } from "./Filters/types";
import { ViewMode } from "../common/types";
import { AgentTableList } from "./AgentTableList";
import { useCopyEmails } from "@/hooks/useCopyEmails";
import { createAgentFilterSections } from "./Filters/helpers";
import { getSectionItems } from "../common/CardsFilter/selectionFilters";
import { useTranslation } from "react-i18next";
import { LoadingAgentTableList } from "./LoadingAgentTableList";
import { createAgentMarkers } from "../common/MapView/helpers";
import { LoadingMapView } from "../common/MapView/LoadingMapView";
import { AgentMapView } from "./AgentMapView";

type Props = {
  setNumOfAgents: (num: number) => void;
  sortOrder: SortOrder;
  filter: AgentCardsFilter;
  setFilter: (newFilter: AgentCardsFilter | ((prev: AgentCardsFilter) => AgentCardsFilter)) => void;
  apiFilterOptions?: ApiOptionLists;
  volunteerId?: string;
  viewMode: ViewMode;
  onSelect?: (agent: ApiAgentGetList) => void;
};

export const AgentListController = ({
  setNumOfAgents,
  sortOrder,
  filter,
  setFilter,
  apiFilterOptions,
  viewMode,
  onSelect,
}: Props) => {
  const { currentPage, setCurrentPage } = usePageParam();
  const { t, i18n } = useTranslation();
  const isListView = viewMode === ViewMode.LIST;
  const isMapView = viewMode === ViewMode.MAP;
  const limit = isListView ? TABLE_LIMIT : isMapView ? MAP_LIMIT : CARD_LIMIT;

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
  });

  const agents: ApiAgentGetList[] = data || [];
  const { handleCopyEmails, isCopying } = useCopyEmails(`${apiPathAgent}/`, "agents-emails", serializedFilter);
  const filterSections = createAgentFilterSections(filter, setFilter, t);
  const dropdownFilters = {
    districtFilters: getSectionItems(filterSections, QueryParamsKeys.DISTRICT),
    typeFilters: getSectionItems(filterSections, "type"),
    volunteerSearchFilters: getSectionItems(filterSections, "volunteerSearch"),
  };

  const markers = useMemo(() => createAgentMarkers(agents, t, i18n.language), [agents, t, i18n.language]);

  useEffect(() => {
    setNumOfAgents(count);
  }, [count, setNumOfAgents]);

  if (isLoading && isListView) return <LoadingAgentTableList dropdownFilters={dropdownFilters} />;
  if (isLoading && isMapView) return <LoadingMapView />;

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
        dropdownFilters={dropdownFilters}
      />
    );
  }

  if (isMapView) {
    return (
      <AgentMapView
        markers={markers}
        count={count}
        itemsPerPage={limit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
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
