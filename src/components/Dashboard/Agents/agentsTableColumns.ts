import { TFunction } from "i18next";
import { Column } from "../common/EntityTableList";

export const AGENT_COL_WIDTHS = {
  title: "180px",
  type: "180px",
  volunteerSearch: "200px",
  district: "200px",
  activeVolunteers: "160px",
  numOpportunities: "160px",
  email: "200px",
};

export const createAgentTableColumns = (t: TFunction): Column[] => [
  { key: "title", label: t("dashboard.agents.table.title"), width: AGENT_COL_WIDTHS.title },
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
  { key: "email", label: t("dashboard.agents.table.email"), width: AGENT_COL_WIDTHS.email },
  {
    key: "numOpportunities",
    label: t("dashboard.agents.table.numberOfOpportunities"),
    width: AGENT_COL_WIDTHS.numOpportunities,
  },
];
