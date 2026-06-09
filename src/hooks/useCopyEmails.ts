import { MAX_PAGE_LIMIT } from "@/config/constants";
import { useQueryClient } from "@tanstack/react-query";
import { Lang } from "need4deed-sdk";
import { fetchData, getReducedFilter } from "./useGetQuery";
import { useParams } from "next/navigation";
import { copyEmails } from "@/utils/copyEmails";
import { toast } from "react-toastify";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";

type EmailRecord = { email?: string | null };

export const useCopyEmails = (apiPath: string, cacheKey: string, serializedFilter: URLSearchParams) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { lang } = useParams<{ lang: Lang }>();
  const [isCopying, setIsCopying] = useState(false);

  async function fetchEmailPage(page: number) {
    const res = await queryClient.fetchQuery({
      queryKey: [cacheKey, serializedFilter.toString(), page],
      staleTime: 0,
      queryFn: () =>
        fetchData<EmailRecord[]>(`${apiPath}/`, {
          limit: MAX_PAGE_LIMIT,
          page,
          filter: getReducedFilter(serializedFilter),
          language: lang,
        }),
    });
    return {
      emails: res.data.map((item) => item.email).filter((e): e is string => Boolean(e)),
      count: res.count,
    };
  }

  async function handleCopyEmails() {
    setIsCopying(true);
    try {
      const emails = await fetchAllFilteredEmails();
      await copyEmails(emails);
      toast.success(t("dashboard.common.copyEmails.success", { count: emails.length }));
    } catch (error: unknown) {
      let message = t("dashboard.common.copyEmails.genericError");
      if (axios.isAxiosError(error)) {
        const serverMessage = error.response?.data;
        if (typeof serverMessage === "string" && serverMessage) {
          message = serverMessage;
        } else if (typeof serverMessage?.message === "string" && serverMessage.message) {
          message = serverMessage.message;
        }
      }
      toast.error(message);
    } finally {
      setIsCopying(false);
    }
  }

  async function fetchAllFilteredEmails(): Promise<string[]> {
    const first = await fetchEmailPage(1);
    const totalPages = Math.ceil(first.count / MAX_PAGE_LIMIT);
    if (totalPages <= 1) return first.emails;

    const restPages = await Promise.all(Array.from({ length: totalPages - 1 }, (_, i) => fetchEmailPage(i + 2)));
    return [first.emails, ...restPages.map((page) => page.emails)].flat();
  }

  return { handleCopyEmails, isCopying };
};
