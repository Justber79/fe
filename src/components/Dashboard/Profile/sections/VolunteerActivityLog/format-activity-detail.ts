import { TFunction } from "i18next";
import { ApiVolunteerAuditLogGet, VolunteerAuditLogType } from "need4deed-sdk";
import { parseMatchDetail } from "./parse-match-detail";

export function formatActivityDetail({ type, detail }: ApiVolunteerAuditLogGet, t: TFunction): string {
  const match = type === VolunteerAuditLogType.OPPORTUNITY_STATUS_CHANGED ? parseMatchDetail(detail) : null;
  if (!match) {
    return detail;
  }

  const label = (status: string) =>
    t(`dashboard.volunteerProfile.opportunitiesSec.tabs.${status}`, { defaultValue: status });
  const { title } = match;

  switch (match.kind) {
    case "linked": {
      const linked = match.status
        ? t("dashboard.volunteerActivityLog.linkedAs", { title, status: label(match.status) })
        : t("dashboard.volunteerActivityLog.linked", { title });
      return match.imported ? t("dashboard.volunteerActivityLog.imported", { entry: linked }) : linked;
    }
    case "removed":
      return t("dashboard.volunteerActivityLog.removed", { title, from: label(match.from) });
    case "statusChanged":
      return match.from
        ? t("dashboard.volunteerActivityLog.statusChangedFrom", { title, from: label(match.from), to: label(match.to) })
        : t("dashboard.volunteerActivityLog.statusChanged", { title, to: label(match.to) });
  }
}
