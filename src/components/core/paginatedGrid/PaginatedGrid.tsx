import { ReactNode } from "react";
import styled from "styled-components";
import PaginationNumbers from "./PaginationNumbers";

interface Props {
  pageItems: ReactNode[];
  itemsPerPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalItemCounts: number;
}

export function PaginatedGrid({ pageItems, itemsPerPage, currentPage, setCurrentPage, totalItemCounts }: Props) {
  const totalPages = Math.ceil(totalItemCounts / itemsPerPage);

  const goToPage = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <MainContainer>
      <GridContainer>{pageItems}</GridContainer>

      <PaginationNumbers currentPage={currentPage} goToPage={goToPage} totalPages={totalPages} />
    </MainContainer>
  );
}

export default PaginatedGrid;

/** Styles */

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--opportunities-container-gap);
  width: 100%;
  flex: 1;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, min(100%, var(--card-width, 320px)));
  gap: var(--paginated-grid-container-gap);
  width: 100%;
  justify-items: start;
`;
