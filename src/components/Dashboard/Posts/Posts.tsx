"use client";

import { DashboardLayout } from "@/components/Layout";
import { useCallback, useState } from "react";

import PostFeed from "./PostFeed";
import PostComposer from "./PostComposer";
import { PostsContainer } from "./styles";
import type { ReplyTarget } from "./types";

export function Posts() {
  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);
  const [expandedPostIds, setExpandedPostIds] = useState<Set<number>>(new Set());

  const startReply = useCallback((target: ReplyTarget) => {
    setReplyTarget(target);
    setExpandedPostIds(new Set([target.postId]));
  }, []);

  const toggleReplies = useCallback((postId: number) => {
    setExpandedPostIds((current) => {
      const next = new Set(current);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
    setReplyTarget((current) => (current?.postId === postId ? null : current));
  }, []);

  const cancelReply = useCallback((collapseThread = false) => {
    setReplyTarget((current) => {
      if (collapseThread && current) {
        setExpandedPostIds((ids) => {
          const next = new Set(ids);
          next.delete(current.postId);
          return next;
        });
      }
      return null;
    });
  }, []);

  return (
    <DashboardLayout>
      <PostsContainer>
        <PostFeed expandedPostIds={expandedPostIds} onReply={startReply} onToggleReplies={toggleReplies} />
        <PostComposer replyTarget={replyTarget} onCancelReply={cancelReply} />
      </PostsContainer>
    </DashboardLayout>
  );
}

export default Posts;
