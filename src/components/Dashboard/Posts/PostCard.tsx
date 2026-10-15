import { ConfirmationDialog } from "@/components/core/common/ConfirmationDialog";
import { apiPathUser, cacheTTL, MAX_PAGE_LIMIT } from "@/config/constants";
import { useDeletePost, useGetQuery, useTogglePostBookmark, useUpdatePost } from "@/hooks";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getImageUrl } from "@/utils";
import { BookmarkSimple, DotsThreeOutline } from "@phosphor-icons/react";
import { ApiPostGet, ApiUserGet, Lang, SortOrder, UserRole } from "need4deed-sdk";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Fragment, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import PostActionMenu from "./PostActionMenu";
import PostReactions from "./PostReactions";
import {
  Avatar,
  AvatarInitials,
  EditActions,
  EditButton,
  EditTextArea,
  FeedPost,
  OpportunityChip,
  OpportunityList,
  PostAuthor,
  PostHeaderActions,
  PostBody,
  PostHeader,
  PostHeaderText,
  PostMenuButton,
  PostMenuWrapper,
  PostText,
  PostTimestamp,
  BookmarkButton,
  PostReplyActions,
} from "./styles";
import RepliesThread from "./RepliesThread";
import { formatMentions } from "./formatMentions";
import type { ReplyTarget } from "./types";

type Props = {
  post: ApiPostGet;
  isRepliesExpanded: boolean;
  onReply: (target: ReplyTarget) => void;
  onToggleReplies: () => void;
};

const POST_MENTION_TOKEN = /(<@(?:person:|agent:)?\d+>)/g;
const EXACT_POST_MENTION_TOKEN = /^<@(person:|agent:)?(\d+)>$/;

export function PostCard({ post, isRepliesExpanded, onReply, onToggleReplies }: Props) {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang: Lang }>();
  const currentUser = useCurrentUser(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editText, setEditText] = useState(post.text);
  const updatePost = useUpdatePost(post.id, () => setIsEditing(false));
  const deletePost = useDeletePost(post.id, () => setIsDeleteOpen(false));
  const hasLegacyMentions = /<@\d+>/.test(post.text);
  const { data: users } = useGetQuery<ApiUserGet[]>({
    queryKey: ["users", "all"],
    apiPath: apiPathUser,
    params: { sortOrder: SortOrder.NewToOld, limit: MAX_PAGE_LIMIT },
    staleTime: cacheTTL,
    enabled: hasLegacyMentions,
  });
  const toggleBookmark = useTogglePostBookmark(post.id, post.bookmarked);

  const closeEdit = useCallback(() => {
    if (updatePost.isPending) return;
    setIsEditing(false);
    setEditText(post.text);
  }, [post.text, updatePost.isPending]);

  const canManage =
    currentUser?.personId === post.author.id ||
    currentUser?.role === UserRole.ADMIN ||
    currentUser?.role === UserRole.COORDINATOR;
  const createdAt = new Date(post.createdAt);
  const authorInitials = post.author.fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name[0]?.toUpperCase())
    .join("");

  const resolveTaggedPerson = useCallback(
    (mentionId: number, isPersonToken: boolean) => {
      if (isPersonToken) return post.taggedPersons.find(({ id }) => id === mentionId);

      const directPerson = post.taggedPersons.find(({ id }) => id === mentionId);
      const legacyUser = users?.find(({ id }) => id === mentionId);
      const legacyPerson = post.taggedPersons.find(({ id }) => id === legacyUser?.personId);

      if (directPerson && legacyPerson && directPerson.id !== legacyPerson.id) return undefined;
      return directPerson ?? legacyPerson;
    },
    [post.taggedPersons, users],
  );

  const resolveMentionName = useCallback(
    (match: RegExpMatchArray): string | undefined => {
      const mentionId = Number(match[2]);
      if (match[1] === "agent:") return post.taggedAgents?.find(({ id }) => id === mentionId)?.title;
      return resolveTaggedPerson(mentionId, match[1] === "person:")?.fullName;
    },
    [post.taggedAgents, resolveTaggedPerson],
  );

  const displayText = useMemo(() => {
    const parts = post.text.split(POST_MENTION_TOKEN);
    return parts.map((part, index) => {
      const match = part.match(EXACT_POST_MENTION_TOKEN);
      if (!match) return <Fragment key={`${post.id}-text-${index}`}>{part}</Fragment>;
      return (
        <strong className="tag" key={`${post.id}-tag-${index}`}>
          @{resolveMentionName(match) ?? t("dashboard.posts.unknownUser")}
        </strong>
      );
    });
  }, [post.id, post.text, resolveMentionName, t]);

  const replyContextText = useMemo(
    () =>
      post.text.replace(POST_MENTION_TOKEN, (token) => {
        const match = token.match(EXACT_POST_MENTION_TOKEN);
        if (!match) return token;
        return `@${resolveMentionName(match) ?? t("dashboard.posts.unknownUser")}`;
      }),
    [post.text, resolveMentionName, t],
  );

  const startEdit = () => {
    const editableText = post.text.replace(POST_MENTION_TOKEN, (token) => {
      const match = token.match(EXACT_POST_MENTION_TOKEN);
      if (!match) return token;
      const name = resolveMentionName(match);
      return name ? `@${name}` : token;
    });
    setEditText(editableText);
    setIsEditing(true);
    setIsMenuOpen(false);
  };

  const saveEdit = () => {
    const formatted = formatMentions(editText.trim(), [
      ...post.taggedPersons.map((person) => ({ name: person.fullName, kind: "person" as const, id: person.id })),
      ...(post.taggedAgents ?? []).map((agent) => ({ name: agent.title, kind: "agent" as const, id: agent.id })),
    ]);
    updatePost.mutate({
      text: formatted.text,
      taggedPersonIds: formatted.taggedPersonIds,
      taggedAgentIds: formatted.taggedAgentIds,
      linkedOpportunityIds: post.linkedOpportunities.map(({ id }) => id),
    });
  };

  return (
    <FeedPost>
      <PostHeader>
        {post.author.avatarUrl ? (
          <Avatar src={getImageUrl(post.author.avatarUrl)} alt="" />
        ) : (
          <AvatarInitials aria-hidden="true">{authorInitials}</AvatarInitials>
        )}
        <PostHeaderText>
          <PostAuthor>{post.author.fullName}</PostAuthor>
          <PostTimestamp dateTime={createdAt.toISOString()}>{createdAt.toLocaleString(i18n.language)}</PostTimestamp>
        </PostHeaderText>
        <PostHeaderActions>
          <BookmarkButton
            type="button"
            aria-label={t(post.bookmarked ? "dashboard.posts.removeBookmark" : "dashboard.posts.addBookmark")}
            aria-pressed={post.bookmarked}
            disabled={toggleBookmark.isPending}
            onClick={() => toggleBookmark.mutate()}
          >
            <BookmarkSimple size={24} weight={post.bookmarked ? "fill" : "regular"} />
          </BookmarkButton>
          {canManage && (
            <PostMenuWrapper>
              <PostMenuButton
                type="button"
                aria-label={t("dashboard.posts.options")}
                aria-expanded={isMenuOpen}
                onMouseDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  setIsMenuOpen((isOpen) => !isOpen);
                }}
              >
                <DotsThreeOutline size={24} weight="fill" />
              </PostMenuButton>
              <PostActionMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                onEdit={startEdit}
                onDelete={() => {
                  setIsMenuOpen(false);
                  setIsDeleteOpen(true);
                }}
              />
            </PostMenuWrapper>
          )}
        </PostHeaderActions>
      </PostHeader>

      <PostBody>
        {isEditing ? (
          <>
            <EditTextArea value={editText} onChange={(event) => setEditText(event.target.value)} autoFocus />
            <EditActions>
              <EditButton type="button" disabled={updatePost.isPending} onClick={closeEdit}>
                {t("dashboard.posts.cancel")}
              </EditButton>
              <EditButton type="button" $primary disabled={!editText.trim() || updatePost.isPending} onClick={saveEdit}>
                {t("dashboard.posts.save")}
              </EditButton>
            </EditActions>
          </>
        ) : (
          <PostText>{displayText}</PostText>
        )}

        {post.linkedOpportunities.length > 0 && (
          <OpportunityList>
            {post.linkedOpportunities.map((opportunity) => (
              <OpportunityChip
                as={Link}
                key={opportunity.id}
                href={`/${lang}/dashboard/opportunities/${opportunity.id}`}
              >
                {opportunity.title}
              </OpportunityChip>
            ))}
          </OpportunityList>
        )}
        <PostReplyActions>
          <PostReactions itemId={post.id} reactions={post.reactions} myReaction={post.myReaction} />
          {(post.replyCount > 0 || isRepliesExpanded) && (
            <EditButton type="button" onClick={onToggleReplies}>
              {t(isRepliesExpanded ? "dashboard.posts.hideReplies" : "dashboard.posts.showReplies", {
                count: post.replyCount,
              })}
            </EditButton>
          )}
          <EditButton
            type="button"
            onClick={() =>
              onReply({
                targetKey: `post-${post.id}`,
                postId: post.id,
                authorName: post.author.fullName,
                createdAt: post.createdAt,
                text: replyContextText,
              })
            }
          >
            {t("dashboard.posts.reply")}
          </EditButton>
        </PostReplyActions>
        {isRepliesExpanded && <RepliesThread postId={post.id} onReply={onReply} />}
      </PostBody>

      {isDeleteOpen && (
        <ConfirmationDialog
          title={t("dashboard.posts.deleteDialog.title")}
          message={t("dashboard.posts.deleteDialog.message")}
          confirmText={t("dashboard.posts.delete")}
          cancelText={t("dashboard.posts.cancel")}
          onCancel={() => setIsDeleteOpen(false)}
          onConfirm={() => {
            if (!deletePost.isPending) deletePost.mutate();
          }}
          cancelDisabled={deletePost.isPending}
          confirmDisabled={deletePost.isPending}
          compact
        />
      )}
    </FeedPost>
  );
}

export default PostCard;
