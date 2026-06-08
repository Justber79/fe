import styled from "styled-components";

export const ACTION_COLUMN_WIDTH = "56px";

export const DocumentTableContainer = styled.div`
  margin-top: var(--spacing-24);
  width: 100%;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: var(--document-section-container-padding);
  gap: var(--document-section-container-gap);
  background: var(--color-white);
  border-radius: var(--card-border-radius);
  margin-bottom: var(--document-section-container-margin-bottom);
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  gap: var(--document-section-header-gap);
`;

export const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--document-section-title-row-gap);
  flex: 1;
`;

export const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: var(--document-section-icon-size);
  height: var(--document-section-icon-size);
  color: var(--color-papaya);
`;

export const Table = styled.div`
  display: flex;
  flex-direction: column;
  border: var(--document-section-table-border-width) solid var(--color-blue-50);
  border-radius: var(--document-section-table-border-radius);
  width: 100%;
  overflow: hidden;
`;

export const TableHeader = styled.div`
  display: flex;
  flex-direction: row;
  background: var(--color-pink-50);
`;

export const HeaderCell = styled.div<{ $width?: string; $noWrap?: boolean }>`
  display: flex;
  align-items: center;
  padding: var(--document-section-header-cell-padding);
  gap: var(--document-section-header-cell-gap);
  font-weight: var(--document-section-header-cell-font-weight);
  font-size: var(--document-section-header-cell-font-size);
  line-height: var(--document-section-header-cell-line-height);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-midnight);
  ${(props) => props.$width && `width: ${props.$width};`}
  ${(props) => props.$noWrap && `white-space: nowrap;`}
  flex: ${(props) => (props.$width ? "none" : "1")};

  &:first-child {
    border-radius: var(--document-section-table-border-radius) 0 0 0;
  }

  &:last-child {
    border-radius: 0 var(--document-section-table-border-radius) 0 0;
    justify-content: center;
  }
`;

export const TableRow = styled.div<{ $isLast?: boolean }>`
  display: flex;
  flex-direction: row;
  ${(props) =>
    !props.$isLast && `border-bottom: var(--document-section-table-border-width) solid var(--color-blue-50);`}

  &:last-child > div:first-child {
    border-radius: 0 0 0 var(--document-section-table-border-radius);
  }

  &:last-child > div:last-child {
    border-radius: 0 0 var(--document-section-table-border-radius) 0;
  }
`;

export const Cell = styled.div<{ $width?: string; $align?: string; $noWrap?: boolean }>`
  display: flex;
  align-items: center;
  padding: var(--document-section-cell-padding);
  gap: var(--document-section-cell-gap);
  font-size: var(--document-section-cell-font-size);
  line-height: var(--document-section-cell-line-height);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-midnight);
  border-right: var(--document-section-table-border-width) solid var(--color-blue-50);
  ${(props) => props.$width && `width: ${props.$width};`}
  ${(props) => props.$align && `justify-content: ${props.$align};`}
  ${(props) => props.$noWrap && `white-space: nowrap;`}
  flex: ${(props) => (props.$width ? "none" : "1")};

  &:last-child {
    border-right: none;
  }
`;

export const StatusBadge = styled.div<{ $status: "uploaded" | "missing" }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--document-section-status-badge-padding);
  gap: var(--document-section-status-badge-gap);
  border-radius: var(--document-section-status-badge-border-radius);
  font-weight: var(--document-section-status-badge-font-weight);
  font-size: var(--document-section-status-badge-font-size);
  line-height: var(--document-section-status-badge-line-height);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-midnight);
  background: ${(props) => (props.$status === "uploaded" ? "var(--color-green-100)" : "var(--color-red-50)")};
`;

export const ActionCell = styled(Cell).attrs<{ $width?: string; $align?: string }>((props) => ({
  $width: props.$width ?? ACTION_COLUMN_WIDTH,
  $align: props.$align ?? "center",
}))`
  padding: var(--document-section-action-cell-padding);
`;

export const ReceivedCell = styled(Cell)`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 120px;
  flex: none;
`;

export const ReceivedCheckbox = styled.input.attrs({ type: "checkbox" })`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--color-aubergine);
`;
