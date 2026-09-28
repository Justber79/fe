"use client";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Button } from "@/components/core/button";
import { IconName } from "@/components/core/button/Button/icon";
import { Search } from "@/components/core/common";
import { hyphenationStyles } from "@/components/styled/mixins";
import { Heading2, Heading4, Paragraph } from "@/components/styled/text";
import { ScreenTypes } from "@/config/constants";
import { useScreenType } from "@/context/DeviceContext";

interface Props {
  numOfOpportunities: number;
  searchInput: string;
  onSearchInputChange: (input: string) => void;
  tabs: string[];
  selectedTabIndex: number;
  setSelectedTabIndex: (index: number) => void;
  setIsFiltersOpen: (isOpen: boolean) => void;
}

export default function OpportunityCardsHeader({
  numOfOpportunities,
  searchInput,
  onSearchInputChange,
  tabs,
  selectedTabIndex,
  setSelectedTabIndex,
  setIsFiltersOpen,
}: Props) {
  const { t } = useTranslation();
  const isMobile = useScreenType() === ScreenTypes.MOBILE;

  const resultsFound = (
    <ResultContainer>
      <Heading4>{numOfOpportunities}</Heading4>
      <Paragraph>{t("opportunityPage.resultsFound")}</Paragraph>
    </ResultContainer>
  );

  const filtersButton = (
    <Button
      text={isMobile ? undefined : t("opportunityPage.filters.button")}
      aria-label={t("opportunityPage.filters.button")}
      backgroundcolor="var(--color-midnight)"
      height="var(--opportunities-filters-button-height)"
      width={isMobile ? "var(--opportunities-filters-button-width)" : undefined}
      onClick={() => setIsFiltersOpen(true)}
      iconName={IconName.FadersHorizontal}
      iconSize="var(--opportunities-filters-button-icon-size)"
    />
  );

  return (
    <HeaderContainer>
      <HyphenatedHeading2>{t("opportunityPage.header")}</HyphenatedHeading2>

      <TabsSearchBarContainer>
        <TabsSectionContainer>
          <Tabs>
            {tabs.map((tab, index) => (
              <TabHeading key={tab} onClick={() => setSelectedTabIndex(index)} $isSelected={selectedTabIndex === index}>
                {tab}
              </TabHeading>
            ))}
          </Tabs>
          {isMobile ? filtersButton : resultsFound}
        </TabsSectionContainer>

        <SearchBarSectionContainer>
          <Search
            placeHolder={`${t("opportunityPage.searchPlaceHolder")} ...`}
            onInputChange={onSearchInputChange}
            width="var(--opportunities-header-searchbar-width)"
            value={searchInput}
          />
          {isMobile ? resultsFound : filtersButton}
        </SearchBarSectionContainer>
      </TabsSearchBarContainer>
    </HeaderContainer>
  );
}

/* Styles */

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--opportunities-header-title-tabs-gap);
`;

const HyphenatedHeading2 = styled(Heading2)`
  ${hyphenationStyles}
`;

const TabsSearchBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--opportunities-header-tabs-searchbar-gap);
`;

const TabsSectionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: var(--opportunities-header-tabs-section-width);
`;

const Tabs = styled.div`
  display: flex;
  gap: var(--opportunities-header-tabs-gap);
`;

const TabHeading = styled(Heading4)<{ $isSelected: boolean }>`
  cursor: pointer;
  border-bottom: ${({ $isSelected }) =>
    $isSelected ? "var(--opportunities-header-tabs-border-bottom) solid currentColor" : "none"};
  padding-bottom: ${({ $isSelected }) => ($isSelected ? "var(--opportunities-header-tabs-padding-bottom)" : "0")};
`;

const SearchBarSectionContainer = styled.div`
  display: flex;
  flex-direction: var(--opportunities-header-searchbar-flex-direction);
  justify-content: space-between;
  gap: 12px;
`;

const ResultContainer = styled.div`
  display: flex;
  align-items: baseline;
  gap: var(--opportunities-header-result-padding);
`;
