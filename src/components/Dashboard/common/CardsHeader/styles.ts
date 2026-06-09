import styled from "styled-components";

import { Heading2, Heading4 } from "../../../styled/text";
import { hyphenationStyles } from "../../../styled/mixins";

export const XIconDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: var(--cards-header-filter-item-icon-div-size);
  height: var(--cards-header-filter-item-icon-div-size);
  border-radius: var(--cards-header-filter-item-icon-div-border-radius);

  &:hover {
    background-color: var(--color-pink-200);
  }
`;

export const HeaderFilterItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  height: var(--cards-header-filter-item-height);
  gap: var(--cards-header-filter-item-gap);
  border-radius: var(--cards-header-filter-item-border-radius);
  padding: var(--cards-header-filter-item-padding);
  background-color: var(--color-pink-50);
`;

export const HeaderFilterItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: var(--dashboard-cards-header-filter-item-container-gap);
  flex-wrap: wrap;
`;

export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--opportunities-header-title-tabs-gap);
`;

export const TabsSearchBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--opportunities-header-tabs-searchbar-gap);
`;

export const TabsSectionContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: var(--filters-search-bar-width);
`;

export const Tabs = styled.div`
  display: flex;
  flex-direction: row;
  gap: var(--opportunities-header-tabs-gap);
`;

export const SearchBarSectionContainer = styled.div`
  display: flex;
  flex-direction: var(--opportunities-header-searchbar-flex-direction);
  gap: var(--filters-search-bar-section-container-gap);
  flex-wrap: wrap;
`;

type TabHeadingProps = {
  $isSelected: boolean;
};

export const TabHeading = styled(Heading4)<TabHeadingProps>`
  cursor: pointer;
  border-bottom: ${(props) =>
    props.$isSelected ? "var(--opportunities-header-tabs-border-bottom) solid currentColor" : "none"};
  padding-bottom: ${(props) => (props.$isSelected ? "var(--opportunities-header-tabs-padding-bottom)" : "0")};
`;

export const HyphenatedHeading2 = styled(Heading2)`
  ${hyphenationStyles}
`;

export const ClearAllButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--filters-clear-all-button-height);
  padding: var(--filters-clear-all-button-padding);
  background: var(--color-white);
  border: none;
  cursor: pointer;
  border-radius: var(--cards-header-filter-item-border-radius);
`;

export const AvatarWrapper = styled.div`
  position: relative;
  width: var(--opportunity-filter-chip-avatar-size);
  height: var(--opportunity-filter-chip-avatar-size);
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
`;

export const DefaultAvatarWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--opportunity-filter-chip-default-avatar-bg);
`;

export const EntityChip = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  height: var(--cards-header-filter-item-height);
  gap: var(--cards-header-filter-item-gap);
  border-radius: var(--cards-header-filter-item-border-radius);
  padding: var(--cards-header-filter-item-padding);
  background-color: var(--opportunity-filter-chip-bg);
`;

export const EntityChipXIconDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: var(--cards-header-filter-item-icon-div-size);
  height: var(--cards-header-filter-item-icon-div-size);
  border-radius: var(--cards-header-filter-item-icon-div-border-radius);
  cursor: pointer;

  &:hover {
    background-color: var(--opportunity-filter-chip-x-hover-bg);
  }
`;
