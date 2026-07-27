import React from "react";
import { PaginatedGrid } from "@/components/core/paginatedGrid";
import VolunteerCard from "./VolunteerCard";
import { ApiVolunteerGetList } from "need4deed-sdk";
import styled from "styled-components";

interface VolunteerCardListProps {
  volunteers: ApiVolunteerGetList[];
  count: number;
  itemsPerPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  opportunityId?: string;
}

const VolunteerCardListContainer = styled.div`
  display: flex;
  justify-content: left;
  flex: 1;
  min-width: 0;
  --card-width: var(--dashboard-volunteers-card-width);
`;

export function VolunteerCardList({
  volunteers,
  count,
  itemsPerPage,
  currentPage,
  setCurrentPage,
  opportunityId,
}: VolunteerCardListProps) {
  const items = volunteers.map((volunteer) => (
    <VolunteerCard key={volunteer.id} volunteer={volunteer} opportunityId={opportunityId} />
  ));

  return (
    <VolunteerCardListContainer>
      <PaginatedGrid
        pageItems={items}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalItemCounts={count}
      />
    </VolunteerCardListContainer>
  );
}

export default VolunteerCardList;
