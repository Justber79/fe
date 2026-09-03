import { Paragraph } from "@/components/styled/text";
import { usePostsFeed } from "@/hooks";
import type { ApiPostGet } from "need4deed-sdk";
import { useParams } from "next/navigation";
import { useCallback, useLayoutEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";

import {
  EmptyState,
  FeedPost,
  FeedScrollContainer,
  LoadOlderIndicator,
  PostAuthor,
  PostHeader,
  PostTimestamp,
} from "./styles";

const LOAD_OLDER_THRESHOLD = 80;

interface ScrollMetrics {
  height: number;
  top: number;
}

function renderPost(post: ApiPostGet, locale: string) {
  const createdAt = new Date(post.createdAt);

  return (
    <FeedPost key={post.id}>
      <PostHeader>
        <PostAuthor>{post.author.fullName}</PostAuthor>
        <PostTimestamp dateTime={createdAt.toISOString()}>{createdAt.toLocaleString(locale)}</PostTimestamp>
      </PostHeader>
      <Paragraph $textWrap="pretty">{post.text}</Paragraph>
    </FeedPost>
  );
}

export function PostFeed() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const feedRef = useRef<HTMLDivElement>(null);
  const didScrollToNewest = useRef(false);
  const pendingScrollMetrics = useRef<ScrollMetrics | null>(null);
  const previousScrollTop = useRef<number | null>(null);
  const { data, fetchNextPage, hasNextPage, isError, isFetchingNextPage, isLoading } = usePostsFeed();

  const posts = useMemo(() => data?.pages.flatMap((page) => page.data).reverse() ?? [], [data?.pages]);

  useLayoutEffect(() => {
    didScrollToNewest.current = false;
    pendingScrollMetrics.current = null;
    previousScrollTop.current = null;
  }, [lang]);

  useLayoutEffect(() => {
    const feed = feedRef.current;
    if (!feed || posts.length === 0) return;

    if (!didScrollToNewest.current) {
      feed.scrollTop = feed.scrollHeight;
      previousScrollTop.current = feed.scrollTop;
      didScrollToNewest.current = true;
      return;
    }

    const previous = pendingScrollMetrics.current;
    if (previous) {
      feed.scrollTop = previous.top + (feed.scrollHeight - previous.height);
      previousScrollTop.current = feed.scrollTop;
      pendingScrollMetrics.current = null;
    }
  }, [posts.length]);

  const loadOlderPosts = useCallback(async () => {
    const feed = feedRef.current;
    if (!feed || !hasNextPage || isFetchingNextPage) return;

    pendingScrollMetrics.current = {
      height: feed.scrollHeight,
      top: feed.scrollTop,
    };

    const result = await fetchNextPage();
    if (result.isError) pendingScrollMetrics.current = null;
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useLayoutEffect(() => {
    const feed = feedRef.current;
    if (!feed || !hasNextPage || isFetchingNextPage || isError || posts.length === 0) return;

    if (feed.scrollHeight <= feed.clientHeight) {
      void loadOlderPosts();
    }
  }, [hasNextPage, isError, isFetchingNextPage, loadOlderPosts, posts.length]);

  const handleScroll = useCallback(() => {
    const feed = feedRef.current;
    if (!feed) return;

    const currentScrollTop = feed.scrollTop;
    const isScrollingUp = previousScrollTop.current !== null && currentScrollTop < previousScrollTop.current;
    previousScrollTop.current = currentScrollTop;

    if (isScrollingUp && currentScrollTop <= LOAD_OLDER_THRESHOLD) {
      void loadOlderPosts();
    }
  }, [loadOlderPosts]);

  if (isLoading) {
    return (
      <EmptyState>
        <Paragraph>{t("dashboard.home.content.loading")}</Paragraph>
      </EmptyState>
    );
  }

  if (isError && posts.length === 0) {
    return (
      <EmptyState role="alert">
        <Paragraph>{t("message.errorGeneric")}</Paragraph>
      </EmptyState>
    );
  }

  if (posts.length === 0) {
    return (
      <EmptyState>
        <Paragraph>{t("dashboard.posts.empty")}</Paragraph>
      </EmptyState>
    );
  }

  return (
    <FeedScrollContainer ref={feedRef} onScroll={handleScroll} aria-label={t("dashboard.home.sidebar.posts")}>
      {(hasNextPage || isFetchingNextPage || isError) && (
        <LoadOlderIndicator aria-live="polite" role={isError ? "alert" : undefined}>
          {isError ? t("message.errorGeneric") : isFetchingNextPage ? "…" : null}
        </LoadOlderIndicator>
      )}
      {posts.map((post) => renderPost(post, i18n.language))}
    </FeedScrollContainer>
  );
}

export default PostFeed;
