import { useTranslation } from "react-i18next";

import { Paragraph } from "../../../styled/text";
import { Search } from "../../../core/common";
import FiltersButton from "./FiltersButton";
import Results from "./Results";
import SortBy, { OnChangeSortOrder, SortOption } from "./SortBy";
import { XIcon } from "@phosphor-icons/react";
import { FilterItem } from "../CardsFilter/types";
import { EntityFilterChip } from "./EntityFilterChip";
import {
  ClearAllButton,
  HeaderContainer,
  HeaderFilterItem,
  HeaderFilterItemContainer,
  HyphenatedHeading2,
  SearchBarSectionContainer,
  TabHeading,
  Tabs,
  TabsSectionContainer,
  TabsSearchBarContainer,
  XIconDiv,
} from "./styles";

export type EntityFilter = {
  name: string;
  avatarUrl?: string;
  onRemove: () => void;
};

type Props = {
  header: string;
  resultCounter: number;
  resultText: string;
  onSearchInputChange: (input: string) => void;
  searchValue: string;
  searchPlaceholder?: string;
  tabs: string[];
  selectedTabIndex: number;
  setSelectedTabIndex: (index: number) => void;
  setIsFiltersOpen: (isOpen: boolean) => void;
  sortOrder: string;
  onSortOrderChange?: OnChangeSortOrder;
  extraSortOptions?: SortOption[];
  activeFilters: FilterItem[];
  onClearAllFilters?: () => void;
  entityFilter?: EntityFilter;
};

export default function CardsHeader({
  header,
  resultCounter,
  resultText,
  onSearchInputChange,
  searchValue,
  searchPlaceholder,
  selectedTabIndex,
  setSelectedTabIndex,
  tabs,
  setIsFiltersOpen,
  sortOrder,
  onSortOrderChange,
  extraSortOptions,
  activeFilters,
  onClearAllFilters,
  entityFilter,
}: Props) {
  const { t } = useTranslation();

  return (
    <HeaderContainer>
      <HyphenatedHeading2>{header}</HyphenatedHeading2>

      <TabsSearchBarContainer>
        <TabsSectionContainer>
          <Tabs>
            {tabs.map((tab, index) => (
              <TabHeading key={tab} onClick={() => setSelectedTabIndex(index)} $isSelected={selectedTabIndex === index}>
                {tab}
              </TabHeading>
            ))}
          </Tabs>
          <SortBy sortOrder={sortOrder} onChange={onSortOrderChange} extraOptions={extraSortOptions} />
        </TabsSectionContainer>

        <SearchBarSectionContainer>
          <Search
            placeHolder={searchPlaceholder ?? `${t("dashboard.searchPlaceHolder")}...`}
            onInputChange={onSearchInputChange}
            width="var(--filters-search-bar-width)"
            backgroundColor="var(--color-magnolia-light)"
            value={searchValue}
          />
          <FiltersButton setIsFiltersOpen={setIsFiltersOpen} />
        </SearchBarSectionContainer>

        <Results counter={resultCounter} text={resultText} />

        <HeaderFilterItemContainer>
          {entityFilter && (
            <EntityFilterChip
              name={entityFilter.name}
              avatarUrl={entityFilter.avatarUrl}
              onRemove={entityFilter.onRemove}
            />
          )}
          {activeFilters.map((f) => (
            <HeaderFilterItem key={f.label}>
              <Paragraph
                color="var(--color-midnight)"
                fontSize="var(--cards-header-filter-item-font-size)"
                fontWeight="var(--cards-header-filter-item-font-weight)"
              >
                {f.label}
              </Paragraph>
              <XIconDiv>
                <XIcon size={20} onClick={() => f.onChange(!f.checked)} />
              </XIconDiv>
            </HeaderFilterItem>
          ))}
          {activeFilters.length > 1 && onClearAllFilters && (
            <ClearAllButton onClick={onClearAllFilters}>
              <Paragraph
                color="var(--color-midnight)"
                fontSize="var(--filters-clear-all-button-text-font-size)"
                fontWeight="var(--filters-clear-all-button-text-font-weight)"
              >
                {t("dashboard.filters.clearAll")}
              </Paragraph>
            </ClearAllButton>
          )}
        </HeaderFilterItemContainer>
      </TabsSearchBarContainer>
    </HeaderContainer>
  );
}
