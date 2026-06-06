import { TableCell } from "@/components/core/common/Table/styles";
import styled from "styled-components";
import { Table, TableContainer } from "@/components/core/common/Table";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--entity-table-gap);
  /* Fill the content row, but allow shrinking when the filters panel is open
     (the table scrolls horizontally inside ScrollableTableContainer). A fixed
     min-width pushed the filters panel off-screen (#534). */
  flex: 1;
  min-width: 0;
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
