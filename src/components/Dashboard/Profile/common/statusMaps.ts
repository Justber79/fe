import {
  ArrowsClockwiseIcon,
  BinocularsIcon,
  CalendarBlankIcon,
  CalendarXIcon,
  ChartLineIcon,
  CheckCircleIcon,
  HandPalmIcon,
  HourglassIcon,
  PhoneXIcon,
  ProhibitInsetIcon,
  QuestionIcon,
  SmileyIcon,
  SmileySadIcon,
  SparkleIcon,
  StopCircleIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import {
  AgentEngagementStatusType,
  OpportunityMatchStatus,
  OpportunityMatchStatusType,
  OpportunityStatusType,
  VolunteerStateEngagementType,
  VolunteerStateMatchType,
  VolunteerStateTypeType,
} from "need4deed-sdk";
import type React from "react";
import { OpportunityManualStatusType } from "../sections/ProfileHeader/opportunity/constants";
import { AgentEngagementStatus, AgentTrustLevel, AgentVolunteerSearch } from "../types";

export type StatusValue =
  | VolunteerStateEngagementType
  | VolunteerStateTypeType
  | VolunteerStateMatchType
  | OpportunityStatusType
  | OpportunityMatchStatus
  | OpportunityMatchStatusType
  | AgentEngagementStatus
  | AgentVolunteerSearch
  | AgentTrustLevel
  | OpportunityManualStatusType;

type SdkStatusValue = Exclude<StatusValue, OpportunityManualStatusType>;

type IconComponent = React.ComponentType<{ size?: number; color?: string }>;

// Several SDK enums share the same underlying string values (e.g. "new", "active",
// "pending-match"). Object literals with computed duplicate keys are a TS error, so
// the SDK entries are built with Object.fromEntries — arrays have no such restriction and
// the last entry for a given key wins, matching the original intended behaviour.
// OpportunityManualStatusType values are unique ("opp-*") and use a typed Record
// to preserve exhaustiveness checking.

const manualStatusColorMap: Record<OpportunityManualStatusType, string> = {
  [OpportunityManualStatusType.NEW]: "var(--color-violet-100)",
  [OpportunityManualStatusType.SEARCHING]: "var(--color-violet-100)",
  [OpportunityManualStatusType.INACTIVE]: "var(--color-grey-50)",
};

export const statusColorMap: Record<StatusValue, string> = {
  ...(Object.fromEntries([
    [VolunteerStateEngagementType.ACTIVE, "var(--color-green-100)"],
    [VolunteerStateEngagementType.AVAILABLE, "var(--color-violet-100)"],
    [VolunteerStateEngagementType.TEMP_UNAVAILABLE, "var( --color-red-50)"],
    [VolunteerStateEngagementType.UNRESPONSIVE, "var(--color-grey-50)"],
    [VolunteerStateEngagementType.INACTIVE, "var(--color-grey-50)"],
    [VolunteerStateEngagementType.NEW, "var(--color-green-100)"],
    [OpportunityMatchStatus.NO_MATCHES, "var(--color-grey-50)"],
    [OpportunityMatchStatus.PENDING_MATCH, "var(--color-violet-100)"],
    [OpportunityMatchStatus.MATCHED, "var(--color-green-100)"],
    [OpportunityMatchStatus.PAST, "var(--color-grey-50)"],
    [VolunteerStateMatchType.NO_MATCHES, "var(--color-grey-50)"],
    [VolunteerStateMatchType.PENDING_MATCH, "var(--color-violet-100)"],
    [VolunteerStateMatchType.MATCHED, "var(--color-green-100)"],
    [VolunteerStateMatchType.NEEDS_REMATCH, "var(--color-red-50)"],
    [VolunteerStateMatchType.PAST, "var(--color-grey-50)"],
    [OpportunityMatchStatusType.NO_MATCHES, "var(--color-grey-50)"],
    [OpportunityMatchStatusType.PENDING_MATCH, "var(--color-violet-100)"],
    [OpportunityMatchStatusType.MATCHED, "var(--color-green-100)"],
    [OpportunityMatchStatusType.NEEDS_REMATCH, "var(--color-red-50)"],
    [OpportunityMatchStatusType.UNMATCHED, "var(--color-grey-50)"],
    [OpportunityMatchStatusType.PAST, "var(--color-grey-50)"],
    [VolunteerStateTypeType.ACCOMPANYING, "var(--color-blue-500)"],
    [VolunteerStateTypeType.EVENTS, "var(--color-blue-500)"],
    [VolunteerStateTypeType.REGULAR, "var(--color-blue-500)"],
    [VolunteerStateTypeType.REGULAR_ACCOMPANYING, "var(--color-blue-500)"],
    [OpportunityStatusType.SEARCHING, "var(--color-violet-100)"],
    [OpportunityStatusType.NEW, "var(--color-violet-100)"],
    [OpportunityStatusType.ACTIVE, "var(--color-green-50)"],
    [OpportunityStatusType.INACTIVE, "var(--color-grey-50)"],
    [OpportunityStatusType.PAST, "var(--color-grey-50)"],
    [AgentVolunteerSearch.NOT_NEEDED, "var(--color-grey-50)"],
    [AgentVolunteerSearch.VOLUNTEERS_FOUND, "var(--color-green-100)"],
    [AgentVolunteerSearch.SEARCHING, "var(--color-red-50)"],
    [AgentTrustLevel.UNKNOWN, "var(--color-grey-50)"],
    [AgentTrustLevel.LOW, "var(--color-red-50)"],
    [AgentTrustLevel.HIGH, "var(--color-green-100)"],
    [AgentEngagementStatusType.NEW, "var(--color-violet-100)"],
    [AgentEngagementStatusType.ACTIVE, "var(--color-green-100)"],
    [AgentEngagementStatusType.INACTIVE, "var(--color-grey-50)"],
    [AgentEngagementStatusType.UNRESPONSIVE, "var(--color-grey-50)"],
  ]) as Record<SdkStatusValue, string>),
  ...manualStatusColorMap,
};

const manualStatusIconMap: Record<OpportunityManualStatusType, IconComponent> = {
  [OpportunityManualStatusType.NEW]: SparkleIcon,
  [OpportunityManualStatusType.SEARCHING]: HourglassIcon,
  [OpportunityManualStatusType.INACTIVE]: StopCircleIcon,
};

export const statusIconMap: Record<StatusValue, IconComponent> = {
  ...(Object.fromEntries([
    [VolunteerStateEngagementType.ACTIVE, ChartLineIcon],
    [VolunteerStateEngagementType.AVAILABLE, CalendarBlankIcon],
    [VolunteerStateEngagementType.TEMP_UNAVAILABLE, CalendarXIcon],
    [VolunteerStateEngagementType.UNRESPONSIVE, PhoneXIcon],
    [VolunteerStateEngagementType.INACTIVE, StopCircleIcon],
    [VolunteerStateEngagementType.NEW, SparkleIcon],
    [OpportunityMatchStatus.NO_MATCHES, ProhibitInsetIcon],
    [OpportunityMatchStatus.PENDING_MATCH, HourglassIcon],
    [OpportunityMatchStatus.MATCHED, CheckCircleIcon],
    [OpportunityMatchStatus.PAST, StopCircleIcon],
    [VolunteerStateMatchType.NO_MATCHES, ProhibitInsetIcon],
    [VolunteerStateMatchType.PENDING_MATCH, HourglassIcon],
    [VolunteerStateMatchType.MATCHED, CheckCircleIcon],
    [VolunteerStateMatchType.NEEDS_REMATCH, ArrowsClockwiseIcon],
    [VolunteerStateMatchType.PAST, StopCircleIcon],
    [OpportunityMatchStatusType.NO_MATCHES, ProhibitInsetIcon],
    [OpportunityMatchStatusType.PENDING_MATCH, HourglassIcon],
    [OpportunityMatchStatusType.MATCHED, CheckCircleIcon],
    [OpportunityMatchStatusType.NEEDS_REMATCH, ArrowsClockwiseIcon],
    [OpportunityMatchStatusType.UNMATCHED, ProhibitInsetIcon],
    [OpportunityMatchStatusType.PAST, StopCircleIcon],
    [VolunteerStateTypeType.ACCOMPANYING, UsersIcon],
    [VolunteerStateTypeType.EVENTS, UsersIcon],
    [VolunteerStateTypeType.REGULAR, UsersIcon],
    [VolunteerStateTypeType.REGULAR_ACCOMPANYING, UsersIcon],
    [OpportunityStatusType.NEW, SparkleIcon],
    [OpportunityStatusType.ACTIVE, ChartLineIcon],
    [OpportunityStatusType.SEARCHING, HourglassIcon],
    [OpportunityStatusType.INACTIVE, StopCircleIcon],
    [OpportunityStatusType.PAST, StopCircleIcon],
    [AgentVolunteerSearch.NOT_NEEDED, HandPalmIcon],
    [AgentVolunteerSearch.VOLUNTEERS_FOUND, CheckCircleIcon],
    [AgentVolunteerSearch.SEARCHING, BinocularsIcon],
    [AgentTrustLevel.UNKNOWN, QuestionIcon],
    [AgentTrustLevel.LOW, SmileySadIcon],
    [AgentTrustLevel.HIGH, SmileyIcon],
    [AgentEngagementStatusType.NEW, SparkleIcon],
    [AgentEngagementStatusType.ACTIVE, ChartLineIcon],
    [AgentEngagementStatusType.INACTIVE, StopCircleIcon],
    [AgentEngagementStatusType.UNRESPONSIVE, PhoneXIcon],
  ]) as unknown as Record<SdkStatusValue, IconComponent>),
  ...manualStatusIconMap,
};
