import { TFunction } from "i18next";
import { VolunteerStateEngagementType, VolunteerStateMatchType } from "need4deed-sdk";

export const ENGAGEMENT_DESCRIPTION_KEYS: Record<VolunteerStateEngagementType, string> = {
  [VolunteerStateEngagementType.NEW]: "new_description",
  [VolunteerStateEngagementType.ACTIVE]: "active_description",
  [VolunteerStateEngagementType.AVAILABLE]: "available_description",
  [VolunteerStateEngagementType.TEMP_UNAVAILABLE]: "tempUnavailable_description",
  [VolunteerStateEngagementType.INACTIVE]: "inactive_description",
  [VolunteerStateEngagementType.UNRESPONSIVE]: "unresponsive_description",
};

export const createEngagementLabelMap = (t: TFunction): Record<VolunteerStateEngagementType, string> => ({
  [VolunteerStateEngagementType.NEW]: t("dashboard.volunteerProfile.volunteerHeader.engagementStatus_options.new"),
  [VolunteerStateEngagementType.ACTIVE]: t(
    "dashboard.volunteerProfile.volunteerHeader.engagementStatus_options.active",
  ),
  [VolunteerStateEngagementType.AVAILABLE]: t(
    "dashboard.volunteerProfile.volunteerHeader.engagementStatus_options.available",
  ),
  [VolunteerStateEngagementType.TEMP_UNAVAILABLE]: t(
    "dashboard.volunteerProfile.volunteerHeader.engagementStatus_options.tempUnavailable",
  ),
  [VolunteerStateEngagementType.INACTIVE]: t(
    "dashboard.volunteerProfile.volunteerHeader.engagementStatus_options.inactive",
  ),
  [VolunteerStateEngagementType.UNRESPONSIVE]: t(
    "dashboard.volunteerProfile.volunteerHeader.engagementStatus_options.unresponsive",
  ),
});

export const createMatchLabelMap = (t: TFunction): Record<VolunteerStateMatchType, string> => ({
  [VolunteerStateMatchType.NO_MATCHES]: t("dashboard.volunteerProfile.volunteerHeader.matchStatus_options.noMatches"),
  [VolunteerStateMatchType.PENDING_MATCH]: t(
    "dashboard.volunteerProfile.volunteerHeader.matchStatus_options.pendingMatch",
  ),
  [VolunteerStateMatchType.MATCHED]: t("dashboard.volunteerProfile.volunteerHeader.matchStatus_options.matched"),
  [VolunteerStateMatchType.NEEDS_REMATCH]: t(
    "dashboard.volunteerProfile.volunteerHeader.matchStatus_options.needsRematch",
  ),
});
