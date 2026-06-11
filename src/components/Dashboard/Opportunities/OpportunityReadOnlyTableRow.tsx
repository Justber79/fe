"use client";

import type { ApiVolunteerOpportunityGetList, OptionItem } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { ClickableRow, TableCell } from "@/components/core/common/Table";
import { OPPORTUNITY_COL_WIDTHS } from "./opportunitiesTableColumns";

interface TableRowProps {
  opportunity: ApiVolunteerOpportunityGetList;
  isLast: boolean;
  activitiesList?: OptionItem[];
  districtsList?: OptionItem[];
}

export function OpportunityReadOnlyTableRow({ opportunity, isLast, districtsList }: TableRowProps) {
  const { t } = useTranslation();

  const { id, title, volunteerType, district } = opportunity;
  const districtTitle = district?.id ? (districtsList?.find((d) => d.id === district.id)?.title ?? null) : null;
  return (
    <ClickableRow $isLast={isLast} $cursor={"auto"} data-testid={`opportunity-row-${id}`}>
      <TableCell data-testid={`opportunity-title-${id}`}>{title}</TableCell>
      <TableCell $width={OPPORTUNITY_COL_WIDTHS.volunteerType} data-testid={`opportunity-volunteer-type-${id}`}>
        {t(`dashboard.opportunities.type.${volunteerType}`)}
      </TableCell>
      <TableCell $width={OPPORTUNITY_COL_WIDTHS.district} data-testid={`opportunity-district-${id}`}>
        {districtTitle || "—"}
      </TableCell>
    </ClickableRow>
  );
}
