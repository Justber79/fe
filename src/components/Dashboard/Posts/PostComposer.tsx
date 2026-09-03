import Autocomplete from "@/components/Dashboard/Profile/sections/Comments/common/Autocomplete";
import { useCommentTag } from "@/components/Dashboard/Profile/sections/Comments/common/hooks/useCommentTag";
import { apiPathOpportunity, MAX_PAGE_LIMIT } from "@/config/constants";
import { useCreatePost, useGetQuery } from "@/hooks";
import { ApiOpportunityGetList } from "need4deed-sdk";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import EmojiPicker from "./EmojiPicker";
import {
  Composer,
  ComposerActions,
  ComposerButton,
  ComposerTextArea,
  OpportunityChip,
  OpportunityList,
  OpportunityPickerPanel,
  PickerItem,
  PickerEmpty,
  PickerResults,
  PickerSearch,
} from "./styles";

export default function PostComposer() {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [selected, setSelected] = useState<ApiOpportunityGetList[]>([]);
  const [opportunityOpen, setOpportunityOpen] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [query, setQuery] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const composerRef = useRef<HTMLDivElement>(null);
  const mention = useCommentTag(text, setText, textareaRef);
  const { setShowAutocomplete } = mention;
  const { data: opportunities } = useGetQuery<ApiOpportunityGetList[]>({
    queryKey: ["post-composer-opportunities"],
    apiPath: `${apiPathOpportunity}/`,
    params: { page: 1, limit: MAX_PAGE_LIMIT },
  });
  const reset = () => {
    setText("");
    setSelected([]);
  };
  const createPost = useCreatePost(reset);
  const closeOpportunityPicker = useCallback(() => {
    setOpportunityOpen(false);
    setQuery("");
  }, []);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!composerRef.current?.contains(event.target as Node)) {
        closeOpportunityPicker();
        setEmojiOpen(false);
        setShowAutocomplete(false);
      }
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeOpportunityPicker();
        setEmojiOpen(false);
        setShowAutocomplete(false);
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", escape);
    };
  }, [closeOpportunityPicker, setShowAutocomplete]);

  const insertAtCursor = useCallback(
    (value: string) => {
      const cursor = textareaRef.current?.selectionStart ?? text.length;
      setText((current) => `${current.slice(0, cursor)}${value}${current.slice(cursor)}`);
      requestAnimationFrame(() => {
        textareaRef.current?.focus();
        textareaRef.current?.setSelectionRange(cursor + value.length, cursor + value.length);
      });
    },
    [text.length],
  );
  const selectAll = useCallback(() => {
    const cursor = textareaRef.current?.selectionStart ?? text.length;
    const start = text.slice(0, cursor).lastIndexOf("@");
    setText(`${text.slice(0, start)}@all ${text.slice(cursor)}`);
    setShowAutocomplete(false);
  }, [setShowAutocomplete, text]);
  const filtered = useMemo(
    () => (opportunities ?? []).filter((item) => item.title.toLowerCase().includes(query.toLowerCase())),
    [opportunities, query],
  );
  const submit = () => {
    let formatted = text.trim();
    const activeTags = mention.tags.filter((tag) => formatted.includes(`@${tag.name}`));
    activeTags.forEach((tag) => {
      formatted = formatted.replaceAll(`@${tag.name}`, `<@${tag.id}>`);
    });
    const taggedPersonIds = [...new Set(activeTags.map((tag) => tag.personId))];
    if (formatted.includes("@all"))
      mention.users?.forEach((user) => {
        if (user.personId) taggedPersonIds.push(user.personId);
      });
    createPost.mutate({
      text: formatted,
      taggedPersonIds: [...new Set(taggedPersonIds)],
      linkedOpportunityIds: selected.map(({ id }) => Number(id)),
    });
  };

  return (
    <Composer ref={composerRef}>
      {mention.showAutocomplete && (
        <Autocomplete
          {...mention}
          newCommentText={text}
          textAreaRef={textareaRef}
          users={mention.users}
          onSelectAll={selectAll}
          allLabel={t("dashboard.posts.everyone")}
        />
      )}
      <ComposerTextArea
        ref={textareaRef}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          closeOpportunityPicker();
          setEmojiOpen(false);
        }}
        onKeyDown={mention.handleKeyDown}
        placeholder={t("dashboard.posts.inputPlaceholder")}
      />
      {selected.length > 0 && (
        <OpportunityList>
          {selected.map((item) => (
            <OpportunityChip
              as="button"
              key={String(item.id)}
              type="button"
              aria-label={`${t("dashboard.posts.removeOpportunity")}: ${item.title}`}
              onClick={() => setSelected((all) => all.filter(({ id }) => id !== item.id))}
            >
              {item.title} ×
            </OpportunityChip>
          ))}
        </OpportunityList>
      )}
      <ComposerActions>
        <ComposerButton
          type="button"
          aria-expanded={opportunityOpen}
          onClick={() => {
            setOpportunityOpen((open) => !open);
            setEmojiOpen(false);
            setShowAutocomplete(false);
          }}
        >
          {t("dashboard.posts.linkOpportunity")}
        </ComposerButton>
        <ComposerButton
          type="button"
          aria-label={t("dashboard.posts.addEmoji")}
          aria-expanded={emojiOpen}
          onClick={() => {
            setEmojiOpen((open) => !open);
            closeOpportunityPicker();
            setShowAutocomplete(false);
          }}
        >
          😊
        </ComposerButton>
        <ComposerButton type="button" $primary disabled={!text.trim() || createPost.isPending} onClick={submit}>
          {t("dashboard.posts.send")}
        </ComposerButton>
      </ComposerActions>
      {opportunityOpen && (
        <OpportunityPickerPanel>
          <PickerSearch
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("dashboard.posts.searchOpportunities")}
          />
          <PickerResults>
            {filtered.map((item) => (
              <PickerItem
                key={String(item.id)}
                type="button"
                aria-pressed={selected.some(({ id }) => id === item.id)}
                onClick={() =>
                  setSelected((all) =>
                    all.some(({ id }) => id === item.id) ? all.filter(({ id }) => id !== item.id) : [...all, item],
                  )
                }
              >
                {item.title}
                {selected.some(({ id }) => id === item.id) ? " ✓" : ""}
              </PickerItem>
            ))}
            {filtered.length === 0 && <PickerEmpty>{t("dashboard.posts.noOpportunities")}</PickerEmpty>}
          </PickerResults>
          <ComposerButton type="button" $primary onClick={closeOpportunityPicker}>
            {t("dashboard.posts.done")}
          </ComposerButton>
        </OpportunityPickerPanel>
      )}
      {emojiOpen && (
        <EmojiPicker
          onChoose={(emoji) => {
            insertAtCursor(emoji);
            setEmojiOpen(false);
          }}
        />
      )}
    </Composer>
  );
}
