"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { PageLayout } from "@/components/Layout";
import { Heading3 } from "@/components/styled/text";
import { useLegacyOpportunities } from "@/hooks/useLegacyOpportunities";
import Cards from "./Cards";
import { defaultFilter, FILTER_KEY_LIST } from "./constants";
import Filters from "./Filters/Filters";
import {
  deserializeFilters,
  extractCardsFilter,
  filterOpportunity,
  getMappedOpportunities,
  openFilters,
  reduceFilter,
  serializeFilters,
} from "./helpers";
import OpportunityCardsHeader from "./OpportunityCardsHeader";

export function OpportunityCards() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { opportunities, loading } = useLegacyOpportunities();

  const [cardsFilter, setCardsFilter] = useState(defaultFilter);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isFilterReady, setIsFilterReady] = useState(false);

  const mappedOpportunities = useMemo(() => getMappedOpportunities(opportunities ?? [], t), [opportunities, t]);

  useEffect(() => {
    if (!mappedOpportunities.length) return;

    setCardsFilter((prev) => {
      const base = { ...prev, ...extractCardsFilter(mappedOpportunities) };
      const hasFilterParams = FILTER_KEY_LIST.some((key) => searchParams.has(key));
      return hasFilterParams ? deserializeFilters(searchParams, base) : base;
    });
    if (openFilters(searchParams)) setIsFiltersOpen(true);
    setIsFilterReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mappedOpportunities]);

  useEffect(() => {
    if (!isFilterReady) return;

    const query = serializeFilters(cardsFilter).toString();
    if (query === window.location.search.slice(1)) return;
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [cardsFilter, isFilterReady, pathname, router]);

  const filteredOpportunities = useMemo(() => {
    const reducedFilter = reduceFilter(cardsFilter);
    return mappedOpportunities
      .filter((opp) => filterOpportunity(opp, reducedFilter))
      .sort((a, b) => b.lastEditedTimeNotion.getTime() - a.lastEditedTimeNotion.getTime());
  }, [mappedOpportunities, cardsFilter]);

  const isCardsTab = selectedTabIndex === 0;

  return (
    <PageLayout>
      <OpportunitiesContainer>
        <Filters
          isFiltersOpen={isFiltersOpen}
          setIsFiltersOpen={setIsFiltersOpen}
          filter={cardsFilter}
          setFilter={setCardsFilter}
        />
        <OpportunityCardsHeader
          numOfOpportunities={isCardsTab ? filteredOpportunities.length : 0}
          searchInput={cardsFilter.searchInput}
          onSearchInputChange={(searchInput) => setCardsFilter((prev) => ({ ...prev, searchInput }))}
          tabs={[t("opportunityPage.tabs.tab1"), t("opportunityPage.tabs.tab2")]}
          selectedTabIndex={selectedTabIndex}
          setSelectedTabIndex={setSelectedTabIndex}
          setIsFiltersOpen={setIsFiltersOpen}
        />
        {isCardsTab ? (
          <Cards opportunities={filteredOpportunities} loading={loading} />
        ) : (
          <MapViewContainer>
            <Heading3>{t("opportunityPage.mapViewMessage")}...</Heading3>
          </MapViewContainer>
        )}
      </OpportunitiesContainer>
    </PageLayout>
  );
}

export default OpportunityCards;

const OpportunitiesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--opportunities-container-gap);
  width: var(--opportunities-container-width);
  min-height: var(--opportunities-container-min-height);
  margin-inline: auto;
  position: relative;
  padding: var(--opportunities-container-padding);
`;

const MapViewContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: var(--opportunities-map-view-container-height);
`;
