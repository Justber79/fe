import { apiPathVolunteer, cacheTTL } from "@/config/constants";
import { getImageUrl } from "@/utils";
import { ApiVolunteerGet } from "need4deed-sdk";
import { useGetQuery } from "./useGetQuery";

export const useGetVolunteer = (volunteerId: string | undefined) => {
  const { data } = useGetQuery<ApiVolunteerGet>({
    queryKey: ["volunteer", volunteerId ?? ""],
    apiPath: `${apiPathVolunteer}/${volunteerId}`,
    staleTime: cacheTTL,
    enabled: !!volunteerId,
  });

  if (!data) return undefined;

  const id = data.id;
  const name = `${data.person.firstName} ${data.person.lastName}`.trim();
  const avatarUrl = data.person.avatarUrl ? getImageUrl(data.person.avatarUrl) : undefined;
  const latitude = data.person.address?.postcode?.latitude ?? null;
  const longitude = data.person.address?.postcode?.longitude ?? null;
  const languages = data.languages;
  const availability = data.availability;

  return { id, name, avatarUrl, latitude, longitude, languages, availability };
};
