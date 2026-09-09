import { apiPathOpportunity, apiPathVolunteer, cacheTTL } from "@/config/constants";
import { useGetQuery } from "./useGetQuery";
import {
  ApiVolunteerGet,
  ApiVolunteerOpportunityGetList,
  EntityTableName,
  OpportunityStatusType,
  QueryParamsKeys,
} from "need4deed-sdk";
import { SEPARATOR, STATUS_PARAM } from "@/components/Dashboard/Opportunities/Filters/constants";

export const useGetMostRelevantOpportunities = (volunteerId: number) => {
  const {
    data: volunteer,
    isLoading: isVolunteerLoading,
    isError: isVolunteerError,
  } = useGetQuery<ApiVolunteerGet>({
    queryKey: ["volunteer", String(volunteerId)],
    apiPath: `${apiPathVolunteer}/${volunteerId}`,
    staleTime: cacheTTL,
    enabled: !!volunteerId,
  });

  const serializeVolunteerFilters = (
    availability: ApiVolunteerGet["availability"] | undefined,
    districts: ApiVolunteerGet["locations"] | undefined,
  ) => {
    const params = new URLSearchParams();

    const activeStatuses = [OpportunityStatusType.ACTIVE, OpportunityStatusType.NEW, OpportunityStatusType.SEARCHING];

    activeStatuses.forEach((defaultStatus) => params.append(STATUS_PARAM, defaultStatus));

    availability?.forEach(({ day, daytime }) => {
      if (day && day !== "occasionally") {
        params.append(QueryParamsKeys.AVAILABILITY, `days${SEPARATOR}${day}`);
      }
      if (daytime) {
        const availabilityGroup = daytime === "weekdays" || daytime === "weekends" ? "occasional" : "times";
        params.append(QueryParamsKeys.AVAILABILITY, `${availabilityGroup}${SEPARATOR}${daytime}`);
      }
    });
    districts?.forEach(({ id }) => {
      params.append(EntityTableName.DISTRICT, String(id));
    });
    return params;
  };

  const volAvailability = volunteer?.availability;
  const volDistricts = volunteer?.locations;
  const serializedFilter = serializeVolunteerFilters(volAvailability, volDistricts);

  const {
    data: opportunities,
    isLoading: isOpportunitiesLoading,
    isError: isOpportunitiesError,
  } = useGetQuery<ApiVolunteerOpportunityGetList[]>({
    queryKey: ["opportunities", String(volunteerId)],
    apiPath: `${apiPathOpportunity}/`,
    params: {
      filter: serializedFilter,
    },
    staleTime: cacheTTL,
    enabled: !!volunteer,
  });

  return {
    opportunities,
    isLoading: isVolunteerLoading || isOpportunitiesLoading,
    isError: isVolunteerError || isOpportunitiesError,
  };
};
