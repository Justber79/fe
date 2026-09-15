import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import { useTranslation } from "react-i18next";
import {
  EmojiCategoryButton,
  EmojiGrid,
  EmojiPickerPanel,
  ReactionEmojiPickerPanel,
  EmojiSectionLabel,
  PickerItem,
  PickerSearch,
} from "./styles";

const emojiCategories = [
  {
    icon: "😀",
    keywords: "face smile happy laugh",
    emojis: ["😀", "😃", "😄", "😁", "😊", "😂", "🙂", "😉", "😍", "🥰", "😎", "🤗"],
  },
  {
    icon: "👋",
    keywords: "people hand thumb help agree",
    emojis: ["👋", "👍", "👎", "👏", "🙏", "🤝", "💪", "🙌", "✋", "👌", "🤞", "✌️"],
  },
  {
    icon: "❤️",
    keywords: "heart love",
    emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🤍", "💖", "💗", "💓", "💕", "💝"],
  },
  {
    icon: "🎉",
    keywords: "celebrate party activity sport music success",
    emojis: ["🎉", "🎊", "🎈", "🎁", "🏆", "⚽", "🎨", "🎵", "🌟", "✨", "🔥", "✅"],
  },
  {
    icon: "🌍",
    keywords: "nature world object calendar idea announcement",
    emojis: ["🌍", "🌱", "🌻", "☀️", "🌈", "🏠", "📌", "📅", "💡", "📣", "☕", "🚲"],
  },
];

const quickEmojis = ["👍", "❤️", "😊", "😂", "👏", "🙏", "🎉", "✅"];

export default function EmojiPicker({
  onChoose,
  placement = "composer",
  align = "left",
  anchorRef,
}: {
  onChoose: (emoji: string) => void;
  placement?: "composer" | "reaction";
  align?: "left" | "right";
  anchorRef?: RefObject<HTMLDivElement | null>;
}) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(0);
  const reactionPanelRef = useRef<HTMLDivElement>(null);
  const [reactionPosition, setReactionPosition] = useState<{ left: number; top: number }>();

  useLayoutEffect(() => {
    if (placement !== "reaction") return;

    const positionPanel = () => {
      const anchor = anchorRef?.current;
      const panel = reactionPanelRef.current;
      if (!anchor || !panel) return;

      const anchorBox = anchor.getBoundingClientRect();
      const panelBox = panel.getBoundingClientRect();
      const edgeGap = 16;
      const left = Math.max(
        edgeGap,
        Math.min(
          align === "right" ? anchorBox.right - panelBox.width : anchorBox.left,
          window.innerWidth - panelBox.width - edgeGap,
        ),
      );
      const above = anchorBox.top - panelBox.height - 8;
      const below = anchorBox.bottom + 8;
      const top =
        above >= edgeGap
          ? above
          : below + panelBox.height <= window.innerHeight - edgeGap
            ? below
            : Math.max(edgeGap, Math.min(below, window.innerHeight - panelBox.height - edgeGap));

      setReactionPosition({ left, top });
    };

    positionPanel();
    const observer = new ResizeObserver(positionPanel);
    if (reactionPanelRef.current) observer.observe(reactionPanelRef.current);
    window.addEventListener("resize", positionPanel);
    window.addEventListener("scroll", positionPanel, true);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", positionPanel);
      window.removeEventListener("scroll", positionPanel, true);
    };
  }, [align, anchorRef, placement]);
  const normalizedQuery = query.trim().toLowerCase();
  const visibleEmojis = normalizedQuery
    ? emojiCategories.flatMap(({ emojis, keywords }) =>
        keywords.includes(normalizedQuery) || emojis.some((emoji) => emoji.includes(normalizedQuery)) ? emojis : [],
      )
    : emojiCategories[category].emojis;

  const pickerContent = (
    <>
      <PickerSearch
        autoFocus={placement === "reaction"}
        aria-label={t("dashboard.posts.searchEmoji")}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t("dashboard.posts.searchEmoji")}
      />
      {!query && (
        <>
          <EmojiSectionLabel>{t("dashboard.posts.quickEmoji")}</EmojiSectionLabel>
          <EmojiGrid>
            {quickEmojis.map((emoji) => (
              <PickerItem key={emoji} type="button" onClick={() => onChoose(emoji)}>
                {emoji}
              </PickerItem>
            ))}
          </EmojiGrid>
          <EmojiSectionLabel>{t("dashboard.posts.browseEmoji")}</EmojiSectionLabel>
          <EmojiGrid>
            {emojiCategories.map(({ icon }, index) => (
              <EmojiCategoryButton
                key={icon}
                type="button"
                $selected={category === index}
                onClick={() => setCategory(index)}
              >
                {icon}
              </EmojiCategoryButton>
            ))}
          </EmojiGrid>
        </>
      )}
      <EmojiGrid>
        {visibleEmojis.map((emoji) => (
          <PickerItem key={emoji} type="button" onClick={() => onChoose(emoji)}>
            {emoji}
          </PickerItem>
        ))}
      </EmojiGrid>
    </>
  );

  return placement === "reaction" ? (
    <ReactionEmojiPickerPanel ref={reactionPanelRef} $left={reactionPosition?.left} $top={reactionPosition?.top}>
      {pickerContent}
    </ReactionEmojiPickerPanel>
  ) : (
    <EmojiPickerPanel>{pickerContent}</EmojiPickerPanel>
  );
}
