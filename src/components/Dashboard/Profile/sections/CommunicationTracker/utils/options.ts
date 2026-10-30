import { TFunction } from "i18next";
import { ApiCommunicationGet, ContactType, ContactMethodType, CommunicationType } from "need4deed-sdk";
import { getContactMethodLabel, getCommunicationTypeLabel } from "./translations";

type Option = {
  value: string;
  label: string;
};

export const manualCommunicationTypes: CommunicationType[] = [
  CommunicationType.BRIEF,
  CommunicationType.FIRST_INQUIRY,
  CommunicationType.OPPORTUNITY_LIST,
  CommunicationType.STATUS_UPDATE,
  CommunicationType.POST_FOLLOWUP,
];

export function getStoredOtherType(entry?: ApiCommunicationGet): CommunicationType | undefined {
  return entry?.contactType === ContactType.OTHER ? entry.communicationType : undefined;
}

export function getEditedCommunicationType(
  initialContactType: ContactType,
  contactType: ContactType,
  selectedType?: CommunicationType,
): CommunicationType | null | undefined {
  if (contactType === ContactType.OTHER) return selectedType;
  if (contactType === initialContactType) return undefined;
  return null;
}

export function getCommunicationTypeOptions(t: TFunction, storedType?: CommunicationType): Option[] {
  const types =
    storedType && !manualCommunicationTypes.includes(storedType)
      ? [...manualCommunicationTypes, storedType]
      : manualCommunicationTypes;
  return types.map((type) => ({
    value: type,
    label: getCommunicationTypeLabel(t, type),
  }));
}

export function getContactMethodOptions(t: TFunction, contactType: ContactType): Option[] {
  if (contactType === ContactType.TEXT_EMAIL || contactType === ContactType.OTHER) {
    return [
      ContactMethodType.EMAIL,
      ContactMethodType.TELEGRAM,
      ContactMethodType.WHATSAPP,
      ContactMethodType.SMS,
      ContactMethodType.VOICENOTE,
    ].map((method) => ({
      value: method,
      label: getContactMethodLabel(t, method),
    }));
  }

  return [
    ContactMethodType.PHONE,
    ContactMethodType.TELEGRAM,
    ContactMethodType.WHATSAPP,
    ContactMethodType.SIGNAL,
  ].map((method) => ({
    value: method,
    label: getContactMethodLabel(t, method),
  }));
}

export function getDefaultContactMethod(contactType: ContactType): ContactMethodType {
  if (contactType === ContactType.TEXT_EMAIL || contactType === ContactType.OTHER) {
    return ContactMethodType.EMAIL;
  }
  return ContactMethodType.PHONE;
}
