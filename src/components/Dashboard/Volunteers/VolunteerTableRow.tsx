"use client";

import { ApiVolunteerGetList } from "need4deed-sdk";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import type {
  createEngagementStatusLabelMap,
  createStatusLabelMap,
} from "@/components/Dashboard/Profile/sections/VolunteerAgents/types";
import { TableCell, TableRow } from "@/components/core/common/Table";
import { CirclePic } from "@/components/styled/img";
import { defaultAvatarURL } from "@/config/constants";
import { getImageUrl } from "@/utils";

interface TableRowProps {
  volunteer: ApiVolunteerGetList;
  isLast: boolean;
  engagementLabels: ReturnType<typeof createEngagementStatusLabelMap>;
  typeLabels: ReturnType<typeof createStatusLabelMap>;
  opportunityId?: string;
}

export function VolunteerTableRow({ volunteer, isLast, engagementLabels, typeLabels, opportunityId }: TableRowProps) {
  const { i18n } = useTranslation();
  const router = useRouter();

  const { id, name, avatarUrl, statusEngagement, statusType, languages, locations } = volunteer;

  const languageText =
    languages
      .map((language) => language.title)
      .filter(Boolean)
      .join(", ") || "—";
  const districtText =
    locations
      .map((location) => (typeof location === "string" ? location : location?.title))
      .filter(Boolean)
      .join(", ") || "—";

  const handleGoToProfile = () => {
    if (!id) return;
    const params = opportunityId ? `?opportunity=${opportunityId}` : "";
    router.push(`/${i18n.language}/dashboard/volunteers/${id}${params}`);
  };

  return (
    <ClickableRow $isLast={isLast} onClick={handleGoToProfile} data-testid={`volunteer-row-${id}`}>
      <NameCell data-testid={`volunteer-name-${id}`}>
        <CirclePic src={getImageUrl(avatarUrl || defaultAvatarURL)} size="32px" />
        <NameText>{name}</NameText>
      </NameCell>
      <TableCell $width="180px" data-testid={`volunteer-type-${id}`}>
        {statusType ? typeLabels[statusType] : "—"}
      </TableCell>
      <TableCell $width="200px" data-testid={`volunteer-engagement-${id}`}>
        {statusEngagement ? engagementLabels[statusEngagement] : "—"}
      </TableCell>
      <TableCell $width="140px" data-testid={`volunteer-match-${id}`}>
        —
      </TableCell>
      <TableCell $width="180px" data-testid={`volunteer-language-${id}`}>
        {languageText}
      </TableCell>
      <TableCell $width="200px" data-testid={`volunteer-district-${id}`}>
        {districtText}
      </TableCell>
      <TableCell data-testid={`volunteer-email-${id}`}>—</TableCell>
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
