import { apiPathOpportunity, cacheTTL } from "@/config/constants";
import { getImageUrl } from "@/utils";
import { ApiOpportunityGetList } from "need4deed-sdk";
import { useGetQuery } from "./useGetQuery";

type ApiOpportunityWithAvatar = ApiOpportunityGetList & { avatarUrl?: string };

export const useGetOpportunity = (opportunityId: string | undefined) => {
  const { data } = useGetQuery<ApiOpportunityWithAvatar>({
    queryKey: ["opportunity", opportunityId ?? ""],
    apiPath: `${apiPathOpportunity}/${opportunityId}`,
    staleTime: cacheTTL,
    enabled: !!opportunityId,
  });

  if (!data) return undefined;

  const id = data.id;
  const name = data.title;
  const avatarUrl = data.avatarUrl ? getImageUrl(data.avatarUrl) : undefined;
  const latitude = data.lat ?? null;
  const longitude = data.lon ?? null;
  const languages = data.languages;
  const availability = data.availability;

  return { id, name, avatarUrl, latitude, longitude, languages, availability };
};
