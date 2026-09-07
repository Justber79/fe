import { Paragraph } from "@/components/styled/text";
import { useGetPostReplies } from "@/hooks";
import type { ApiPostReplyGet } from "need4deed-sdk";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import ReplyCard from "./ReplyCard";
import { RepliesList, ReplyState } from "./styles";
import type { ReplyTarget } from "./types";

interface Props {
  postId: number;
  onReply: (target: ReplyTarget) => void;
}

export function RepliesThread({ postId, onReply }: Props) {
  const { t } = useTranslation();
  const { data: replies = [], isError, isLoading } = useGetPostReplies(postId, true);
  const grouped = useMemo(() => {
    const children = new Map<number, ApiPostReplyGet[]>();
    const roots: ApiPostReplyGet[] = [];

    replies.forEach((reply) => {
      if (reply.parentReplyId === null) roots.push(reply);
      else children.set(reply.parentReplyId, [...(children.get(reply.parentReplyId) ?? []), reply]);
    });

    return { children, roots };
  }, [replies]);

  if (isLoading) return <ReplyState>{t("dashboard.posts.loadingReplies")}</ReplyState>;
  if (isError)
    return (
      <ReplyState role="alert">
        <Paragraph>{t("dashboard.posts.repliesError")}</Paragraph>
      </ReplyState>
    );

  return (
    <RepliesList>
      {grouped.roots.map((reply) => (
        <ReplyCard key={reply.id} reply={reply} childReplies={grouped.children.get(reply.id) ?? []} onReply={onReply} />
      ))}
      {grouped.roots.length === 0 && <ReplyState>{t("dashboard.posts.noReplies")}</ReplyState>}
    </RepliesList>
  );
}

export default RepliesThread;
