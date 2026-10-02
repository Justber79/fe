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

  if (filter instanceof URLSearchParams) {
    filter.forEach((_value, key) => {
      const values = filter.getAll(key);
      reducedFilter[key] = values.length > 1 ? values : values[0];
    });
  } else {
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
  search?: string;
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
}

export const useGetQuery = <T,>({ queryKey, apiPath, params = {}, staleTime, enabled }: UseGetQuery) => {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: Lang }>();
  const normalizedParams = { ...params, filter: getReducedFilter(params.filter) };

  const { data, isLoading, isError, error } = useQuery<ApiResponse<T>, Error>({
    queryKey: [...queryKey, lang, normalizedParams],
    queryFn: () => fetchData<T>(apiPath, normalizedParams),
    staleTime,
    enabled,
  });

  useEffect(() => {
    if (isError) {
      let errorMessage = t("message.errorGeneric");

      if (error && axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        errorMessage = errorData?.message || errorData;
      } else if (error) {
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
