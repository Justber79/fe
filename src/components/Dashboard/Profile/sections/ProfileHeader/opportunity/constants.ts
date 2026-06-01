import { TFunction } from "i18next";
import { OpportunityMatchStatusType, OpportunityStatusType } from "need4deed-sdk";

export type { OpportunityMatchStatusType };

export enum OpportunityManualStatusType {
  NEW = "opp-new",
  SEARCHING = "opp-searching",
  INACTIVE = "opp-inactive",
}

export const SDK_TO_MANUAL: Partial<Record<OpportunityStatusType, OpportunityManualStatusType>> = {
  [OpportunityStatusType.NEW]: OpportunityManualStatusType.NEW,
  [OpportunityStatusType.SEARCHING]: OpportunityManualStatusType.SEARCHING,
  [OpportunityStatusType.ACTIVE]: OpportunityManualStatusType.SEARCHING,
  [OpportunityStatusType.INACTIVE]: OpportunityManualStatusType.INACTIVE,
  [OpportunityStatusType.PAST]: OpportunityManualStatusType.INACTIVE,
};

export const MANUAL_TO_SDK: Partial<Record<OpportunityManualStatusType, OpportunityStatusType>> = {
  [OpportunityManualStatusType.NEW]: OpportunityStatusType.NEW,
  [OpportunityManualStatusType.SEARCHING]: OpportunityStatusType.SEARCHING,
  [OpportunityManualStatusType.INACTIVE]: OpportunityStatusType.INACTIVE,
};

export const STATUS_DESCRIPTION_KEYS: Record<OpportunityManualStatusType, string> = {
  [OpportunityManualStatusType.NEW]: "new_description",
  [OpportunityManualStatusType.SEARCHING]: "searching_description",
  [OpportunityManualStatusType.INACTIVE]: "inactive_description",
};

export const createOpportunityStatusLabelMap = (t: TFunction): Record<OpportunityManualStatusType, string> => ({
  [OpportunityManualStatusType.NEW]: t("dashboard.opportunityProfile.statusModal.options.new"),
  [OpportunityManualStatusType.SEARCHING]: t("dashboard.opportunityProfile.statusModal.options.searching"),
  [OpportunityManualStatusType.INACTIVE]: t("dashboard.opportunityProfile.statusModal.options.inactive"),
});

export const createOpportunityMatchLabelMap = (t: TFunction): Record<OpportunityMatchStatusType, string> => ({
  [OpportunityMatchStatusType.NO_MATCHES]: t("dashboard.opportunityProfile.matchStatus.noMatches"),
  [OpportunityMatchStatusType.PENDING_MATCH]: t("dashboard.opportunityProfile.matchStatus.pendingMatch"),
  [OpportunityMatchStatusType.MATCHED]: t("dashboard.opportunityProfile.matchStatus.matched"),
  [OpportunityMatchStatusType.NEEDS_REMATCH]: t("dashboard.opportunityProfile.matchStatus.needRematch"),
  [OpportunityMatchStatusType.UNMATCHED]: t("dashboard.opportunityProfile.matchStatus.unmatched"),
  [OpportunityMatchStatusType.PAST]: t("dashboard.opportunityProfile.matchStatus.past"),
});
