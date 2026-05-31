"use client";

import type { ApiVolunteerOpportunityGetList, OptionItem } from "need4deed-sdk";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { EntityTableList } from "../common/EntityTableList";
import { createOpportunityTableColumns } from "./opportunitiesTableColumns";
import { OpportunityTableRow } from "./OpportunityTableRow";

interface TableListProps {
  opportunities: ApiVolunteerOpportunityGetList[];
  count: number;
  itemsPerPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  districtsList?: OptionItem[];
  activitiesList?: OptionItem[];
}

export function OpportunityTableList({
  opportunities,
  count,
  itemsPerPage,
  currentPage,
  setCurrentPage,
  districtsList,
  activitiesList,
}: TableListProps) {
  const { t } = useTranslation();

  const columns = useMemo(() => createOpportunityTableColumns(t), [t]);

  return (
    <EntityTableList
      columns={columns}
      data={opportunities}
      renderRow={(opportunity, isLast) => (
        <OpportunityTableRow
          key={opportunity.id}
          opportunity={opportunity}
          isLast={isLast}
          districtsList={districtsList}
          activitiesList={activitiesList}
        />
      )}
      count={count}
      itemsPerPage={itemsPerPage}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      testIdPrefix="opportunities"
    />
  );
}
