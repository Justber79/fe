import styled from "styled-components";

export const OuterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
  position: relative;
`;

export const ItemCount = styled.span`
  color: var(--color-grey-500);
  font-size: var(--font-size-14);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-20);
`;

export const RelativeContainer = styled.div`
  position: relative;
`;

export const FilterWrapper = styled.div`
  position: relative;
`;
