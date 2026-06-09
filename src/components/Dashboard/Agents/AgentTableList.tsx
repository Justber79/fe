"use client";

import type { ApiAgentGetList, OptionItem } from "need4deed-sdk";
import { EntityTableList } from "../common/EntityTableList";
import { useTranslation } from "react-i18next";
import { createAgentTableColumns } from "./agentsTableColumns";
import { useMemo } from "react";
import { AgentTableRow } from "./AgentTableRow";
import { createAgentTypeMap, createVolunteerSearchMap } from "./constants";
import { CopyButton } from "../common/CopyButton";

interface TableListProps {
  agents: ApiAgentGetList[];
  count: number;
  itemsPerPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  districtsList?: OptionItem[];
  onCopyEmails: () => void;
  isCopying: boolean;
}

export function AgentTableList({
  agents,
  count,
  itemsPerPage,
  currentPage,
  setCurrentPage,
  districtsList,
  onCopyEmails,
  isCopying,
}: TableListProps) {
  const { t } = useTranslation();

  const columns = useMemo(() => {
    const copyButton = (
      <CopyButton
        onClick={onCopyEmails}
        disabled={isCopying}
        tooltipText={t("dashboard.common.copyEmails.tooltip")}
        ariaLabel={t("dashboard.common.copyEmails.tooltip")}
      />
    );
    return createAgentTableColumns(t, copyButton);
  }, [t, onCopyEmails, isCopying]);

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
          districtsList={districtsList}
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
