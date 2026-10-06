"use client";

import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import i18next from "i18next";
import { ReactNode, useState } from "react";
import { toast } from "react-toastify";
import { getLocalizedErrorMessage, isSilentError } from "./apiErrors";

const MAX_RETRIES = 2;

// 4xx won't change on retry; only retry server and network errors.
const shouldRetry = (failureCount: number, error: unknown) => {
  const status = axios.isAxiosError(error) ? error.response?.status : undefined;
  if (status !== undefined && status < 500) return false;
  return failureCount < MAX_RETRIES;
};

const createQueryClient = () =>
  new QueryClient({
    // Toasting here fires once per failed query, not once per component using it.
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (!query.meta?.toastOnError || isSilentError(error)) return;
        toast.error(getLocalizedErrorMessage(error, i18next.t));
      },
    }),
    defaultOptions: { queries: { retry: shouldRetry } },
  });

export default function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
