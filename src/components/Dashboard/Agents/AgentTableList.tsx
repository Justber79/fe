"use client";

import type { ApiAgentGetList, OptionItem } from "need4deed-sdk";
import { EntityTableList } from "../common/EntityTableList";
import { useTranslation } from "react-i18next";
import { createAgentTableColumns, createReadOnlyAgentTableColumns } from "./agentsTableColumns";
import { useMemo } from "react";
import { AgentTableRow } from "./AgentTableRow";
import { createVolunteerSearchMap } from "./constants";
import { CopyButton } from "../common/CopyButton";
import { AgentReadOnlyTableRow } from "./AgentReadOnlyTableRow";
import { useAuth } from "@/hooks/useAuth";

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
  const { isAuthorized } = useAuth();

  const columns = useMemo(() => {
    const copyButton = (
      <CopyButton
        onClick={onCopyEmails}
        disabled={isCopying}
        tooltipText={t("dashboard.common.copyEmails.tooltip")}
        ariaLabel={t("dashboard.common.copyEmails.copyAriaAllAgents")}
      />
    );
    return createAgentTableColumns(t, copyButton);
  }, [t, onCopyEmails, isCopying]);
  const readOnlyColumns = useMemo(() => createReadOnlyAgentTableColumns(t), [t]);
  const searchLabels = useMemo(() => createVolunteerSearchMap(t), [t]);

  return (
    <EntityTableList
      columns={isAuthorized ? columns : readOnlyColumns}
      data={agents}
      renderRow={(agent, isLast) =>
        isAuthorized ? (
          <AgentTableRow
            key={agent.id}
            agent={agent}
            isLast={isLast}
            searchLabels={searchLabels}
            districtsList={districtsList}
          />
        ) : (
          <AgentReadOnlyTableRow key={agent.id} agent={agent} isLast={isLast} districtsList={districtsList} />
        )
      }
      count={count}
      itemsPerPage={itemsPerPage}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      testIdPrefix="agents"
      noFixedWidth={!isAuthorized}
    />
  );
}
