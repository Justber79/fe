"use client";

import type { ApiVolunteerOpportunityGetList, OptionItem } from "need4deed-sdk";
import { LangPurpose, ProfileVolunteeringType } from "need4deed-sdk";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ClickableRow, TableCell, TruncatedText } from "@/components/core/common/Table";
import { OPPORTUNITY_COL_WIDTHS } from "./opportunitiesTableColumns";
import { formatAccompanyingDate, formatSchedule, getLanguagesByPurpose } from "./helpers";

interface TableRowProps {
  opportunity: ApiVolunteerOpportunityGetList;
  isLast: boolean;
  districtsList?: OptionItem[];
}

export function OpportunityTableRow({ opportunity, isLast, districtsList }: TableRowProps) {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const {
    id,
    title,
    volunteerType,
    statusMatch,
    languages,
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
      ? formatSchedule(availability, t)
      : null;

  const mainCommunication = getLanguagesByPurpose(languages, LangPurpose.GENERAL);
  const handleGoToProfile = () => {
    if (!id) return;
    router.push(`/${i18n.language}/dashboard/opportunities/${id}`);
  };

  return (
    <ClickableRow $isLast={isLast} onClick={handleGoToProfile} data-testid={`opportunity-row-${id}`}>
      <TableCell $noWrap $width={OPPORTUNITY_COL_WIDTHS.title} data-testid={`opportunity-title-${id}`}>
        <TruncatedText>{title}</TruncatedText>
      </TableCell>
      <TableCell $noWrap $width={OPPORTUNITY_COL_WIDTHS.schedule} data-testid={`opportunity-schedule-${id}`}>
        <TruncatedText>{scheduleText || "—"}</TruncatedText>
      </TableCell>
      <TableCell $noWrap $width={OPPORTUNITY_COL_WIDTHS.statusMatch} data-testid={`opportunity-status-match-${id}`}>
        <TruncatedText>{t(`dashboard.opportunities.matchStatus.${statusMatch}`)}</TruncatedText>
      </TableCell>
      <TableCell $noWrap $width={OPPORTUNITY_COL_WIDTHS.languages} data-testid={`opportunity-languages-${id}`}>
        <TruncatedText>{mainCommunication || "—"}</TruncatedText>
      </TableCell>
      <TableCell $noWrap $width={OPPORTUNITY_COL_WIDTHS.district} data-testid={`opportunity-district-${id}`}>
        <TruncatedText>{districtTitle || "—"}</TruncatedText>
      </TableCell>
      <TableCell
        $noWrap
        $width={OPPORTUNITY_COL_WIDTHS.numberOfVolunteers}
        data-testid={`opportunity-number-of-volunteers-${id}`}
      >
        {numberOfVolunteers ?? "—"}
      </TableCell>
      <TableCell $noWrap $width={OPPORTUNITY_COL_WIDTHS.agentTitle} data-testid={`opportunity-agent-${id}`}>
        <TruncatedText>{agentTitle || "—"}</TruncatedText>
      </TableCell>
    </ClickableRow>
  );
}
