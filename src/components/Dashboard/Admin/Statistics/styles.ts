import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-24);
  min-width: 0;
`;

export const Card = styled.section<{ $isDimmed?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-16);
  padding: var(--spacing-24);
  border: var(--border-width-thin) solid var(--color-blue-50);
  border-radius: var(--border-radius-small);
  background: var(--color-white);
  min-width: 0;
  opacity: ${({ $isDimmed }) => ($isDimmed ? 0.6 : 1)};
  transition: opacity 0.2s ease;

  @media (max-width: 767px) {
    padding: var(--spacing-16);
  }
`;

export const FiltersRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: var(--spacing-16) var(--spacing-24);
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
  min-width: 0;
`;

export const FieldLabel = styled.label`
  font-size: var(--text-p-font-size);
  font-weight: var(--font-weight-semi-bold);
  color: var(--color-midnight);
`;

export const Select = styled.select`
  height: var(--button-height);
  min-width: 220px;
  padding: 0 var(--spacing-48) 0 var(--spacing-16);
  border: var(--border-width-thin) solid var(--color-grey-200);
  border-radius: var(--button-border-radius);
  font-size: var(--text-p-font-size);
  font-family: var(--bs-body-font-family);
  color: var(--color-midnight);
  background-color: var(--color-white);
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg width='14' height='8' viewBox='0 0 14 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M1 1L7 7L13 1' stroke='%23403168' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right var(--spacing-16) center;
  appearance: none;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid var(--color-midnight);
    outline-offset: 2px;
  }

  &:disabled {
    cursor: default;
    color: var(--color-grey-500);
    background-color: var(--color-grey-50);
  }

  @media (max-width: 767px) {
    width: 100%;
  }
`;

export const ToggleGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-8);
`;

export const DateRange = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-12);

  & > div {
    width: 180px;
  }

  @media (max-width: 767px) {
    flex-wrap: wrap;

    & > div {
      flex: 1 1 140px;
      width: auto;
    }
  }
`;

export const CardHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--spacing-8) var(--spacing-16);
`;

export const Legend = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-8) var(--spacing-16);
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const LegendItem = styled.li`
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
  font-size: var(--font-size-14, 14px);
  color: var(--color-grey-700);
`;

export const Swatch = styled.span<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

export const TableScroll = styled.div`
  overflow-x: auto;
  border: var(--border-width-thin) solid var(--color-blue-50);
  border-radius: var(--border-radius-small);
`;

export const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-p-font-size);
  color: var(--color-midnight);

  th,
  td {
    padding: var(--spacing-12) var(--spacing-16);
    text-align: right;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
    border-bottom: var(--border-width-thin) solid var(--color-blue-50);
  }

  th:first-child,
  td:first-child {
    text-align: left;
  }

  thead th {
    background: var(--color-pink-50);
    font-weight: var(--font-weight-semi-bold);
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  tfoot td {
    font-weight: var(--font-weight-semi-bold);
    border-top: var(--border-width-thin) solid var(--color-blue-100);
    border-bottom: none;
  }
`;

export const Note = styled.p`
  margin: 0;
  font-size: var(--font-size-14, 14px);
  color: var(--color-grey-500);
`;

export const ChartScroll = styled.div`
  overflow-x: auto;
`;

export const ChartSvg = styled.svg`
  width: 100%;
  min-width: 640px;
  height: auto;

  .grid {
    stroke: var(--color-grey-200);
  }

  .baseline {
    stroke: var(--color-grey-400);
  }

  .axis {
    fill: var(--color-grey-500);
    font-size: 12px;
  }

  .bar:hover rect {
    opacity: 0.85;
  }
`;
