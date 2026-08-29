import { TFunction } from "i18next";
import { ApiAppreciationGet, AppreciationStatusType } from "need4deed-sdk";

export const createAppreciationStatusLabelMap = (
  t: TFunction,
): Record<AppreciationStatusType, (entry: ApiAppreciationGet) => string> => ({
  [AppreciationStatusType.RECEIVED]: () => t("dashboard.appreciationSection.statusReceived"),
  [AppreciationStatusType.PENDING]: () => t("dashboard.appreciationSection.statusPending"),
  [AppreciationStatusType.POST]: () => t("dashboard.appreciationSection.statusPost"),
});
