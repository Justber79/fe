import { TFunction } from "i18next";
import { Column } from "../common/EntityTableList";
import { COLUMN_WIDTH } from "../common/EntityTableList/columnWidths";

export const AGENT_COL_WIDTHS = {
  type: COLUMN_WIDTH.MD,
  volunteerSearch: COLUMN_WIDTH.LG,
  district: COLUMN_WIDTH.LG,
  activeVolunteers: COLUMN_WIDTH.XS,
  numOpportunities: COLUMN_WIDTH.SM,
  email: COLUMN_WIDTH.LG,
};

export const createAgentTableColumns = (t: TFunction): Column[] => [
  { key: "title", label: t("dashboard.agents.table.title") },
  { key: "type", label: t("dashboard.agents.table.type"), width: AGENT_COL_WIDTHS.type },
  {
    key: "volunteerSearch",
    label: t("dashboard.agents.table.volunteerSearch"),
    width: AGENT_COL_WIDTHS.volunteerSearch,
  },
  { key: "district", label: t("dashboard.agents.table.district"), width: AGENT_COL_WIDTHS.district },
  {
    key: "activeVolunteers",
    label: t("dashboard.agents.table.activeVolunteers"),
    width: AGENT_COL_WIDTHS.activeVolunteers,
  },
  {
    key: "numOpportunities",
    label: t("dashboard.agents.table.numberOfOpportunities"),
    width: AGENT_COL_WIDTHS.numOpportunities,
  },
  { key: "email", label: t("dashboard.agents.table.email") },
];
