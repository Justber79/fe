"use client";

import { type ApiVolunteerOpportunityGetList, type OptionItem } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { ClickableRow, TableCell } from "@/components/core/common/Table";
import { OPPORTUNITY_READ_ONLY_COL_WIDTHS } from "./opportunitiesTableColumns";
import { abbreviateDistrict, getDistrictTitle, getOpportunityDisplayLanguages } from "./helpers";
import { getMatchStatusDisplay } from "./OpportunityCard.helpers";
import Link from "next/link";
import { formatLocation } from "@/utils/helpers";

interface TableRowProps {
  opportunity: ApiVolunteerOpportunityGetList;
  isLast: boolean;
  activitiesList?: OptionItem[];
  districtsList?: OptionItem[];
}

export function OpportunityReadOnlyTableRow({ opportunity, isLast, districtsList }: TableRowProps) {
  const { t, i18n } = useTranslation();
  const { id, title, volunteerType, district, languages } = opportunity;
  const matchStatus = getMatchStatusDisplay(opportunity.statusMatch, opportunity.noMatchFound);
  const displayLanguages = getOpportunityDisplayLanguages(languages);
  const districtTitle = getDistrictTitle(district, districtsList);
  const districtText =
    formatLocation(opportunity.postcode, districtTitle ? abbreviateDistrict(districtTitle) : null) || "—";

  const profileUrl = id ? `/${i18n.language}/dashboard/opportunities/${id}` : "";
  return (
    <ClickableRow as={Link} href={profileUrl} $isLast={isLast} $cursor="pointer" data-testid={`opportunity-row-${id}`}>
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
        {t(`dashboard.opportunities.matchStatus.${matchStatus}`)}
      </TableCell>
      <TableCell data-testid={`opportunity-languages-${id}`} $width={OPPORTUNITY_READ_ONLY_COL_WIDTHS.languages}>
        {displayLanguages || "—"}
      </TableCell>
      <TableCell data-testid={`opportunity-district-${id}`} $width={OPPORTUNITY_READ_ONLY_COL_WIDTHS.district}>
        {districtText || "—"}
      </TableCell>
    </ClickableRow>
  );
}
