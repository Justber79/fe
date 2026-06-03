import { apiPathVolunteer } from "@/config/constants";
import { useQueryClient } from "@tanstack/react-query";
import { ApiVolunteerGetList, Lang } from "need4deed-sdk";
import { fetchData, getReducedFilter } from "./useGetQuery";
import { useParams } from "next/navigation";
import { copyEmails } from "@/components/Dashboard/common/copyEmails";
import { toast } from "react-toastify";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function useCopyVolunteerEmails(serializedFilter: URLSearchParams) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { lang } = useParams<{ lang: Lang }>();
  const [isCopying, setIsCopying] = useState(false);

  async function fetchEmailPage(page: number) {
    const res = await queryClient.fetchQuery({
      queryKey: ["volunteer-emails", serializedFilter.toString(), page],
      queryFn: () =>
        fetchData<ApiVolunteerGetList[]>(`${apiPathVolunteer}/`, {
          limit: 120,
          page,
          filter: getReducedFilter(serializedFilter),
          language: lang,
        }),
    });
    return {
      emails: res.data.map((volunteer) => volunteer.email).filter(Boolean),
      count: res.count,
    };
  }

  async function handleCopyEmails() {
    setIsCopying(true);
    try {
      const emails = await fetchAllFilteredEmails();
      await copyEmails(emails);
      toast.success(t("dashboard.volunteers.copyEmails.success", { count: emails.length }));
    } catch {
      toast.error(t("dashboard.volunteers.copyEmails.error"));
    } finally {
      setIsCopying(false);
    }
  }

  async function fetchAllFilteredEmails(): Promise<string[]> {
    const first = await fetchEmailPage(1);
    const totalPages = Math.ceil(first.count / 120);
    if (totalPages <= 1) return first.emails;

    const restPages = await Promise.all(Array.from({ length: totalPages - 1 }, (_, i) => fetchEmailPage(i + 2)));
    return [first.emails, ...restPages.map((page) => page.emails)].flat();
  }

  return { handleCopyEmails, isCopying };
}
