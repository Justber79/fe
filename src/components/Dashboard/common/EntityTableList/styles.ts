import { TableCell } from "@/components/core/common/Table/styles";
import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--entity-table-gap);
  width: 100%;
`;

export const WrapAnywhereCell = styled(TableCell)`
  overflow-wrap: anywhere;
`;
