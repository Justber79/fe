import { TFunction } from "i18next";
import { ContactType, ContactMethodType, CommunicationType } from "need4deed-sdk";

export function getContactTypeLabel(t: TFunction, contactType: ContactType): string {
  const map: Record<string, string> = {
    [ContactType.CALL]: "dashboard.communicationSection.contactTypes.called",
    [ContactType.TRIED_CALL]: "dashboard.communicationSection.contactTypes.triedToCall",
    [ContactType.TEXT_EMAIL]: "dashboard.communicationSection.contactTypes.textedOrEmailed",
    [ContactType.OTHER]: "dashboard.communicationSection.contactTypes.other",
  };
  return t(map[contactType] || `dashboard.communicationSection.contactTypes.${contactType.toLowerCase()}`, {
    defaultValue: contactType,
  });
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
  };
  return t(map[contactMethod] || `dashboard.communicationSection.platformOptions.${contactMethod.toLowerCase()}`, {
    defaultValue: contactMethod,
  });
}

const communicationTypeKeys: Record<CommunicationType, string> = {
  [CommunicationType.BRIEF]: "dashboard.communicationSection.communicationTypes.briefedVolunteer",
  [CommunicationType.FIRST_INQUIRY]: "dashboard.communicationSection.communicationTypes.firstInquiry",
  [CommunicationType.OPPORTUNITY_LIST]: "dashboard.communicationSection.communicationTypes.opportunityList",
  [CommunicationType.STATUS_UPDATE]: "dashboard.communicationSection.communicationTypes.statusUpdate",
  [CommunicationType.POST_FOLLOWUP]: "dashboard.communicationSection.communicationTypes.postMatchFollowUp",
  [CommunicationType.ACCOMPANYING_MATCHED]: "dashboard.communicationSection.communicationTypes.accompanyingMatched",
  [CommunicationType.MATCHED]: "dashboard.communicationSection.communicationTypes.matched",
  [CommunicationType.OPPORTUNITY_CONFIRMATION]:
    "dashboard.communicationSection.communicationTypes.opportunityConfirmation",
  [CommunicationType.ACCOMPANYING_NOT_FOUND]: "dashboard.communicationSection.communicationTypes.accompanyingNotFound",
  [CommunicationType.OPPORTUNITY_UPDATED]: "dashboard.communicationSection.communicationTypes.opportunityUpdated",
  [CommunicationType.CGC_APPLICATION_EMAIL]: "dashboard.communicationSection.communicationTypes.cgcApplicationEmail",
};

export function getCommunicationTypeLabel(t: TFunction, communicationType: CommunicationType): string {
  const key = communicationTypeKeys[communicationType];
  return key ? t(key) : communicationType;
}

const callContactTypes: ContactType[] = [ContactType.CALL, ContactType.TRIED_CALL];

export function getDisplayLabel(t: TFunction, contactType: ContactType, communicationType?: CommunicationType): string {
  return communicationType && !callContactTypes.includes(contactType)
    ? getCommunicationTypeLabel(t, communicationType)
    : getContactTypeLabel(t, contactType);
}

export { formatDate } from "../../shared/utils/formatDate";

export function getLoggedByLabel(userId: number, currentUser?: { id: number; fullName: string } | null): string {
  if (currentUser && userId === currentUser.id) return currentUser.fullName || `#${userId}`;
  return `#${userId}`;
}
