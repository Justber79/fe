import { apiPathUser, cacheTTL } from "@/config/constants";
import { useGetQuery } from "@/hooks";
import { ApiUserGet, SortOrder } from "need4deed-sdk";
import { useState, useCallback, useEffect } from "react";

export function useCommentTag(
  value: string,
  setNewCommentText?: React.Dispatch<React.SetStateAction<string>>,
  textAreaRef?: React.RefObject<HTMLTextAreaElement | null> | null,
) {
  const [tags, setTags] = useState<{ id: number; name: string }[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [activeRowIndex, setActiveRowIndex] = useState(0);
  const [filteredListLength, setFilteredListLength] = useState(0);
  const [onSelectTrigger, setOnSelectTrigger] = useState<(() => void) | null>(null);

  const { data: users } = useGetQuery<ApiUserGet[]>({
    queryKey: ["users"],
    apiPath: apiPathUser,
    params: {
      sortOrder: SortOrder.NewToOld,
    },
    staleTime: cacheTTL,
    enabled: !!setNewCommentText,
  });

  useEffect(() => {
    setActiveRowIndex(0);
  }, [value]);

  const renderHighlightedText = useCallback(() => {
    if (!value) return null;

    const regexTag = /(<@\d+>)|((?<=^|\s)@[\w\s]+?)(?=\s|$)/g;
    const matches = Array.from(value.matchAll(regexTag));

    if (matches.length === 0) return value;
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    matches.forEach((match, idx) => {
      const matchString = match[0];
      const matchIndex = match.index ?? 0;

      if (matchIndex > lastIndex) {
        elements.push(value.substring(lastIndex, matchIndex));
      }

      const confirmedTag = tags?.find((t) => `@${t.name}` === matchString);

      if (confirmedTag) {
        elements.push(
          <span key={`tag-${confirmedTag.id}-${idx}`} className="tag">
            {matchString}
          </span>,
        );
      } else if (matchString.startsWith("<@") && matchString.endsWith(">")) {
        const userId = matchString.replace(/[<@>]/g, "");
        const user = users?.find((u) => u.id === Number(userId));
        elements.push(
          <span key={`db-tag-${userId}-${idx}`} className="tag">
            {`@${user?.fullName.replace(" ", "") || "user"}`}
          </span>,
        );
      } else {
        elements.push(matchString);
      }

      lastIndex = matchIndex + matchString.length;
    });

    if (lastIndex < value.length) {
      elements.push(value.substring(lastIndex));
    }

    return elements;
  }, [value, tags, users]);

  const handleTagAdd = (userId: number, fullName: string) => {
    if (!value || !textAreaRef?.current) return null;
    const cursorPosition = textAreaRef.current.selectionStart;
    const textBeforeCaret = value.substring(0, cursorPosition);
    const textAfterCaret = value.substring(cursorPosition);
    const lastAtIndex = textBeforeCaret.lastIndexOf("@");

    const newText = textBeforeCaret.substring(0, lastAtIndex) + `@${fullName} ` + textAfterCaret;
    setNewCommentText?.(newText);
    setTags((prev) => [...prev, { id: userId, name: fullName }]);
    setShowAutocomplete(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showAutocomplete || filteredListLength === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveRowIndex((prev) => (prev + 1) % filteredListLength);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveRowIndex((prev) => (prev - 1 + filteredListLength) % filteredListLength);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (onSelectTrigger) onSelectTrigger();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setShowAutocomplete(false);
    }
  };

  useEffect(() => {
    if (!textAreaRef?.current) return;

    const el = textAreaRef.current;
    const cursorPosition = el.selectionStart;

    const textBeforeCaret = value.substring(0, cursorPosition);
    const lastAtIndex = textBeforeCaret.lastIndexOf("@");

    if (lastAtIndex === -1) {
      setShowAutocomplete(false);
      return;
    }

    const charBeforeAt = lastAtIndex > 0 ? value.charAt(lastAtIndex - 1) : " ";
    const isValidBefore = charBeforeAt === " " || charBeforeAt === "\n";

    const textAfterAt = textBeforeCaret.substring(lastAtIndex + 1);
    const isValidAfter = !textAfterAt.includes(" ");

    const charAfterCursor = value.charAt(cursorPosition);
    const isValidContext = charAfterCursor === "" || charAfterCursor === " " || charAfterCursor === "\n";

    if (isValidBefore && isValidAfter && isValidContext) {
      setShowAutocomplete(true);
    } else {
      setShowAutocomplete(false);
    }
  }, [value, textAreaRef]);

  return {
    renderHighlightedText,
    showAutocomplete,
    setShowAutocomplete,
    handleTagAdd,
    tags,
    activeRowIndex,
    setFilteredListLength,
    setOnSelectTrigger,
    handleKeyDown,
  };
}
