"use client";

import type { ApiVolunteerGetList } from "need4deed-sdk";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  createEngagementStatusLabelMap,
  createMatchStatusLabelMap,
  createStatusLabelMap,
} from "@/components/Dashboard/Profile/sections/VolunteerAgents/types";
import { createVolunteerTableColumns } from "./volunteerTableColumns";
import { VolunteerTableRow } from "./VolunteerTableRow";
import { EntityTableList } from "../common/EntityTableList";
import { CopyButton } from "../common/CopyButton";

interface TableListProps {
  volunteers: ApiVolunteerGetList[];
  count: number;
  itemsPerPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  opportunityId?: string;
  onCopyEmails: () => void;
  isCopying: boolean;
  canSeeContactColumns: boolean;
}

export function VolunteerTableList({
  volunteers,
  count,
  itemsPerPage,
  currentPage,
  setCurrentPage,
  opportunityId,
  onCopyEmails,
  isCopying,
  canSeeContactColumns,
}: TableListProps) {
  const { t } = useTranslation();
  const engagementLabels = useMemo(() => createEngagementStatusLabelMap(t), [t]);
  const typeLabels = useMemo(() => createStatusLabelMap(t), [t]);
  const columns = useMemo(() => {
    const copyButton = (
      <CopyButton
        onClick={onCopyEmails}
        disabled={isCopying}
        tooltipText={t("dashboard.volunteers.copyEmails.tooltip")}
        ariaLabel={t("dashboard.volunteers.copyEmails.tooltip")}
      />
    );
    return createVolunteerTableColumns(t, copyButton, canSeeContactColumns);
  }, [t, onCopyEmails, isCopying, canSeeContactColumns]);
  const matchLabels = useMemo(() => createMatchStatusLabelMap(t), [t]);

  return (
    <EntityTableList
      columns={columns}
      data={volunteers}
      renderRow={(volunteer, isLast) => (
        <VolunteerTableRow
          key={volunteer.id}
          volunteer={volunteer}
          isLast={isLast}
          engagementLabels={engagementLabels}
          typeLabels={typeLabels}
          matchLabels={matchLabels}
          opportunityId={opportunityId}
          canSeeContactColumns={canSeeContactColumns}
        />
      )}
      count={count}
      itemsPerPage={itemsPerPage}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      testIdPrefix="volunteers"
    />
  );
}
