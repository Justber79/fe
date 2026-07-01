import { TFunction } from "i18next";
import { Column } from "../common/EntityTableList";
import { COLUMN_WIDTH } from "../common/EntityTableList/columnWidths";

export const OPPORTUNITY_COL_WIDTHS = {
  title: COLUMN_WIDTH.LG,
  schedule: COLUMN_WIDTH.LG,
  statusMatch: COLUMN_WIDTH.SM,
  languages: COLUMN_WIDTH.MD,
  district: COLUMN_WIDTH.XL,
  numberOfVolunteers: COLUMN_WIDTH.XXS,
  agentTitle: COLUMN_WIDTH.XL,
};

export const OPPORTUNITY_READ_ONLY_COL_WIDTHS = {
  title: COLUMN_WIDTH.XXXL,
  volunteerType: COLUMN_WIDTH.XXXL,
  statusMatch: COLUMN_WIDTH.XXXL,
  languages: COLUMN_WIDTH.XXXL,
  district: COLUMN_WIDTH.XXXL,
};

export const createOpportunityTableColumns = (t: TFunction): Column[] => [
  { key: "title", label: t("dashboard.opportunities.table.title"), width: OPPORTUNITY_COL_WIDTHS.title },
  { key: "schedule", label: t("dashboard.opportunities.table.schedule"), width: OPPORTUNITY_COL_WIDTHS.schedule },
  {
    key: "statusMatch",
    label: t("dashboard.opportunities.table.matchingStatus"),
    width: OPPORTUNITY_COL_WIDTHS.statusMatch,
  },
  { key: "languages", label: t("dashboard.opportunities.table.languages"), width: OPPORTUNITY_COL_WIDTHS.languages },
  { key: "district", label: t("dashboard.opportunities.table.district"), width: OPPORTUNITY_COL_WIDTHS.district },
  {
    key: "numberOfVolunteers",
    label: t("dashboard.opportunities.table.volunteersNeeded"),
    width: OPPORTUNITY_COL_WIDTHS.numberOfVolunteers,
  },
  { key: "agentTitle", label: t("dashboard.opportunities.table.agentName"), width: OPPORTUNITY_COL_WIDTHS.agentTitle },
];

export const createReadOnlyAgentTableColumns = (t: TFunction): Column[] => [
  { key: "title", label: t("dashboard.agents.table.title"), width: OPPORTUNITY_READ_ONLY_COL_WIDTHS.title },
  { key: "type", label: t("dashboard.agents.table.type"), width: OPPORTUNITY_READ_ONLY_COL_WIDTHS.volunteerType },
  {
    key: "statusMatch",
    label: t("dashboard.opportunities.table.matchingStatus"),
    width: OPPORTUNITY_READ_ONLY_COL_WIDTHS.statusMatch,
  },
  {
    key: "languages",
    label: t("dashboard.opportunities.table.languages"),
    width: OPPORTUNITY_READ_ONLY_COL_WIDTHS.languages,
  },
  { key: "district", label: t("dashboard.agents.table.district"), width: OPPORTUNITY_READ_ONLY_COL_WIDTHS.district },
];
