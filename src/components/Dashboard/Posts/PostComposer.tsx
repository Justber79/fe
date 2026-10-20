import Autocomplete from "@/components/Dashboard/Profile/sections/Comments/common/Autocomplete";
import { useCommentTag } from "@/components/Dashboard/Profile/sections/Comments/common/hooks/useCommentTag";
import { apiPathOpportunity, cacheTTL, MAX_PAGE_LIMIT } from "@/config/constants";
import { useClickOutside, useCreatePost, useCreateReply, useGetQuery } from "@/hooks";
import { useAgentTagCandidates } from "@/hooks/useAgentTagCandidates";
import { ApiAgentTagCandidate, ApiOpportunityGetList } from "need4deed-sdk";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import EmojiPicker from "./EmojiPicker";
import { formatMentions } from "./formatMentions";
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
  ReplyContext,
  ReplyContextClose,
} from "./styles";
import type { ReplyTarget } from "./types";

interface Props {
  replyTarget: ReplyTarget | null;
  onCancelReply: (collapseThread?: boolean) => void;
}

export default function PostComposer({ replyTarget, onCancelReply }: Props) {
  const { t, i18n } = useTranslation();
  const [text, setText] = useState("");
  const [selected, setSelected] = useState<ApiOpportunityGetList[]>([]);
  const [opportunityOpen, setOpportunityOpen] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [agentPickerOpen, setAgentPickerOpen] = useState(false);
  const [agentQuery, setAgentQuery] = useState("");
  const [taggedAgents, setTaggedAgents] = useState<ApiAgentTagCandidate[]>([]);
  const agentCandidates = useAgentTagCandidates(agentQuery, agentPickerOpen);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const composerRef = useRef<HTMLDivElement>(null);
  const replyTargetRef = useRef(replyTarget);
  const previousReplyTargetKeyRef = useRef(replyTarget?.targetKey);
  replyTargetRef.current = replyTarget;
  const mention = useCommentTag(text, setText, textareaRef, null);
  const { resetTags, setShowAutocomplete } = mention;
  const { data: opportunities } = useGetQuery<ApiOpportunityGetList[]>({
    queryKey: ["post-composer-opportunities"],
    apiPath: `${apiPathOpportunity}/`,
    params: { page: 1, limit: MAX_PAGE_LIMIT },
    staleTime: cacheTTL,
    enabled: opportunityOpen,
  });
  const reset = () => {
    setText("");
    setSelected([]);
    setTaggedAgents([]);
    resetTags();
  };
  const cancelReplyMode = useCallback(
    (collapseThread = false) => {
      setText("");
      setSelected([]);
      resetTags();
      onCancelReply(collapseThread);
    },
    [onCancelReply, resetTags],
  );
  const createPost = useCreatePost(reset);
  const createReply = useCreateReply(replyTarget?.postId ?? 0);
  const closeOpportunityPicker = useCallback(() => {
    setOpportunityOpen(false);
    setQuery("");
  }, []);

  const closeAgentPicker = useCallback(() => {
    setAgentPickerOpen(false);
    setAgentQuery("");
  }, []);

  const closePickers = useCallback(() => {
    closeOpportunityPicker();
    closeAgentPicker();
    setEmojiOpen(false);
    setShowAutocomplete(false);
  }, [closeAgentPicker, closeOpportunityPicker, setShowAutocomplete]);

  useClickOutside(composerRef, closePickers);

  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePickers();
        if (replyTarget) cancelReplyMode(true);
      }
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [cancelReplyMode, closePickers, replyTarget]);

  const replyTargetKey = replyTarget?.targetKey;

  useEffect(() => {
    const wasReplying = Boolean(previousReplyTargetKeyRef.current);

    if (replyTargetKey || wasReplying) {
      setText("");
      setSelected([]);
      setOpportunityOpen(false);
      setQuery("");
      resetTags();
    }
    if (replyTargetKey) textareaRef.current?.focus();

    previousReplyTargetKeyRef.current = replyTargetKey;
  }, [replyTargetKey, resetTags]);

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
    if (!replyTarget && previousReplyTargetKeyRef.current) return;

    if (replyTarget) {
      const submittedTargetKey = replyTarget.targetKey;
      createReply.mutate(
        {
          postId: replyTarget.postId,
          parentReplyId: replyTarget.parentReplyId,
          text: text.trim(),
        },
        {
          onSuccess: () => {
            if (replyTargetRef.current?.targetKey !== submittedTargetKey) return;
            reset();
            onCancelReply(false);
          },
        },
      );
      return;
    }

    const formatted = formatMentions(text.trim(), [
      ...mention.tags.map((tag) => ({ name: tag.name, kind: "person" as const, id: tag.personId })),
      ...taggedAgents.map((agent) => ({ name: agent.title, kind: "agent" as const, id: agent.id })),
    ]);
    const taggedPersonIds = [...formatted.taggedPersonIds];
    if (/(^|\s)@all(?![\p{L}\p{N}_])/u.test(formatted.text))
      mention.users?.forEach((user) => {
        if (user.personId) taggedPersonIds.push(user.personId);
      });
    createPost.mutate({
      text: formatted.text,
      taggedPersonIds: [...new Set(taggedPersonIds)],
      taggedAgentIds: formatted.taggedAgentIds,
      linkedOpportunityIds: selected.map(({ id }) => Number(id)),
    });
  };

  return (
    <Composer ref={composerRef}>
      {replyTarget && (
        <ReplyContext>
          <div>
            <strong>{t("dashboard.posts.replyingTo", { name: replyTarget.authorName })}</strong>
            <span>{new Date(replyTarget.createdAt).toLocaleString(i18n.language)}</span>
            <p>{replyTarget.text}</p>
          </div>
          <ReplyContextClose
            type="button"
            aria-label={t("dashboard.posts.cancelReply")}
            onClick={() => cancelReplyMode(false)}
          >
            ×
          </ReplyContextClose>
        </ReplyContext>
      )}
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
        {!replyTarget && (
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
        )}
        {!replyTarget && (
          <ComposerButton
            type="button"
            aria-expanded={agentPickerOpen}
            onClick={() => {
              setAgentPickerOpen((open) => !open);
              closeOpportunityPicker();
              setEmojiOpen(false);
              setShowAutocomplete(false);
            }}
          >
            {t("dashboard.posts.tagNgo")}
          </ComposerButton>
        )}
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
        <ComposerButton
          type="button"
          $primary
          disabled={!text.trim() || createPost.isPending || createReply.isPending}
          onClick={submit}
        >
          {t(replyTarget ? "dashboard.posts.sendReply" : "dashboard.posts.send")}
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
      {agentPickerOpen && (
        <OpportunityPickerPanel>
          <PickerSearch
            value={agentQuery}
            onChange={(e) => setAgentQuery(e.target.value)}
            placeholder={t("dashboard.posts.searchNgos")}
          />
          <PickerResults>
            {agentCandidates.map((agent) => (
              <PickerItem
                key={agent.id}
                type="button"
                onClick={() => {
                  setTaggedAgents((all) => (all.some(({ id }) => id === agent.id) ? all : [...all, agent]));
                  insertAtCursor(`@${agent.title} `);
                  closeAgentPicker();
                }}
              >
                {agent.title}
                {agent.district?.title?.de ? ` · ${agent.district.title.de}` : ""}
              </PickerItem>
            ))}
            {agentCandidates.length === 0 && <PickerEmpty>{t("dashboard.posts.noNgos")}</PickerEmpty>}
          </PickerResults>
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
