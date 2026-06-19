import { ApiOpportunityVolunteerGet, OpportunityVolunteerStatusType } from "need4deed-sdk";

import { ActivityLog } from "../ActivityLog";
import { StatusAccordionActions } from "../shared/AccordionActions";
import { DetailContainer } from "../shared/accordionStyles";
import { AccordionActionProps } from "../shared/types";

type Props = {
  opportunity: ApiOpportunityVolunteerGet;
  volunteerId: number;
  currentStatus: OpportunityVolunteerStatusType;
} & AccordionActionProps;

export default function OpportunityDetail({
  opportunity,
  volunteerId,
  currentStatus,
  onMatch,
  onNotAMatch,
  onMarkAsActive,
  onMarkAsPast,
}: Props) {
  const canShowActions = onMatch;
  return (
    <DetailContainer>
      {currentStatus === OpportunityVolunteerStatusType.ACTIVE && (
        <ActivityLog opportunityId={opportunity.opportunityId} volunteerId={volunteerId} readOnly />
      )}
      {canShowActions && (
        <StatusAccordionActions
          currentStatus={currentStatus}
          onMatch={onMatch}
          onNotAMatch={onNotAMatch}
          onMarkAsActive={onMarkAsActive}
          onMarkAsPast={onMarkAsPast}
        />
      )}
    </DetailContainer>
  );
}
