import axios from "axios";
import { apiPathAgent, apiPathMe, AUTH_HINT_COOKIE_NAME, cacheTTL, USER_QUERY_KEY } from "@/config/constants";
import { useGetQuery } from "@/hooks";
import { getCookie } from "@/utils/helpers";
import { useQueries } from "@tanstack/react-query";
import { ApiUserGet } from "need4deed-sdk";
import { useState } from "react";

export const useGetCurrentAgent = () => {
  const [isAgentsLoading, setIsAgentsLoading] = useState(false);

  const isLoggedIn = getCookie(AUTH_HINT_COOKIE_NAME) === "true";

  const { data: user, isLoading: userLoading } = useGetQuery<ApiUserGet & { agentId?: number }>({
    queryKey: USER_QUERY_KEY,
    apiPath: apiPathMe,
    staleTime: cacheTTL,
    enabled: isLoggedIn,
    addLang: false,
  });

  const agentId = user?.agentId;
  // test here for multiple ngos, add more agentids
  const agentIds = [agentId];

  const agentQueries = useQueries({
    queries: agentIds.map((id) => ({
      queryKey: ["agent", String(id)],
      queryFn: async () => {
        setIsAgentsLoading(true);
        try {
          const response = await axios.get(`${apiPathAgent}/${id}`);
          return response.data;
        } catch (error) {
          console.error(`Error fetching agent with ID ${id}:`, error);
          throw error;
        } finally {
          setIsAgentsLoading(false);
        }
      },
      staleTime: cacheTTL,
      enabled: !!id,
    })),
  });

  const currentAgents = agentQueries.map((q) => q.data?.data);

  return {
    agentId,
    isLoading: userLoading || (agentIds.length > 0 && isAgentsLoading),
    currentAgents,
  };
};
