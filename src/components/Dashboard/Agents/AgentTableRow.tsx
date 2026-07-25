"use client";

import type { ApiAgentGetList, Lang, OptionItem } from "need4deed-sdk";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { AGENT_COL_WIDTHS } from "./agentsTableColumns";
import { ClickableRow, TableCell } from "@/components/core/common/Table";
import { WrapAnywhereCell } from "../common/EntityTableList/styles";
import { CopyEmail } from "../common/CopyEmail";
import { extractOptionTitle } from "@/components/Dashboard/Profile/sections/OpportunityDetails/formatters";

interface TableRowProps {
  agent: ApiAgentGetList;
  isLast: boolean;
  searchLabels: Record<string, string>;
  districtsList?: OptionItem[];
}

export function AgentTableRow({ agent, isLast, searchLabels, districtsList }: TableRowProps) {
  const { i18n } = useTranslation();

  const { id, title, type, volunteerSearch, district, activeVolunteers, numOpportunities, email } = agent;
  const districtTitle = district?.id ? (districtsList?.find((d) => d.id === district.id)?.title ?? null) : null;
  const lang = i18n.language as Lang;

  const profileUrl = id ? `/${i18n.language}/dashboard/agents/${id}` : "";

  return (
    <ClickableRow as={Link} href={profileUrl} $isLast={isLast} data-testid={`agent-row-${id}`}>
      <TableCell $width={AGENT_COL_WIDTHS.title} data-testid={`agent-title-${id}`}>
        {title}
      </TableCell>
      <TableCell $width={AGENT_COL_WIDTHS.type} data-testid={`agent-type-${id}`}>
        {extractOptionTitle(type, lang)}
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
        {numOpportunities ?? "—"}
      </TableCell>
      <WrapAnywhereCell $width={AGENT_COL_WIDTHS.email} $align="space-between" data-testid={`agent-email-${id}`}>
        {email || "—"}
        {email && <CopyEmail email={email} name={title} />}
      </WrapAnywhereCell>
    </ClickableRow>
  );
}
