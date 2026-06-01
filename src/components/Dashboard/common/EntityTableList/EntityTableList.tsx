"use client";

import { Table, TableBody, TableContainer, TableHeader, TableHeaderCell } from "@/components/core/common/Table";
import { Wrapper } from "./styles";
import { EntityTableListProps } from "./types";
import PaginationNumbers from "@/components/core/paginatedGrid/PaginationNumbers";

export function EntityTableList<T extends { id: string | number }>({
  columns,
  data,
  renderRow,
  count,
  itemsPerPage,
  currentPage,
  setCurrentPage,
  testIdPrefix,
}: EntityTableListProps<T>) {
  const totalPages = Math.ceil(count / itemsPerPage);
  const goToPage = (page: number) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <Wrapper data-testid={`${testIdPrefix}-table`}>
      <TableContainer>
        <Table>
          <TableHeader>
            {columns.map((col) => (
              <TableHeaderCell key={col.key} $width={col.width}>
                {col.label}
              </TableHeaderCell>
            ))}
          </TableHeader>
          <TableBody>{data.map((item, index) => renderRow(item, index === data.length - 1))}</TableBody>
        </Table>
      </TableContainer>
      <PaginationNumbers currentPage={currentPage} goToPage={goToPage} totalPages={totalPages} />
    </Wrapper>
  );
}
