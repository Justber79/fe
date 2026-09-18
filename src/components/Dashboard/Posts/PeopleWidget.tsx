import { apiPathUser, cacheTTL, MAX_PAGE_LIMIT } from "@/config/constants";
import { useClickOutside, useGetQuery } from "@/hooks";
import { useDebounce } from "@/hooks/useDebounce";
import { getImageUrl } from "@/utils";
import { CaretDownIcon, CheckIcon, MagnifyingGlassIcon, UsersIcon } from "@phosphor-icons/react";
import { ApiUserGet, SortOrder, UserRole } from "need4deed-sdk";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  PeopleAvatar,
  PeopleAvatarInitials,
  PeopleDropdown,
  PeopleDescription,
  PeopleEmptyState,
  PeopleFilterButton,
  PeopleFilterButtonText,
  PeopleFilterWrapper,
  PeopleItem,
  PeopleList,
  PeopleSearchField,
  PeopleSearchInput,
  PeopleText,
  PeopleDropdownHeader,
} from "./styles";

const POST_AUTHOR_ROLES = new Set([UserRole.AGENT, UserRole.COORDINATOR, UserRole.ADMIN]);

interface Props {
  selectedPersonId?: number;
  onSelect: (personId?: number) => void;
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function PeopleWidget({ selectedPersonId, onSelect }: Props) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPersonCache, setSelectedPersonCache] = useState<(ApiUserGet & { personId: number }) | undefined>();
  const debouncedQuery = useDebounce(query.trim(), 300);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setIsOpen(false), []);
  useClickOutside(wrapperRef, close);
  const {
    data: users,
    isLoading,
    isError,
  } = useGetQuery<ApiUserGet[]>({
    queryKey: ["users", "all"],
    apiPath: apiPathUser,
    params: {
      sortOrder: SortOrder.NewToOld,
      limit: MAX_PAGE_LIMIT,
      ...(debouncedQuery ? { search: debouncedQuery } : {}),
    },
    staleTime: cacheTTL,
    enabled: isOpen,
  });

  const people = useMemo(
    () =>
      (users ?? [])
        .filter(
          (user): user is ApiUserGet & { personId: number } =>
            user.personId != null && user.isActive && POST_AUTHOR_ROLES.has(user.role) && Boolean(user.fullName.trim()),
        )
        .sort((a, b) => a.fullName.localeCompare(b.fullName)),
    [users],
  );
  const personFromResults = people.find((person) => person.personId === selectedPersonId);
  const selectedPerson =
    personFromResults ?? (selectedPersonCache?.personId === selectedPersonId ? selectedPersonCache : undefined);

  useEffect(() => {
    if (personFromResults) setSelectedPersonCache(personFromResults);
    else if (selectedPersonId == null) setSelectedPersonCache(undefined);
  }, [personFromResults, selectedPersonId]);

  useEffect(() => {
    if (!isOpen) setQuery("");
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close, isOpen]);

  const selectPerson = (person?: ApiUserGet & { personId: number }) => {
    setSelectedPersonCache(person);
    onSelect(person?.personId);
    close();
  };

  return (
    <PeopleFilterWrapper ref={wrapperRef}>
      <PeopleFilterButton
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls="posts-people-filter"
        $active={Boolean(selectedPerson)}
        onClick={() => setIsOpen((current) => !current)}
      >
        {selectedPerson?.avatarUrl ? (
          <PeopleAvatar src={getImageUrl(selectedPerson.avatarUrl)} alt="" />
        ) : selectedPerson ? (
          <PeopleAvatarInitials aria-hidden="true">{getInitials(selectedPerson.fullName)}</PeopleAvatarInitials>
        ) : (
          <UsersIcon size={24} aria-hidden="true" />
        )}
        <PeopleFilterButtonText>
          <span>{t("dashboard.posts.postedBy")}</span>
          <strong>{selectedPerson?.fullName ?? t("dashboard.posts.anyone")}</strong>
        </PeopleFilterButtonText>
        <CaretDownIcon size={18} aria-hidden="true" />
      </PeopleFilterButton>

      {isOpen && (
        <PeopleDropdown id="posts-people-filter" role="dialog" aria-label={t("dashboard.posts.peopleDescription")}>
          <PeopleDropdownHeader>
            <strong>{t("dashboard.posts.postedBy")}</strong>
            <PeopleDescription>{t("dashboard.posts.peopleDescription")}</PeopleDescription>
          </PeopleDropdownHeader>
          <PeopleSearchField>
            <MagnifyingGlassIcon size={18} aria-hidden="true" />
            <PeopleSearchInput
              type="search"
              autoFocus
              aria-label={t("dashboard.posts.findPerson")}
              placeholder={t("dashboard.posts.findPerson")}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </PeopleSearchField>

          <PeopleList>
            <PeopleItem
              type="button"
              $selected={!selectedPersonId}
              aria-pressed={!selectedPersonId}
              onClick={() => selectPerson()}
            >
              <PeopleAvatarInitials aria-hidden="true">
                <UsersIcon size={18} />
              </PeopleAvatarInitials>
              <PeopleText>
                <strong>{t("dashboard.posts.anyone")}</strong>
                <span>{t("dashboard.posts.everyoneDescription")}</span>
              </PeopleText>
              {!selectedPersonId && <CheckIcon size={20} aria-hidden="true" />}
            </PeopleItem>
            {isLoading ? (
              <PeopleEmptyState>{t("dashboard.home.content.loading")}</PeopleEmptyState>
            ) : isError ? (
              <PeopleEmptyState role="alert">{t("message.errorGeneric")}</PeopleEmptyState>
            ) : people.length === 0 ? (
              <PeopleEmptyState>{t("dashboard.posts.noPeople")}</PeopleEmptyState>
            ) : (
              people.map((person) => (
                <PeopleItem
                  type="button"
                  key={person.id}
                  $selected={selectedPersonId === person.personId}
                  aria-pressed={selectedPersonId === person.personId}
                  onClick={() => selectPerson(person)}
                >
                  {person.avatarUrl ? (
                    <PeopleAvatar src={getImageUrl(person.avatarUrl)} alt="" />
                  ) : (
                    <PeopleAvatarInitials aria-hidden="true">{getInitials(person.fullName)}</PeopleAvatarInitials>
                  )}
                  <PeopleText>
                    <strong>{person.fullName}</strong>
                    <span>{t(`dashboard.posts.roles.${person.role}`)}</span>
                  </PeopleText>
                  {selectedPersonId === person.personId && <CheckIcon size={20} aria-hidden="true" />}
                </PeopleItem>
              ))
            )}
          </PeopleList>
        </PeopleDropdown>
      )}
    </PeopleFilterWrapper>
  );
}
