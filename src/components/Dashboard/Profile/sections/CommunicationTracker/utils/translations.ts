import { TFunction } from "i18next";
import { ContactType, ContactMethodType, CommunicationType } from "need4deed-sdk";

export function getContactTypeLabel(t: TFunction, contactType: ContactType): string {
  const map: Record<string, string> = {
    [ContactType.CALL]: "dashboard.communicationSection.contactTypes.called",
    [ContactType.TRIED_CALL]: "dashboard.communicationSection.contactTypes.triedToCall",
    [ContactType.TEXT_EMAIL]: "dashboard.communicationSection.contactTypes.textedOrEmailed",
    [ContactType.OTHER]: "dashboard.communicationSection.contactTypes.other",
  };
  return t(map[contactType] || `dashboard.communicationSection.contactTypes.${contactType.toLowerCase()}`, { defaultValue: contactType });
}

export function getContactMethodLabel(t: TFunction, contactMethod: ContactMethodType): string {
   const map: Record<string, string> = {
    [ContactMethodType.PHONE]: "dashboard.communicationSection.platformOptions.phoneNumber",
    [ContactMethodType.TELEGRAM]: "dashboard.communicationSection.platformOptions.telegram",
    [ContactMethodType.WHATSAPP]: "dashboard.communicationSection.platformOptions.whatsapp",
    [ContactMethodType.SIGNAL]: "dashboard.communicationSection.platformOptions.signal",
    [ContactMethodType.EMAIL]: "dashboard.communicationSection.platformOptions.email",
    [ContactMethodType.SMS]: "dashboard.communicationSection.platformOptions.sms",
    [ContactMethodType.VOICENOTE]: "dashboard.communicationSection.platformOptions.voicenote",
    [ContactMethodType.VIDEO_CALL]: "dashboard.communicationSection.platformOptions.videoCall",
  };
  return t(map[contactMethod] || `dashboard.communicationSection.platformOptions.${contactMethod.toLowerCase()}`, { defaultValue: contactMethod });
}

export function getCommunicationTypeLabel(t: TFunction, communicationType: CommunicationType): string {
    const map: Record<string, string> = {
    [CommunicationType.BRIEF]: "dashboard.communicationSection.communicationTypes.briefedVolunteer",
    [CommunicationType.FIRST_INQUIRY]: "dashboard.communicationSection.communicationTypes.firstInquiry",
    [CommunicationType.OPPORTUNITY_LIST]: "dashboard.communicationSection.communicationTypes.opportunityList",
    [CommunicationType.STATUS_UPDATE]: "dashboard.communicationSection.communicationTypes.statusUpdate",
    [CommunicationType.POST_FOLLOWUP]: "dashboard.communicationSection.communicationTypes.postMatchFollowUp",
  };
  return t(map[communicationType] || `dashboard.communicationSection.communicationTypes.${communicationType.toLowerCase()}`, { defaultValue: communicationType });
}

export function getDisplayLabel(
  t: TFunction,
  contactType: ContactType,
  communicationType?: CommunicationType,
): string {
  if (contactType === ContactType.OTHER && communicationType) {
    return getCommunicationTypeLabel(t, communicationType);
  }
  return getContactTypeLabel(t, contactType);
}

export { formatDate } from "../../shared/utils/formatDate";