import { apiPathOpportunity, apiPathVolunteer, cacheTTL } from "@/config/constants";
import { useGetQuery } from "./useGetQuery";
import { ApiVolunteerGet, ApiVolunteerOpportunityGetList } from "need4deed-sdk";

export const useGetMostRelevantOpportunities = (volunteerId: number) => {
  const { data: volunteer } = useGetQuery<ApiVolunteerGet>({
    queryKey: ["volunteer", String(volunteerId) ?? ""],
    apiPath: `${apiPathVolunteer}/${volunteerId}`,
    staleTime: cacheTTL,
    enabled: !!volunteerId,
  });

  const serializeVolunteerFilters = (
    availability: ApiVolunteerGet["availability"] | undefined,
    districts: ApiVolunteerGet["locations"] | undefined,
  ) => {
    const params = new URLSearchParams();
    availability?.forEach(({ day, daytime }) => {
      if (day) {
        const availabilityGroup = day === "occasionally" ? "occasional" : "days";
        params.append("availability", `${availabilityGroup}~${day}`);
      }
      if (daytime) {
        const availabilityGroup = daytime === "weekdays" || daytime === "weekends" ? "occasional" : "times";
        params.append("availability", `${availabilityGroup}~${daytime}`);
      }
    });
    districts?.forEach(({ id }) => {
      params.append("district", String(id));
    });
    return params;
  };

  const volAvailability = volunteer?.availability;
  const volDistricts = volunteer?.locations;
  const serializedFilter = serializeVolunteerFilters(volAvailability, volDistricts);

  const {
    data: opportunities,
    isLoading,
    isError,
  } = useGetQuery<ApiVolunteerOpportunityGetList[]>({
    queryKey: ["opportunities", String(volunteerId)],
    apiPath: `${apiPathOpportunity}/`,
    params: {
      filter: serializedFilter,
    },
    staleTime: cacheTTL,
    enabled: !!volunteer,
  });

  return { opportunities, isLoading, isError };
};
