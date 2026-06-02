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
import { copyEmails } from "../common/copyEmails";

interface TableListProps {
  volunteers: ApiVolunteerGetList[];
  count: number;
  itemsPerPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  opportunityId?: string;
}

export function VolunteerTableList({
  volunteers,
  count,
  itemsPerPage,
  currentPage,
  setCurrentPage,
  opportunityId,
}: TableListProps) {
  const { t } = useTranslation();
  const engagementLabels = useMemo(() => createEngagementStatusLabelMap(t), [t]);
  const typeLabels = useMemo(() => createStatusLabelMap(t), [t]);
  const columns = useMemo(() => {
    const copyButton = (
      <CopyButton onClick={() => copyEmails(volunteers.map((volunteer) => volunteer.email).filter(Boolean))} />
    );
    return createVolunteerTableColumns(t, copyButton);
  }, [t, volunteers]);
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
