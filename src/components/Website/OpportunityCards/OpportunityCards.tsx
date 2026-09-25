"use client";
import { Lang } from "need4deed-sdk";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SetStateAction, useEffect, useMemo, useState } from "react";
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
import { CardsFilter } from "./types";

/** Public opportunity browser, ported from the old website's /opportunity-cards. */
export function OpportunityCards() {
  const { t, i18n } = useTranslation();
  const language = i18n.language as Lang;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { opportunities, loading } = useLegacyOpportunities();

  const [cardsFilter, setCardsFilter] = useState(defaultFilter);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const mappedOpportunities = useMemo(() => getMappedOpportunities(opportunities ?? [], t), [opportunities, t]);

  // Activity-type and district options come from the data (and their labels
  // from the language), so rebuild them when either changes, then re-apply
  // whatever the URL says is selected.
  useEffect(() => {
    if (!mappedOpportunities.length) return;

    setCardsFilter((prev) => {
      const base = { ...prev, ...extractCardsFilter(mappedOpportunities, t) };
      const hasFilterParams = FILTER_KEY_LIST.some((key) => searchParams.has(key));
      return hasFilterParams ? deserializeFilters(searchParams, base) : base;
    });
    if (openFilters(searchParams)) setIsFiltersOpen(true);
    // searchParams is read once per data/language change on purpose: it is
    // written from cardsFilter, so reacting to it would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mappedOpportunities, t]);

  const updateFilter = (update: SetStateAction<CardsFilter>) => {
    const next = typeof update === "function" ? update(cardsFilter) : update;
    setCardsFilter(next);

    const query = serializeFilters(next, language).toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

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
          setFilter={updateFilter}
        />
        <OpportunityCardsHeader
          numOfOpportunities={isCardsTab ? filteredOpportunities.length : 0}
          searchInput={cardsFilter.searchInput}
          onSearchInputChange={(searchInput) => updateFilter((prev) => ({ ...prev, searchInput }))}
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

/* Styles */

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
