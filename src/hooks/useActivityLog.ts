import {
  ApiActivityLogGet,
  ApiActivityLogPatch,
  ApiActivityLogPost,
} from "@/components/Dashboard/Profile/sections/ActivityLog/types";
import { sumHours } from "@/components/Dashboard/Profile/sections/ActivityLog/utils";
import { apiPathActivityLog, apiPathOpportunity, cacheTTL } from "@/config/constants";
import { useGetQuery } from "@/hooks/useGetQuery";
import { useMutationQuery } from "@/hooks/useMutationQuery";
import axios from "axios";

export const useActivityLog = (opportunityId: number, volunteerId: number) => {
  const queryKey = ["activity-log", String(opportunityId), String(volunteerId)];
  const matchPath = `${apiPathOpportunity}/${opportunityId}/volunteer/${volunteerId}/activity-log`;

  const { data: entries = [], isLoading } = useGetQuery<ApiActivityLogGet[]>({
    queryKey,
    apiPath: matchPath,
    staleTime: cacheTTL,
    enabled: !!opportunityId && !!volunteerId,
  });

  const { mutate: createEntry, isPending: isCreating } = useMutationQuery<ApiActivityLogPost, unknown>({
    apiPath: matchPath,
    method: "post",
    successMessage: "dashboard.activityLog.entryAdded",
    queryKeyToInvalidate: queryKey,
  });

  const { mutate: updateEntry, isPending: isUpdating } = useMutationQuery<
    { id: number; data: ApiActivityLogPatch },
    unknown
  >({
    mutationFn: ({ id, data }) => axios.patch(`${apiPathActivityLog}/${id}`, data).then((res) => res.data),
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
