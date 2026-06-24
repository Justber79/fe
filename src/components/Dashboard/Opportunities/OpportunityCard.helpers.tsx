import {
  ArrowsClockwiseIcon,
  CheckCircleIcon,
  ConfettiIcon,
  HourglassIcon,
  PersonSimpleWalkIcon,
  ProhibitInsetIcon,
  ShootingStarIcon,
  StopCircleIcon,
  TranslateIcon,
} from "@phosphor-icons/react";
import { ApiVolunteerOpportunityGetList, OpportunityStatusType, ProfileVolunteeringType } from "need4deed-sdk";
import { JSX } from "react";

// OpportunityMatchStatusType was removed from need4deed-sdk — defined locally.
export enum OpportunityMatchStatusType {
  NO_MATCHES = "opp-vol-no-matches",
  PENDING_MATCH = "opp-vol-pending-match",
  MATCHED = "opp-vol-matched",
  NEEDS_REMATCH = "opp-vol-needs-rematch",
  UNMATCHED = "opp-vol-unmatched",
  PAST = "opp-vol-past",
}

export function formatAvailability(availability: ApiVolunteerOpportunityGetList["availability"]): string {
  const first = availability[0];
  if (!first) return "";
  const parts = [first.day, first.daytime].filter(Boolean);
  return parts.join(", ");
}

export const statusColorMap: Record<OpportunityStatusType, string> = {
  [OpportunityStatusType.NEW]: "var(--color-red-500)",
  [OpportunityStatusType.SEARCHING]: "var(--color-orange-500, var(--color-red-500))",
  [OpportunityStatusType.ACTIVE]: "var(--color-green-700)",
  [OpportunityStatusType.PAST]: "var(--color-grey-700)",
};

export const statusIconMap: Record<OpportunityStatusType, JSX.Element> = {
  [OpportunityStatusType.NEW]: <ShootingStarIcon size={18} color={statusColorMap[OpportunityStatusType.NEW]} />,
  [OpportunityStatusType.SEARCHING]: (
    <ShootingStarIcon size={18} color={statusColorMap[OpportunityStatusType.SEARCHING]} />
  ),
  [OpportunityStatusType.ACTIVE]: <ShootingStarIcon size={18} color={statusColorMap[OpportunityStatusType.ACTIVE]} />,
  [OpportunityStatusType.PAST]: <ShootingStarIcon size={18} color={statusColorMap[OpportunityStatusType.PAST]} />,
};

export const matchStatusColorMap: Record<OpportunityMatchStatusType, string> = {
  "opp-vol-no-matches": "var(--color-grey-700)",
  "opp-vol-pending-match": "var(--color-orange-500)",
  "opp-vol-matched": "var(--color-green-700)",
  "opp-vol-needs-rematch": "var(--color-red-50)",
  "opp-vol-unmatched": "var(--color-grey-700)",
  "opp-vol-past": "var(--color-grey-700)",
};

export const matchStatusIconMap: Record<OpportunityMatchStatusType, JSX.Element> = {
  "opp-vol-no-matches": <ProhibitInsetIcon size={18} color={matchStatusColorMap["opp-vol-no-matches"]} />,
  "opp-vol-pending-match": <HourglassIcon size={18} color={matchStatusColorMap["opp-vol-pending-match"]} />,
  "opp-vol-matched": <CheckCircleIcon size={18} color={matchStatusColorMap["opp-vol-matched"]} />,
  "opp-vol-needs-rematch": <ArrowsClockwiseIcon size={18} color={matchStatusColorMap["opp-vol-needs-rematch"]} />,
  "opp-vol-unmatched": <ProhibitInsetIcon size={18} color={matchStatusColorMap["opp-vol-unmatched"]} />,
  "opp-vol-past": <StopCircleIcon size={18} color={matchStatusColorMap["opp-vol-past"]} />,
};

export const volunteerTypeIconMap: Record<ProfileVolunteeringType, JSX.Element> = {
  [ProfileVolunteeringType.ACCOMPANYING]: <PersonSimpleWalkIcon size={18} />,
  [ProfileVolunteeringType.REGULAR]: <ShootingStarIcon size={18} />,
  [ProfileVolunteeringType.EVENTS]: <ConfettiIcon size={18} />,
  [ProfileVolunteeringType.REGULAR_ACCOMPANYING]: <TranslateIcon size={18} />,
};
