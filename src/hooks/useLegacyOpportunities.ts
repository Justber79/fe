import { useQuery } from "@tanstack/react-query";
import { apiPathOpportunity } from "@/config/constants";
import { OpportunityApi } from "@/components/Website/OpportunityCards/types";
import axios from "axios";
import { Lang } from "need4deed-sdk";
import { useParams } from "next/navigation";

const staleTime = 1000 * 60 * 60;

export function useLegacyOpportunities() {
  const { lang } = useParams<{ lang: Lang }>();
  const { data, isLoading } = useQuery<OpportunityApi[]>({
    queryKey: ["opportunities", "legacy", lang],
    queryFn: () => axios.get<OpportunityApi[]>(`${apiPathOpportunity}/legacy`).then((response) => response.data),
    staleTime,
  });

  return { opportunities: data, loading: isLoading };
}
