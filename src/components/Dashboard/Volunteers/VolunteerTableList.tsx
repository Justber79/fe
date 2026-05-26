"use client";

import { ApiVolunteerGetList } from "need4deed-sdk";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import {
  createEngagementStatusLabelMap,
  createStatusLabelMap,
} from "@/components/Dashboard/Profile/sections/VolunteerAgents/types";
import { Table, TableBody, TableContainer, TableHeader, TableHeaderCell } from "@/components/core/common/Table";
import PaginationNumbers from "@/components/core/paginatedGrid/PaginationNumbers";
import { VolunteerTableRow } from "./VolunteerTableRow";

interface TableListProps {
  volunteers: ApiVolunteerGetList[];
  count: number;
  itemsPerPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  opportunityId?: string;
}

export function VolunteerTableList({
  volunteers,
  count,
  itemsPerPage,
  currentPage,
  setCurrentPage,
  opportunityId,
}: TableListProps) {
  const { t } = useTranslation();
  const totalPages = Math.ceil(count / itemsPerPage);

  const engagementLabels = useMemo(() => createEngagementStatusLabelMap(t), [t]);
  const typeLabels = useMemo(() => createStatusLabelMap(t), [t]);

  const goToPage = (page: number) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <Wrapper data-testid="volunteers-table">
      <TableContainer>
        <Table>
          <TableHeader>
            <TableHeaderCell>{t("dashboard.volunteers.table.name")}</TableHeaderCell>
            <TableHeaderCell $width="180px">{t("dashboard.volunteers.table.type")}</TableHeaderCell>
            <TableHeaderCell $width="200px">{t("dashboard.volunteers.table.engagementStatus")}</TableHeaderCell>
            <TableHeaderCell $width="140px">{t("dashboard.volunteers.table.matchingStatus")}</TableHeaderCell>
            <TableHeaderCell $width="180px">{t("dashboard.volunteers.table.language")}</TableHeaderCell>
            <TableHeaderCell $width="200px">{t("dashboard.volunteers.table.district")}</TableHeaderCell>
            <TableHeaderCell>{t("dashboard.volunteers.table.email")}</TableHeaderCell>
          </TableHeader>
          <TableBody>
            {volunteers.map((volunteer, index) => (
              <VolunteerTableRow
                key={volunteer.id}
                volunteer={volunteer}
                isLast={index === volunteers.length - 1}
                engagementLabels={engagementLabels}
                typeLabels={typeLabels}
                opportunityId={opportunityId}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationNumbers currentPage={currentPage} goToPage={goToPage} totalPages={totalPages} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--opportunities-container-gap);
  width: 100%;
`;
