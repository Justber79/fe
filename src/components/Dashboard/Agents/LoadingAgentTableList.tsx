"use client";

import { useTranslation } from "react-i18next";
import { createAgentTableColumns } from "./agentsTableColumns";
import { EntityTableList } from "../common/EntityTableList";
import { FilterItem } from "../common/CardsFilter/types";
import { DashboardListLoading } from "../common/DashboardListLoading";

interface TableListProps {
  dropdownFilters: {
    districtFilters: FilterItem[];
  };
}

export function LoadingAgentTableList({ dropdownFilters }: TableListProps) {
  const { t } = useTranslation();
  const columns = createAgentTableColumns(t, null, dropdownFilters);

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
        testIdPrefix="loading-agents"
      />
      <DashboardListLoading />
    </div>
  );
}
