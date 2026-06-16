"use client";

import type {
  createEngagementStatusLabelMap,
  createMatchStatusLabelMap,
  createStatusLabelMap,
} from "@/components/Dashboard/Profile/sections/VolunteerAgents/types";
import { ClickableRow, TableCell, TruncatedText } from "@/components/core/common/Table";
import { CirclePic } from "@/components/styled/img";
import { defaultAvatarURL } from "@/config/constants";
import { getImageUrl } from "@/utils";
import { ApiVolunteerGetList } from "need4deed-sdk";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { getVolunteerColWidths } from "./volunteerTableColumns";
import { getFirstName, getTopLanguages, truncateList } from "./helpers";
import { CopyEmail } from "../common/CopyEmail";
import { CheckCircleIcon } from "@phosphor-icons/react";
import { isBriefedAccompanying } from "../Profile/sections/ProfileHeader/common";

interface TableRowProps {
  volunteer: ApiVolunteerGetList;
  isLast: boolean;
  engagementLabels: ReturnType<typeof createEngagementStatusLabelMap>;
  typeLabels: ReturnType<typeof createStatusLabelMap>;
  matchLabels: ReturnType<typeof createMatchStatusLabelMap>;
  opportunityId?: string;
  canSeeContactColumns: boolean;
}

export function VolunteerTableRow({
  volunteer,
  isLast,
  engagementLabels,
  typeLabels,
  matchLabels,
  opportunityId,
  canSeeContactColumns,
}: TableRowProps) {
  const { i18n } = useTranslation();
  const router = useRouter();
  const VOLUNTEER_COL_WIDTHS = getVolunteerColWidths(canSeeContactColumns);

  const {
    id,
    name,
    avatarUrl,
    statusEngagement,
    statusType,
    languages,
    locations,
    statusMatch,
    email,
    statusCommunication,
  } = volunteer;

  const topLangs = getTopLanguages(languages, 2);
  const languageText =
    truncateList(topLangs.length ? topLangs : languages.map((l) => l.title).filter(Boolean), 2) || "—";

  const districtTitles = locations
    .map((loc) => (typeof loc === "string" ? loc : loc?.title))
    .filter(Boolean) as string[];
  const abbreviatedDistricts = districtTitles.map((title) => {
    if (title.includes("-")) {
      const abbreviation = title
        .split("-")
        .filter((word) => word.trim())
        .map((word) => word.trim()[0])
        .join("-");
      return abbreviation.toUpperCase();
    }
    return title;
  });
  const districtText = truncateList(abbreviatedDistricts, 1) || "—";
  const showBriefedCheck = isBriefedAccompanying(statusType, statusCommunication ?? undefined);

  const handleGoToProfile = () => {
    if (!id) return;
    const params = opportunityId ? `?opportunity=${opportunityId}` : "";
    router.push(`/${i18n.language}/dashboard/volunteers/${id}${params}`);
  };

  return (
    <ClickableRow $isLast={isLast} onClick={handleGoToProfile} data-testid={`volunteer-row-${id}`}>
      <TableCell $width={VOLUNTEER_COL_WIDTHS.name} data-testid={`volunteer-name-${id}`}>
        <CirclePic src={getImageUrl(avatarUrl || defaultAvatarURL)} size="32px" />
        <TruncatedText>{getFirstName(name)}</TruncatedText>
      </TableCell>
      <TableCell $width={VOLUNTEER_COL_WIDTHS.type} $noWrap $align="space-between" data-testid={`volunteer-type-${id}`}>
        <TruncatedText>{statusType ? typeLabels[statusType] : "—"}</TruncatedText>
        {showBriefedCheck && (
          <CheckCircleIcon size={18} color="var(--color-green-700)" weight="fill" style={{ flexShrink: 0 }} />
        )}
      </TableCell>
      <TableCell $width={VOLUNTEER_COL_WIDTHS.engagement} $noWrap data-testid={`volunteer-engagement-${id}`}>
        <TruncatedText>{statusEngagement ? engagementLabels[statusEngagement] : "—"}</TruncatedText>
      </TableCell>
      <TableCell $width={VOLUNTEER_COL_WIDTHS.matching} $noWrap data-testid={`volunteer-match-${id}`}>
        <TruncatedText>{statusMatch ? matchLabels[statusMatch] : "—"}</TruncatedText>
      </TableCell>
      <TableCell $width={VOLUNTEER_COL_WIDTHS.language} $noWrap data-testid={`volunteer-language-${id}`}>
        <TruncatedText>{languageText}</TruncatedText>
      </TableCell>
      <TableCell $width={VOLUNTEER_COL_WIDTHS.district} $noWrap data-testid={`volunteer-district-${id}`}>
        <TruncatedText>{districtText}</TruncatedText>
      </TableCell>
      {canSeeContactColumns && (
        <TableCell
          $width={VOLUNTEER_COL_WIDTHS.email}
          $noWrap
          $align="space-between"
          data-testid={`volunteer-email-${id}`}
        >
          <TruncatedText>{email || "—"}</TruncatedText>
          {email && <CopyEmail email={email} name={name} />}
        </TableCell>
      )}
    </ClickableRow>
  );
}
