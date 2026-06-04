"use client";

import type {
  createEngagementStatusLabelMap,
  createMatchStatusLabelMap,
  createStatusLabelMap,
} from "@/components/Dashboard/Profile/sections/VolunteerAgents/types";
import { TableCell, TableRow } from "@/components/core/common/Table";
import { CirclePic } from "@/components/styled/img";
import { defaultAvatarURL } from "@/config/constants";
import { getImageUrl } from "@/utils";
import { ApiVolunteerGetList } from "need4deed-sdk";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { VOLUNTEER_COL_WIDTHS } from "./volunteerTableColumns";
import { getFirstName, getTopLanguages, truncateList } from "./helpers";

interface TableRowProps {
  volunteer: ApiVolunteerGetList;
  isLast: boolean;
  engagementLabels: ReturnType<typeof createEngagementStatusLabelMap>;
  typeLabels: ReturnType<typeof createStatusLabelMap>;
  matchLabels: ReturnType<typeof createMatchStatusLabelMap>;
  opportunityId?: string;
}

export function VolunteerTableRow({
  volunteer,
  isLast,
  engagementLabels,
  typeLabels,
  matchLabels,
  opportunityId,
}: TableRowProps) {
  const { i18n } = useTranslation();
  const router = useRouter();

  const { id, name, avatarUrl, statusEngagement, statusType, languages, locations } = volunteer;
  const { statusMatch, email } = volunteer as ApiVolunteerGetList;

  const topLangs = getTopLanguages(languages, 2);
  const languageText = truncateList(topLangs.length ? topLangs : languages.map((l) => l.title).filter(Boolean), 2) || "—";

  const districtTitles = locations
    .map((loc) => (typeof loc === "string" ? loc : loc?.title))
    .filter(Boolean) as string[];
  const districtText = truncateList(districtTitles, 2) || "—";

  const handleGoToProfile = () => {
    if (!id) return;
    const params = opportunityId ? `?opportunity=${opportunityId}` : "";
    router.push(`/${i18n.language}/dashboard/volunteers/${id}${params}`);
  };

  return (
    <ClickableRow $isLast={isLast} onClick={handleGoToProfile} data-testid={`volunteer-row-${id}`}>
      <NameCell data-testid={`volunteer-name-${id}`}>
        <CirclePic src={getImageUrl(avatarUrl || defaultAvatarURL)} size="32px" />
        <NameText>{getFirstName(name)}</NameText>
      </NameCell>
      <TableCell $width={VOLUNTEER_COL_WIDTHS.type} $noWrap data-testid={`volunteer-type-${id}`}>
        {statusType ? typeLabels[statusType] : "—"}
      </TableCell>
      <TableCell $width={VOLUNTEER_COL_WIDTHS.engagement} $noWrap data-testid={`volunteer-engagement-${id}`}>
        {statusEngagement ? engagementLabels[statusEngagement] : "—"}
      </TableCell>
      <TableCell $width={VOLUNTEER_COL_WIDTHS.matching} $noWrap data-testid={`volunteer-match-${id}`}>
        {statusMatch ? matchLabels[statusMatch] : "—"}
      </TableCell>
      <TableCell $width={VOLUNTEER_COL_WIDTHS.language} $noWrap data-testid={`volunteer-language-${id}`}>
        {languageText}
      </TableCell>
      <TableCell $width={VOLUNTEER_COL_WIDTHS.district} $noWrap data-testid={`volunteer-district-${id}`}>
        {districtText}
      </TableCell>
      <TableCell $noWrap data-testid={`volunteer-email-${id}`}>{email || "—"}</TableCell>
    </ClickableRow>
  );
}

const ClickableRow = styled(TableRow)`
  cursor: pointer;

  &:hover {
    background: var(--color-pink-50);
  }
`;

const NameCell = styled(TableCell)`
  overflow: hidden;
`;

const NameText = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
