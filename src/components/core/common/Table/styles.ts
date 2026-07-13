import styled from "styled-components";

export const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: var(--border-width-thin) solid var(--color-blue-50);
  border-radius: var(--border-radius-small);
  width: 100%;
  overflow: hidden;
`;

export const Table = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const TableHeader = styled.div`
  display: flex;
  flex-direction: row;
  background: var(--color-pink-50);
`;

export const TableHeaderCell = styled.div<{ $width?: string; $maxWidth?: string; $noWrap?: boolean; $align?: string }>`
  display: flex;
  align-items: center;
  padding: var(--spacing-16);
  gap: var(--spacing-8);
  font-weight: var(--font-weight-semi-bold);
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-midnight);
  ${(props) => props.$width && `width: ${props.$width};`}
  ${(props) => props.$maxWidth && `max-width: ${props.$maxWidth};`}
  ${(props) => props.$noWrap && `white-space: nowrap;`}
  ${(props) => props.$align && `justify-content: ${props.$align};`}
  flex: ${(props) => (props.$width ? "none" : props.$maxWidth ? "1 1 auto" : "1")};

  &:first-child {
    border-radius: var(--border-radius-small) 0 0 0;
  }

  &:last-child {
    border-radius: 0 var(--border-radius-small) 0 0;
  }
`;

export const TableBody = styled.div``;

export const TableRow = styled.div<{ $isLast?: boolean }>`
  display: flex;
  flex-direction: row;
  ${(props) => !props.$isLast && `border-bottom: var(--border-width-thin) solid var(--color-blue-50);`}

  &:last-child > div:first-child {
    border-radius: 0 0 0 var(--border-radius-small);
  }

  &:last-child > div:last-child {
    border-radius: 0 0 var(--border-radius-small) 0;
  }
`;

export const TableCell = styled.div<{ $width?: string; $maxWidth?: string; $align?: string; $noWrap?: boolean }>`
  display: flex;
  align-items: center;
  padding: var(--spacing-16);
  gap: var(--spacing-8);
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-midnight);
  border-right: var(--border-width-thin) solid var(--color-blue-50);
  ${(props) => props.$width && `width: ${props.$width};`}
  ${(props) => props.$maxWidth && `max-width: ${props.$maxWidth};`}
  ${(props) => props.$align && `justify-content: ${props.$align};`}
  ${(props) => props.$noWrap && `white-space: nowrap; overflow: hidden;`}
  flex: ${(props) => (props.$width ? "none" : props.$maxWidth ? "1 1 auto" : "1")};

  &:last-child {
    border-right: none;
  }
`;

export const ActionCell = styled(TableCell).attrs<{ $width?: string; $align?: string }>((props) => ({
  $width: props.$width ?? "var(--communication-tracker-action-column-width)",
  $align: props.$align ?? "center",
}))`
  padding: var(--spacing-8);
`;

export const ActionButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: var(--spacing-8);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-midnight);

  &:hover {
    opacity: var(--opacity-hover);
  }
`;

export const ClickableRow = styled(TableRow)<{ $cursor?: string }>`
  cursor: ${(props) => props.$cursor || "pointer"};

  &:hover {
    background: var(--color-pink-50);
  }

  text-decoration: none;
  color: inherit;
`;

export const TruncatedText = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const WrappedText = styled.span`
  overflow-wrap: anywhere;
`;
