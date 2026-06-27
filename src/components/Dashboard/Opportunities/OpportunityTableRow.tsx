"use client";

import type { ApiVolunteerOpportunityGetList, OptionItem } from "need4deed-sdk";
import { LangPurpose, ProfileVolunteeringType } from "need4deed-sdk";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ClickableRow, TableCell, TruncatedText, WrappedText } from "@/components/core/common/Table";
import { OPPORTUNITY_COL_WIDTHS } from "./opportunitiesTableColumns";
import { abbreviateDistrict, formatAccompanyingDate, formatSchedule, getLanguagesByPurpose } from "./helpers";
import { MatchedBadge } from "./styles";
import { OpportunityMatchStatusType } from "./OpportunityCard.helpers";
import type { ApiOpportunityAccompanyingDetails } from "need4deed-sdk";

// These fields are not yet in ApiVolunteerOpportunityGetList SDK type
type ExtendedOpportunity = ApiVolunteerOpportunityGetList & {
  statusMatch?: string;
  accompanyingDetails?: ApiOpportunityAccompanyingDetails & {
    appointmentPostcode?: string;
    appointmentDistrict?: { title: Record<string, string> };
  };
  agentTitle?: string;
  numberOfVolunteers?: number;
};

interface TableRowProps {
  opportunity: ApiVolunteerOpportunityGetList;
  isLast: boolean;
  districtsList?: OptionItem[];
}

export function OpportunityTableRow({ opportunity, isLast, districtsList }: TableRowProps) {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const ext = opportunity as ExtendedOpportunity;
  const { id, title, volunteerType, languages, availability, location } = opportunity;
  const { statusMatch, accompanyingDetails, agentTitle, numberOfVolunteers } = ext;

  const districtTitle = location[0]?.id ? (districtsList?.find((d) => d.id === location[0].id)?.title ?? null) : null;
  const districtText = abbreviateDistrict(districtTitle) || "—";
  const isAccompanying = volunteerType === ProfileVolunteeringType.ACCOMPANYING;
  const scheduleText = isAccompanying
    ? formatAccompanyingDate(accompanyingDetails)
    : availability?.length
      ? formatSchedule(availability, t)
      : null;

  const mainCommunication = getLanguagesByPurpose(languages, LangPurpose.GENERAL);
  const isMatched = statusMatch === OpportunityMatchStatusType.MATCHED;
  const statusLabel = statusMatch ? t(`dashboard.opportunities.matchStatus.${statusMatch}`) : "—";

  const handleGoToProfile = () => {
    if (!id) return;
    router.push(`/${i18n.language}/dashboard/opportunities/${id}`);
  };

  return (
    <ClickableRow $isLast={isLast} onClick={handleGoToProfile} data-testid={`opportunity-row-${id}`}>
      <TableCell $width={OPPORTUNITY_COL_WIDTHS.title} data-testid={`opportunity-title-${id}`}>
        <WrappedText>{title}</WrappedText>
      </TableCell>
      <TableCell $width={OPPORTUNITY_COL_WIDTHS.schedule} data-testid={`opportunity-schedule-${id}`}>
        <WrappedText>{scheduleText || "—"}</WrappedText>
      </TableCell>
      <TableCell $noWrap $width={OPPORTUNITY_COL_WIDTHS.statusMatch} data-testid={`opportunity-status-match-${id}`}>
        {isMatched ? <MatchedBadge>{statusLabel}</MatchedBadge> : <TruncatedText>{statusLabel}</TruncatedText>}
      </TableCell>
      <TableCell $noWrap $width={OPPORTUNITY_COL_WIDTHS.languages} data-testid={`opportunity-languages-${id}`}>
        <TruncatedText>{mainCommunication || "—"}</TruncatedText>
      </TableCell>
      <TableCell $noWrap $width={OPPORTUNITY_COL_WIDTHS.district} data-testid={`opportunity-district-${id}`}>
        <TruncatedText>{districtText}</TruncatedText>
      </TableCell>
      <TableCell
        $width={OPPORTUNITY_COL_WIDTHS.numberOfVolunteers}
        data-testid={`opportunity-number-of-volunteers-${id}`}
      >
        <WrappedText>{numberOfVolunteers ?? "—"}</WrappedText>
      </TableCell>
      <TableCell $noWrap $width={OPPORTUNITY_COL_WIDTHS.agentTitle} data-testid={`opportunity-agent-${id}`}>
        <TruncatedText>{agentTitle || "—"}</TruncatedText>
      </TableCell>
    </ClickableRow>
  );
}
