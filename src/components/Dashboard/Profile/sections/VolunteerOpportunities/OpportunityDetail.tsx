import { ApiOpportunityVolunteerGet, OpportunityVolunteerStatusType } from "need4deed-sdk";

import { ActivityLog } from "../ActivityLog";
import { StatusAccordionActions } from "../shared/AccordionActions";
import { DetailContainer } from "../shared/accordionStyles";
import { AccordionActionProps } from "../shared/types";

type Props = {
  opportunity: ApiOpportunityVolunteerGet;
  currentStatus: OpportunityVolunteerStatusType;
} & AccordionActionProps;

export default function OpportunityDetail({
  opportunity,
  currentStatus,
  onMatch,
  onNotAMatch,
  onMarkAsActive,
  onMarkAsPast,
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
          onNotAMatch={onNotAMatch}
          onMarkAsActive={onMarkAsActive}
          onMarkAsPast={onMarkAsPast}
        />
      )}
    </DetailContainer>
  );
}
