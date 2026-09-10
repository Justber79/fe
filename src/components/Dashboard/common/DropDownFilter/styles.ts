import styled from "styled-components";

interface WidthProps {
  $width: string;
}

export const OuterContainer = styled.div`
  position: absolute;
`;

export const ItemCount = styled.span<WidthProps>`
  position: absolute;
  right: calc(-${({ $width }) => $width} + 20px);
  top: -25px;
  color: grey;
  font-size: 1.15rem;
`;

export const RelativeContainer = styled.div`
  position: relative;
`;

export const FilterWrapper = styled.div<WidthProps>`
  position: absolute;
  right: calc(-${({ $width }) => $width} + 20px);
  top: -10px;
`;
