import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import styled from "styled-components";
import { Heading4 } from "../../styled/text";

const PaginationContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: center;
`;

interface NumberDivProps {
  $bgColor?: string;
}

const NumberDiv = styled.div<NumberDivProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: var(--paginated-grid-pagination-number-width);
  height: var(--paginated-grid-pagination-number-height);
  border-radius: var(--paginated-grid-pagination-number-border-radius);
  background-color: ${(props) => props.$bgColor};
  cursor: pointer;
`;

interface Props {
  currentPage: number;
  totalPages: number;
  goToPage: (pageNumber: number) => void;
}

export default function PaginationNumbers({ currentPage, totalPages, goToPage }: Props) {
  if (totalPages === 0) return null;

  const handlePrevPage = (): void => {
    goToPage(currentPage - 1);
  };

  const handleNextPage = (): void => {
    goToPage(currentPage + 1);
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const maxPagesToShow = 5;
  const pages: (number | string)[] = [];

  pages.push(1);

  let startPage = Math.max(2, currentPage - Math.floor((maxPagesToShow - 3) / 2));
  let endPage = Math.min(totalPages - 1, currentPage + Math.ceil((maxPagesToShow - 3) / 2));

  if (endPage - startPage + 1 < maxPagesToShow - 2) {
    if (startPage === 2) {
      endPage = Math.min(totalPages - 1, startPage + (maxPagesToShow - 3) - 1);
    } else if (endPage === totalPages - 1) {
      startPage = Math.max(2, endPage - (maxPagesToShow - 3) + 1);
    }
  }

  if (startPage > 2) {
    pages.push("...");
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (endPage < totalPages - 1) {
    pages.push("...");
  }

  if (totalPages > 1) {
    pages.push(totalPages);
  }

  const uniquePages = Array.from(new Set(pages));

  return (
    <PaginationContainer>
      <CaretLeftIcon
        size={20}
        onClick={handlePrevPage}
        cursor={isFirstPage ? "default" : "pointer"}
        color={isFirstPage ? "var(--color-sand-dark)" : "var(--color-midnight)"}
      />

      {uniquePages.map((page) =>
        page === "..." ? (
          <Heading4 key={page}>{page}</Heading4>
        ) : (
          <NumberDiv
            $bgColor={page === currentPage ? "var(--color-midnight)" : "none"}
            key={page}
            onClick={() => goToPage(Number(page))}
          >
            <Heading4 margin={0} color={page === currentPage ? "var(--color-white)" : "var(--color-midnight)"}>
              {page}
            </Heading4>
          </NumberDiv>
        ),
      )}

      <CaretRightIcon
        size={20}
        onClick={handleNextPage}
        cursor={isLastPage ? "default" : "pointer"}
        color={isLastPage ? "var(--color-sand-dark)" : "var(--color-midnight)"}
      />
    </PaginationContainer>
  );
}
