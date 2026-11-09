import { apiPathAgent } from "@/config/constants";
import { AgentEngagementStatusType, ApiAgentGetList } from "need4deed-sdk";
import { useMemo } from "react";
import { useDebounce } from "./useDebounce";
import { useGetQuery } from "./useGetQuery";

const SEARCH_LIMIT = 20;
const SEARCH_DEBOUNCE_MS = 300;
const MIN_SEARCH_LENGTH = 2;

export type AgentOption = { id: number; title: string; isInactive?: boolean };

export const useAgentSearch = (search: string, enabled = true) => {
  const query = useDebounce(search.trim(), SEARCH_DEBOUNCE_MS);
  const isActive = enabled && query.length >= MIN_SEARCH_LENGTH;
  const { data, isLoading } = useGetQuery<ApiAgentGetList[]>({
    queryKey: ["agents", "search", query],
    apiPath: `${apiPathAgent}/`,
    params: { limit: SEARCH_LIMIT, filter: { search: query } },
    enabled: isActive,
  });
  const agents = useMemo<AgentOption[]>(
    () =>
      isActive
        ? (data ?? []).map(({ id, title, statusEngagement }) => ({
            id,
            title,
            isInactive: statusEngagement === AgentEngagementStatusType.INACTIVE,
          }))
        : [],
    [data, isActive],
  );
  const isSettled = isActive && !isLoading && query === search.trim();
  return { agents, isSettled };
};
