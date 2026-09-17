"use client";

import { useTranslation } from "react-i18next";
import { createOpportunityTableColumns } from "./opportunitiesTableColumns";
import { EntityTableList } from "../common/EntityTableList";
import { FilterItem } from "../common/CardsFilter/types";
import { DashboardListLoading } from "../common/DashboardListLoading";

interface TableListProps {
  dropdownFilters: {
    districtFilters: FilterItem[];
    languageFilters: FilterItem[];
  };
}

export function LoadingOpportunityTableList({ dropdownFilters }: TableListProps) {
  const { t } = useTranslation();
  const columns = createOpportunityTableColumns(t, dropdownFilters);

  return (
    <div>
      <EntityTableList
        columns={columns}
        data={[]}
        renderRow={() => <div />}
        count={0}
        itemsPerPage={0}
        currentPage={0}
        setCurrentPage={() => null}
        testIdPrefix="loading-opportunities"
      />
      <DashboardListLoading />
    </div>
  );
}
