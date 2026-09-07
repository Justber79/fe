import { TFunction } from "i18next";
import { AppreciationStatusType } from "need4deed-sdk";

export const createAppreciationStatusLabelMap = (t: TFunction): Record<AppreciationStatusType, string> => ({
  [AppreciationStatusType.RECEIVED]: t("dashboard.appreciationSection.statusReceived"),
  [AppreciationStatusType.PENDING]: t("dashboard.appreciationSection.statusPending"),
  [AppreciationStatusType.POST]: t("dashboard.appreciationSection.statusPost"),
});
