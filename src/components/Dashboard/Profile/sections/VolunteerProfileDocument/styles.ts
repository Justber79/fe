import styled from "styled-components";

export const ACTION_COLUMN_WIDTH = "48px";

const DOCUMENT_TABLE_COLUMNS = "minmax(150px, 1fr) 100px 140px 120px repeat(4, 48px)";

export const ScrollHint = styled.div`
  display: none;

  @media (max-width: 767px) {
    display: flex;
    align-items: center;
    gap: var(--spacing-8);
    margin-top: var(--spacing-16);
    color: var(--color-grey-500);
    font-size: var(--font-size-sm);
    line-height: var(--line-height-20);
  }
`;

export const TableViewport = styled.div<{ $showLeftFade: boolean; $showRightFade: boolean }>`
  position: relative;
  width: 100%;
  min-width: 0;
  overflow: hidden;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: var(--spacing-24);
    bottom: 6px;
    z-index: 2;
    width: var(--spacing-32);
    pointer-events: none;
    transition: opacity 160ms ease;
  }

  &::before {
    left: 0;
    background: linear-gradient(to right, var(--color-white), transparent);
    opacity: ${({ $showLeftFade }) => ($showLeftFade ? 1 : 0)};
  }

  &::after {
    right: 0;
    background: linear-gradient(to left, var(--color-white), transparent);
    opacity: ${({ $showRightFade }) => ($showRightFade ? 1 : 0)};
  }
`;

export const DocumentTableContainer = styled.div`
  margin-top: var(--spacing-24);
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  scrollbar-color: var(--color-violet-500) var(--color-grey-50);
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: var(--color-grey-50);
    border-radius: 999px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-violet-500);
    border-radius: 999px;
  }
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
  min-width: 702px;
  overflow: hidden;
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: ${DOCUMENT_TABLE_COLUMNS};
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
  ${(props) => props.$noWrap && `white-space: nowrap;`}
  min-width: 0;

  &:first-child {
    border-radius: var(--document-section-table-border-radius) 0 0 0;
  }

  &:last-child {
    border-radius: 0 var(--document-section-table-border-radius) 0 0;
    justify-content: center;
  }
`;

export const TableRow = styled.div<{ $isLast?: boolean }>`
  display: grid;
  grid-template-columns: ${DOCUMENT_TABLE_COLUMNS};
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
  ${(props) => props.$align && `justify-content: ${props.$align};`}
  ${(props) => props.$noWrap && `white-space: nowrap;`}
  min-width: 0;

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
`;

interface CheckboxProps {
  $isAuthorized: boolean;
}

export const ReceivedCheckbox = styled.input.attrs({ type: "checkbox" })<CheckboxProps>`
  width: 18px;
  height: 18px;
  accent-color: var(--color-aubergine);
  cursor: ${(props) => (props.$isAuthorized ? "pointer" : "not-allowed")};
  opacity: ${(props) => (props.$isAuthorized ? "1" : "0.5")};
`;
