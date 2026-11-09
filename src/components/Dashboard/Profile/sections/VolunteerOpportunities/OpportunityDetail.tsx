import { ApiOpportunityVolunteerGet, OpportunityVolunteerStatusType } from "need4deed-sdk";

import { ActivityLog } from "../ActivityLog";
import { StatusAccordionActions, WithdrawSuggestionAction } from "../shared/AccordionActions";
import { DetailContainer } from "../shared/accordionStyles";
import { AccordionActionProps } from "../shared/types";

type Props = {
  opportunity: ApiOpportunityVolunteerGet;
  currentStatus: OpportunityVolunteerStatusType;
  onWithdraw?: () => void;
} & AccordionActionProps;

export default function OpportunityDetail({
  opportunity,
  currentStatus,
  onMatch,
  emailNote,
  onNotAMatch,
  onMarkAsActive,
  onMarkAsPast,
  onWithdraw,
}: Props) {
  const canShowActions = onMatch;
  return (
    <DetailContainer>
      {(currentStatus === OpportunityVolunteerStatusType.ACTIVE ||
        currentStatus === OpportunityVolunteerStatusType.PAST) && (
        <ActivityLog opportunityVolunteerId={opportunity.id} readOnly />
      )}
      {canShowActions && (
        <StatusAccordionActions
          currentStatus={currentStatus}
          onMatch={onMatch}
          emailNote={emailNote}
          onNotAMatch={onNotAMatch}
          onMarkAsActive={onMarkAsActive}
          onMarkAsPast={onMarkAsPast}
        />
      )}
      {onWithdraw && <WithdrawSuggestionAction onWithdraw={onWithdraw} />}
    </DetailContainer>
  );
}
