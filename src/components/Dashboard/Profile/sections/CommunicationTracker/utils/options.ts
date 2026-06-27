import { TFunction } from "i18next";
import { ContactType, ContactMethodType, CommunicationType } from "need4deed-sdk";
import { getContactMethodLabel, getCommunicationTypeLabel } from "./translations";

type Option = {
  value: string;
  label: string;
};

export function getCommunicationTypeOptions(t: TFunction): Option[] {
  return Object.values(CommunicationType).map((type) => ({
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
