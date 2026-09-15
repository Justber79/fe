import { useState } from "react";
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
}: {
  onChoose: (emoji: string) => void;
  placement?: "composer" | "reaction";
  align?: "left" | "right";
}) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(0);
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
    <ReactionEmojiPickerPanel $align={align}>{pickerContent}</ReactionEmojiPickerPanel>
  ) : (
    <EmojiPickerPanel>{pickerContent}</EmojiPickerPanel>
  );
}
