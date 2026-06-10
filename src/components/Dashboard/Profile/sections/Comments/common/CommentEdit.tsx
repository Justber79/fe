import { useTranslation } from "react-i18next";
import {
  CommentEditButtons,
  EditCancelButton,
  EditSaveButton,
  NewCommentSection,
  TagOverlay,
  TextArea,
} from "./styles";
import { useCommentTag } from "./hooks/useCommentTag";
import { useEffect, useRef } from "react";
import Autocomplete from "./Autocomplete";

type EditState = {
  text: string;
  canSave: boolean;
  isUpdating: boolean;
  isUsersLoading: boolean;
  onTextChange: (text: string) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSave: () => void;
  onCancel: () => void;
};

type Props = {
  commentId: string | number;
  edit: EditState;
};

export function CommentEdit({ commentId, edit }: Props) {
  const { t } = useTranslation();
  const editTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const editOverlayRef = useRef<HTMLDivElement>(null);
  const {
    showAutocomplete,
    handleTagAdd,
    activeRowIndex,
    setFilteredListLength,
    setOnSelectTrigger,
    renderHighlightedText,
    setShowAutocomplete,
    convertDbTextToEditable,
    handleKeyDown,
    users,
  } = useCommentTag(edit.text, edit.onTextChange, editTextAreaRef);

  const handleScroll = () => {
    if (!editTextAreaRef?.current || !editOverlayRef?.current) return;
    editOverlayRef.current.style.transform = `translateY(-${editTextAreaRef.current.scrollTop}px)`;
  };

  useEffect(() => {
    const sanitisedText = convertDbTextToEditable(edit.text);
    edit.onTextChange(sanitisedText);
  }, [convertDbTextToEditable]);

  return (
    <>
      <NewCommentSection>
        {showAutocomplete && (
          <Autocomplete
            handleTagAdd={handleTagAdd}
            newCommentText={edit.text}
            textAreaRef={editTextAreaRef}
            activeRowIndex={activeRowIndex}
            setFilteredListLength={setFilteredListLength}
            setOnSelectTrigger={setOnSelectTrigger}
            users={users}
          />
        )}
        <TagOverlay ref={editOverlayRef}>{renderHighlightedText()}</TagOverlay>
        <TextArea
          ref={editTextAreaRef}
          value={edit.text}
          onChange={(e) => edit.onTextChange(e.target.value)}
          onKeyPress={edit.onKeyPress}
          onKeyDown={handleKeyDown}
          data-testid={`edit-comment-textarea-${commentId}`}
          onScroll={handleScroll}
          onClick={() => setShowAutocomplete(false)}
        />
      </NewCommentSection>
      <CommentEditButtons>
        <EditCancelButton onClick={edit.onCancel} data-testid={`cancel-edit-${commentId}`}>
          {t("dashboard.commentsSection.cancelEdit")}
        </EditCancelButton>
        <EditSaveButton
          onClick={edit.onSave}
          disabled={!edit.canSave || edit.isUpdating || edit.isUsersLoading}
          data-testid={`save-edit-${commentId}`}
        >
          {t("dashboard.commentsSection.saveEdit")}
        </EditSaveButton>
      </CommentEditButtons>
    </>
  );
}
