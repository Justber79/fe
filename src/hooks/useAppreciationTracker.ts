import { apiPathAppreciation, apiPathVolunteer } from "@/config/constants";
import { useGetQuery } from "@/hooks/useGetQuery";
import { useMutationQuery } from "@/hooks/useMutationQuery";
import axios from "axios";
import { ApiAppreciationPatch, ApiAppreciationPost, ApiAppreciationGet } from "need4deed-sdk";

export const useAppreciationTracker = (volunteerId: number) => {
  const queryKey = ["volunteer", String(volunteerId), "appreciations"];

  const { data: appreciations = [], isLoading } = useGetQuery<ApiAppreciationGet[]>({
    queryKey,
    apiPath: `${apiPathVolunteer}/${volunteerId}/appreciation`,
  });

  const { mutate: createAppreciation, isPending: isCreating } = useMutationQuery<ApiAppreciationPost, unknown>({
    apiPath: `${apiPathVolunteer}/${volunteerId}/appreciation`,
    method: "post",
    successMessage: "dashboard.appreciationSection.appreciationAdded",
    queryKeyToInvalidate: queryKey,
  });

  const { mutate: updateAppreciation, isPending: isUpdating } = useMutationQuery<
    { id: number; data: ApiAppreciationPatch },
    unknown
  >({
    mutationFn: ({ id, data }) => axios.patch(`${apiPathAppreciation}/${id}`, data).then((res) => res.data),
    successMessage: "dashboard.appreciationSection.appreciationUpdated",
    queryKeyToInvalidate: queryKey,
  });

  const { mutate: deleteAppreciation, isPending: isDeleting } = useMutationQuery<number, unknown>({
    mutationFn: (id) => axios.delete(`${apiPathAppreciation}/${id}`).then((res) => res.data),
    successMessage: "dashboard.appreciationSection.appreciationDeleted",
    queryKeyToInvalidate: queryKey,
  });

  const sortedAppreciations = [...appreciations].sort((a, b) => {
    const dateA = a.dateDelivery ? new Date(a.dateDelivery).getTime() : a.dateDue ? new Date(a.dateDue).getTime() : 0;
    const dateB = b.dateDelivery ? new Date(b.dateDelivery).getTime() : b.dateDue ? new Date(b.dateDue).getTime() : 0;
    return dateB - dateA;
  });

  return {
    appreciations: sortedAppreciations,
    isLoading,
    createAppreciation,
    isCreating,
    updateAppreciation,
    isUpdating,
    deleteAppreciation,
    isDeleting,
  };
};
