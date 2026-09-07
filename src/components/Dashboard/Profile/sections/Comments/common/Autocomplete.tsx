import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AutocompleteContainer, AutocompleteRow } from "./styles";
import { ApiUserGet } from "need4deed-sdk";
import { defaultAvatarVolunteerProfile } from "@/config/constants";
import { AvatarImg } from "../../OpportunityVolunteers/styles";
import { getImageUrl } from "@/utils";
import getCaretCoordinates from "textarea-caret";

// personId is not yet in ApiUserGet SDK type — cast until SDK is updated
type ApiUserGetWithPersonId = ApiUserGet & { personId?: number };

type Props = {
  handleTagAdd: (userId: number, fullName: string, personId: number) => void;
  newCommentText: string;
  textAreaRef: React.RefObject<HTMLTextAreaElement | null>;
  activeRowIndex: number;
  setFilteredListLength: (length: number) => void;
  setOnSelectTrigger: (callback: (() => void) | null) => void;
  users?: ApiUserGetWithPersonId[] | undefined;
  onSelectAll?: () => void;
  allLabel?: string;
};

export default function Autocomplete({
  handleTagAdd,
  newCommentText,
  textAreaRef,
  activeRowIndex,
  setFilteredListLength,
  setOnSelectTrigger,
  users,
  onSelectAll,
  allLabel = "Everyone",
}: Props) {
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const userFilter = useMemo(() => {
    if (!newCommentText || !textAreaRef?.current) return "";
    const cursorPosition = textAreaRef?.current.selectionStart;
    const textBeforeCaret = newCommentText.substring(0, cursorPosition);
    const lastAtIndex = textBeforeCaret.lastIndexOf("@");
    if (lastAtIndex === -1) return null;
    if (lastAtIndex > 0 && !/\s/.test(textBeforeCaret[lastAtIndex - 1])) return null;
    const textAfterAt = textBeforeCaret.substring(lastAtIndex + 1);
    if (/\s/.test(textAfterAt)) return null;
    return textAfterAt.toLowerCase();
  }, [newCommentText, textAreaRef]);

  const filteredUsers = useMemo(() => {
    if (userFilter === null) return;
    return users?.filter((user) => user?.fullName?.toLowerCase().includes(userFilter) && user?.personId != null);
  }, [userFilter, users]);
  const showAll = !!onSelectAll && userFilter !== null && "all".startsWith(userFilter);

  useEffect(() => {
    if (!filteredUsers) return;
    setFilteredListLength(filteredUsers.length + (showAll ? 1 : 0));
    return () => setFilteredListLength(0);
  }, [filteredUsers, setFilteredListLength, showAll]);

  useEffect(() => {
    if (!filteredUsers) return;
    if (showAll && activeRowIndex === 0) {
      setOnSelectTrigger(() => onSelectAll ?? null);
      return () => setOnSelectTrigger(null);
    }
    const activeUser = filteredUsers[activeRowIndex - (showAll ? 1 : 0)];
    if (activeUser) {
      setOnSelectTrigger(() => () => {
        if (activeUser.personId == null) return;
        handleTagAdd(activeUser.id, activeUser.fullName.replaceAll(/ /g, ""), activeUser.personId);
      });
    } else {
      setOnSelectTrigger(null);
    }
    return () => setOnSelectTrigger(null);
  }, [filteredUsers, activeRowIndex, setOnSelectTrigger, showAll, onSelectAll, handleTagAdd]);

  useEffect(() => {
    if (!containerRef.current || filteredUsers?.length === 0) return;

    const container = containerRef.current;

    const activeChild = container.children[activeRowIndex] as HTMLElement;

    if (!activeChild) return;

    const containerTop = container.scrollTop;
    const containerBottom = containerTop + container.clientHeight;
    const elemTop = activeChild.offsetTop;
    const elemBottom = elemTop + activeChild.offsetHeight;

    if (elemBottom > containerBottom) {
      container.scrollTop = elemBottom - container.clientHeight;
    } else if (elemTop < containerTop) {
      container.scrollTop = elemTop;
    }
  }, [activeRowIndex, filteredUsers]);

  const handleUserSelect = (userId: number, fullName: string, personId: number) => {
    handleTagAdd(userId, fullName.replaceAll(/ /g, ""), personId);
  };

  const resolvedAvatarUrl = (url: string | null | undefined) => {
    return getImageUrl(url || defaultAvatarVolunteerProfile);
  };

  useLayoutEffect(() => {
    const el = textAreaRef?.current;
    if (!el || userFilter === null) return;
    const textBeforeCaret = el.value.substring(0, el.selectionStart);
    const lastAtIndex = textBeforeCaret?.lastIndexOf("@");

    const positioningIndex = lastAtIndex !== -1 ? lastAtIndex : el.selectionStart;

    const caret = getCaretCoordinates(el, positioningIndex ?? 0);

    setCoords({
      top: caret.top + 20 - el?.scrollTop,
      left: caret.left - el?.scrollLeft,
    });
  }, [userFilter, textAreaRef]);

  return (
    filteredUsers &&
    (filteredUsers.length > 0 || showAll) && (
      <AutocompleteContainer
        ref={containerRef}
        role="listbox"
        aria-label="User mentions options"
        style={{
          top: `${coords.top}px`,
          left: `${coords.left}px`,
        }}
      >
        {showAll && (
          <AutocompleteRow
            role="option"
            aria-selected={activeRowIndex === 0}
            onClick={onSelectAll}
            style={{
              backgroundColor: activeRowIndex === 0 ? "var(--editableField-optionRow-selectedBg)" : "transparent",
              cursor: "pointer",
            }}
          >
            <strong>@all</strong>
            <span>{allLabel}</span>
          </AutocompleteRow>
        )}
        {filteredUsers?.map((user, index) => {
          const isActive = index + (showAll ? 1 : 0) === activeRowIndex;

          return (
            <AutocompleteRow
              key={user.id}
              role="option"
              aria-selected={isActive}
              onClick={() => {
                if (user.personId == null) return;
                handleUserSelect(user.id, user.fullName, user.personId);
              }}
              style={{
                backgroundColor: isActive ? "var(--editableField-optionRow-selectedBg)" : "transparent",
                cursor: "pointer",
              }}
            >
              <AvatarImg src={resolvedAvatarUrl(user?.avatarUrl as string)} alt={user.fullName} />
              <span>{user.fullName}</span>
            </AutocompleteRow>
          );
        })}
      </AutocompleteContainer>
    )
  );
}
