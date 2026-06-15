"use client";

import { LangPurpose, type ApiVolunteerOpportunityGetList, type OptionItem } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { ClickableRow, TableCell } from "@/components/core/common/Table";
import { OPPORTUNITY_READ_ONLY_COL_WIDTHS } from "./opportunitiesTableColumns";
import { getLanguagesByPurpose } from "./helpers";

interface TableRowProps {
  opportunity: ApiVolunteerOpportunityGetList;
  isLast: boolean;
  activitiesList?: OptionItem[];
  districtsList?: OptionItem[];
}

export function OpportunityReadOnlyTableRow({ opportunity, isLast, districtsList }: TableRowProps) {
  const { t } = useTranslation();

  const { id, title, volunteerType, district, statusMatch, languages } = opportunity;
  const mainCommunication = getLanguagesByPurpose(languages, LangPurpose.GENERAL);
  const districtTitle = district?.id ? (districtsList?.find((d) => d.id === district.id)?.title ?? null) : null;
  return (
    <ClickableRow $isLast={isLast} $cursor={"auto"} data-testid={`opportunity-row-${id}`}>
      <TableCell data-testid={`opportunity-title-${id}`} $width={OPPORTUNITY_READ_ONLY_COL_WIDTHS.title}>
        {title}
      </TableCell>
      <TableCell
        data-testid={`opportunity-volunteer-type-${id}`}
        $width={OPPORTUNITY_READ_ONLY_COL_WIDTHS.volunteerType}
      >
        {t(`dashboard.opportunities.type.${volunteerType}`)}
      </TableCell>
      <TableCell data-testid={`opportunity-status-match-${id}`} $width={OPPORTUNITY_READ_ONLY_COL_WIDTHS.statusMatch}>
        {t(`dashboard.opportunities.matchStatus.${statusMatch}`)}
      </TableCell>
      <TableCell data-testid={`opportunity-languages-${id}`} $width={OPPORTUNITY_READ_ONLY_COL_WIDTHS.languages}>
        {mainCommunication || "—"}
      </TableCell>
      <TableCell data-testid={`opportunity-district-${id}`} $width={OPPORTUNITY_READ_ONLY_COL_WIDTHS.district}>
        {districtTitle || "—"}
      </TableCell>
    </ClickableRow>
  );
}
