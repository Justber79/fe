"use client";
import { EntityType } from "@/components/Dashboard/Profile/types/types";
import { useCreateComment } from "@/hooks/useCreateComment";
import { useDeleteComment } from "@/hooks/useDeleteComment";
import { useUpdateComment } from "@/hooks/useUpdateComment";
import { Id, TimedText } from "need4deed-sdk";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Comment } from "./Comment";
import { DeleteCommentDialog } from "./DeleteCommentDialog";
import { useCommentDelete } from "./hooks/useCommentDelete";
import { useCommentEdit } from "./hooks/useCommentEdit";
import { useCommentMenu } from "./hooks/useCommentMenu";
import { AddCommentButton, Container, NewCommentSection, TagOverlay, TextArea } from "./styles";
import { useCommentTag } from "./hooks/useCommentTag";
import Autocomplete from "./Autocomplete";
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { apiPathUser } from "@/config/constants";
<<<<<<< HEAD
=======
import { apiPathPerson, apiPathUser } from "@/config/constants";
>>>>>>> 9bd2fe0 (gets personId and adds them to comment POST & PATCH)
=======
import { apiPathUser } from "@/config/constants";
>>>>>>> d31340a (removes console log)
=======
import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";
=======
>>>>>>> 89ae0e4 (adds axios fetch, local loading state, and abstracts userfetch wi helper)
import { getPersonIds } from "./helpers";
>>>>>>> 7e8a5c5 (adds axios fetch, local loading state, and abstracts userfetch wi helper)

type Props = {
  entityId: Id;
  entityType: EntityType;
  comments: TimedText[];
  testId: string;
};

export function EntityComments({ entityId, entityType, comments, testId }: Props) {
  const { t } = useTranslation();
  const { mutate: createComment, isPending: isCreating } = useCreateComment(entityId, entityType);
  const [newCommentText, setNewCommentText] = useState("");
  const [isTagFetch, setIsTagFetch] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const edit = useCommentEdit();
  const deleteState = useCommentDelete();
  const menu = useCommentMenu();
  const {
    renderHighlightedText,
    showAutocomplete,
    handleTagAdd,
    tags,
    setShowAutocomplete,
    activeRowIndex,
    setFilteredListLength,
    setOnSelectTrigger,
    handleKeyDown,
    initTags,
    users,
  } = useCommentTag(newCommentText, setNewCommentText, textAreaRef);

  const { mutate: updateComment, isPending: isUpdating } = useUpdateComment(
    entityId,
    edit.editingCommentId ?? 0,
    entityType,
  );

  const { mutate: deleteComment } = useDeleteComment(entityId, deleteState.deleteCommentId ?? 0, entityType);

  const sortedComments = comments.slice().reverse();

  const handleAddComment = async () => {
    if (!newCommentText.trim()) return;

    let formattedText = newCommentText;
    const taggedUserIds: number[] = [];
    // let taggedPersonIds: number[] = [];

    tags.forEach((tag) => {
      formattedText = formattedText.replace(`@${tag.name}`, `<@${tag.id}>`);
      if (formattedText.includes(`<@${tag.id}>`) && !taggedUserIds.includes(tag.id)) {
        taggedUserIds.push(tag.id);
      }
    });

    // if (taggedUserIds.length) {
    //   const promiseArray = taggedUserIds.map(async (id) => {
    //     setIsTagFetch(true);
    //     try {
    //       const response: AxiosResponse<ApiUserGet> = await axios.get(`${apiPathUser}/${id}`);
    //       return response.data.personId;
    //     } catch (err) {
    //       console.error(err);
    //       toast.error("dashboard.commentsSection.errorTagging");
    //       return null;
    //     } finally {
    //       setIsTagFetch(false);
    //     }
    //   });
    //   const resolvedPersonIds = await Promise.all(promiseArray);
    //   taggedPersonIds = resolvedPersonIds?.filter((id): id is number => id !== null);
    // }
    const taggedPersonIds = await getPersonIds(taggedUserIds, setIsTagFetch, t);
    createComment(
      {
        text: formattedText.trim(),
        entityType,
        entityId,
        taggedPersonIds,
      },
      {
        onSuccess: () => {
          setNewCommentText("");
        },
      },
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showAutocomplete) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  const handleScroll = () => {
    if (!textAreaRef?.current || !overlayRef?.current) return;
    overlayRef.current.style.transform = `translateY(-${textAreaRef.current.scrollTop}px)`;
  };

  const handleSaveEdit = async () => {
    if (!edit.editText.trim() || !edit.editingCommentId) return;

    const currentTags = initTags(edit.editText);
    const taggedUserIds: number[] = [];
    // let taggedPersonIds: number[] = [];

    let formattedText = edit.editText;
    currentTags?.forEach((tag) => {
      formattedText = formattedText.replace(`@${tag.name}`, `<@${tag.id}>`);
      if (formattedText.includes(`<@${tag.id}>`) && !taggedUserIds.includes(tag.id)) {
        taggedUserIds.push(tag.id);
      }
    });

    // if (taggedUserIds.length) {
    //   const promiseArray = taggedUserIds.map(async (id) => {
    //     setIsTagFetch(true);
    //     try {
    //       const response: AxiosResponse<ApiUserGet> = await axios.get(`${apiPathUser}/${id}`);
    //       return response.data.personId;
    //     } catch (err) {
    //       console.error(err);
    //       toast.error("dashboard.commentsSection.errorTagging");
    //       return null;
    //     } finally {
    //       setIsTagFetch(false);
    //     }
    //   });
    //   const resolvedPersonIds = await Promise.all(promiseArray);
    //   taggedPersonIds = resolvedPersonIds?.filter((id): id is number => id !== null);
    // }
    const taggedPersonIds = await getPersonIds(taggedUserIds, setIsTagFetch, t);
    updateComment(
      { text: formattedText.trim(), taggedPersonIds },

      {
        onSuccess: () => {
          edit.cancelEdit();
        },
      },
    );
  };

  const handleConfirmDelete = () => {
    if (!deleteState.deleteCommentId) return;

    deleteComment(undefined, {
      onSuccess: () => deleteState.closeDeleteDialog(),
    });
  };

  const handleEditClick = (commentId: number, currentText: string) => {
    edit.startEdit(commentId, currentText);
    menu.closeMenu();
  };

  const handleDeleteClick = (commentId: number, authorName: string) => {
    deleteState.openDeleteDialog(commentId, authorName);
    menu.closeMenu();
  };
  return (
    <Container data-testid={testId}>
      {sortedComments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          edit={{
            isActive: edit.editingCommentId === comment.id,
            text: edit.editText,
            canSave: edit.canSave,
            isUpdating,
            isTagFetch,
            onTextChange: edit.updateEditText,
            onKeyPress: (e) => edit.handleKeyPress(e, handleSaveEdit),
            onSave: handleSaveEdit,
            onCancel: edit.cancelEdit,
          }}
          menu={{
            isOpen: menu.openMenuCommentId === comment.id,
            anchorElement: menu.menuButtonRefs.current[comment.id] ?? null,
            buttonRef: (el) => {
              menu.menuButtonRefs.current[comment.id] = el;
            },
            onToggle: (e) => {
              e.stopPropagation();
              menu.toggleMenu(comment.id);
            },
            onClose: menu.closeMenu,
            onEdit: () => handleEditClick(comment.id, comment.content),
            onDelete: () => handleDeleteClick(comment.id, comment.authorName),
          }}
        />
      ))}
      <NewCommentSection>
        {showAutocomplete && (
          <Autocomplete
            handleTagAdd={handleTagAdd}
            newCommentText={newCommentText}
            textAreaRef={textAreaRef}
            activeRowIndex={activeRowIndex}
            setFilteredListLength={setFilteredListLength}
            setOnSelectTrigger={setOnSelectTrigger}
            users={users}
          />
        )}
        <TagOverlay ref={overlayRef}>{renderHighlightedText()}</TagOverlay>
        <TextArea
          ref={textAreaRef}
          placeholder={t("dashboard.commentsSection.placeholder")}
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          onKeyPress={handleKeyPress}
          onKeyDown={handleKeyDown}
          data-testid="comment-textarea"
          onScroll={handleScroll}
          onClick={() => setShowAutocomplete(false)}
        />
      </NewCommentSection>
      <AddCommentButton
        onClick={handleAddComment}
        disabled={!newCommentText.trim() || isCreating || isTagFetch}
        data-testid="add-comment-button"
      >
        {t("dashboard.commentsSection.addComment")}
      </AddCommentButton>
      <DeleteCommentDialog
        isOpen={deleteState.deleteDialogOpen}
        authorName={deleteState.deleteAuthorName}
        onCancel={deleteState.closeDeleteDialog}
        onConfirm={handleConfirmDelete}
      />
    </Container>
  );
}
