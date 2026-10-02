"use client";

import { useState } from "react";
import styled from "styled-components";
import { Button } from "../button";

interface AddCommentProps {
  onSubmit: (text: string) => Promise<void>;
  placeholder?: string;
}

export function AddComment({ onSubmit, placeholder = "Comment" }: AddCommentProps) {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() === "" || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(text.trim());
      setText("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AddCommentContainer>
      <AddCommentForm onSubmit={handleSubmit}>
        <CommentTextarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          disabled={isSubmitting}
          rows={3}
        />
        <SubmitButton>
          <Button
            text="Add comment"
            type="submit"
            disabled={isSubmitting || text.trim() === ""}
            backgroundcolor={text.trim() === "" ? "var(--color-grey-50)" : "var(--color-midnight)"}
            textColor={text.trim() === "" ? "var(--color-grey-500)" : "var(--color-white)"}
          />
        </SubmitButton>
      </AddCommentForm>
    </AddCommentContainer>
  );
}

export default AddComment;

const AddCommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0;
`;

const AddCommentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CommentTextarea = styled.textarea`
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

  &::placeholder {
    color: var(--color-grey-400);
  }
`;

const SubmitButton = styled.div`
  display: flex;
  justify-content: flex-end;
`;
