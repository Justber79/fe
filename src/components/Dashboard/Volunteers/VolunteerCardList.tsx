import React from "react";
import { PaginatedGrid } from "@/components/core/paginatedGrid";
import VolunteerCard from "./VolunteerCard";
import { ApiVolunteerGetList } from "need4deed-sdk";
import styled from "styled-components";

interface VolunteerCardListProps {
  volunteers: ApiVolunteerGetList[];
  count: number;
  columns: number;
  rows: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  opportunityId?: string;
}

const VolunteerCardListContainer = styled.div`
  display: flex;
  justify-content: left;
  flex: 1;
  min-width: 0;
`;

export function VolunteerCardList({
  volunteers,
  count,
  columns,
  rows,
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
        columns={columns}
        rows={rows}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalItemCounts={count}
      />
    </VolunteerCardListContainer>
  );
}

export default VolunteerCardList;
