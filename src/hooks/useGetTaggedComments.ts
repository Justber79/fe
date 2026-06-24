import { apiPathComment, cacheTTL } from "@/config/constants";
import { useGetQuery } from "./useGetQuery";
import { ApiComment } from "need4deed-sdk";

export const useGetTaggedComments = (personId: number) => {
  const {
    data: tagComments,
    isLoading,
    isError,
    error,
  } = useGetQuery<ApiComment & { taggedPersons: { id: number; readAt: Date }[] }[]>({
    queryKey: ["tagComments", String(personId)],
    apiPath: `${apiPathComment}?taggedPersonId=${personId}`,
    staleTime: cacheTTL,
  });

  return { tagComments, isLoading, isError, error };
};
