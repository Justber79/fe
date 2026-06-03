import { useState } from "react";

type UseCommentEditReturn = {
  editingCommentId: number | null;
  editText: string;
  originalEditText: string;
  startEdit: (commentId: number, currentText: string) => void;
  cancelEdit: () => void;
  updateEditText: (text: string) => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>, onSave: () => void) => void;
  canSave: boolean;
};

export function useCommentEdit(): UseCommentEditReturn {
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [originalEditText, setOriginalEditText] = useState("");

  const startEdit = (commentId: number, currentText: string) => {
    setEditingCommentId(commentId);
    setEditText(currentText);
    setOriginalEditText(currentText);
  };

  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditText("");
    setOriginalEditText("");
  };

  const updateEditText = (text: string) => {
    setEditText(text);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>, onSave: () => void) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSave();
    }
  };

  const canSave = editText.trim() !== "" && editText !== originalEditText;

  return {
    editingCommentId,
    editText,
    originalEditText,
    startEdit,
    cancelEdit,
    updateEditText,
    handleKeyPress,
    canSave,
  };
}
