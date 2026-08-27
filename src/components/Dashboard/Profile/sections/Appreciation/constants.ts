import { TFunction } from "i18next";
import { ApiAppreciationGet, AppreciationStatusType } from "need4deed-sdk";
import { formatDate } from "../shared/utils/formatDate";

export const createAppreciationStatusLabelMap = (
  t: TFunction,
): Record<AppreciationStatusType, (entry: ApiAppreciationGet) => string> => ({
  [AppreciationStatusType.RECEIVED]: () => t("dashboard.appreciationSection.statusReceived"),
  [AppreciationStatusType.PENDING]: (entry) =>
    `${t("dashboard.appreciationSection.statusDueTo")} ${formatDate(entry.dateDue ?? undefined)}`,
  [AppreciationStatusType.POST]: (entry) =>
    `${t("dashboard.appreciationSection.statusMailedOn")} ${formatDate(entry.dateDue ?? undefined)}`,
});
