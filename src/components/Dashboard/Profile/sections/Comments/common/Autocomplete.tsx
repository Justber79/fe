import React, { useLayoutEffect, useMemo, useState } from "react";
import { AutocompleteContainer, AutocompleteRow } from "./styles";
import { ApiUserGet, SortOrder, UserRole } from "need4deed-sdk";
import { useGetQuery } from "@/hooks";
import { apiPathUser, cacheTTL, defaultAvatarVolunteerProfile } from "@/config/constants";
import { AvatarImg } from "../../OpportunityVolunteers/styles";
import { getImageUrl } from "@/utils";
import getCaretCoordinates from "textarea-caret";

type Props = {
  handleTagAdd: (userId: number, username: string) => void;
  newCommentText: string;
  textAreaRef: React.RefObject<HTMLTextAreaElement | null>;
};

export default function Autocomplete({ handleTagAdd, newCommentText, textAreaRef }: Props) {
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const userFilter = useMemo(() => {
    if (!newCommentText || !textAreaRef?.current) return "";
    const cursorPosition = textAreaRef?.current.selectionStart;
    const textBeforeCaret = newCommentText.substring(0, cursorPosition);
    if (newCommentText[0] !== "@" && newCommentText.length > 1 && !textBeforeCaret.includes(" @")) return null;
    const lastAtIndex = textBeforeCaret.lastIndexOf("@");
    if (lastAtIndex === -1) return "";
    const textAfterAt = textBeforeCaret.substring(lastAtIndex + 1);
    if (textAfterAt.includes(" ")) return null;
    return textAfterAt.toLowerCase();
  }, [newCommentText, textAreaRef]);

  const { data: users } = useGetQuery<ApiUserGet[]>({
    queryKey: ["users"],
    apiPath: apiPathUser,
    params: {
      sortOrder: SortOrder.NewToOld,
    },
    enabled: userFilter !== null,
    staleTime: cacheTTL,
  });

  const filteredUsers = useMemo(() => {
    if (userFilter === null) return;
    return users
      ?.filter((user) => user.role === UserRole.COORDINATOR)
      ?.map((user) => {
        return {
          id: user.id,
          fullName: user.fullName,
          firstName: user.firstName,
          avatarUrl: user.avatarUrl,
        };
      })
      ?.filter((user) => user?.fullName?.toLowerCase().includes(userFilter));
  }, [userFilter, users]);

  const handleUserSelect = (userId: number, firstName: string) => {
    handleTagAdd(userId, firstName);
  };

  const resolvedAvatarUrl = (url: string) => {
    return getImageUrl(url || defaultAvatarVolunteerProfile);
  };

  useLayoutEffect(() => {
    const el = textAreaRef?.current;
    if (!el && !userFilter) return;
    const textBeforeCaret = userFilter?.substring(0, el?.selectionStart);
    const lastAtIndex = textBeforeCaret?.lastIndexOf("@");

    if (!el) return;
    const positioningIndex = lastAtIndex !== -1 ? lastAtIndex : el.selectionStart;

    const caret = getCaretCoordinates(el, positioningIndex ?? 0);

    setCoords({
      top: caret.top + 20 - el?.scrollTop,
      left: caret.left - el?.scrollLeft,
    });
  }, [userFilter, textAreaRef]);

  return (
    filteredUsers &&
    filteredUsers.length > 0 && (
      <AutocompleteContainer
        style={{
          top: `${coords.top}px`,
          left: `${coords.left}px`,
        }}
      >
        {filteredUsers?.map((user) => (
          <AutocompleteRow key={user.id} onClick={() => handleUserSelect(user.id, user.firstName)}>
            <AvatarImg src={resolvedAvatarUrl(user.avatarUrl)} alt={user.firstName} />
            <AutocompleteRow>{user.fullName}</AutocompleteRow>
          </AutocompleteRow>
        ))}
      </AutocompleteContainer>
    )
  );
}
