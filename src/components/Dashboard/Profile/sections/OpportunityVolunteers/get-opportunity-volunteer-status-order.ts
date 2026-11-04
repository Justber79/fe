import { OpportunityVolunteerStatusType } from "need4deed-sdk";
import { TAB_STATUS_ORDER } from "../shared/useTabTransitions";

export function getOpportunityVolunteerStatusOrder(isStaff: boolean, isUserLoaded: boolean) {
  if (!isUserLoaded) return [];
  return isStaff
    ? TAB_STATUS_ORDER
    : TAB_STATUS_ORDER.filter((status) => status !== OpportunityVolunteerStatusType.PENDING);
}
