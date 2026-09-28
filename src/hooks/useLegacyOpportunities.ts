import { useQuery } from "@tanstack/react-query";
import { apiPathOpportunity } from "@/config/constants";
import { OpportunityApi } from "@/components/Website/OpportunityCards/types";
import { fetchFn } from "./api/utils";

const staleTime = 1000 * 60 * 60; // 1h

// Public opportunity list the old website's /opportunity-cards used. The
// endpoint returns a bare array (no {data, count} envelope), so useGetQuery
// doesn't fit.
export function useLegacyOpportunities() {
  const { data, isLoading } = useQuery<OpportunityApi[]>({
    queryKey: ["opportunities", "legacy"],
    queryFn: () => fetchFn<OpportunityApi[]>({ url: `${apiPathOpportunity}/legacy` }),
    staleTime,
  });

  return { opportunities: data, loading: isLoading };
}
