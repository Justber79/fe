"use client";

import type { ApiAgentGetList, OptionItem } from "need4deed-sdk";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { AGENT_COL_WIDTHS } from "./agentsTableColumns";
import { TableCell, TableRow } from "@/components/core/common/Table";
import styled from "styled-components";
import { WrapAnywhereCell } from "../common/EntityTableList/styles";

interface TableRowProps {
  agent: ApiAgentGetList;
  isLast: boolean;
  typeLabels: Record<string, string>;
  searchLabels: Record<string, string>;
  districtsList?: OptionItem[];
}

export function AgentTableRow({ agent, isLast, typeLabels, searchLabels, districtsList }: TableRowProps) {
  const { i18n } = useTranslation();
  const router = useRouter();

  const { id, title, type, volunteerSearch, district, activeVolunteers, email } = agent;
  const districtTitle = district?.id ? (districtsList?.find((d) => d.id === district.id)?.title ?? null) : null;

  const handleGoToProfile = () => {
    if (!id) return;
    router.push(`/${i18n.language}/dashboard/agents/${id}`);
  };

  return (
    <ClickableRow $isLast={isLast} onClick={handleGoToProfile} data-testid={`agent-row-${id}`}>
      <TableCell data-testid={`agent-title-${id}`}>{title}</TableCell>
      <TableCell $width={AGENT_COL_WIDTHS.type} data-testid={`agent-type-${id}`}>
        {typeLabels[type] || type}
      </TableCell>
      <TableCell $width={AGENT_COL_WIDTHS.volunteerSearch} data-testid={`agent-search-${id}`}>
        {searchLabels[volunteerSearch] || volunteerSearch}
      </TableCell>
      <TableCell $width={AGENT_COL_WIDTHS.district} data-testid={`agent-district-${id}`}>
        {districtTitle || "—"}
      </TableCell>
      <TableCell $width={AGENT_COL_WIDTHS.activeVolunteers} data-testid={`agent-active-volunteers-${id}`}>
        {activeVolunteers}
      </TableCell>
      <TableCell $width={AGENT_COL_WIDTHS.numOpportunities} data-testid={`agent-opportunities-${id}`}>
        {"—"}
      </TableCell>
      <WrapAnywhereCell data-testid={`agent-email-${id}`}>{email || "—"}</WrapAnywhereCell>
    </ClickableRow>
  );
}

const ClickableRow = styled(TableRow)`
  cursor: pointer;

  &:hover {
    background: var(--color-pink-50);
  }
`;
