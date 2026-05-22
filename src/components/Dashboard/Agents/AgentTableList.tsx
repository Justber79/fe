"use client";

import type { ApiAgentGetList } from "need4deed-sdk";
import { EntityTableList } from "../common/EntityTableList";
import { useTranslation } from "react-i18next";
import { createAgentTableColumns } from "./agentsTableColumns";
import { useMemo } from "react";
import { AgentTableRow } from "./AgentTableRow";
import { createAgentTypeMap, createVolunteerSearchMap } from "./icon";

interface TableListProps {
  agents: ApiAgentGetList[];
  count: number;
  itemsPerPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export function AgentTableList({ agents, count, itemsPerPage, currentPage, setCurrentPage }: TableListProps) {
  const { t } = useTranslation();

  const columns = useMemo(() => createAgentTableColumns(t), [t]);
  const typeLabels = useMemo(() => createAgentTypeMap(t), [t]);
  const searchLabels = useMemo(() => createVolunteerSearchMap(t), [t]);

  return (
    <EntityTableList
      columns={columns}
      data={agents}
      renderRow={(agent, isLast) => (
        <AgentTableRow
          key={agent.id}
          agent={agent}
          isLast={isLast}
          typeLabels={typeLabels}
          searchLabels={searchLabels}
        />
      )}
      count={count}
      itemsPerPage={itemsPerPage}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      testIdPrefix="agents"
    />
  );
}
