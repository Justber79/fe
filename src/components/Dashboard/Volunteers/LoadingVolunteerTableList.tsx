"use client";

import { useTranslation } from "react-i18next";
import { createVolunteerTableColumns } from "./volunteerTableColumns";
import { EntityTableList } from "../common/EntityTableList";
import { FilterItem } from "../common/CardsFilter/types";

interface TableListProps {
  canSeeContactColumns: boolean;
  dropdownFilters: {
    districtFilters: FilterItem[];
    engagementFilters: FilterItem[];
    languageFilters: FilterItem[];
    typeFilters: FilterItem[];
  };
}

export function LoadingVolunteerTableList({ canSeeContactColumns, dropdownFilters }: TableListProps) {
  const { t } = useTranslation();
  const columns = createVolunteerTableColumns(t, null, canSeeContactColumns, dropdownFilters);

  return (
    <EntityTableList
      columns={columns}
      data={[]}
      renderRow={() => <div />}
      count={0}
      itemsPerPage={0}
      currentPage={0}
      setCurrentPage={() => null}
      testIdPrefix="loading-volunteers"
    />
  );
}
