import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { Lang, SortOrder, UserRole } from "need4deed-sdk";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export const fetchData = async <T,>(apiPath: string, params: Params) => {
  const response: AxiosResponse<ApiResponse<T>> = await axios.get(apiPath, { params });
  return response.data;
};

export const getReducedFilter = (filter?: FilterParam) => {
  if (!filter) return;

  let reducedFilter: Record<string, unknown> = {};

  //If URLSearchParams, convert to a flat object where multi-value keys become arrays.
  if (filter instanceof URLSearchParams) {
    filter.forEach((_value, key) => {
      const values = filter.getAll(key);
      // If multiple values, use an array; otherwise, use the single value.
      reducedFilter[key] = values.length > 1 ? values : values[0];
    });
  } else {
    // If it's a JSON object, use it directly.
    reducedFilter = filter as Record<string, unknown>;
  }

  return reducedFilter;
};

interface ApiResponse<T> {
  message: string;
  data: T;
  count: number;
}

type FilterParam = URLSearchParams | Record<string, unknown>;
interface Params {
  language?: Lang;
  page?: number;
  limit?: number;
  sortOrder?: SortOrder;
  filter?: FilterParam;
  role?: UserRole;
}
interface UseGetQuery {
  apiPath: string;
  queryKey: string[];
  params?: Params;
  staleTime?: number;
  enabled?: boolean;
  addLang?: boolean;
}

// The generic custom hook with pagination-sort-language params
export const useGetQuery = <T,>({
  queryKey,
  apiPath,
  params = {},
  staleTime,
  enabled,
  addLang = true,
}: UseGetQuery) => {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: Lang }>();
  if (addLang) {
    params.language = lang;
  }
  params.filter = getReducedFilter(params.filter);

  const { data, isLoading, isError, error } = useQuery<ApiResponse<T>, Error>({
    queryKey: [...queryKey, params],
    queryFn: () => fetchData<T>(apiPath, params),
    staleTime,
    enabled,
  });

  // Display a toast message when an error occurs
  useEffect(() => {
    if (isError) {
      let errorMessage = t("message.errorGeneric");

      if (error && axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        errorMessage = errorData?.message || errorData;
      } else if (error) {
        // Fallback for non-Axios errors
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    }
  }, [isError, error, t]);

  return {
    data: data?.data,
    message: data?.message || "",
    count: data?.count || 0,
    isLoading,
    isError,
    error,
  };
};
