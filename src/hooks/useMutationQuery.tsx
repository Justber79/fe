import { HttpMethod } from "@/types";
import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { getLocalizedErrorMessage, isSilentError } from "@/utils/apiErrors";

// Define the options for the hook
type DataMutationOptions<TResponse, TData> = {
  method?: HttpMethod;
  successMessage?: string;
  onSuccessCallback?: (data: TResponse) => void | Promise<void>;
  queryKeyToInvalidate?: QueryKey | QueryKey[];
  // Return true to mark an error as handled by the caller (e.g. shown inline),
  // which skips the default error toast.
  onErrorCallback?: (error: unknown) => boolean | void;

  noToast?: boolean;
} & (
  | {
      apiPath: string;
      mutationFn?: never;
    }
  | {
      mutationFn: (data: TData) => Promise<TResponse>;
      apiPath?: never;
    }
);

// Generic function to perform the API call
async function mutateData<TData, TResponse>(apiPath: string, method: HttpMethod, data: TData): Promise<TResponse> {
  if (method === "delete") {
    const response = await axios.delete(apiPath);
    return response.data;
  }
  const response = await axios[method](apiPath, data);
  return response.data;
}

/**
 * A generic hook for handling POST, PATCH, and PUT mutations.
 * @param TData The type of the payload sent to the API.
 * @param TResponse The type of the data expected in the API response.
 * @param TError The type of the error object.
 */
export const useMutationQuery = <TData, TResponse, TError = AxiosError<{ message?: string }>>({
  apiPath,
  method = "post",
  successMessage,
  onSuccessCallback,
  queryKeyToInvalidate,
  mutationFn,
  onErrorCallback,
  noToast = false,
}: DataMutationOptions<TResponse, TData>) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation<TResponse, TError, TData>({
    mutationFn: (data: TData) => {
      if (mutationFn) {
        return mutationFn(data);
      }
      return mutateData(apiPath, method, data);
    },

    onSuccess: (responseData) => {
      if (!noToast) toast.success(t(successMessage || "message.successful") + " 🎉");

      if (queryKeyToInvalidate) {
        const keysToInvalidate = Array.isArray(queryKeyToInvalidate[0])
          ? (queryKeyToInvalidate as QueryKey[])
          : [queryKeyToInvalidate];

        keysToInvalidate.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }

      // Execute the custom callback for component-specific logic (e.g., closing a modal)
      if (onSuccessCallback) {
        onSuccessCallback(responseData);
      }
    },

    onError: (error) => {
      if (isSilentError(error) || onErrorCallback?.(error)) return;

      toast.error(getLocalizedErrorMessage(error, t));
    },
  });
};

export default useMutationQuery;
