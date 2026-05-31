"use client";

import { ApiVolunteerOpportunityGetList, LangPurpose, OptionItem, ProfileVolunteeringType } from "need4deed-sdk";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { getActivityTitles, getLanguagesByPurpose } from "./helpers";
import { TableCell, TableRow } from "@/components/core/common/Table";
import { OPPORTUNITY_COL_WIDTHS } from "./opportunitiesTableColumns";
import { formatAccompanyingDate, formatAvailability } from "./OpportunityCard.helpers";

interface TableRowProps {
  opportunity: ApiVolunteerOpportunityGetList;
  isLast: boolean;
  activitiesList?: OptionItem[];
  districtsList?: OptionItem[];
}

export function OpportunityTableRow({ opportunity, isLast, activitiesList, districtsList }: TableRowProps) {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const {
    id,
    title,
    volunteerType,
    statusOpportunity,
    statusMatch,
    languages,
    activities,
    availability,
    accompanyingDetails,
    district,
    agentTitle,
    numberOfVolunteers,
  } = opportunity;
  const districtTitle = district?.id ? (districtsList?.find((d) => d.id === district.id)?.title ?? null) : null;
  const isAccompanying = volunteerType === ProfileVolunteeringType.ACCOMPANYING;
  const scheduleText = isAccompanying
    ? formatAccompanyingDate(accompanyingDetails)
    : availability?.length
      ? formatAvailability(availability)
      : null;

  const activityTitles = getActivityTitles(activities, activitiesList);
  const mainCommunication = getLanguagesByPurpose(languages, LangPurpose.GENERAL);

  const handleGoToProfile = () => {
    if (!id) return;
    router.push(`/${i18n.language}/dashboard/opportunities/${id}`);
  };

  return (
    <ClickableRow $isLast={isLast} onClick={handleGoToProfile} data-testid={`opportunity-row-${id}`}>
      <TableCell $width={OPPORTUNITY_COL_WIDTHS.title} data-testid={`opportunity-title-${id}`}>
        {title}
      </TableCell>
      <TableCell $width={OPPORTUNITY_COL_WIDTHS.volunteerType} data-testid={`opportunity-volunteer-type-${id}`}>
        {t(`dashboard.opportunities.type.${volunteerType}`)}
      </TableCell>
      <TableCell $width={OPPORTUNITY_COL_WIDTHS.statusOpportunity} data-testid={`opportunity-status-opportunity-${id}`}>
        {t(`dashboard.opportunities.status.${statusOpportunity}`)}
      </TableCell>
      <TableCell $width={OPPORTUNITY_COL_WIDTHS.statusMatch} data-testid={`opportunity-status-match-${id}`}>
        {t(`dashboard.opportunities.matchStatus.${statusMatch}`)}
      </TableCell>
      <TableCell $width={OPPORTUNITY_COL_WIDTHS.languages} data-testid={`opportunity-languages-${id}`}>
        {mainCommunication || "—"}
      </TableCell>
      <TableCell $width={OPPORTUNITY_COL_WIDTHS.activities} data-testid={`opportunity-activities-${id}`}>
        {activityTitles.join(", ") || "—"}
      </TableCell>
      <TableCell $width={OPPORTUNITY_COL_WIDTHS.district} data-testid={`opportunity-district-${id}`}>
        {districtTitle || "—"}
      </TableCell>
      <TableCell $width={OPPORTUNITY_COL_WIDTHS.schedule} data-testid={`opportunity-schedule-${id}`}>
        {scheduleText || "—"}
      </TableCell>
      <TableCell
        $width={OPPORTUNITY_COL_WIDTHS.numberOfVolunteers}
        data-testid={`opportunity-number-of-volunteers-${id}`}
      >
        {numberOfVolunteers ?? "—"}
      </TableCell>
      <TableCell $width={OPPORTUNITY_COL_WIDTHS.agentTitle} data-testid={`opportunity-agent-${id}`}>
        {agentTitle || "—"}
      </TableCell>
    </ClickableRow>
  );
}

const ClickableRow = styled(TableRow)`
  cursor: pointer;

  &:hover {
    background: var(--color-pink-50);
  }
`;
