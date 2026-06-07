import styled from "styled-components";
import CloseFilters from "./CloseFilters";
import { ReactNode } from "react";

interface Props {
  isFiltersOpen: boolean;
  setIsFiltersOpen: (isOpen: boolean) => void;
  filtersContent: ReactNode;
}

export default function Filters({ isFiltersOpen, setIsFiltersOpen, filtersContent }: Props) {
  return isFiltersOpen ? (
    <FiltersContainer>
      <CloseFilters setIsFiltersOpen={setIsFiltersOpen} />
      {filtersContent}
    </FiltersContainer>
  ) : null;
}

const FiltersContainer = styled.div`
  width: var(--filters-container-width);
  flex-shrink: 0;
  align-self: flex-start;
  background: var(--color-pink-50);
  border-bottom-left-radius: var(--filters-container-border-radius);

  @media (max-width: 1023px) {
    width: 100%;
    order: -1;
  }
`;
