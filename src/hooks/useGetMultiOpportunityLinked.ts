import { apiPathAgent, cacheTTL } from "@/config/constants";
import { useQueries } from "@tanstack/react-query";
import axios from "axios";
import { Lang } from "need4deed-sdk";
import { useParams } from "next/navigation";

export const useGetMultiOpportunityLinked = (agentIds: number[]) => {
  const { lang } = useParams<{ lang: Lang }>();
  const oppLinkedQueries = useQueries({
    queries: agentIds?.map((id) => ({
      queryKey: ["agent-opportunities", String(id), lang],
      queryFn: async () => {
        try {
          const res = await axios.get(`${apiPathAgent}/${id}/opportunity-linked`);
          if (!res) {
            throw new Error("Failed to fetch opportunity");
          }
          return res.data;
        } catch (error) {
          console.error(`Error fetching agent with ID ${id}:`, error);
          throw error;
        }
      },
      staleTime: cacheTTL,
      enabled: !!id,
    })),
  });

  const allLinkedOpportunities = oppLinkedQueries.flatMap((q) => q.data?.data).filter((q) => Boolean(q));

  return {
    allLinkedOpportunities,
    isLoading: oppLinkedQueries.some((q) => q.isLoading),
  };
};
