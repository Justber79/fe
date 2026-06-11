import { TFunction } from "i18next";
import { Column } from "../common/EntityTableList";
import { COLUMN_WIDTH } from "../common/EntityTableList/columnWidths";

export const OPPORTUNITY_COL_WIDTHS = {
  title: COLUMN_WIDTH.LG,
  volunteerType: COLUMN_WIDTH.MD,
  statusOpportunity: COLUMN_WIDTH.SM,
  statusMatch: COLUMN_WIDTH.MD,
  languages: COLUMN_WIDTH.MD,
  activities: COLUMN_WIDTH.LG,
  district: COLUMN_WIDTH.MD,
  schedule: COLUMN_WIDTH.MD,
  numberOfVolunteers: COLUMN_WIDTH.XS,
  agentTitle: COLUMN_WIDTH.MD,
};

export const createOpportunityTableColumns = (t: TFunction): Column[] => [
  { key: "title", label: t("dashboard.opportunities.table.title"), width: OPPORTUNITY_COL_WIDTHS.title },
  { key: "volunteerType", label: t("dashboard.opportunities.table.type"), width: OPPORTUNITY_COL_WIDTHS.volunteerType },
  {
    key: "statusOpportunity",
    label: t("dashboard.opportunities.table.currentStatus"),
    width: OPPORTUNITY_COL_WIDTHS.statusOpportunity,
  },
  {
    key: "statusMatch",
    label: t("dashboard.opportunities.table.matchingStatus"),
    width: OPPORTUNITY_COL_WIDTHS.statusMatch,
  },
  { key: "languages", label: t("dashboard.opportunities.table.languages"), width: OPPORTUNITY_COL_WIDTHS.languages },
  { key: "activities", label: t("dashboard.opportunities.table.activities"), width: OPPORTUNITY_COL_WIDTHS.activities },
  { key: "district", label: t("dashboard.opportunities.table.district"), width: OPPORTUNITY_COL_WIDTHS.district },
  { key: "schedule", label: t("dashboard.opportunities.table.schedule"), width: OPPORTUNITY_COL_WIDTHS.schedule },
  {
    key: "numberOfVolunteers",
    label: t("dashboard.opportunities.table.volunteersNeeded"),
    width: OPPORTUNITY_COL_WIDTHS.numberOfVolunteers,
  },
  { key: "agentTitle", label: t("dashboard.opportunities.table.agentName"), width: OPPORTUNITY_COL_WIDTHS.agentTitle },
];

export const createReadOnlyAgentTableColumns = (t: TFunction): Column[] => [
  { key: "title", label: t("dashboard.agents.table.title") },
  { key: "type", label: t("dashboard.agents.table.type"), width: OPPORTUNITY_COL_WIDTHS.volunteerType },
  { key: "district", label: t("dashboard.agents.table.district"), width: OPPORTUNITY_COL_WIDTHS.district },
];
