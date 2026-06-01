import { TFunction } from "i18next";
import { Column } from "../common/EntityTableList";
import { COLUMN_WIDTH } from "../common/EntityTableList/columnWidths";

export const VOLUNTEER_COL_WIDTHS = {
  type: COLUMN_WIDTH.MD,
  engagement: COLUMN_WIDTH.LG,
  matching: COLUMN_WIDTH.SM,
  language: COLUMN_WIDTH.MD,
  district: COLUMN_WIDTH.LG,
};

export const createVolunteerTableColumns = (t: TFunction): Column[] => [
  { key: "name", label: t("dashboard.volunteers.table.name") },
  { key: "type", label: t("dashboard.volunteers.table.type"), width: VOLUNTEER_COL_WIDTHS.type },
  {
    key: "engagement",
    label: t("dashboard.volunteers.table.engagementStatus"),
    width: VOLUNTEER_COL_WIDTHS.engagement,
  },
  { key: "matching", label: t("dashboard.volunteers.table.matchingStatus"), width: VOLUNTEER_COL_WIDTHS.matching },
  { key: "language", label: t("dashboard.volunteers.table.language"), width: VOLUNTEER_COL_WIDTHS.language },
  { key: "district", label: t("dashboard.volunteers.table.district"), width: VOLUNTEER_COL_WIDTHS.district },
  { key: "email", label: t("dashboard.volunteers.table.email") },
];
