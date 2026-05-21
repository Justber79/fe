import { ReactNode } from "react";

export interface Column {
  key: string;
  label: string;
  width?: string;
}

export interface EntityTableListProps<T extends { id: string | number }> {
  columns: Column[];
  data: T[];
  renderRow: (item: T, isLast: boolean) => ReactNode;
  count: number;
  itemsPerPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  testIdPrefix: string;
}
