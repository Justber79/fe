import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  EmojiCategoryButton,
  EmojiGrid,
  EmojiPickerPanel,
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

export default function EmojiPicker({ onChoose }: { onChoose: (emoji: string) => void }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(0);
  const normalizedQuery = query.trim().toLowerCase();
  const visibleEmojis = normalizedQuery
    ? emojiCategories.flatMap(({ emojis, keywords }) =>
        keywords.includes(normalizedQuery) || emojis.some((emoji) => emoji.includes(normalizedQuery)) ? emojis : [],
      )
    : emojiCategories[category].emojis;

  return (
    <EmojiPickerPanel>
      <PickerSearch
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
    </EmojiPickerPanel>
  );
}
