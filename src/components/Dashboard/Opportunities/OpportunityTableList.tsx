"use client";

import type { ApiVolunteerOpportunityGetList, OptionItem } from "need4deed-sdk";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { EntityTableList } from "../common/EntityTableList";
import { createOpportunityTableColumns, createReadOnlyAgentTableColumns } from "./opportunitiesTableColumns";
import { OpportunityTableRow } from "./OpportunityTableRow";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { OpportunityReadOnlyTableRow } from "./OpportunityReadOnlyTableRow";

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
  const { isAuthorized } = useCurrentUser();

  const columns = useMemo(() => createOpportunityTableColumns(t), [t]);
  const readOnlyColumns = useMemo(() => createReadOnlyAgentTableColumns(t), [t]);
  return (
    <EntityTableList
      columns={isAuthorized ? columns : readOnlyColumns}
      data={opportunities}
      renderRow={(opportunity, isLast) =>
        isAuthorized ? (
          <OpportunityTableRow
            key={opportunity.id}
            opportunity={opportunity}
            isLast={isLast}
            districtsList={districtsList}
            activitiesList={activitiesList}
          />
        ) : (
          <OpportunityReadOnlyTableRow
            key={opportunity.id}
            opportunity={opportunity}
            isLast={isLast}
            districtsList={districtsList}
          />
        )
      }
      count={count}
      itemsPerPage={itemsPerPage}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      testIdPrefix="opportunities"
    />
  );
}
