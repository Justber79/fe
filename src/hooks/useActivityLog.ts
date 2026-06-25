import { sumHours } from "@/components/Dashboard/Profile/sections/ActivityLog/utils";
import { apiPathActivityLog, apiPathOpportunityVolunteer, cacheTTL } from "@/config/constants";
import { useGetQuery } from "@/hooks/useGetQuery";
import { useMutationQuery } from "@/hooks/useMutationQuery";
import axios from "axios";
import { format } from "date-fns";
import { ApiActivityLogEntry, ApiActivityLogPatch, ApiActivityLogPost } from "need4deed-sdk";

// The backend's date columns are date-only; the API schema types `date` as a
// `format: date` string, so serialize the form's Date to yyyy-MM-dd on the wire.
const toRequestBody = (data: ApiActivityLogPatch): { date?: string; hours?: number } => ({
  ...(data.date !== undefined && { date: format(data.date, "yyyy-MM-dd") }),
  ...(data.hours !== undefined && { hours: data.hours }),
});

export const useActivityLog = (opportunityVolunteerId: number) => {
  const queryKey = ["activity-log", String(opportunityVolunteerId)];
  const matchPath = `${apiPathOpportunityVolunteer}/${opportunityVolunteerId}/activity-log`;

  // The GET response envelope is { data, totalHours, count }; useGetQuery unwraps
  // `data`, leaving the entry array. totalHours is summed client-side from those.
  const { data: entries = [], isLoading } = useGetQuery<ApiActivityLogEntry[]>({
    queryKey,
    apiPath: matchPath,
    staleTime: cacheTTL,
    enabled: !!opportunityVolunteerId,
  });

  const { mutate: createEntry, isPending: isCreating } = useMutationQuery<ApiActivityLogPost, unknown>({
    mutationFn: (payload) => axios.post(matchPath, toRequestBody(payload)).then((res) => res.data),
    successMessage: "dashboard.activityLog.entryAdded",
    queryKeyToInvalidate: queryKey,
  });

  const { mutate: updateEntry, isPending: isUpdating } = useMutationQuery<
    { id: number; data: ApiActivityLogPatch },
    unknown
  >({
    mutationFn: ({ id, data: payload }) =>
      axios.patch(`${apiPathActivityLog}/${id}`, toRequestBody(payload)).then((res) => res.data),
    successMessage: "dashboard.activityLog.entryUpdated",
    queryKeyToInvalidate: queryKey,
  });

  const { mutate: deleteEntry, isPending: isDeleting } = useMutationQuery<number, unknown>({
    mutationFn: (id) => axios.delete(`${apiPathActivityLog}/${id}`).then((res) => res.data),
    successMessage: "dashboard.activityLog.entryDeleted",
    queryKeyToInvalidate: queryKey,
  });

  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    entries: sortedEntries,
    totalHours: sumHours(entries),
    isLoading,
    createEntry,
    isCreating,
    updateEntry,
    isUpdating,
    deleteEntry,
    isDeleting,
  };
};
