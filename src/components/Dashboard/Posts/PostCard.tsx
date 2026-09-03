import { ConfirmationDialog } from "@/components/Dashboard/Profile/sections/shared/ConfirmationDialog";
import { useDeletePost, useUpdatePost } from "@/hooks";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getImageUrl } from "@/utils";
import { DotsThreeOutline } from "@phosphor-icons/react";
import { ApiPostGet, UserRole } from "need4deed-sdk";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Fragment, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import PostActionMenu from "./PostActionMenu";
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
  PostBody,
  PostHeader,
  PostHeaderText,
  PostMenuButton,
  PostMenuWrapper,
  PostText,
  PostTimestamp,
} from "./styles";

type Props = { post: ApiPostGet };

export function PostCard({ post }: Props) {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentUser = useCurrentUser(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editText, setEditText] = useState(post.text);
  const updatePost = useUpdatePost(post.id, () => setIsEditing(false));
  const deletePost = useDeletePost(post.id, () => setIsDeleteOpen(false));

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

  const displayText = useMemo(() => {
    const parts = post.text.split(/(<@\d+>)/g);
    return parts.map((part, index) => {
      const match = part.match(/^<@(\d+)>$/);
      if (!match) return <Fragment key={`${post.id}-text-${index}`}>{part}</Fragment>;
      const person = post.taggedPersons.find(({ id }) => id === Number(match[1]));
      return (
        <strong className="tag" key={`${post.id}-tag-${index}`}>
          @{person?.fullName ?? t("dashboard.posts.unknownUser")}
        </strong>
      );
    });
  }, [post.id, post.taggedPersons, post.text, t]);

  const startEdit = () => {
    const editableText = post.text.replace(/<@(\d+)>/g, (token, id) => {
      const person = post.taggedPersons.find((taggedPerson) => taggedPerson.id === Number(id));
      return person ? `@${person.fullName}` : token;
    });
    setEditText(editableText);
    setIsEditing(true);
    setIsMenuOpen(false);
  };

  const saveEdit = () => {
    let formattedText = editText.trim();
    const taggedPersonIds: number[] = [];
    [...post.taggedPersons]
      .sort((first, second) => second.fullName.length - first.fullName.length)
      .forEach((person) => {
        const escapedName = person.fullName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const mentionPattern = new RegExp(`@${escapedName}(?![\\p{L}\\p{N}_])`, "gu");
        formattedText = formattedText.replace(mentionPattern, () => {
          taggedPersonIds.push(person.id);
          return `<@${person.id}>`;
        });
      });
    updatePost.mutate({
      text: formattedText,
      taggedPersonIds: [...new Set(taggedPersonIds)],
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
