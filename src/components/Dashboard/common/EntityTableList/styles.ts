import styled from "styled-components";
import { Table, TableContainer } from "@/components/core/common/Table";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--entity-table-gap);
  width: 100%;
`;

export const ScrollableTableContainer = styled(TableContainer)`
  overflow-x: auto;
`;

export const ScrollableTable = styled(Table)`
  width: max-content;
  min-width: 100%;
`;
