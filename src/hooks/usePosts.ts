import { apiPathPost } from "@/config/constants";
import { fetchData } from "@/hooks/useGetQuery";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { ApiPostGet, Lang } from "need4deed-sdk";
import { useParams } from "next/navigation";

export const POSTS_QUERY_KEY = ["posts"];
export const POSTS_PAGE_SIZE = 20;

export function usePostsFeed() {
  const { lang } = useParams<{ lang: Lang }>();

  return useInfiniteQuery({
    queryKey: [...POSTS_QUERY_KEY, lang],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      fetchData<ApiPostGet[]>(apiPathPost, {
        language: lang,
        page: pageParam,
        limit: POSTS_PAGE_SIZE,
      }),
    getNextPageParam: (lastPage, pages) => {
      const loadedPostCount = pages.reduce((count, page) => count + page.data.length, 0);
      return loadedPostCount < lastPage.count ? pages.length + 1 : undefined;
    },
  });
}
