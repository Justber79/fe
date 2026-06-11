import { TFunction } from "i18next";
import { Column } from "../common/EntityTableList";
import { COLUMN_WIDTH } from "../common/EntityTableList/columnWidths";
import { ReactNode } from "react";

export const VOLUNTEER_COL_WIDTHS = {
  name: COLUMN_WIDTH.SM,
  type: COLUMN_WIDTH.LG,
  engagement: COLUMN_WIDTH.LG,
  matching: COLUMN_WIDTH.SM,
  language: COLUMN_WIDTH.MD,
  district: COLUMN_WIDTH.SM,
  email: COLUMN_WIDTH.XXXL,
};

export const createVolunteerTableColumns = (t: TFunction, copyButton: ReactNode): Column[] => [
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
  {
    key: "email",
    label: t("dashboard.volunteers.table.email"),
    width: VOLUNTEER_COL_WIDTHS.email,
    headerAction: copyButton,
  },
];
