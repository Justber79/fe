import { apiPathPost, cacheTTL } from "@/config/constants";
import { fetchData } from "@/hooks/useGetQuery";
import { useMutationQuery } from "@/hooks/useMutationQuery";
import { InfiniteData, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type {
  ApiPostGet,
  ApiPostPatch,
  ApiPostPost,
  ApiPostReplyGet,
  ApiPostReplyPatch,
  ApiPostReplyPost,
  Lang,
} from "need4deed-sdk";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useGetQuery } from "./useGetQuery";

export const POSTS_QUERY_KEY = ["posts"];
export const POSTS_PAGE_SIZE = 20;
export const postRepliesQueryKey = (postId: number) => ["post-replies", String(postId)];

type PostsPage = {
  message: string;
  data: ApiPostGet[];
  count: number;
};

type PostsFeedData = InfiniteData<PostsPage, number>;

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

export function useUpdatePost(postId: number, onSuccess: () => void) {
  return useMutationQuery<ApiPostPatch, unknown>({
    apiPath: `${apiPathPost}/${postId}`,
    method: "patch",
    queryKeyToInvalidate: POSTS_QUERY_KEY,
    successMessage: "dashboard.posts.updated",
    onSuccessCallback: onSuccess,
  });
}

export function useDeletePost(postId: number, onSuccess: () => void) {
  return useMutationQuery<void, unknown>({
    apiPath: `${apiPathPost}/${postId}`,
    method: "delete",
    queryKeyToInvalidate: POSTS_QUERY_KEY,
    successMessage: "dashboard.posts.deleted",
    onSuccessCallback: onSuccess,
  });
}

export function useCreatePost(onSuccess: () => void) {
  return useMutationQuery<ApiPostPost, unknown>({
    apiPath: apiPathPost,
    queryKeyToInvalidate: POSTS_QUERY_KEY,
    successMessage: "dashboard.posts.created",
    onSuccessCallback: onSuccess,
  });
}

export function useTogglePostBookmark(postId: number, bookmarked: boolean) {
  const queryClient = useQueryClient();
  const bookmarkedRef = useRef(bookmarked);
  const isRequestInFlight = useRef(false);

  useEffect(() => {
    bookmarkedRef.current = bookmarked;
  }, [bookmarked]);

  const mutation = useMutationQuery<boolean, boolean>({
    mutationFn: async (nextBookmarked) => {
      if (nextBookmarked) await axios.post(`${apiPathPost}/${postId}/bookmark`);
      else await axios.delete(`${apiPathPost}/${postId}/bookmark`);
      return nextBookmarked;
    },
    successMessage: bookmarked ? "dashboard.posts.bookmarkRemoved" : "dashboard.posts.bookmarkAdded",
    onSuccessCallback: (nextBookmarked) => {
      bookmarkedRef.current = nextBookmarked;

      queryClient.getQueriesData<PostsFeedData>({ queryKey: POSTS_QUERY_KEY }).forEach(([queryKey, data]) => {
        if (!data) return;

        queryClient.setQueryData<PostsFeedData>(queryKey, {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            data: page.data.map((post) => (post.id === postId ? { ...post, bookmarked: nextBookmarked } : post)),
          })),
        });
      });
    },
  });

  return {
    ...mutation,
    mutate: () => {
      if (isRequestInFlight.current) return;

      isRequestInFlight.current = true;
      mutation.mutate(!bookmarkedRef.current, {
        onSettled: () => {
          isRequestInFlight.current = false;
        },
      });
    },
  };
}

export function useGetPostReplies(postId: number, enabled: boolean) {
  return useGetQuery<ApiPostReplyGet[]>({
    queryKey: postRepliesQueryKey(postId),
    apiPath: `${apiPathPost}/${postId}/reply`,
    enabled,
    staleTime: cacheTTL,
  });
}

export function useCreateReply(postId: number) {
  return useMutationQuery<ApiPostReplyPost, unknown>({
    apiPath: `${apiPathPost}/${postId}/reply`,
    queryKeyToInvalidate: [POSTS_QUERY_KEY, postRepliesQueryKey(postId)],
    successMessage: "dashboard.posts.replyCreated",
  });
}

export function useUpdateReply(postId: number, replyId: number, onSuccess: () => void) {
  return useMutationQuery<ApiPostReplyPatch, unknown>({
    apiPath: `${apiPathPost}/reply/${replyId}`,
    method: "patch",
    queryKeyToInvalidate: postRepliesQueryKey(postId),
    successMessage: "dashboard.posts.replyUpdated",
    onSuccessCallback: onSuccess,
  });
}

export function useDeleteReply(postId: number, replyId: number, onSuccess: () => void) {
  return useMutationQuery<void, unknown>({
    apiPath: `${apiPathPost}/reply/${replyId}`,
    method: "delete",
    queryKeyToInvalidate: [POSTS_QUERY_KEY, postRepliesQueryKey(postId)],
    successMessage: "dashboard.posts.replyDeleted",
    onSuccessCallback: onSuccess,
  });
}
