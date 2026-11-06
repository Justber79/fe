import { type ApiAgentGetList, type ApiOptionLists, QueryParamsKeys, SortOrder } from "need4deed-sdk";
import { AgentCardList } from "./AgentCardList";
import { useEffect } from "react";
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
import { LoadingMapView } from "../common/MapView/LoadingMapView";
import { AgentMapView } from "./AgentMapView";
import { hasUnsupportedDistrictMapFilter } from "../common/MapView/helpers";

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

export const AgentListController = (props: Props) => <AgentListControllerContent key={props.viewMode} {...props} />;

const AgentListControllerContent = ({
  setNumOfAgents,
  sortOrder,
  filter,
  setFilter,
  apiFilterOptions,
  viewMode,
  onSelect,
}: Props) => {
  const { currentPage, setCurrentPage } = usePageParam();
  const { t } = useTranslation();
  const isListView = viewMode === ViewMode.LIST;
  const isMapView = viewMode === ViewMode.MAP;
  const hasUnsupportedMapFilters =
    isMapView && (Boolean(filter.search) || hasUnsupportedDistrictMapFilter(filter.district));
  const limit = isListView ? TABLE_LIMIT : isMapView ? (onSelect ? MAP_LIMIT : 1) : CARD_LIMIT;

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
    enabled: !isMapView || hasUnsupportedMapFilters || Boolean(onSelect),
    keepPreviousData: isMapView,
  });

  const agents: ApiAgentGetList[] = data || [];
  const { handleCopyEmails, isCopying } = useCopyEmails(`${apiPathAgent}/`, "agents-emails", serializedFilter);
  const filterSections = createAgentFilterSections(filter, setFilter, t);
  const dropdownFilters = {
    districtFilters: getSectionItems(filterSections, QueryParamsKeys.DISTRICT),
    typeFilters: getSectionItems(filterSections, "type"),
    volunteerSearchFilters: getSectionItems(filterSections, "volunteerSearch"),
  };

  useEffect(() => {
    if (!isMapView || hasUnsupportedMapFilters) setNumOfAgents(count);
  }, [count, hasUnsupportedMapFilters, isMapView, setNumOfAgents]);

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
        filter={serializedFilter}
        onCountChange={setNumOfAgents}
        agents={onSelect ? agents : undefined}
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
