import { EntityType } from "@/components/Dashboard/Profile/types";
import { apiPathAgent, apiPathCommunication, apiPathVolunteer } from "@/config/constants";
import { useGetQuery } from "@/hooks/useGetQuery";
import { useMutationQuery } from "@/hooks/useMutationQuery";
import axios from "axios";
import { ApiCommunicationGet, ApiVolunteerCommunicationPatch, ApiVolunteerCommunicationPost } from "need4deed-sdk";

const entityApiPathMap: Record<string, string> = {
  volunteer: `${apiPathVolunteer}/`,
  agent: `${apiPathAgent}/`,
};

export const communicationsQuery = (entityType: EntityType, entityId: number) => ({
  queryKey: [entityType, String(entityId), "communications"],
  apiPath: `${entityApiPathMap[entityType]}${entityId}/communication`,
});

export const useCommunicationTracker = (entityId: number, entityType: EntityType) => {
  const { queryKey, apiPath } = communicationsQuery(entityType, entityId);

  const { data: communications = [], isLoading } = useGetQuery<ApiCommunicationGet[]>({ queryKey, apiPath });

  const { mutate: createCommunication, isPending: isCreating } = useMutationQuery<
    ApiVolunteerCommunicationPost,
    unknown
  >({
    apiPath,
    method: "post",
    successMessage: "dashboard.communicationSection.communicationAdded",
    queryKeyToInvalidate: queryKey,
  });

  const { mutate: updateCommunication, isPending: isUpdating } = useMutationQuery<
    { id: number; data: ApiVolunteerCommunicationPatch },
    unknown
  >({
    mutationFn: ({ id, data }) => axios.patch(`${apiPathCommunication}/${id}`, data).then((res) => res.data),
    successMessage: "dashboard.communicationSection.communicationUpdated",
    queryKeyToInvalidate: queryKey,
  });

  const { mutate: deleteCommunication, isPending: isDeleting } = useMutationQuery<number, unknown>({
    mutationFn: (id) => axios.delete(`${apiPathCommunication}/${id}`).then((res) => res.data),
    successMessage: "dashboard.communicationSection.communicationDeleted",
    queryKeyToInvalidate: queryKey,
  });

  const sortedCommunications = [...communications].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return {
    communications: sortedCommunications,
    isLoading,
    createCommunication,
    isCreating,
    updateCommunication,
    isUpdating,
    deleteCommunication,
    isDeleting,
  };
};
