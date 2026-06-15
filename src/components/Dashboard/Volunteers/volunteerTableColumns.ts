import { TFunction } from "i18next";
import { Column } from "../common/EntityTableList";
import { COLUMN_WIDTH } from "../common/EntityTableList/columnWidths";
import { ReactNode } from "react";

const FULL_WIDTHS = {
  name: COLUMN_WIDTH.SM,
  type: COLUMN_WIDTH.LG,
  engagement: COLUMN_WIDTH.LG,
  matching: COLUMN_WIDTH.SM,
  language: COLUMN_WIDTH.MD,
  district: COLUMN_WIDTH.SM,
  email: COLUMN_WIDTH.XXXL,
};
const RESTRICTED_WIDTHS = {
  ...FULL_WIDTHS,
  name: COLUMN_WIDTH.LG,
  type: COLUMN_WIDTH.XXXL,
  engagement: COLUMN_WIDTH.XXXL,
  matching: COLUMN_WIDTH.XXL,
  language: COLUMN_WIDTH.LG,
};

export const getVolunteerColWidths = (canSeeContactColumns: boolean) =>
  canSeeContactColumns ? FULL_WIDTHS : RESTRICTED_WIDTHS;

export const createVolunteerTableColumns = (
  t: TFunction,
  copyButton: ReactNode,
  canSeeContactColumns: boolean,
): Column[] => {
  const VOLUNTEER_COL_WIDTHS = getVolunteerColWidths(canSeeContactColumns);

  const columns: Column[] = [
    { key: "name", label: t("dashboard.volunteers.table.name"), width: VOLUNTEER_COL_WIDTHS.name },
    { key: "type", label: t("dashboard.volunteers.table.type"), width: VOLUNTEER_COL_WIDTHS.type },
    {
      key: "engagement",
      label: t("dashboard.volunteers.table.engagementStatus"),
      width: VOLUNTEER_COL_WIDTHS.engagement,
    },
    { key: "matching", label: t("dashboard.volunteers.table.matchingStatus"), width: VOLUNTEER_COL_WIDTHS.matching },
    { key: "language", label: t("dashboard.volunteers.table.language"), width: VOLUNTEER_COL_WIDTHS.language },
    { key: "district", label: t("dashboard.volunteers.table.district"), width: VOLUNTEER_COL_WIDTHS.district },
  ];

  if (canSeeContactColumns) {
    columns.push({
      key: "email",
      label: t("dashboard.volunteers.table.email"),
      width: VOLUNTEER_COL_WIDTHS.email,
      headerAction: copyButton,
    });
  }

  return columns;
};
