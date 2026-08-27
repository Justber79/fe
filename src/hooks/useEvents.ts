import { apiPathEvent } from "@/config/constants";
import axios from "axios";
import type { ApiEventN4DCreate, ApiEventN4DGet, ApiEventN4DGetList, ApiEventN4DPatch } from "need4deed-sdk";

import { useGetQuery } from "./useGetQuery";
import { useMutationQuery } from "./useMutationQuery";

export const EVENT_QUERY_KEY = ["events"];

export function useEvents() {
  return useGetQuery<ApiEventN4DGetList[]>({ queryKey: EVENT_QUERY_KEY, apiPath: apiPathEvent });
}

export function useEvent(id?: number) {
  const query = useEvents();
  return {
    ...query,
    data: id ? query.data?.find((event) => event.id === id) : undefined,
  };
}

export function useCreateEvent(onSuccess: (event: ApiEventN4DGet) => void) {
  return useMutationQuery<ApiEventN4DCreate, { data: ApiEventN4DGet }>({
    apiPath: apiPathEvent,
    queryKeyToInvalidate: EVENT_QUERY_KEY,
    successMessage: "dashboard.calendar.messages.created",
    onSuccessCallback: (response) => onSuccess(response.data),
  });
}

export function useUpdateEvent(id: number, onSuccess: () => void) {
  return useMutationQuery<ApiEventN4DPatch, unknown>({
    apiPath: `${apiPathEvent}/${id}`,
    method: "patch",
    queryKeyToInvalidate: EVENT_QUERY_KEY,
    successMessage: "dashboard.calendar.messages.updated",
    onSuccessCallback: onSuccess,
  });
}

export function useDeleteEvent() {
  return useMutationQuery<number, unknown>({
    mutationFn: (id) => axios.delete(`${apiPathEvent}/${id}`).then((response) => response.data),
    queryKeyToInvalidate: EVENT_QUERY_KEY,
    successMessage: "dashboard.calendar.messages.deleted",
  });
}
