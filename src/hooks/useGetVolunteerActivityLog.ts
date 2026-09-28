import { useGetQuery } from "@/hooks";
import { ApiVolunteerAuditLogGet } from "need4deed-sdk";
import { apiPathVolunteer } from "@/config/constants";

export const useGetVolunteerActivityLog = (volunteerId: number) => {
  const queryKey = ["volunteer", String(volunteerId), "activity-log"];

  const { data: activities = [], isLoading } = useGetQuery<ApiVolunteerAuditLogGet[]>({
    queryKey,
    apiPath: `${apiPathVolunteer}/${volunteerId}/activity-log`,
  });

  return {
    activities,
    isLoading,
  };
};
