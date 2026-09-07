import { TableCell } from "@/components/core/common/Table/styles";
import styled from "styled-components";
import { Table, TableContainer } from "@/components/core/common/Table";

interface WrapperProps {
  $isFewResults?: boolean;
}

export const Wrapper = styled.div<WrapperProps>`
  display: flex;
  flex-direction: column;
  gap: var(--entity-table-gap);
  flex: 1;
  min-width: 0;
  height: ${({ $isFewResults }) => ($isFewResults ? "50dvh" : "auto")};
`;

export const ScrollableTableContainer = styled(TableContainer)`
  overflow-x: auto;
`;

export const ScrollableTable = styled(Table)`
  width: max-content;
  min-width: 100%;
`;

export const WrapAnywhereCell = styled(TableCell)`
  overflow-wrap: anywhere;
`;
