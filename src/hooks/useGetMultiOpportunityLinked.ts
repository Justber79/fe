import { apiPathAgent, cacheTTL } from "@/config/constants";
import { useQueries } from "@tanstack/react-query";
import { useState } from "react";

export const useGetMultiOpportunityLinked = (agentIds: number[]) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const oppLinkedQueries = useQueries({
    queries: agentIds?.map((id) => ({
      queryKey: ["agent-opportunities", String(id)],
      queryFn: async () => {
        setIsLoading(true);
        const res = await fetch(`${apiPathAgent}/${id}/opportunity-linked`);
        if (!res.ok) {
          setIsLoading(false);
          throw new Error("Failed to fetch opportunity");
        }
        setIsLoading(false);
        return res.json();
      },
      staleTime: cacheTTL,
      enabled: !!id,
    })),
  });

  const allLinkedOpportunities = oppLinkedQueries.flatMap((q) => q.data?.data).filter((q) => Boolean(q)) ?? [];

  return {
    allLinkedOpportunities,
    isLoading,
  };
};
