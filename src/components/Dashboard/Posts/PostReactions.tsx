import {
  useClickOutside,
  useDeletePostReaction,
  useDeleteReplyReaction,
  useSetPostReaction,
  useSetReplyReaction,
} from "@/hooks";
import { Plus, Smiley } from "@phosphor-icons/react";
import type { ApiPostReactionSummary } from "need4deed-sdk";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import EmojiPicker from "./EmojiPicker";
import {
  ReactionControls,
  ReactionAddBadge,
  ReactionAddIcon,
  ReactionMenu,
  ReactionPickerWrapper,
  ReactionPill,
  ReactionQuickButton,
  ReactionSummary,
  ReactionTrigger,
} from "./styles";

const quickReactions = ["👍", "❤️", "😂", "😮", "😢", "🙌"];

type Props = {
  itemId: number;
  myReaction: string | null;
  reactions: ApiPostReactionSummary[];
  postId?: number;
  align?: "left" | "right";
};

export default function PostReactions({ itemId, myReaction, reactions, postId, align = "left" }: Props) {
  const { t } = useTranslation();
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const [isFullPickerOpen, setIsFullPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const isReply = postId !== undefined;
  const setPostReaction = useSetPostReaction(itemId);
  const deletePostReaction = useDeletePostReaction(itemId);
  const setReplyReaction = useSetReplyReaction(postId ?? itemId, itemId);
  const deleteReplyReaction = useDeleteReplyReaction(postId ?? itemId, itemId);
  const isPending = isReply
    ? setReplyReaction.isPending || deleteReplyReaction.isPending
    : setPostReaction.isPending || deletePostReaction.isPending;

  const closePicker = useCallback(() => {
    setIsQuickMenuOpen(false);
    setIsFullPickerOpen(false);
  }, []);
  useClickOutside(pickerRef, closePicker);

  useEffect(() => {
    if (!isQuickMenuOpen && !isFullPickerOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePicker();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [closePicker, isFullPickerOpen, isQuickMenuOpen]);

  useEffect(() => {
    if (myReaction) closePicker();
  }, [closePicker, myReaction]);

  const chooseReaction = (emoji: string) => {
    if (isPending) return;
    if (myReaction && emoji !== myReaction) return;
    if (emoji === myReaction) {
      if (isReply) deleteReplyReaction.mutate();
      else deletePostReaction.mutate();
    } else if (isReply) {
      setReplyReaction.mutate({ emoji });
    } else {
      setPostReaction.mutate({ emoji });
    }
    closePicker();
  };

  return (
    <ReactionControls role="group" aria-label={t("dashboard.posts.reactions")}>
      {reactions.length > 0 && (
        <ReactionSummary>
          {reactions.map(({ emoji, count }) => (
            <ReactionPill
              key={emoji}
              type="button"
              $selected={myReaction === emoji}
              disabled={isPending || Boolean(myReaction && myReaction !== emoji)}
              aria-pressed={myReaction === emoji}
              aria-label={t("dashboard.posts.reactionCount", { emoji, count })}
              title={myReaction && myReaction !== emoji ? t("dashboard.posts.removeReactionFirst") : undefined}
              onClick={() => chooseReaction(emoji)}
            >
              <span aria-hidden="true">{emoji}</span>
              <span>{count}</span>
            </ReactionPill>
          ))}
        </ReactionSummary>
      )}
      <ReactionPickerWrapper ref={pickerRef}>
        <ReactionTrigger
          type="button"
          $selected={false}
          disabled={isPending || Boolean(myReaction)}
          aria-label={t("dashboard.posts.chooseReaction")}
          title={myReaction ? t("dashboard.posts.removeReactionFirst") : undefined}
          aria-expanded={isQuickMenuOpen || isFullPickerOpen}
          onClick={() => {
            setIsQuickMenuOpen((isOpen) => !isOpen);
            setIsFullPickerOpen(false);
          }}
        >
          <ReactionAddIcon aria-hidden="true">
            <Smiley size={20} />
            <ReactionAddBadge>
              <Plus size={9} weight="bold" />
            </ReactionAddBadge>
          </ReactionAddIcon>
        </ReactionTrigger>
        {isQuickMenuOpen ? (
          <ReactionMenu $align={align} role="group" aria-label={t("dashboard.posts.quickReactions")}>
            {quickReactions.map((emoji) => (
              <ReactionQuickButton
                key={emoji}
                type="button"
                $selected={myReaction === emoji}
                disabled={isPending}
                aria-pressed={myReaction === emoji}
                aria-label={t(myReaction === emoji ? "dashboard.posts.removeReaction" : "dashboard.posts.addReaction", {
                  emoji,
                })}
                onClick={() => chooseReaction(emoji)}
              >
                <span aria-hidden="true">{emoji}</span>
              </ReactionQuickButton>
            ))}
            <ReactionQuickButton
              type="button"
              $selected={false}
              aria-label={t("dashboard.posts.moreReactions")}
              onClick={() => {
                setIsQuickMenuOpen(false);
                setIsFullPickerOpen(true);
              }}
            >
              <Plus size={16} weight="bold" aria-hidden />
            </ReactionQuickButton>
          </ReactionMenu>
        ) : null}
        {isFullPickerOpen ? <EmojiPicker onChoose={chooseReaction} placement="reaction" align={align} /> : null}
      </ReactionPickerWrapper>
    </ReactionControls>
  );
}
