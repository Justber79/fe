"use client";

import { LangPurpose, type ApiVolunteerOpportunityGetList, type OptionItem } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { ClickableRow, TableCell } from "@/components/core/common/Table";
import { OPPORTUNITY_READ_ONLY_COL_WIDTHS } from "./opportunitiesTableColumns";
import { abbreviateDistrict, getLanguagesByPurpose } from "./helpers";

interface TableRowProps {
  opportunity: ApiVolunteerOpportunityGetList;
  isLast: boolean;
  activitiesList?: OptionItem[];
  districtsList?: OptionItem[];
}

export function OpportunityReadOnlyTableRow({ opportunity, isLast, districtsList }: TableRowProps) {
  const { t } = useTranslation();
  const { id, title, volunteerType, location, languages } = opportunity;
  // statusMatch is not yet in ApiVolunteerOpportunityGetList SDK type
  const statusMatch = (opportunity as ApiVolunteerOpportunityGetList & { statusMatch?: string }).statusMatch;
  const mainCommunication = getLanguagesByPurpose(languages, LangPurpose.GENERAL);
  const districtTitle = location[0]?.id ? (districtsList?.find((d) => d.id === location[0].id)?.title ?? null) : null;
  const districtText = abbreviateDistrict(districtTitle) || "—";
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
        {districtText || "—"}
      </TableCell>
    </ClickableRow>
  );
}
