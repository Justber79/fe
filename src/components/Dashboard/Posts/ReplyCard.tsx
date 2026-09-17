import { ConfirmationDialog } from "@/components/Dashboard/Profile/sections/shared/ConfirmationDialog";
import { useDeleteReply, useUpdateReply } from "@/hooks";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getImageUrl } from "@/utils";
import { DotsThreeOutline } from "@phosphor-icons/react";
import type { ApiPostReplyGet } from "need4deed-sdk";
import { UserRole } from "need4deed-sdk";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import PostActionMenu from "./PostActionMenu";
import {
  Avatar,
  AvatarInitials,
  ChildReplies,
  EditActions,
  EditButton,
  EditTextArea,
  PostAuthor,
  PostHeader,
  PostHeaderText,
  PostMenuButton,
  PostMenuWrapper,
  PostText,
  PostTimestamp,
  ReplyArticle,
  ReplyFooter,
} from "./styles";
import type { ReplyTarget } from "./types";

interface Props {
  reply: ApiPostReplyGet;
  childrenByParent: Map<number, ApiPostReplyGet[]>;
  onReply: (target: ReplyTarget) => void;
  nested?: boolean;
  conversationParentId?: number;
}

export function ReplyCard({ reply, childrenByParent, onReply, nested = false, conversationParentId }: Props) {
  const { t, i18n } = useTranslation();
  const currentUser = useCurrentUser(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editText, setEditText] = useState(reply.text);
  const updateReply = useUpdateReply(reply.postId, reply.id, () => setIsEditing(false));
  const deleteReply = useDeleteReply(reply.postId, reply.id, () => setIsDeleteOpen(false));
  const canManage =
    currentUser?.personId === reply.author.id ||
    currentUser?.role === UserRole.ADMIN ||
    currentUser?.role === UserRole.COORDINATOR;
  const initials = reply.author.fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name[0]?.toUpperCase())
    .join("");
  const createdAt = new Date(reply.createdAt);
  const childReplies = childrenByParent.get(reply.id) ?? [];

  const closeEdit = useCallback(() => {
    if (updateReply.isPending) return;
    setIsEditing(false);
    setEditText(reply.text);
  }, [reply.text, updateReply.isPending]);

  return (
    <ReplyArticle $nested={nested}>
      <PostHeader>
        {reply.author.avatarUrl ? (
          <Avatar src={getImageUrl(reply.author.avatarUrl)} alt="" />
        ) : (
          <AvatarInitials aria-hidden="true">{initials}</AvatarInitials>
        )}
        <PostHeaderText>
          <PostAuthor>{reply.author.fullName}</PostAuthor>
          <PostTimestamp dateTime={createdAt.toISOString()}>{createdAt.toLocaleString(i18n.language)}</PostTimestamp>
        </PostHeaderText>
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
              <DotsThreeOutline size={22} weight="fill" />
            </PostMenuButton>
            <PostActionMenu
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              onEdit={() => {
                setEditText(reply.text);
                setIsEditing(true);
                setIsMenuOpen(false);
              }}
              onDelete={() => {
                setIsMenuOpen(false);
                setIsDeleteOpen(true);
              }}
            />
          </PostMenuWrapper>
        )}
      </PostHeader>

      {isEditing ? (
        <>
          <EditTextArea value={editText} onChange={(event) => setEditText(event.target.value)} autoFocus />
          <EditActions>
            <EditButton type="button" disabled={updateReply.isPending} onClick={closeEdit}>
              {t("dashboard.posts.cancel")}
            </EditButton>
            <EditButton
              type="button"
              $primary
              disabled={!editText.trim() || updateReply.isPending}
              onClick={() => updateReply.mutate({ text: editText.trim() })}
            >
              {t("dashboard.posts.save")}
            </EditButton>
          </EditActions>
        </>
      ) : (
        <PostText>{reply.text}</PostText>
      )}

      <ReplyFooter>
        <EditButton
          type="button"
          onClick={() =>
            onReply({
              targetKey: `reply-${reply.id}`,
              postId: reply.postId,
              parentReplyId: conversationParentId ?? reply.id,
              authorName: reply.author.fullName,
              createdAt: reply.createdAt,
              text: reply.text,
            })
          }
        >
          {t("dashboard.posts.reply")}
        </EditButton>
      </ReplyFooter>

      {childReplies.length > 0 && (
        <ChildReplies>
          {childReplies.map((child) => (
            <ReplyCard
              key={child.id}
              reply={child}
              childrenByParent={childrenByParent}
              onReply={onReply}
              nested
              conversationParentId={conversationParentId ?? reply.id}
            />
          ))}
        </ChildReplies>
      )}

      {isDeleteOpen && (
        <ConfirmationDialog
          title={t("dashboard.posts.deleteReplyDialog.title")}
          message={t("dashboard.posts.deleteReplyDialog.message")}
          confirmText={t("dashboard.posts.delete")}
          cancelText={t("dashboard.posts.cancel")}
          onCancel={() => setIsDeleteOpen(false)}
          onConfirm={() => {
            if (!deleteReply.isPending) deleteReply.mutate();
          }}
          cancelDisabled={deleteReply.isPending}
          confirmDisabled={deleteReply.isPending}
          compact
        />
      )}
    </ReplyArticle>
  );
}

export default ReplyCard;
