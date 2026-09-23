import { useClickOutside, useDeleteReaction, useSetReaction } from "@/hooks";
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
  const [pickerMode, setPickerMode] = useState<"closed" | "quick" | "full">("closed");
  const pickerRef = useRef<HTMLDivElement>(null);
  const setReaction = useSetReaction(itemId, postId);
  const deleteReaction = useDeleteReaction(itemId, postId);
  const isPending = setReaction.isPending || deleteReaction.isPending;

  const closePicker = useCallback(() => {
    setPickerMode("closed");
  }, []);
  useClickOutside(pickerRef, closePicker);

  useEffect(() => {
    if (pickerMode === "closed") return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePicker();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [closePicker, pickerMode]);

  useEffect(() => {
    if (myReaction) closePicker();
  }, [closePicker, myReaction]);

  const chooseReaction = (emoji: string) => {
    if (isPending) return;
    if (myReaction && emoji !== myReaction) return;
    if (emoji === myReaction) {
      deleteReaction.mutate();
    } else {
      setReaction.mutate({ emoji });
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
          aria-expanded={pickerMode !== "closed"}
          onClick={() => setPickerMode((mode) => (mode === "closed" ? "quick" : "closed"))}
        >
          <ReactionAddIcon aria-hidden="true">
            <Smiley size={20} />
            <ReactionAddBadge>
              <Plus size={9} weight="bold" />
            </ReactionAddBadge>
          </ReactionAddIcon>
        </ReactionTrigger>
        {pickerMode === "quick" ? (
          <ReactionMenu $align={align} role="group" aria-label={t("dashboard.posts.quickReactions")}>
            {quickReactions.map((emoji) => (
              <ReactionQuickButton
                key={emoji}
                type="button"
                $selected={myReaction === emoji}
                disabled={isPending || Boolean(myReaction && myReaction !== emoji)}
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
              disabled={isPending || Boolean(myReaction)}
              aria-label={t("dashboard.posts.moreReactions")}
              onClick={() => {
                setPickerMode("full");
              }}
            >
              <Plus size={16} weight="bold" aria-hidden />
            </ReactionQuickButton>
          </ReactionMenu>
        ) : null}
        {pickerMode === "full" ? (
          <EmojiPicker onChoose={chooseReaction} placement="reaction" align={align} anchorRef={pickerRef} />
        ) : null}
      </ReactionPickerWrapper>
    </ReactionControls>
  );
}
