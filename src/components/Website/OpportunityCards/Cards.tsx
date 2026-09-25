"use client";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Announcement from "@/components/Announcement";
import { PaginatedGrid } from "@/components/core/paginatedGrid/PaginatedGrid";
import { ScreenTypes } from "@/config/constants";
import { useScreenType } from "@/context/DeviceContext";
import { CategoryTitle } from "./constants";
import { getIconName } from "./helpers";
import OpportunityCard from "./OpportunityCard";
import OpportunityCardPopup from "./OpportunityCardPopup";
import { Opportunity } from "./types";

// Cards per page, as on the website (columns × rows).
const itemsPerPageByScreen: Record<ScreenTypes, number> = {
  [ScreenTypes.MOBILE]: 10,
  [ScreenTypes.TABLET]: 12,
  [ScreenTypes.DESKTOP]: 12,
};

interface Props {
  opportunities: Opportunity[];
  loading: boolean;
}

export default function Cards({ opportunities, loading }: Props) {
  const screenType = useScreenType();
  const [modalOpportunity, setModalOpportunity] = useState<Opportunity>();
  const [currentPage, setCurrentPage] = useState(1);

  // A filter change shrinks the list; don't leave the user on an empty page.
  useEffect(() => setCurrentPage(1), [opportunities.length]);

  if (!opportunities.length) return <Announcement copies={loading ? "spinner" : "emptyList"} />;

  const itemsPerPage = itemsPerPageByScreen[screenType];
  // Page size changes with the screen type (e.g. rotating a phone); stay on a page that exists.
  const page = Math.min(currentPage, Math.ceil(opportunities.length / itemsPerPage));
  const start = (page - 1) * itemsPerPage;

  return (
    <CardsContainer>
      {modalOpportunity && (
        <OpportunityCardPopup opportunity={modalOpportunity} close={() => setModalOpportunity(undefined)} />
      )}
      <PaginatedGrid
        pageItems={opportunities.slice(start, start + itemsPerPage).map((opp) => (
          <OpportunityCard
            key={opp.id}
            iconName={getIconName(opp.categoryId as CategoryTitle)}
            opportunity={opp}
            onClick={() => setModalOpportunity(opp)}
            width="var(--page-opportunity-card-width)"
            height="var(--page-opportunity-card-height)"
            backgroundColor="var(--color-white)"
            enableHoverEffect={!modalOpportunity}
          />
        ))}
        itemsPerPage={itemsPerPage}
        currentPage={page}
        setCurrentPage={setCurrentPage}
        totalItemCounts={opportunities.length}
      />
    </CardsContainer>
  );
}

const CardsContainer = styled.div`
  display: flex;
  justify-content: var(--opportunities-cards-container-justify-content);
  --card-width: var(--page-opportunity-card-width);
`;
