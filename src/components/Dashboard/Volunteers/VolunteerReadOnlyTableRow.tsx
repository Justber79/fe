"use client";

import type {
  createEngagementStatusLabelMap,
  createStatusLabelMap,
} from "@/components/Dashboard/Profile/sections/VolunteerAgents/types";
import { ClickableRow, TableCell, TruncatedText } from "@/components/core/common/Table";
import { ApiVolunteerGetList } from "need4deed-sdk";
import { VOLUNTEER_COL_WIDTHS } from "./volunteerTableColumns";
import { getFirstName, truncateList } from "./helpers";

interface TableRowProps {
  volunteer: ApiVolunteerGetList;
  isLast: boolean;
  engagementLabels: ReturnType<typeof createEngagementStatusLabelMap>;
  typeLabels: ReturnType<typeof createStatusLabelMap>;
}

export function VolunteerReadOnlyTableRow({ volunteer, isLast, typeLabels }: TableRowProps) {
  const { id, name, statusType, locations } = volunteer;

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

  return (
    <ClickableRow $isLast={isLast} $cursor="auto" data-testid={`volunteer-row-${id}`}>
      <TableCell data-testid={`volunteer-name-${id}`}>
        <TruncatedText>{getFirstName(name)}</TruncatedText>
      </TableCell>
      <TableCell $width={VOLUNTEER_COL_WIDTHS.type} $noWrap $align="space-between" data-testid={`volunteer-type-${id}`}>
        <TruncatedText>{statusType ? typeLabels[statusType] : "—"}</TruncatedText>
      </TableCell>
      <TableCell $width={VOLUNTEER_COL_WIDTHS.district} $noWrap data-testid={`volunteer-district-${id}`}>
        <TruncatedText>{districtText}</TruncatedText>
      </TableCell>
    </ClickableRow>
  );
}
