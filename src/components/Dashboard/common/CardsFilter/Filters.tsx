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

  /* On narrow viewports there is no room next to the list: span the full
     width and appear above the list, right below the FILTERS button (#534). */
  @media (max-width: 1023px) {
    width: 100%;
    order: -1;
  }
`;
