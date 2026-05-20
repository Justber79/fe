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
import { format } from "date-fns";
import { ApiVolunteerOpportunityGetList, OpportunityStatusType, ProfileVolunteeringType } from "need4deed-sdk";
import { utcHhmmToLocal } from "@/utils";
import { JSX } from "react";

export function formatAvailability(availability: ApiVolunteerOpportunityGetList["availability"]): string {
  const first = availability[0];
  if (!first) return "";
  const parts = [first.day, first.daytime].filter(Boolean);
  return parts.join(", ");
}

export function formatAccompanyingDate(details?: {
  appointmentDate?: string;
  appointmentTime?: string;
}): string | null {
  if (!details?.appointmentDate) return null;

  const date = new Date(details.appointmentDate);
  const formattedDate = isNaN(date.getTime()) ? details.appointmentDate : format(date, "dd.MM.yyyy");
  const formattedTime = details.appointmentTime ? utcHhmmToLocal(details.appointmentTime) : null;

  return [formattedDate, formattedTime].filter(Boolean).join(" ");
}

export const statusColorMap: Record<OpportunityStatusType, string> = {
  [OpportunityStatusType.NEW]: "var(--color-red-500)",
  [OpportunityStatusType.SEARCHING]: "var(--color-orange-500, var(--color-red-500))",
  [OpportunityStatusType.ACTIVE]: "var(--color-green-700)",
  [OpportunityStatusType.INACTIVE]: "var(--color-grey-700)",
  [OpportunityStatusType.PAST]: "var(--color-grey-700)",
};

export const statusIconMap: Record<OpportunityStatusType, JSX.Element> = {
  [OpportunityStatusType.NEW]: <ShootingStarIcon size={18} color={statusColorMap[OpportunityStatusType.NEW]} />,
  [OpportunityStatusType.SEARCHING]: (
    <ShootingStarIcon size={18} color={statusColorMap[OpportunityStatusType.SEARCHING]} />
  ),
  [OpportunityStatusType.ACTIVE]: <ShootingStarIcon size={18} color={statusColorMap[OpportunityStatusType.ACTIVE]} />,
  [OpportunityStatusType.INACTIVE]: (
    <ShootingStarIcon size={18} color={statusColorMap[OpportunityStatusType.INACTIVE]} />
  ),
  [OpportunityStatusType.PAST]: <ShootingStarIcon size={18} color={statusColorMap[OpportunityStatusType.PAST]} />,
};

// TODO: replace string with OpportunityMatchStatusType once SDK PR #89 is merged
export const matchStatusColorMap: Record<string, string> = {
  "vol-no-matches": "var(--color-grey-700)",
  "vol-pending-match": "var(--color-orange-500)",
  "vol-matched": "var(--color-green-700)",
  "vol-needs-rematch": "var(--color-red-50)",
  "vol-unmatched": "var(--color-grey-700)",
  "vol-past": "var(--color-grey-700)",
};

export const matchStatusIconMap: Record<string, JSX.Element> = {
  "vol-no-matches": <ProhibitInsetIcon size={18} color={matchStatusColorMap["vol-no-matches"]} />,
  "vol-pending-match": <HourglassIcon size={18} color={matchStatusColorMap["vol-pending-match"]} />,
  "vol-matched": <CheckCircleIcon size={18} color={matchStatusColorMap["vol-matched"]} />,
  "vol-needs-rematch": <ArrowsClockwiseIcon size={18} color={matchStatusColorMap["vol-needs-rematch"]} />,
  "vol-unmatched": <ProhibitInsetIcon size={18} color={matchStatusColorMap["vol-unmatched"]} />,
  "vol-past": <StopCircleIcon size={18} color={matchStatusColorMap["vol-past"]} />,
};

export const volunteerTypeIconMap: Record<ProfileVolunteeringType, JSX.Element> = {
  [ProfileVolunteeringType.ACCOMPANYING]: <PersonSimpleWalkIcon size={18} />,
  [ProfileVolunteeringType.REGULAR]: <ShootingStarIcon size={18} />,
  [ProfileVolunteeringType.EVENTS]: <ConfettiIcon size={18} />,
  [ProfileVolunteeringType.REGULAR_ACCOMPANYING]: <TranslateIcon size={18} />,
};
