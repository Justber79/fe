import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

import { SearchClearButton, SearchField, SearchInput } from "./styles";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function PostsSearch({ value, onChange }: Props) {
  const { t } = useTranslation();
  const label = t("dashboard.posts.searchPosts");

  return (
    <SearchField role="search">
      <MagnifyingGlassIcon size={22} aria-hidden="true" />
      <SearchInput
        type="search"
        aria-label={label}
        placeholder={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {value && (
        <SearchClearButton type="button" aria-label={t("dashboard.posts.clearSearch")} onClick={() => onChange("")}>
          <XIcon size={18} aria-hidden="true" />
        </SearchClearButton>
      )}
    </SearchField>
  );
}
