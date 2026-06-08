import { apiPathAgentMe, cacheTTL } from "@/config/constants";
import { useGetQuery } from "@/hooks";
import { getCookie } from "@/utils/helpers";
import { ApiAgentGet } from "need4deed-sdk";

// Requires BE: GET /api/agent/me — returns the agent profile for the logged-in agent user.
export const useGetCurrentAgent = () => {
  const isLoggedIn = getCookie("is_logged_in") === "true";

  const { data, isLoading } = useGetQuery<ApiAgentGet>({
    queryKey: ["agent", "me"],
    apiPath: apiPathAgentMe,
    staleTime: cacheTTL,
    enabled: isLoggedIn,
    addLang: false,
  });

  return { agent: data, isLoading };
};
