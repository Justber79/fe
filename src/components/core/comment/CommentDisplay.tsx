"use client";

import { DotsThreeVertical, Pencil, Trash } from "@phosphor-icons/react";
import { useState, useRef } from "react";
import styled from "styled-components";
import useOutsideClick from "@/hooks/useOutsideClick";
import { Paragraph } from "@/components/styled/text";
import { Button } from "../button";
import { TimedText } from "need4deed-sdk";

interface CommentDisplayProps {
  comment: TimedText;
  onPatch: (commentId: string, updatedText: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
}

export function CommentDisplay({ comment, onPatch, onDelete }: CommentDisplayProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [editedText, setEditedText] = useState(comment.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOutsideClick({
    ref: dropdownRef as React.RefObject<HTMLElement>,
    handler: () => setIsDropdownOpen(false),
  });

  const handleEdit = () => {
    setIsEditMode(true);
    setIsDropdownOpen(false);
  };

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteClick = () => {
    setIsDropdownOpen(false);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    setShowDeleteDialog(false);
    setIsSubmitting(true);
    try {
      await onDelete(String(comment.id));
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
  };

  const handleSave = async () => {
    if (editedText.trim() === comment.content) {
      setIsEditMode(false);
      return;
    }

    setIsSubmitting(true);
    try {
      await onPatch(String(comment.id), editedText.trim());
      setIsEditMode(false);
    } catch (error) {
      console.error("Error updating comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditedText(comment.content);
    setIsEditMode(false);
  };

  const formatTimestamp = (timestamp: Date | string) => {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${month} ${day}, ${hours}:${minutes}`;
  };

  return (
    <CommentContainer>
      <CommentHeader>
        <UserInfo>
          <Paragraph fontWeight={600} fontSize="16px" lineheight="20px" color="var(--color-midnight)">
            {comment.authorName}
          </Paragraph>
          <Paragraph fontWeight={400} fontSize="14px" lineheight="18px" color="var(--color-grey-400)">
            {formatTimestamp(comment.timestamp)}
          </Paragraph>
        </UserInfo>
        {!isEditMode && (
          <MenuContainer ref={dropdownRef}>
            <MenuButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <DotsThreeVertical size={20} color="var(--color-grey-700)" style={{ transform: "rotate(90deg)" }} />
            </MenuButton>
            {isDropdownOpen && (
              <DropdownMenu>
                <DropdownItem onClick={handleEdit}>
                  <Pencil size={16} />
                  <span>Edit comment</span>
                </DropdownItem>
                <DropdownItem onClick={handleDeleteClick} $isDanger>
                  <Trash size={16} />
                  <span>Delete comment</span>
                </DropdownItem>
              </DropdownMenu>
            )}
          </MenuContainer>
        )}
      </CommentHeader>

      {isEditMode ? (
        <EditContainer>
          <EditTextarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            disabled={isSubmitting}
            rows={3}
          />
          <EditActions>
            <Button
              text="Cancel"
              onClick={handleCancel}
              disabled={isSubmitting}
              backgroundcolor="var(--color-white)"
              textColor="var(--color-midnight)"
              border="1px solid var(--color-midnight)"
            />
            <Button
              text="Save"
              onClick={handleSave}
              disabled={isSubmitting || editedText.trim() === ""}
              backgroundcolor="var(--color-midnight)"
              textColor="var(--color-white)"
            />
          </EditActions>
        </EditContainer>
      ) : (
        <CommentText>
          <Paragraph fontWeight={400} fontSize="16px" lineheight="24px" color="var(--color-grey-700)">
            {comment.content}
          </Paragraph>
        </CommentText>
      )}

      {showDeleteDialog && (
        <DeleteDialog>
          <DeleteDialogContent>
            <DeleteDialogTitle>Delete comment?</DeleteDialogTitle>
            <DeleteDialogText>
              {comment.authorName}&apos;s comment will be permanently deleted.
            </DeleteDialogText>
            <DeleteDialogActions>
              <Button
                text="Cancel"
                onClick={handleDeleteCancel}
                backgroundcolor="var(--color-white)"
                textColor="var(--color-midnight)"
                border="1px solid var(--color-midnight)"
              />
              <Button
                text="Delete"
                onClick={handleDeleteConfirm}
                backgroundcolor="var(--color-midnight)"
                textColor="var(--color-white)"
              />
            </DeleteDialogActions>
          </DeleteDialogContent>
        </DeleteDialog>
      )}
    </CommentContainer>
  );
}

export default CommentDisplay;

const CommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0;
  background-color: transparent;
  transition: background-color 0.2s ease;
`;

const CommentHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MenuContainer = styled.div`
  position: relative;
`;

const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--color-grey-50);
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background-color: var(--color-white);
  border-radius: 8px;
  box-shadow: var(--n4d-box-shadow);
  min-width: 120px;
  z-index: 100;
  overflow: hidden;
`;

const DropdownItem = styled.div<{ $isDanger?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  color: ${(props) => (props.$isDanger ? "var(--color-red-500)" : "var(--color-midnight)")};

  &:hover {
    background-color: var(--color-grey-50);
  }

  span {
    font-size: 14px;
    font-weight: 400;
  }
`;

const CommentText = styled.div`
  padding-top: 4px;
`;

const EditContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const EditTextarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid var(--color-grey-200);
  border-radius: 8px;
  font-size: 16px;
  font-family: "Figtree", sans-serif;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border: 2px solid var(--color-green-200);
  }

  &:disabled {
    background-color: var(--color-grey-50);
    cursor: not-allowed;
  }
`;

const EditActions = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  justify-content: flex-end;
`;

const DeleteDialog = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-dimmed-background);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const DeleteDialogContent = styled.div`
  background-color: var(--color-white);
  border-radius: var(--card-border-radius);
  padding: 24px;
  min-width: 400px;
  box-shadow: var(--n4d-box-shadow);
`;

const DeleteDialogTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: var(--color-midnight);
  margin: 0 0 12px 0;
`;

const DeleteDialogText = styled.p`
  font-size: 16px;
  color: var(--color-midnight);
  margin: 0 0 24px 0;
`;

const DeleteDialogActions = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  justify-content: flex-end;
`;

