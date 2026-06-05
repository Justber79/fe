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

  const { id, name, avatarUrl, statusEngagement, statusType, languages, locations, statusMatch, email } = volunteer;

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
        .map((word) => word.trim()[0])
        .join("-");
      return abbreviation.toUpperCase();
    }
    return title;
  });
  const districtText = truncateList(abbreviatedDistricts, 1) || "—";

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
      <TableCell $width={VOLUNTEER_COL_WIDTHS.type} $noWrap data-testid={`volunteer-type-${id}`}>
        <TruncatedText>{statusType ? typeLabels[statusType] : "—"}</TruncatedText>
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
      <TableCell $width={VOLUNTEER_COL_WIDTHS.email} $noWrap data-testid={`volunteer-email-${id}`}>
        <TruncatedText>{email || "—"}</TruncatedText>
      </TableCell>
    </ClickableRow>
  );
}
